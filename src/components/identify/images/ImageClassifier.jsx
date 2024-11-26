import { useState, useRef } from "react";
import { useModelContext } from "@/context/ModelContext";
import BirdPredictCard from "@/components/identify/BirdPredictCard";

export default function ImageClassifier({ imageFile }) {
    const [predictedLabel, setPredictedLabel] = useState(null);
    const imgRef = useRef(null);
    const { tf, imageModel } = useModelContext();

    const handlePredict = async () => {
        if (!imageFile || !imageModel) return;
        try {
            const img = imgRef.current || document.createElement("img");
            img.src = imageFile;

            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
            });

            const prediction = tf.tidy(() => {
                let tensor = tf.browser.fromPixels(img);
                tensor = tf.image.resizeBilinear(tensor, [224, 224]);
                tensor = tensor.toFloat().expandDims(0);
                const output = imageModel.predict(tensor);
                return output.dataSync();
            });

            const predictedLabel = prediction.indexOf(Math.max(...prediction));
            setPredictedLabel(predictedLabel);
        } catch (error) {
            console.error("Error en la predicción:", error);
        }
    }

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
            {predictedLabel !== null && <BirdPredictCard predictedLabel={ predictedLabel } />}
        </div>
    );
}
