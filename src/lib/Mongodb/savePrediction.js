import { getDB, getCollection } from "./mongodb";
import { GridFSBucket } from "mongodb";
import { Readable } from "stream";

export async function savePrediction({
  userId,
  fileBuffer,
  predictedLabel,
  type,
}) {
  const db = await getDB();
  const collection = await getCollection("predictions");

  if (!collection) {
    throw new Error("No se pudo conectar a la colección");
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
        reject(e);
      }
    });

    uploadStream.once("error", (err) => {
      console.error("Error subiendo archivo:", err);
      reject(err);
    });

    readableStream.pipe(uploadStream);
  });
}
