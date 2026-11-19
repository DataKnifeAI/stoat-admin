import { Filter, ObjectId } from "mongodb";
import { getDb } from "./mongo";

export type StoatUser = {
  _id: string;
  username?: string;
  discriminator?: string;
  display_name?: string;
  badges?: number;
  flags?: number;
  privileged?: boolean;
  bot?: { owner?: string };
  relationship?: string;
  status?: { text?: string; presence?: string };
  avatar?: { _id?: string };
};

export type StoatAccount = {
  _id: string;
  email?: string;
  disabled?: boolean;
  deletion?: unknown;
};

export type StoatServer = {
  _id: string;
  name?: string;
  description?: string;
  owner?: string;
  channels?: string[];
  flags?: number;
  nsfw?: boolean;
  icon?: { _id?: string };
};

export type DashboardStats = {
  users: number;
  accounts: number;
  servers: number;
  channels: number;
  messages: number;
  bots: number;
  sessions: number;
  members: number;
  reports: number;
};

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const db = await getDb();
  const [
    users,
    accounts,
    servers,
    channels,
    messages,
    bots,
    sessions,
    members,
    reports,
  ] = await Promise.all([
    db.collection("users").estimatedDocumentCount(),
    db.collection("accounts").estimatedDocumentCount(),
    db.collection("servers").estimatedDocumentCount(),
    db.collection("channels").estimatedDocumentCount(),
    db.collection("messages").estimatedDocumentCount(),
    db.collection("bots").estimatedDocumentCount(),
    db.collection("sessions").estimatedDocumentCount(),
    db.collection("server_members").estimatedDocumentCount(),
    db.collection("safety_reports").estimatedDocumentCount(),
  ]);
  return {
    users,
    accounts,
    servers,
    channels,
    messages,
    bots,
    sessions,
    members,
    reports,
  };
}

export async function listUsers(opts: {
  q?: string;
  limit?: number;
  skip?: number;
}): Promise<{ items: StoatUser[]; total: number }> {
  const db = await getDb();
  const limit = Math.min(opts.limit ?? 50, 200);
  const skip = opts.skip ?? 0;
  const filter: Filter<StoatUser> = {};
  const q = opts.q?.trim();
  if (q) {
    if (q.startsWith("01") && q.length >= 20) {
      filter._id = q;
    } else {
      filter.username = { $regex: escapeRegex(q), $options: "i" };
    }
  }
  const col = db.collection<StoatUser>("users");
  const [items, total] = await Promise.all([
    col.find(filter).sort({ username: 1 }).skip(skip).limit(limit).toArray(),
    col.countDocuments(filter),
  ]);
  return { items, total };
}

export async function getUser(id: string): Promise<{
  user: StoatUser | null;
  account: StoatAccount | null;
  memberOf: number;
}> {
  const db = await getDb();
  const [user, account, memberOf] = await Promise.all([
    db.collection<StoatUser>("users").findOne({ _id: id }),
    db.collection<StoatAccount>("accounts").findOne({ _id: id }),
    db.collection("server_members").countDocuments({ "_id.user": id }),
  ]);
  return { user, account, memberOf };
}

export async function listServers(opts: {
  q?: string;
  limit?: number;
  skip?: number;
}): Promise<{ items: StoatServer[]; total: number }> {
  const db = await getDb();
  const limit = Math.min(opts.limit ?? 50, 200);
  const skip = opts.skip ?? 0;
  const filter: Filter<StoatServer> = {};
  const q = opts.q?.trim();
  if (q) {
    if (q.startsWith("01") && q.length >= 20) {
      filter._id = q;
    } else {
      filter.name = { $regex: escapeRegex(q), $options: "i" };
    }
  }
  const col = db.collection<StoatServer>("servers");
  const [items, total] = await Promise.all([
    col.find(filter).sort({ name: 1 }).skip(skip).limit(limit).toArray(),
    col.countDocuments(filter),
  ]);
  return { items, total };
}

export async function getServer(id: string): Promise<{
  server: StoatServer | null;
  memberCount: number;
  owner: StoatUser | null;
}> {
  const db = await getDb();
  const server = await db.collection<StoatServer>("servers").findOne({ _id: id });
  if (!server) return { server: null, memberCount: 0, owner: null };
  const [memberCount, owner] = await Promise.all([
    db.collection("server_members").countDocuments({ "_id.server": id }),
    server.owner
      ? db.collection<StoatUser>("users").findOne({ _id: server.owner })
      : Promise.resolve(null),
  ]);
  return { server, memberCount, owner };
}

export type InspectResult =
  | { kind: "user"; user: StoatUser; account: StoatAccount | null }
  | { kind: "server"; server: StoatServer }
  | { kind: "channel"; channel: Record<string, unknown> }
  | { kind: "message"; message: Record<string, unknown> }
  | { kind: "bot"; bot: Record<string, unknown> }
  | { kind: "none" };

type UlidDoc = { _id: string };

export async function inspectId(id: string): Promise<InspectResult> {
  const trimmed = id.trim();
  if (!trimmed) return { kind: "none" };

  const db = await getDb();
  const byId = { _id: trimmed } as Filter<UlidDoc>;

  const user = await db.collection<StoatUser>("users").findOne(byId);
  if (user) {
    const account = await db.collection<StoatAccount>("accounts").findOne(byId);
    return { kind: "user", user, account };
  }

  const server = await db.collection<StoatServer>("servers").findOne(byId);
  if (server) return { kind: "server", server };

  const channel = await db.collection<UlidDoc>("channels").findOne(byId);
  if (channel) {
    return { kind: "channel", channel: channel as unknown as Record<string, unknown> };
  }

  const message = await db.collection<UlidDoc>("messages").findOne(byId);
  if (message) {
    return { kind: "message", message: message as unknown as Record<string, unknown> };
  }

  const bot = await db.collection<UlidDoc>("bots").findOne(byId);
  if (bot) {
    return { kind: "bot", bot: bot as unknown as Record<string, unknown> };
  }

  if (ObjectId.isValid(trimmed)) {
    const oid = new ObjectId(trimmed);
    for (const name of ["attachments", "attachment_hashes"] as const) {
      const doc = await db.collection(name).findOne({ _id: oid });
      if (doc) return { kind: "none" };
    }
  }

  return { kind: "none" };
}
