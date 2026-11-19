import { Filter, ObjectId } from "mongodb";
import { getDb } from "./mongo";

export type StoatFileRef = {
  _id?: string;
  tag?: string;
  filename?: string;
  content_type?: string;
};

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
  relations?: { _id: string; status?: string }[];
  status?: { text?: string; presence?: string };
  avatar?: StoatFileRef;
};

export type StoatAccount = {
  _id: string;
  email?: string;
  email_normalised?: string;
  disabled?: boolean;
  deletion?: unknown;
  lockout?: unknown;
  verification?: unknown;
  mfa?: unknown;
  password?: string;
};

export type StoatServer = {
  _id: string;
  name?: string;
  description?: string;
  owner?: string;
  channels?: string[];
  flags?: number;
  nsfw?: boolean;
  discoverable?: boolean;
  icon?: StoatFileRef;
  banner?: StoatFileRef;
  system_messages?: Record<string, string | null | undefined>;
  default_permissions?: unknown;
  categories?: unknown;
  roles?: unknown;
};

export type StoatChannel = {
  _id: string;
  channel_type?: string;
  name?: string;
  description?: string;
  server?: string;
  owner?: string;
  user?: string;
  recipients?: string[];
  last_message_id?: string;
  nsfw?: boolean;
  active?: boolean;
  slowmode?: number;
  icon?: StoatFileRef;
  permissions?: number;
  default_permissions?: unknown;
  role_permissions?: unknown;
  voice?: unknown;
};

export type StoatMessage = {
  _id: string;
  channel?: string;
  author?: string;
  content?: string | null;
  nonce?: string;
  attachments?: unknown[];
  embeds?: unknown[];
  mentions?: string[];
  replies?: string[];
  reactions?: unknown;
  edited?: unknown;
  pinned?: boolean;
  flags?: number;
  system?: unknown;
  masquerade?: unknown;
};

export type StoatBot = {
  _id: string;
  owner?: string;
  token?: string;
  public?: boolean;
  analytics?: boolean;
  discoverable?: boolean;
  interactions_url?: string;
  terms_of_service_url?: string;
  privacy_policy_url?: string;
  flags?: number;
};

export type StoatInvite = {
  _id: string;
  type?: string;
  server?: string;
  creator?: string;
  channel?: string;
  member_count?: number;
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
  | {
      kind: "user";
      user: StoatUser;
      account: StoatAccount | null;
      memberOf: number;
    }
  | { kind: "server"; server: StoatServer; memberCount: number; owner: StoatUser | null }
  | { kind: "channel"; channel: StoatChannel; serverName: string | null }
  | { kind: "message"; message: StoatMessage; author: StoatUser | null }
  | { kind: "bot"; bot: StoatBot; owner: StoatUser | null }
  | {
      kind: "invite";
      invite: StoatInvite;
      creator: StoatUser | null;
      serverName: string | null;
    }
  | { kind: "none" };

type UlidDoc = { _id: string };

async function findInvite(
  id: string,
): Promise<StoatInvite | null> {
  const db = await getDb();
  for (const name of ["channel_invites", "invites"] as const) {
    const doc = await db.collection<StoatInvite>(name).findOne({ _id: id });
    if (doc) return doc;
  }
  return null;
}

export async function inspectId(id: string): Promise<InspectResult> {
  const trimmed = id.trim();
  if (!trimmed) return { kind: "none" };

  const db = await getDb();
  const byId = { _id: trimmed } as Filter<UlidDoc>;

  const user = await db.collection<StoatUser>("users").findOne(byId);
  if (user) {
    const [account, memberOf] = await Promise.all([
      db.collection<StoatAccount>("accounts").findOne(byId),
      db.collection("server_members").countDocuments({ "_id.user": trimmed }),
    ]);
    return { kind: "user", user, account, memberOf };
  }

  const server = await db.collection<StoatServer>("servers").findOne(byId);
  if (server) {
    const [memberCount, owner] = await Promise.all([
      db.collection("server_members").countDocuments({ "_id.server": trimmed }),
      server.owner
        ? db.collection<StoatUser>("users").findOne({ _id: server.owner })
        : Promise.resolve(null),
    ]);
    return { kind: "server", server, memberCount, owner };
  }

  const channel = await db.collection<StoatChannel>("channels").findOne(byId);
  if (channel) {
    const serverDoc = channel.server
      ? await db.collection<StoatServer>("servers").findOne({ _id: channel.server })
      : null;
    return {
      kind: "channel",
      channel,
      serverName: serverDoc?.name ?? null,
    };
  }

  const message = await db.collection<StoatMessage>("messages").findOne(byId);
  if (message) {
    const author = message.author
      ? await db.collection<StoatUser>("users").findOne({ _id: message.author })
      : null;
    return { kind: "message", message, author };
  }

  const bot = await db.collection<StoatBot>("bots").findOne(byId);
  if (bot) {
    const owner = bot.owner
      ? await db.collection<StoatUser>("users").findOne({ _id: bot.owner })
      : null;
    return { kind: "bot", bot, owner };
  }

  const invite = await findInvite(trimmed);
  if (invite) {
    const [creator, serverDoc] = await Promise.all([
      invite.creator
        ? db.collection<StoatUser>("users").findOne({ _id: invite.creator })
        : Promise.resolve(null),
      invite.server
        ? db.collection<StoatServer>("servers").findOne({ _id: invite.server })
        : Promise.resolve(null),
    ]);
    return {
      kind: "invite",
      invite,
      creator,
      serverName: serverDoc?.name ?? null,
    };
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
