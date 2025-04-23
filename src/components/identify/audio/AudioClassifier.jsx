import { useState, useEffect, useCallback } from "react";
import BirdPredictCard from "@/components/identify/BirdPredictCard";

import { auth } from "@/lib/firebase/clientApp";
import { useAuthState } from "react-firebase-hooks/auth";

export default function AudioClassifier({ segments, audioFile }) {
  const [predictedLabel, setPredictedLabel] = useState(null);
  const [user] = useAuthState(auth);

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
