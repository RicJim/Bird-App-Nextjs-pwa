import { useState } from "react";
import ImageFileUploader from "./ImageFileUploader";
import CameraImage from "./CameraImage";
import ImageClassifier from "./ImageClassifier";
import Image from "next/image";

import { ArrowUpTrayIcon, CameraIcon } from "@heroicons/react/24/outline";

export default function ImageProcessor() {
  const [imageFile, setImageFile] = useState(null);
  const [activeComponent, setActiveComponent] = useState(null);

  const handleFileSelect = (file) => {
    setImageFile(file);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center md:px-12 lg:px-16 py-2">
      <h1 className="text-2xl sm:text-3xl font-bold text-yellow-600 mb-4 text-center">
        ¡Explora la Naturaleza!
      </h1>
      <p className="text-sm sm:text-base md:text-lg text-blue-600 text-center mb-6">
        Sube una imagen o toma una fotografía para conocer más sobre la fauna
        que nos rodea.
      </p>

      <div className="flex flex-col md:flex-row justify-center items-stretch space-y-5 md:space-y-0 md:space-x-8">
        {/* Botón de seleccionar imagen */}
        <div
          className={`flex flex-col items-center justify-between ${
            activeComponent === "uploader" ? "hidden" : "block"
          }`}
        >
          <div className="flex flex-col justify-between w-full bg-yellow-100 border border-yellow-300 rounded-xl shadow-md px-6 py-6 text-center">
            <p className="text-yellow-800 text-base font-semibold mb-4">
              ¿Tienes una imagen guardada?
            </p>
            <button
              className="flex py-3 sm:py-4 px-8 bg-gradient-to-r from-yellow-500 to-orange-400 
              text-white font-semibold rounded-full shadow-lg transform 
              hover:scale-105 transition-all duration-300 ease-in-out 
              focus:ring-4 focus:ring-orange-300 mx-auto"
              onClick={() => {
                setActiveComponent("uploader");
                setImageFile(null);
              }}
            >
              <ArrowUpTrayIcon className="h-6 w-6 mr-3" />
              Seleccionar Imagen
            </button>
            <p className="text-yellow-600 text-sm mt-4">
              Usa este botón para subirla desde tu dispositivo y analizarla.
            </p>
          </div>
        </div>

        {/* Botón de tomar fotografía */}
        <div
          className={`flex flex-col items-center justify-between ${
            activeComponent === "camera" ? "hidden" : "block"
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
                setActiveComponent("camera");
                setImageFile(null);
              }}
            >
              <CameraIcon className="h-6 w-6 mr-3" />
              Tomar Fotografía
            </button>
            <p className="text-green-600 text-sm mt-4">
              Toma una fotografía al instante y analiza su contenido.
            </p>
          </div>
        </div>
      </div>

      {/* Mostrar imagen */}
      {imageFile && (
        <div className="flex justify-center mt-8">
          <div
            className="relative w-[45vh] h-[45vh] sm:w-[60vh] sm:h-[40vh] md:w-[80vh] md:h-[60vh] 
            overflow-hidden border-2 border-gray-300 rounded-lg shadow-lg"
          >
            <Image src={imageFile} alt="Imagen" fill className="object-cover" />
          </div>
        </div>
      )}

      {/** Render Condicional */}
      <div className="w-full mt-2 flex justify-center">
        {/* Cargar Imagen */}
        {activeComponent === "uploader" && (
          <ImageFileUploader onFileSelect={handleFileSelect} />
        )}
        {/* Tomar imagen */}
        {activeComponent === "camera" && (
          <CameraImage onFileSelect={handleFileSelect} />
        )}
      </div>

      {/** Clasificación de imagen */}
      {imageFile && (
        <div className="w-full mt-2 flex justify-center">
          <ImageClassifier imageFile={imageFile} />
        </div>
      )}
    </div>
  );
}
