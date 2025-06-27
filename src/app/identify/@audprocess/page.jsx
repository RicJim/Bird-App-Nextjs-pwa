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
    <section className="min-h-screen flex flex-col items-center md:px-12 lg:px-16 py-2">
      <p className="text-sm sm:text-base md:text-lg text-blue-600 text-center mb-6">
        Sube una audio o graba lo que escuchas para conocer más sobre la fauna
        que nos rodea.
      </p>
      <div className="flex flex-col md:flex-row justify-center items-stretch space-y-5 md:space-y-0 md:space-x-8">
        {/* Carga del archivo */}
        <div
          className={`flex flex-col items-center justify-between ${
            activeComponent === "uploader" ? "hidden" : "block"
          }`}
        >
          <div className="flex flex-col justify-between w-full bg-yellow-100 border border-yellow-300 rounded-xl shadow-md px-6 py-6 text-center">
            <p className="text-yellow-800 text-base font-semibold mb-4">
              ¿Tienes un Audio guardado?
            </p>
            <button
              className="flex py-3 sm:py-4 px-8 bg-gradient-to-r from-yellow-500 to-orange-400 
              text-white font-semibold rounded-full shadow-lg transform 
              hover:scale-105 transition-all duration-300 ease-in-out 
              focus:ring-4 focus:ring-orange-300 mx-auto"
              onClick={() => {
                setActiveComponent("uploader");
                setAudioFile(null);
                setSegments(null);
              }}
            >
              <ArrowUpTrayIcon className="h-6 w-6 mr-3" />
              Seleccionar Audio
            </button>
            <p className="text-yellow-600 text-sm mt-4">
              Usa este botón para subirlo desde tu dispositivo y analizarlo.
            </p>
          </div>
        </div>

        {/* Botón de Grabar Audio */}
        <div
          className={`flex flex-col items-center justify-between ${
            activeComponent === "mic" ? "hidden" : "block"
          }`}
        >
          <div className="flex flex-col justify-between w-full bg-green-100 border border-green-300 rounded-xl shadow-md px-6 py-6 text-center">
            <p className="text-green-800 text-base font-semibold mb-4">
              ¿Prefieres capturar el momento?
            </p>
            <button
              className="flex py-3 sm:py-4 px-8 bg-gradient-to-r from-green-500 to-teal-400 
              text-white font-semibold rounded-full shadow-lg transform 
              hover:scale-105 transition-all duration-300 ease-in-out 
              focus:ring-4 focus:ring-teal-300 mx-auto"
              onClick={() => {
                setActiveComponent("mic");
                setAudioFile(null);
                setSegments(null);
              }}
            >
              <MusicalNoteIcon className="h-6 w-6 mr-3" />
              Grabar Audio
            </button>
            <p className="text-green-600 text-sm mt-4">
              Graba un audio al instante y analiza su contenido.
            </p>
          </div>
        </div>
      </div>

      {/** Render Condicional */}
      <div className="w-full mt-2 flex justify-center">
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
        <div className="w-full max-w-xl">
          <h2 className="text-md sm:text-2xl font-semibold text-gray-700 mb-3">
            Identifica tu archivo
          </h2>
          {audioUrl && (
            <div className="w-full p-6 bg-green-50">
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
        <div className="w-full max-w-xl">
          <h2 className="text-md sm:text-2xl font-semibold text-gray-700 mb-4">
            Resultado del procesamiento
          </h2>
          <AudioClassifier segments={segments} audioFile={audiofile} />
        </div>
      )}
    </section>
  );
}
