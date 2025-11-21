import { useRef, useState, useEffect } from "react";
import BirdPredictCard from "@/components/identify/BirdPredictCard";

import { auth, isFirebaseConfigured } from "@/lib/firebase/clientApp";
import { useAuthState } from "react-firebase-hooks/auth";

import { predictImage } from "@/services/tfjs/image/predictImage";

export default function ImageClassifier({ imageFile }) {
  const [predictedLabel, setPredictedLabel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [taskId, setTaskId] = useState(null);
  const [previousImageFile, setPreviousImageFile] = useState(null);
  const imgRef = useRef(null);

  let user = null;
  if (isFirebaseConfigured) {
    [user] = useAuthState(auth);
  }

  // Resetear predicción cuando cambia la imagen
  useEffect(() => {
    if (imageFile !== previousImageFile) {
      setPredictedLabel(null);
      setTaskId(null);
      setPreviousImageFile(imageFile);
    }
  }, [imageFile, previousImageFile]);

  const handlePredict = async () => {
    if (!imageFile) return;

    setLoading(true);

    try {
      if (!imageFile.startsWith("data:image")) {
        console.error("La imagen no está en formato base64 válido.");
        return;
      }

      const img = imgRef.current || document.createElement("img");
      img.src = imageFile;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const pred = await predictImage(img);
      setPredictedLabel(pred);

      if (user && isFirebaseConfigured) {
        const token = await user.getIdToken();
        const base64data = imageFile.split(",")[1];

        fetch("/api/predict/image", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            imageBase64: base64data,
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-2 sm:px-4 md:px-6">
      {/* Botón para hacer la predicción - se oculta cuando hay predicción */}
      {predictedLabel === null && (
        <button
          onClick={handlePredict}
          disabled={loading}
          className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-green-600 
                  text-white text-sm sm:text-base px-4 sm:px-8 py-2 sm:py-3 rounded-lg shadow-md 
                  hover:bg-green-700 active:scale-95 transition-all duration-300 ease-in-out 
                  focus:outline-none focus:ring-4 focus:ring-green-300
                  disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Clasificando..." : "Clasificar Imagen"}
        </button>
      )}

      {predictedLabel !== null && (
        <BirdPredictCard predictedLabel={predictedLabel} />
      )}
    </div>
  );
}
