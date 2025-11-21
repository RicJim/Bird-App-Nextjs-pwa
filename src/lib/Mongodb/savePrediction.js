import { getDB, getCollection, isMongoDBConfigured } from "./mongodb";
import { GridFSBucket } from "mongodb";
import { Readable } from "stream";

export async function savePrediction({
  userId,
  fileBuffer,
  predictedLabel,
  type,
}) {
  if (!isMongoDBConfigured) {
    console.warn("MongoDB no está disponible. La predicción no será guardada.");
    return;
  }

  try {
    const db = await getDB();
    if (!db) {
      console.warn(
        "No se pudo conectar a MongoDB. La predicción no será guardada."
      );
      return;
    }

    const collection = await getCollection("predictions");
    if (!collection) {
      console.warn(
        "No se pudo acceder a la colección. La predicción no será guardada."
      );
      return;
    }

    const bucketName = type === "audio" ? "audios" : "images";
    const bucket = new GridFSBucket(db, { bucketName });

    const filename = `${type}_${userId}_${Date.now()}`;

    return new Promise((resolve, reject) => {
      const readableStream = Readable.from(fileBuffer);
      const uploadStream = bucket.openUploadStream(filename);

      uploadStream.once("finish", async () => {
        try {
          await collection.insertOne({
            userId,
            fileId: uploadStream.id,
            type,
            predictedLabel,
            createdAt: new Date(),
          });
          resolve();
        } catch (e) {
          console.error("Error al guardar metadatos:", e);
          resolve();
        }
      });

      uploadStream.once("error", (err) => {
        console.error("Error subiendo archivo:", err);
        resolve();
      });

      readableStream.pipe(uploadStream);
    });
  } catch (error) {
    console.error("Error en savePrediction:", error);
  }
}
