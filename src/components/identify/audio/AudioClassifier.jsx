import { useState, useEffect, useCallback } from "react";
import BirdPredictCard from "@/components/identify/BirdPredictCard";

export default function AudioClassifier({ segments }) {
  const [predictedLabel, setPredictedLabel] = useState(null);

  const handlePredict = useCallback(async () => {
    if (!segments || segments.length === 0) return;
    try {
      const res = await fetch("/api/predict/audio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mfccMatrix: segments }),
      });

      if (!res.ok) {
        const error = await res.text();
        console.error("Error en el backend:", error);
        return;
      }

      const data = await res.json();
      setPredictedLabel(data.predictedLabel);
    } catch (error) {
      console.error("Error en la predicción:", error);
    }
  }, [segments]);

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
