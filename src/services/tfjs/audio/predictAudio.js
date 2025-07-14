import { LoadAudioModel } from "./audioModel";
import { preprocessAudio, loadNormalizationStats } from "./preprocessAudio";
import * as tf from "@tensorflow/tfjs";

export async function predictAudio(segments) {
  const model = await LoadAudioModel();

  await loadNormalizationStats();

  const output = tf.tidy(() => {
    const input = preprocessAudio(segments);
    const predictionTensor = model.predict(input);
    return predictionTensor;
  });

  const prediction = await output.array();
  output.dispose();

  const avgPrediction = prediction
    .reduce(
      (sum, p) => sum.map((v, i) => v + p[i]),
      new Array(prediction[0].length).fill(0)
    )
    .map((v) => v / prediction.length);

  const predictionLabel = avgPrediction.indexOf(Math.max(...avgPrediction));

  return predictionLabel;
}
