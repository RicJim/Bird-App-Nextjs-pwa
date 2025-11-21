"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import AudioApiResponse from "@/components/identify/audio/AudioApiResponse.jsx";
import AudioFileUploader from "@/components/identify/audio/AudioFileUploader";

const AudioClassifier = dynamic(
  () => import("@/components/identify/audio/AudioClassifier"),
  { ssr: false }
);

const MicrophoneAudio = dynamic(
  () => import("@/components/identify/audio/MicrophoneAudio"),
  {
    ssr: false,
  }
);

import { ArrowUpTrayIcon, MusicalNoteIcon } from "@heroicons/react/24/outline";

export default function AudioProcessor() {
  const [audiofile, setAudioFile] = useState(null);
  const [segments, setSegments] = useState(null);
  const [audioUrl, setAudioUrl] = useState("");
  const [activeComponent, setActiveComponent] = useState(null);

  const handleFileSelect = (file) => {
    setAudioFile(file);
    setSegments(null);
    setAudioUrl(URL.createObjectURL(file));
  };

  return (
    <section className="w-full flex flex-col items-center px-2 sm:px-4 md:px-8 lg:px-12 py-4 sm:py-6">
      <p className="text-xs sm:text-sm md:text-base lg:text-lg text-blue-600 text-center mb-4 sm:mb-6 max-w-2xl">
        Sube un audio o graba lo que escuchas para conocer más sobre la fauna
        que nos rodea.
      </p>
      <div className="w-full flex flex-col lg:flex-row justify-center items-stretch gap-4 sm:gap-6 md:gap-8 max-w-5xl">
        {/* Carga del archivo */}
        <div
          className={`w-full lg:w-1/2 flex flex-col items-center justify-between ${
            activeComponent === "uploader" ? "hidden" : "flex"
          }`}
        >
          <div className="w-full bg-gradient-to-br from-yellow-100 to-yellow-50 border border-yellow-300 rounded-xl shadow-md p-4 sm:p-6 text-center">
            <p className="text-yellow-800 text-sm sm:text-base font-semibold mb-4">
              ¿Tienes un Audio guardado?
            </p>
            <button
              className="flex items-center justify-center py-2 sm:py-3 px-4 sm:px-6 bg-gradient-to-r from-yellow-500 to-orange-400 
              text-white text-sm sm:text-base font-semibold rounded-full shadow-lg transform 
              hover:scale-105 active:scale-100 transition-all duration-300 ease-in-out 
              focus:ring-4 focus:ring-orange-300 mx-auto w-fit"
              onClick={() => {
                setActiveComponent("uploader");
                setAudioFile(null);
                setSegments(null);
              }}
            >
              <ArrowUpTrayIcon className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
              Seleccionar Audio
            </button>
            <p className="text-yellow-600 text-xs sm:text-sm mt-3">
              Usa este botón para subirlo desde tu dispositivo y analizarlo.
            </p>
          </div>
        </div>

        {/* Botón de Grabar Audio */}
        <div
          className={`w-full lg:w-1/2 flex flex-col items-center justify-between ${
            activeComponent === "mic" ? "hidden" : "flex"
          }`}
        >
          <div className="w-full bg-gradient-to-br from-green-100 to-green-50 border border-green-300 rounded-xl shadow-md p-4 sm:p-6 text-center">
            <p className="text-green-800 text-sm sm:text-base font-semibold mb-4">
              ¿Prefieres capturar el momento?
            </p>
            <button
              className="flex items-center justify-center py-2 sm:py-3 px-4 sm:px-6 bg-gradient-to-r from-green-500 to-teal-400 
              text-white text-sm sm:text-base font-semibold rounded-full shadow-lg transform 
              hover:scale-105 active:scale-100 transition-all duration-300 ease-in-out 
              focus:ring-4 focus:ring-teal-300 mx-auto w-fit"
              onClick={() => {
                setActiveComponent("mic");
                setAudioFile(null);
                setSegments(null);
              }}
            >
              <MusicalNoteIcon className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
              Grabar Audio
            </button>
            <p className="text-green-600 text-xs sm:text-sm mt-3">
              Graba un audio al instante y analiza su contenido.
            </p>
          </div>
        </div>
      </div>

      {/** Render Condicional */}
      <div className="w-full max-w-2xl mt-4 sm:mt-6 flex justify-center">
        {/* Cargar Audio */}
        {activeComponent === "uploader" && (
          <AudioFileUploader
            onFileSelect={handleFileSelect}
            className="w-full"
          />
        )}
        {/* Grabar Audio */}
        {activeComponent === "mic" && (
          <MicrophoneAudio onFileSelect={handleFileSelect} className="w-full" />
        )}
      </div>

      {/* Envío del archivo al API */}
      {audiofile && (
        <div className="w-full max-w-2xl mt-4 sm:mt-6">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-700 mb-3 sm:mb-4">
            Identifica tu archivo
          </h2>
          {audioUrl && (
            <div className="w-full p-4 sm:p-6 bg-green-50 rounded-lg mb-4">
              <audio
                controls
                src={audioUrl}
                className="w-full rounded-lg border border-gray-300 shadow-sm"
              ></audio>
            </div>
          )}
          <AudioApiResponse audiofile={audiofile} setSegments={setSegments} />
        </div>
      )}

      {/* Clasificación del audio */}
      {segments && (
        <div className="w-full max-w-2xl mt-4 sm:mt-6">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-700 mb-3 sm:mb-4">
            Resultado del procesamiento
          </h2>
          <AudioClassifier segments={segments} audioFile={audiofile} />
        </div>
      )}
    </section>
  );
}
