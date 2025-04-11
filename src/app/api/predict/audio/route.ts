export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import * as tf from "@tensorflow/tfjs-node";
import path from "path";

const modelPath = `file://${path.join(
  process.cwd(),
  "public/models/sound/model.json"
)}`;

let audioModelPromise: Promise<tf.GraphModel> | null = null;

function loadAudioModelOnce(): Promise<tf.GraphModel> {
  if (!audioModelPromise) {
    audioModelPromise = tf.loadGraphModel(modelPath);
  }
  return audioModelPromise;
}

loadAudioModelOnce();

export async function POST(req: Request) {
  try {
    const { mfccMatrix } = await req.json();
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

    return NextResponse.json({ predictedLabel });
  } catch (error) {
    console.error("Error en la predicción de audio:", error);
    return NextResponse.json(
      { error: "Error interno en la predicción" },
      { status: 500 }
    );
  }
}
