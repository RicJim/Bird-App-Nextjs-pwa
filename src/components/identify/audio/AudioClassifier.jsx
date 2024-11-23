import { useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";

export default function AudioClassifier({ segments, audioModel }) {
    const [predictedLabel, setPredictedLabel] = useState(null);

    const handlePredict = async () => {
        try {
            const predictions = segments.map(segment => {
                return tf.tidy(() => {
                    let tensor = tf.tensor(segment);
                    tensor = tf.image.resizeBilinear(tensor.expandDims(-1), [16000, 13]);
                    tensor = tensor.expandDims(0);
                    const prediction = audioModel.predict(tensor);
                    return prediction.dataSync();
                });
            });

            const avgPrediction = predictions
                .reduce((sum, p) => sum.map((v, i) => v + p[i]), new Array(predictions[0].length).fill(0))
                .map(v => v / predictions.length);

            const predictedLabel = avgPrediction.indexOf(Math.max(...avgPrediction));
            setPredictedLabel(predictedLabel);
        } catch (error) {
            console.error("Error en la predicción:", error);
        }
    };

    useEffect(() => {
        handlePredict();
    }, []);

    return (
        <div className="w-full max-w-xl mx-auto bg-white p-3 rounded-lg shadow-lg">
            {predictedLabel !== null && (
                <p className="text-center mt-3 text-gray-800 text-sm sm:text-base
                bg-gray-50 border border-gray-300 p-2 rounded-lg shadow-sm">
                    <strong className="text-blue-600">Predicción:</strong> {predictedLabel}
                </p>
            )}
        </div>
    );
}
