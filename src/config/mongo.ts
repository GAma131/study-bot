import { MongoClient, type Db } from 'mongodb';

let client: MongoClient | null = null;

export async function connectMongo(uri: string): Promise<Db> {
  client = new MongoClient(uri);
  await client.connect();
  const dbName = 'study-bot';
  return client.db(dbName);
}

export async function disconnectMongo(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
  }
}
