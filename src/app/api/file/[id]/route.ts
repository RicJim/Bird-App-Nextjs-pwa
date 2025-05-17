import { NextRequest } from "next/server";
import { getDB } from "@/lib/Mongodb/mongodb";
import { GridFSBucket, GridFSBucketReadStream, ObjectId } from "mongodb";
import { Readable } from "stream";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const db = await getDB();

    if (!db) {
      return new Response("Error al conectar con la base de datos", {
        status: 500,
      });
    }

    const imageBucket = new GridFSBucket(db, { bucketName: "images" });
    const audioBucket = new GridFSBucket(db, { bucketName: "audios" });

    const fileId = new ObjectId(id);
    const imageFiles = db.collection("images.files");
    const audioFiles = db.collection("audios.files");

    const file =
      (await imageFiles.findOne({ _id: fileId })) ||
      (await audioFiles.findOne({ _id: fileId }));

    if (!file) {
      return new Response("Archivo no encontrado", { status: 404 });
    }

    const isAudio =
      file.filename?.startsWith("audio") || file.metadata?.type === "audio";
    const bucketToUse = isAudio ? audioBucket : imageBucket;

    const downloadStream: GridFSBucketReadStream =
      bucketToUse.openDownloadStream(fileId);

    const webStream = nodeToWebStream(downloadStream);

    return new Response(webStream, {
      headers: {
        "Content-Type": file.contentType || "application/octet-stream",
        "Content-Disposition": `inline; filename="${file.filename}"`,
      },
    });
  } catch (err) {
    console.error("Error al servir archivo:", err);
    return new Response("Error interno", { status: 500 });
  }
}

function nodeToWebStream(nodeStream: Readable): ReadableStream {
  return new ReadableStream({
    start(controller) {
      nodeStream.on("data", (chunk) => controller.enqueue(chunk));
      nodeStream.on("end", () => controller.close());
      nodeStream.on("error", (err) => controller.error(err));
    },
    cancel() {
      nodeStream.destroy();
    },
  });
}
