import { useState, useEffect, useCallback } from "react";
import BirdPredictCard from "@/components/identify/BirdPredictCard";

import { auth, isFirebaseConfigured } from "@/lib/firebase/clientApp";
import { useAuthState } from "react-firebase-hooks/auth";

import { predictAudio } from "@/services/tfjs/audio/predictAudio";

export default function AudioClassifier({ segments, audioFile }) {
  const [predictedLabel, setPredictedLabel] = useState(null);
  const [taskId, setTaskId] = useState(null);

  let user = null;
  if (isFirebaseConfigured) {
    [user] = useAuthState(auth);
  }

  const handlePredict = useCallback(async () => {
    if (!segments || segments.length === 0) return;

    try {
      const pred = await predictAudio(segments);
      setPredictedLabel(pred);

      if (user && isFirebaseConfigured) {
        const token = await user.getIdToken();

        const audioBase64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64 = reader.result.split(",")[1];
            resolve(base64);
          };
          reader.onerror = reject;
          reader.readAsDataURL(audioFile);
        });

        fetch("/api/predict/audio", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            audioBase64: audioBase64,
            predictedLabel: pred,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.taskId) {
              setTaskId(data.taskId);
              console.log(`Predicción encolada: ${data.taskId}`);
            }
          })
          .catch((err) => {
            console.error("Error enviando predicción al servidor:", err);
          });
      }
    } catch (error) {
      console.error("Error en la predicción:", error);
    }
  }, [segments, audioFile, user]);

  useEffect(() => {
    handlePredict();
  }, [handlePredict]);

  return (
    <div className="w-full max-w-2xl mx-auto bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-lg">
      {predictedLabel !== null && (
        <BirdPredictCard predictedLabel={predictedLabel} />
      )}
    </div>
  );
}
