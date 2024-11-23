import { useState } from "react";
import AudioFileUploader from "./AudioFileUploader";
import AudioApiResponse from "./AudioApiResponse";
import AudioClassifier from "./AudioClassifier";

export default function AudioProcessor({ audioModel }) {
  const [audiofile, setAudioFile] = useState(null);
  const [segments, setSegments] = useState(null);

  const handleFileSelect = (file) => {
    setAudioFile(file);
    setSegments(null);
  };

  return (
    <section className="min-h-screen flex flex-col items-center bg-gradient-to-b from-brown-50 to-teal-50 p-2 sm:p-10 space-y-10">
      <h1 className="text-xl sm:text-2xl font-bold text-green-700 text-center mt-5">
        Procesador de Audio
      </h1>

      {/* Carga del archivo */}
      <div className="w-full max-w-xl">
        <h2 className="text-xs sm:text-xl font-semibold text-gray-700 mb-4">
          1. Selecciona un archivo de audio
        </h2>
        <AudioFileUploader onFileSelect={handleFileSelect} className="w-full" />
      </div>

      {/* Envío del archivo al API */}
      {audiofile && (
        <div className="w-full max-w-xl">
          <h2 className="text-xs sm:text-xl font-semibold text-gray-700 mb-4">
            2. Identifica tu archivo
          </h2>
          <AudioApiResponse audiofile={audiofile} setSegments={setSegments} />
        </div>
      )}

      {/* Clasificación del audio */}
      {segments && (
        <div className="w-full max-w-xl">
          <h2 className="text-xs sm:text-xl font-semibold text-gray-700 mb-4">
            3. Resultado del procesamiento
          </h2>
          <AudioClassifier segments={segments} audioModel={audioModel} />
        </div>
      )}
    </section>
  );
}
