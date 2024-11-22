import { useState } from "react";
import AudioFileUploader from "./AudioFileUploader";
import AudioApiResponse from "./AudioApiResponse";
import AudioClassifier from "./AudioClassifier";

export default function AudioProcessor({ audioModel }) {
    const [audiofile, setAudioFile] = useState(null);
    const [segments, setSegments] = useState(null);

    const handleFileSelect = (file) => {
        setAudioFile(file); // Recibe el archivo desde AudioFileUploader
        setSegments(null);  // Reinicia los segmentos cuando se carga un nuevo archivo
    };

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-50 m-3">
            <h1 className="text-3xl font-semibold text-center mb-6 text-blue-600">
                Procesador de Audio
            </h1>

            {/* Carga del archivo */}
            <AudioFileUploader onFileSelect={handleFileSelect} />

            {/* Envío del archivo al API */}
            {audiofile && (
                <AudioApiResponse
                    audiofile={audiofile}
                    setSegments={setSegments} // Recibe los segmentos procesados
                />
            )}

            {/* Clasificación del audio */}
            {segments && (
                <AudioClassifier
                    segments={segments} // Usa los segmentos procesados
                    audioModel={audioModel}
                />
            )}
        </div>
    );
}
