import * as tf from "@tensorflow/tfjs";

function normalizedImage(tensor) {
  const mean = tf.tensor([0.485, 0.456, 0.406]);
  const std = tf.tensor([0.229, 0.224, 0.225]);
  return tensor.sub(mean).div(std);
}

export function preprocessImage(img) {
  const input = tf.tidy(() => {
    const imageTensor = tf.browser
      .fromPixels(img)
      .resizeBilinear([224, 224])
      .toFloat()
      .div(255.0);

    const normalized = normalizedImage(imageTensor);
    return normalized.expandDims();
  });

  return input;
}
