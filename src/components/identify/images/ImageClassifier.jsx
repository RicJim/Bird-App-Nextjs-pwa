import { useState, useRef } from "react";
import * as tf from "@tensorflow/tfjs";

export default function ImageClassifier({ imageFile, imageModel }) {
    const [predictedLabel, setPredictedLabel] = useState(null);
    const imgRef = useRef(null);

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
        <div className="w-full max-w-lg px-4 sm:px-6 md:px-8">
            {/* Botón para hace la predicción */}
            <button
                onClick={handlePredict}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 
                text-white p-3 rounded-lg shadow-md 
                hover:bg-green-700 transition-all duration-300 ease-in-out 
                focus:outline-none focus:ring-4 focus:ring-green-300"
            >
                Clasificar Imagen
            </button>
            {predictedLabel !== null && (
                <div className="w-full max-w-xl mt-5 bg-white p-3 rounded-lg shadow-lg">
                    <p className="text-center mt-3 text-gray-800 text-sm sm:text-base
                    bg-gray-50 border border-gray-300 p-2 rounded-lg shadow-sm">
                        <strong className="text-blue-600">Predicción:</strong> {predictedLabel}
                    </p>
                </div>
            )}
        </div>
    );
}
