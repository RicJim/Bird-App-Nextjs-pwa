"use client";

import { useState } from "react";
import ImageFileUploader from "@/components/identify/images/ImageFileUploader";
import CameraImage from "@/components/identify/images/CameraImage";
import dynamic from "next/dynamic";
import Image from "next/image";

const ImageClassifier = dynamic(
  () => import("@/components/identify/images/ImageClassifier"),
  { ssr: false }
);

import { ArrowUpTrayIcon, CameraIcon } from "@heroicons/react/24/outline";

export default function ImageProcessor() {
  const [imageFile, setImageFile] = useState(null);
  const [activeComponent, setActiveComponent] = useState(null);

  const handleFileSelect = (file) => {
    setImageFile(file);
  };

  return (
    <div className="w-full flex flex-col items-center px-2 sm:px-4 md:px-8 lg:px-12 py-4 sm:py-6">
      <p className="text-xs sm:text-sm md:text-base lg:text-lg text-blue-600 text-center mb-4 sm:mb-6 max-w-2xl">
        Sube una imagen o toma una fotografía para conocer más sobre la fauna
        que nos rodea.
      </p>

      <div className="w-full flex flex-col lg:flex-row justify-center items-stretch gap-4 sm:gap-6 md:gap-8 max-w-5xl">
        {/* Botón de seleccionar imagen */}
        <div
          className={`w-full lg:w-1/2 flex flex-col items-center justify-between ${
            activeComponent === "uploader" ? "hidden" : "flex"
          }`}
        >
          <div className="w-full bg-gradient-to-br from-yellow-100 to-yellow-50 border border-yellow-300 rounded-xl shadow-md p-4 sm:p-6 text-center">
            <p className="text-yellow-800 text-sm sm:text-base font-semibold mb-4">
              ¿Tienes una imagen guardada?
            </p>
            <button
              className="flex items-center justify-center py-2 sm:py-3 px-4 sm:px-6 bg-gradient-to-r from-yellow-500 to-orange-400 
              text-white text-sm sm:text-base font-semibold rounded-full shadow-lg transform 
              hover:scale-105 active:scale-100 transition-all duration-300 ease-in-out 
              focus:ring-4 focus:ring-orange-300 mx-auto w-fit"
              onClick={() => {
                setActiveComponent("uploader");
                setImageFile(null);
              }}
            >
              <ArrowUpTrayIcon className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
              Seleccionar Imagen
            </button>
            <p className="text-yellow-600 text-xs sm:text-sm mt-3">
              Usa este botón para subirla desde tu dispositivo y analizarla.
            </p>
          </div>
        </div>

        {/* Botón de tomar fotografía */}
        <div
          className={`w-full lg:w-1/2 flex flex-col items-center justify-between ${
            activeComponent === "camera" ? "hidden" : "flex"
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
                setActiveComponent("camera");
                setImageFile(null);
              }}
            >
              <CameraIcon className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
              Tomar Fotografía
            </button>
            <p className="text-green-600 text-xs sm:text-sm mt-3">
              Toma una fotografía al instante y analiza su contenido.
            </p>
          </div>
        </div>
      </div>

      {/** Render Condicional */}
      <div className="w-full max-w-2xl mt-4 sm:mt-6 flex justify-center">
        {/* Cargar Imagen */}
        {activeComponent === "uploader" && (
          <ImageFileUploader onFileSelect={handleFileSelect} />
        )}
        {/* Tomar imagen */}
        {activeComponent === "camera" && (
          <CameraImage onFileSelect={handleFileSelect} />
        )}
      </div>

      {/* Mostrar imagen y clasificación lado a lado */}
      {imageFile && activeComponent !== "camera" && (
        <div className="w-full mt-6 sm:mt-8 flex flex-col lg:flex-row justify-center items-start gap-6 lg:gap-8 max-w-6xl">
          {/* Imagen subida */}
          <div className="w-full lg:w-auto flex justify-center">
            <div className="relative overflow-hidden border-2 sm:border-4 border-gray-300 rounded-lg shadow-lg max-w-sm sm:max-w-md">
              <Image
                src={imageFile}
                alt="Imagen"
                width={300}
                height={225}
                className="object-cover w-full"
              />
            </div>
          </div>

          {/* Clasificación de imagen */}
          <div className="w-full lg:w-auto flex justify-center lg:items-start">
            <ImageClassifier imageFile={imageFile} />
          </div>
        </div>
      )}

      {/* Clasificación de imagen para fotos de cámara */}
      {imageFile && activeComponent === "camera" && (
        <div className="w-full max-w-2xl mt-4 sm:mt-6 flex justify-center">
          <ImageClassifier imageFile={imageFile} />
        </div>
      )}
    </div>
  );
}
