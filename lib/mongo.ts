import { MongoClient, Db } from "mongodb";

declare global {
  var __stoatMongo:
    | { client: MongoClient; promise: Promise<MongoClient> }
    | undefined;
}

function mongoUri(): string {
  const uri = process.env.MONGODB?.trim();
  if (!uri) {
    throw new Error("MONGODB env is required");
  }
  return uri;
}

export function mongoDbName(): string {
  return process.env.MONGODB_DB?.trim() || "revolt";
}

async function getClient(): Promise<MongoClient> {
  const uri = mongoUri();
  if (!global.__stoatMongo) {
    const client = new MongoClient(uri, { maxPoolSize: 10 });
    global.__stoatMongo = {
      client,
      promise: client.connect(),
    };
  }
  await global.__stoatMongo.promise;
  return global.__stoatMongo.client;
}

export async function getDb(name = mongoDbName()): Promise<Db> {
  const client = await getClient();
  return client.db(name);
}
