import "server-only";
import { MongoClient, ServerApiVersion } from "mongodb";

if (
  !process.env.MONGODB_URI ||
  !process.env.MONGODB_URI.startsWith("mongodb+srv://")
) {
  throw new Error("Invalid MongoDB URI");
}

const client = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function getDB(dbName) {
  try {
    await client.connect();
    console.log("Connected to DataBase");
    return client.db(dbName);
  } catch (e) {
    console.log(e);
  }
}

export async function getCollection(collectionName) {
  const db = await getDB("bird_db");
  if (db) {
    return db.collection(collectionName);
  }

  return null;
}
