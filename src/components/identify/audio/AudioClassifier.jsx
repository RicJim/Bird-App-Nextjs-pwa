import { useState, useEffect, useCallback } from "react";
// import { useModelContext } from "@/context/ModelContext";
import BirdPredictCard from "@/components/identify/BirdPredictCard";

import { auth } from "@/lib/firebase/clientApp";
import { useAuthState } from "react-firebase-hooks/auth";

export default function AudioClassifier({ segments, audioFile }) {
  const [predictedLabel, setPredictedLabel] = useState(null);
  const [user] = useAuthState(auth);
  // const { tf, audioModel } = useModelContext();

  const handlePredict = useCallback(async () => {
    if (!segments || segments.length === 0) return;

    console.log(audioFile);

    try {
      const audioBase64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result.split(",")[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(audioFile);
      });
      const token = user ? await user.getIdToken() : null;

      const res = await fetch("/api/predict/audio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ mfccMatrix: segments, audioBase64 }),
      });

      if (!res.ok) {
        const error = await res.text();
        console.error("Error en el backend:", error);
        return;
      }

      const data = await res.json();
      setPredictedLabel(data.predictedLabel);
      /*const predictions = segments.map((segment) => {
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
      setPredictedLabel(predictedLabel);*/
    } catch (error) {
      console.error("Error en la predicción:", error);
    }
  }, [segments]); // [segments, audioModel, tf]

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
