import { useState } from "react";
import FileUploader from "./AudioFileUploader";
// import ApiResponse from "./AudioApiResponse";
import * as tf from "@tensorflow/tfjs";

export default function AudioClassifier({ yamnetModel }) {
  const [audiofile, setAudioFile] = useState(null);
  const [prediction, setPrediction] = useState(null);

  const handleFileSelect = (file) => {
    setAudioFile(file);
  };

  const handlePredict = async () => {
    if (!audiofile) {
      alert("Por favor, selecciona un archivo de audio.");
      return;
    }
    
    try {
      const audioBuffer = await audiofile.arrayBuffer();
      const waveform = await processAudio(audioBuffer);

      const [scores, embeddings, spectrogram] = yamnetModel.predict(waveform);

      const topScoreIndex = scores.mean(0).argMax().arraySync();
      const topScore = scores.arraySync()[topScoreIndex];

      setPrediction({
        topClass: topScoreIndex,
        topScore: topScore,
        embeddings: embeddings,
        spectrogram: spectrogram
      });
      
      scores.print();
      embeddings.print();
      spectrogram.print();

    } catch (error) {
      console.error("Error en la predicción:", error);
    }
  };

  const processAudio = async (audioBuffer) => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const decodedAudio = await audioContext.decodeAudioData(audioBuffer);

    const waveform = tf.tensor(decodedAudio.getChannelData(0));
    return waveform;
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-gray-50 m-3">
      <div className="w-full max-w-3xl bg-white p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-semibold text-center mb-6 text-blue-600">
          Clasificador de Sonido
        </h1>

        {/* Carga de archivo de audio */}
        <FileUploader onFileSelect={handleFileSelect} />

        {/* Botón para hace la predicción */}
        <button
          onClick={handlePredict}
          className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700"
        >
          Clasificar Sonido
        </button>

        {/* Botón para enviar el archivo */}
        {/* <ApiResponse audiofile={audiofile} /> */}       
      </div>
    </div>
  );
}
