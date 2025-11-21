import "server-only";
import { MongoClient, ServerApiVersion } from "mongodb";

const isMongoDBConfigured =
  process.env.MONGODB_URI &&
  process.env.MONGODB_URI.startsWith("mongodb+srv://");

let client = null;
let isConnected = false;

if (isMongoDBConfigured) {
  try {
    client = new MongoClient(process.env.MONGODB_URI, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
  } catch (error) {
    console.error("Error creando cliente MongoDB:", error);
    client = null;
  }
} else {
  console.warn(
    "MONGODB_URI no está configurado. MongoDB no estará disponible."
  );
}

export async function getDB() {
  try {
    if (!client) {
      console.warn("MongoDB no está configurado.");
      return null;
    }

    if (!isConnected) {
      await client.connect();
      isConnected = true;
    }

    return client.db("bird_db");
  } catch (e) {
    console.error("Error conectando a MongoDB:", e);
    return null;
  }
}

export async function getCollection(collectionName) {
  try {
    const db = await getDB();
    if (!db) {
      console.warn(`No se pudo acceder a la colección ${collectionName}`);
      return null;
    }
    return db.collection(collectionName);
  } catch (error) {
    console.error(`Error obteniendo colección ${collectionName}:`, error);
    return null;
  }
}

export { isMongoDBConfigured };
