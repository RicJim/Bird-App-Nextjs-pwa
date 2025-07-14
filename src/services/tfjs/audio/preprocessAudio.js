import * as tf from "@tensorflow/tfjs";

let globalMean = null;
let globalStd = null;

export async function loadNormalizationStats() {
  const stats = await fetch('/normalization.json').then(res => res.json());
  globalMean = stats.global_mean;
  globalStd = stats.global_std;
}

export function preprocessAudio(segments) {
  if (globalMean == null || globalStd == null) {
    throw new Error("Stats de normalización no cargados.");
  }
  let input = tf.tidy(() => {
    return tf.stack(
      segments.map((segment) => {
        let mfccTensor = tf
          .tensor2d(segment)
          .sub(globalMean).div(globalStd)
          .expandDims(-1)
          .resizeBilinear([224, 224])
          .tile([1, 1, 3]);

        return mfccTensor;
      })
    );
  });

  return input;
}


// export function preprocessAudio(segments) {
//   return tf.tidy(() => {
//     return tf.stack(
//       segments.map((segment) => tf.tensor1d(segment))  // [1024]
//     ); // [num_segments, 1024]
//   });
// }