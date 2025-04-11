export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import * as tf from "@tensorflow/tfjs-node";
import path from "path";

const modelPath = `file://${path.join(
  process.cwd(),
  "public/models/image/model.json"
)}`;

let imageModelPromise: Promise<tf.GraphModel> | null = null;

function loadImageModelOnce() {
  if (!imageModelPromise) {
    imageModelPromise = tf.loadGraphModel(modelPath);
  }
  return imageModelPromise;
}

loadImageModelOnce();

export async function POST(req: Request) {
  try {
    const { imageBase64 } = await req.json();
    if (!imageBase64) {
      return NextResponse.json(
        { error: "No se proporciono la imagen" },
        { status: 400 }
      );
    }

    const imageBuffer = Buffer.from(imageBase64, "base64");

    const imageTensor = tf.node
      .decodeImage(imageBuffer, 3)
      .resizeBilinear([224, 224])
      .expandDims(0)
      .toFloat();

    const model = await loadImageModelOnce();
    const predictionTensor = model.predict(imageTensor) as tf.Tensor;
    const prediction = await predictionTensor.data();

    const predictedLabel = Array.from(prediction).indexOf(
      Math.max(...prediction)
    );
    return NextResponse.json({ predictedLabel });
  } catch (e) {
    console.error("Error en la predicción de imagen:", e);
    return NextResponse.json(
      { error: "Error interno en la predicción" },
      { status: 500 }
    );
  }
}
