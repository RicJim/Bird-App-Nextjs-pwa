export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import * as tf from "@tensorflow/tfjs";

import { savePrediction } from "@/lib/Mongodb/savePrediction";
import { adminAuth } from "@/lib/firebase/serverApp";

const modelPath = `${process.env.NEXT_PUBLIC_BASE_URL}/models/sound/model.json`;

let audioModelPromise: Promise<tf.GraphModel> | null = null;

function loadAudioModelOnce(): Promise<tf.GraphModel> {
  if (!audioModelPromise) {
    audioModelPromise = tf.loadGraphModel(modelPath);
  }
  return audioModelPromise;
}

loadAudioModelOnce();

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
    const { mfccMatrix, audioBase64 } = await req.json();
    const token = req.headers.get("authorization")?.split("Bearer ")[1];

    if (!mfccMatrix || !Array.isArray(mfccMatrix)) {
      return NextResponse.json(
        { error: "No se proporcionó el MFCC correctamente" },
        { status: 400 }
      );
    }

    const model = await loadAudioModelOnce();

    const inputBatch = tf.stack(
      mfccMatrix.map((segment: number[][]) => {
        const tensor = tf.tensor(segment);
        const expanded = tensor.expandDims(-1) as tf.Tensor3D;
        const resized = tf.image.resizeBilinear(expanded, [16000, 13]);
        return resized;
      })
    ) as tf.Tensor4D;

    const prediction = model.predict(inputBatch) as tf.Tensor;
    const predictionArray = (await prediction.array()) as number[][];

    const avgPrediction = predictionArray
      .reduce(
        (sum, p) => sum.map((v, i) => v + p[i]),
        new Array(predictionArray[0].length).fill(0)
      )
      .map((v) => v / predictionArray.length);

    const predictedLabel = avgPrediction.indexOf(Math.max(...avgPrediction));

    const userId = token ? await verifyToken(token) : null;

    if (userId) {
      const audioBuffer = Buffer.from(audioBase64, "base64");

      savePrediction({
        userId,
        fileBuffer: audioBuffer,
        predictedLabel,
        type: "audio",
      });
    }

    return NextResponse.json({ predictedLabel });
  } catch (error) {
    console.error("Error en la predicción de audio:", error);
    return NextResponse.json(
      { error: "Error interno en la predicción" },
      { status: 500 }
    );
  }
}
