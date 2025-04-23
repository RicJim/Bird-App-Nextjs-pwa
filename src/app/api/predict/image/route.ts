export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import * as tf from "@tensorflow/tfjs";
import { createCanvas, loadImage } from "canvas";

import { savePrediction } from "@/lib/Mongodb/savePrediction";
import { adminAuth } from "@/lib/firebase/serverApp";

const modelPath = `${process.env.NEXT_PUBLIC_BASE_URL}/models/image/model.json`;

let imageModelPromise: Promise<tf.LayersModel> | null = null;

function loadImageModelOnce() {
  console.log("funcion LoadImageModel");
  if (!imageModelPromise) {
    imageModelPromise = tf.loadLayersModel(modelPath);
    console.log("Modelo Cargado...");
  }
  return imageModelPromise;
}

loadImageModelOnce();

function normalizedImage(tensor: tf.Tensor): tf.Tensor {
  const mean = tf.tensor([0.485, 0.456, 0.406]);
  const std = tf.tensor([0.229, 0.224, 0.225]);
  return tensor.sub(mean).div(std);
}

async function verifyToken(token: string) {
  try {
    const decodeToken = await adminAuth.verifyIdToken(token);
    return decodeToken.uid;
  } catch (e) {
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const { imageBase64 } = await req.json();
    const token = req.headers.get("authorization")?.split("Bearer ")[1];

    if (!imageBase64) {
      return NextResponse.json(
        { error: "No se proporciono la imagen" },
        { status: 400 }
      );
    }

    const imageBuffer = Buffer.from(imageBase64, "base64");

    const image = await loadImage(imageBuffer);
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0);

    const { data, width, height } = ctx.getImageData(
      0,
      0,
      image.width,
      image.height
    );

    const rgbData = [];
    for (let i = 0; i < data.length; i += 4) {
      rgbData.push(data[i]);
      rgbData.push(data[i + 1]);
      rgbData.push(data[i + 2]);
    }

    const imageTensor = tf
      .tensor3d(rgbData, [height, width, 3])
      .resizeBilinear([224, 224])
      .toFloat()
      .div(255.0);

    const normalized = normalizedImage(imageTensor);
    const input = normalized.expandDims();

    const model = await loadImageModelOnce();
    const predictionTensor = model.predict(input) as tf.Tensor;
    const prediction = await predictionTensor.data();

    const predictedLabel = Array.from(prediction).indexOf(
      Math.max(...prediction)
    );

    const userId = token ? await verifyToken(token) : null;

    if (userId) {
      savePrediction({
        userId,
        fileBuffer: imageBuffer,
        predictedLabel,
        type: "image",
      }).catch(console.error);
    }

    return NextResponse.json({ predictedLabel });
  } catch (e) {
    console.error("Error en la predicción de imagen:", e);
    return NextResponse.json(
      { error: "Error interno en la predicción" },
      { status: 500 }
    );
  }
}
