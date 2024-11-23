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
        <div className="w-full max-w-lg mt-6">
            {/* Botón para hace la predicción */}
            <button
                onClick={handlePredict}
                className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700"
            >
                Clasificar Imagen
            </button>
            {predictedLabel !== null && (
                <p className="text-center mt-4">
                    <strong>Predicción:</strong> {predictedLabel}
                </p>
            )}
        </div>
    );
}
