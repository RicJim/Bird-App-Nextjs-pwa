import { useState, useEffect } from "react";
import { useModelContext } from "@/context/ModelContext";
import BirdPredictCard from "@/components/identify/BirdPredictCard";

export default function AudioClassifier({ segments }) {
  const [predictedLabel, setPredictedLabel] = useState(null);
  const { tf, audioModel } = useModelContext();

  const handlePredict = useCallback(async () => {
    try {
      const predictions = segments.map((segment) => {
        return tf.tidy(() => {
          let tensor = tf.tensor(segment);
          tensor = tf.image.resizeBilinear(tensor.expandDims(-1), [16000, 13]);
          tensor = tensor.expandDims(0);
          const prediction = audioModel.predict(tensor);
          return prediction.dataSync();
        });
      });

      const avgPrediction = predictions
        .reduce(
          (sum, p) => sum.map((v, i) => v + p[i]),
          new Array(predictions[0].length).fill(0)
        )
        .map((v) => v / predictions.length);

      const predictedLabel = avgPrediction.indexOf(Math.max(...avgPrediction));
      setPredictedLabel(predictedLabel);
    } catch (error) {
      console.error("Error en la predicción:", error);
    }
  }, [segments, audioModel, tf]);

  useEffect(() => {
    handlePredict();
  }, [handlePredict]);

  return (
    <div className="w-full max-w-xl mx-auto bg-white p-3 rounded-lg shadow-lg">
      {predictedLabel !== null && (
        <BirdPredictCard predictedLabel={predictedLabel} />
      )}
    </div>
  );
}
