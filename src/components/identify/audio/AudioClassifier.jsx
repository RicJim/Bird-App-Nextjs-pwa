import { useState } from "react";
import * as tf from "@tensorflow/tfjs";

export default function AudioClassifier({ segments, audioModel }) {
    const [predictedLabel, setPredictedLabel] = useState(null);
    const [loading, setLoading] = useState(false);

    const handlePredict = async () => {
        setLoading(true);
        try {
            const predictions = [];

            for (const segment of segments) {
                let segmentTensor = tf.tensor(segment);
                segmentTensor = tf.image.resizeBilinear(segmentTensor.expandDims(-1), [16000,13]);
                segmentTensor = segmentTensor.expandDims(0);
                const prediction = await audioModel.predict(segmentTensor).data();
                predictions.push(prediction);

                segmentTensor.dispose();
            }

            const avgPrediction = predictions
                .reduce((sum, p) => sum.map((v, i) => v + p[i]), new Array(predictions[0].length).fill(0))
                .map(v => v / predictions.length);

            const predictedLabel = avgPrediction.indexOf(Math.max(...avgPrediction));
            setPredictedLabel(predictedLabel);
        } catch (error) {
            console.error("Error en la predicción:", error);
        }
        setLoading(false);
    };

    return (
        <div className="w-full max-w-lg mt-6">
            {/* Botón para hace la predicción */}
            <button
                onClick={handlePredict}
                className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700"
            >
                {loading ? 'Clasificando...' : 'Clasificar Sonido'}
            </button>

            {predictedLabel !== null && (
                <p className="text-center mt-4">
                    <strong>Predicción:</strong> {predictedLabel}
                </p>
            )}
        </div>
    );
}
