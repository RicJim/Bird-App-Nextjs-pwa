import { useState } from "react";
import ImageFileUploader from "./ImageFileUploader";
import CameraImage from "./CameraImage";
import ImageClassifier from "./ImageClassifier";
import Image from "next/image";

import { UploadIcon, CameraIcon } from "@heroicons/react/outline";

export default function ImageProcessor({ imageModel }) {
  const [imageFile, setImageFile] = useState(null);
  const [activeComponent, setActiveComponent] = useState(null);

  const handleFileSelect = (file) => {
    setImageFile(file);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center md:px-12 lg:px-16 py-2">
      <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-blue-600 mb-12">
        Clasificación por Imágenes
      </h1>

      <div className="flex flex-col justify-center items-center space-y-3 sm:space-y-0 mb-5">
        {/* Botón de seleccionar imagen */}
        <div className={`flex flex-row items-center my-10 ${activeComponent === "uploader" ? "hidden" : "block"}`}>
          <button
            className="flex py-3 sm:py-4 px-10 bg-gradient-to-r from-blue-500 to-blue-600 
              text-white rounded-lg shadow-lg transform 
                hover:scale-105 transition-all duration-300 ease-in-out mx-5
                focus:ring-4 focus:ring-blue-300"
            onClick={() => {
              setActiveComponent("uploader");
              setImageFile(null);
            }}
          >
            <UploadIcon className="h-6 w-6 mr-3" />
            Seleccionar Imagen
          </button>
          <p className="text-sm text-gray-500 mt-2 text-center">
            Permite cargar una imagen desde tu dispositivo.
          </p>
        </div>

        {/* Botón de tomar fotografía */}
        <div className={`flex flex-row items-center my-10 ${activeComponent === "camera" ? "hidden" : "block"}`}>
          <button
            className="flex py-3 sm:py-4 px-10 bg-gradient-to-r from-green-500 to-green-600 
              text-white rounded-lg shadow-lg transform 
                hover:scale-105 transition-all duration-300 ease-in-out 
                focus:ring-4 focus:ring-green-300 mx-5"
            onClick={() => {
              setActiveComponent("camera");
              setImageFile(null);
            }}
          >
            <CameraIcon className="h-6 w-6 mr-3" />
            Tomar Fotografía
          </button>
          <p className="text-sm text-gray-500 mt-2 text-center">
            Permite tomar una fotografía con tu cámara.
          </p>
        </div>
      </div>

      {/* Mostrar imagen */}
      {imageFile && (
        <div className="flex justify-center mb-1">
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
          <ImageClassifier imageFile={imageFile} imageModel={imageModel} />
        </div>
      )}
    </div>
  );
}
