import { getDb } from "./mongo";
import { dayKeyUTC, ulidTimestampMs } from "./ulid";

export type DayCount = { day: string; count: number };
export type NamedCount = { id: string; name: string; count: number };
export type HourHeat = { hour: number; count: number };

export type Engagement = {
  days: number;
  messagesPerDay: DayCount[];
  usersPerDay: DayCount[];
  topServers: NamedCount[];
  busyHours: HourHeat[];
};

function emptyDays(days: number): Map<string, number> {
  const map = new Map<string, number>();
  const now = Date.now();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now - i * 86_400_000);
    map.set(d.toISOString().slice(0, 10), 0);
  }
  return map;
}

function toSeries(map: Map<string, number>): DayCount[] {
  return [...map.entries()].map(([day, count]) => ({ day, count }));
}

/**
 * Engagement series from Mongo. Message/user ids are ULIDs so we can bucket
 * without a separate created_at index. Caps scan size for large instances.
 */
export async function getEngagement(days = 30): Promise<Engagement> {
  const db = await getDb();
  const sinceMs = Date.now() - days * 86_400_000;
  const msgMap = emptyDays(days);
  const userMap = emptyDays(days);
  const hours = Array.from({ length: 24 }, (_, hour) => ({ hour, count: 0 }));

  const messages = db
    .collection<{ _id: string; channel?: string }>("messages")
    .find({}, { projection: { _id: 1, channel: 1 } })
    .sort({ _id: -1 })
    .limit(50_000);

  const channelHits = new Map<string, number>();
  for await (const doc of messages) {
    const ms = ulidTimestampMs(doc._id);
    if (ms == null) continue;
    if (ms < sinceMs) break;
    const key = dayKeyUTC(ms);
    if (msgMap.has(key)) msgMap.set(key, (msgMap.get(key) || 0) + 1);
    hours[new Date(ms).getUTCHours()].count += 1;
    if (doc.channel) {
      channelHits.set(doc.channel, (channelHits.get(doc.channel) || 0) + 1);
    }
  }

  const users = db
    .collection<{ _id: string }>("users")
    .find({}, { projection: { _id: 1 } })
    .sort({ _id: -1 })
    .limit(20_000);

  for await (const doc of users) {
    const ms = ulidTimestampMs(doc._id);
    if (ms == null) continue;
    if (ms < sinceMs) break;
    const key = dayKeyUTC(ms);
    if (userMap.has(key)) userMap.set(key, (userMap.get(key) || 0) + 1);
  }

  // Map hot channels → servers for a top-servers chart.
  const topChannelIds = [...channelHits.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 40)
    .map(([id]) => id);

  const channels = topChannelIds.length
    ? await db
        .collection<{ _id: string; server?: string }>("channels")
        .find({ _id: { $in: topChannelIds } as never })
        .project({ _id: 1, server: 1 })
        .toArray()
    : [];

  const serverHits = new Map<string, number>();
  const channelServer = new Map(channels.map((c) => [c._id, c.server]));
  for (const [ch, n] of channelHits) {
    const server = channelServer.get(ch);
    if (!server) continue;
    serverHits.set(server, (serverHits.get(server) || 0) + n);
  }

  const topServerIds = [...serverHits.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const serverDocs = topServerIds.length
    ? await db
        .collection<{ _id: string; name?: string }>("servers")
        .find({ _id: { $in: topServerIds.map(([id]) => id) } as never })
        .project({ _id: 1, name: 1 })
        .toArray()
    : [];
  const names = new Map(serverDocs.map((s) => [s._id, s.name || "(unnamed)"]));

  return {
    days,
    messagesPerDay: toSeries(msgMap),
    usersPerDay: toSeries(userMap),
    topServers: topServerIds.map(([id, count]) => ({
      id,
      name: names.get(id) || id,
      count,
    })),
    busyHours: hours,
  };
}
