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

export async function getDB() {
  try {
    await client.connect();
    return client.db("bird_db");
  } catch (e) {
    console.log(e);
  }
}

export async function getCollection(collectionName) {
  const db = await getDB();
  return db?.collection(collectionName) || null;
}
