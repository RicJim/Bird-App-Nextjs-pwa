import * as tf from "@tensorflow/tfjs";

let globalMean = -4.214846134185791;
let globalStd = 39.93134689331055;

export function preprocessAudio(segments) {
  if (globalMean == null || globalStd == null) {
    throw new Error("Stats de normalización no cargados.");
  }

  let input = tf.tidy(() => {
    return tf.stack(
      segments.map((segment) => {
        let mfccTensor = tf
          .tensor(segment, undefined, 'float32')
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