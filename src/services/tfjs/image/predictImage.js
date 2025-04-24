import { LoadImageModel } from "./imageModel";
import { preprocessImage } from "./preprocessImage";
import * as tf from "@tensorflow/tfjs";

export async function predictImage(img) {
  const model = await LoadImageModel();

  const output = tf.tidy(() => {
    const input = preprocessImage(img);
    const predictionTensor = model.predict(input);
    return predictionTensor;
  });

  const prediction = await output.data();
  output.dispose();

  const predictionLabel = Array.from(prediction).indexOf(
    Math.max(...prediction)
  );

  return predictionLabel;
}
