import * as tf from "@tensorflow/tfjs";

export function preprocessAudio(segments) {
  const input = tf.tidy(() => {
    return tf.stack(
      segments.map((segment) => {
        const mfccTensor = tf
          .tensor(segment)
          .expandDims(-1)
          .resizeBilinear([16000, 13]);

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