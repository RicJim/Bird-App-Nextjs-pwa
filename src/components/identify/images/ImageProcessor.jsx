import { useState } from "react";
import ImageFileUploader from "./ImageFileUploader";
import CameraImage from "./CameraImage";
import ImageClassifier from "./ImageClassifier";
import Image from "next/image";

export default function ImageProcessor({ imageModel }) {
  const [imageFile, setImageFile] = useState(null);
  const [activeComponent, setActiveComponent] = useState(null);

  const handleFileSelect = (file) => {
    setImageFile(file);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 m-3">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
        Clasificador de Imágenes
      </h1>
      <div className="flex justify-center space-x-6 mb-8">
        <button
          className="py-2 px-8 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          onClick={() => {
            setActiveComponent("uploader");
            setImageFile(null);
          }}>
          Selecionar Imagen
        </button>
        <button
          className="py-2 px-8 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          onClick={() => {
            setActiveComponent("camera");
            setImageFile(null);
          }}>
          Tomar Fotografía
        </button>
      </div>

      {/* Mostrar imagen */}
      {imageFile && (
        <div className="flex justify-center mb-6">
          <div className="relative w-96 h-96 overflow-hidden border-2 border-gray-300 rounded-lg">
            <Image
              src={imageFile}
              alt="Imagen"
              fill
              className="object-cover"
            />
          </div>
        </div>
      )}

      {/** Render Condicional */}
      <div className="mt-8">
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
        <ImageClassifier imageFile={imageFile} imageModel={imageModel} />
      )}
    </div>
  );
}
