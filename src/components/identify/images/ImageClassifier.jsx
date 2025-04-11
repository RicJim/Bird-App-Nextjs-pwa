import { useState } from "react";
import BirdPredictCard from "@/components/identify/BirdPredictCard";

export default function ImageClassifier({ imageFile }) {
  const [predictedLabel, setPredictedLabel] = useState(null);

  const handlePredict = async () => {
    if (!imageFile) return;
    try {
      if (!imageFile.startsWith("data:image")) {
        console.error("La imagen no está en formato base64 válido.");
        return;
      }
      const base64data = imageFile.split(",")[1];

      const res = await fetch("/api/predict/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64data }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Error en el backend:", errorText);
        return;
      }

      const data = await res.json();
      setPredictedLabel(data.predictedLabel);
    } catch (error) {
      console.error("Error en la predicción:", error);
    }
  };

  return (
    <div className="w-full max-w-xl px-4 sm:px-6 md:px-8">
      {/* Botón para hace la predicción */}
      <button
        onClick={handlePredict}
        className="w-3/6 bg-gradient-to-r from-green-500 to-green-600 
                text-white p-3 rounded-lg shadow-md 
                hover:bg-green-700 transition-all duration-300 ease-in-out 
                focus:outline-none focus:ring-4 focus:ring-green-300"
      >
        Clasificar Imagen
      </button>
      {predictedLabel !== null && (
        <BirdPredictCard predictedLabel={predictedLabel} />
      )}
    </div>
  );
}
