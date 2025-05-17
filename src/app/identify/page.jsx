"use client";

import Link from "next/link";
import { CameraIcon, MusicalNoteIcon } from "@heroicons/react/24/outline";

export default function IdentifyPage() {
  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center text-center sm:p-10 shadow-lg
            bg-gray-50 bg-gradient-to-b from-white to-green-300"
    >
      <section>
        <h1 className="text-2xl sm:text-3xl font-bold text-yellow-600 mb-4 text-center">
          ¡Explora la Naturaleza!
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-blue-600 text-center mb-6">
          Sube un archivo, toma una fotografía o graba un audio para descubrir
          más sobre la fauna que nos rodea.
        </p>
        <div className="flex flex-wrap justify-center items-center mb-8 gap-10">
          <Link href="/identify/image-processor">
            <button
              className="flex items-center py-3 px-10 text-white rounded-lg shadow-md 
                            bg-gradient-to-r from-green-500 to-green-600                             
                            hover:scale-105 transform transition-all duration-300 focus:outline-none"
            >
              <CameraIcon className="h-6 w-6 mr-3" />
              Clasificación por Imágenes
            </button>
          </Link>

          <Link href="/identify/audio-processor">
            <button
              className="flex items-center py-3 px-10 
                            bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-md                            
                            hover:scale-105 transform transition-all duration-300 focus:outline-none"
            >
              <MusicalNoteIcon className="h-6 w-6 mr-3" />
              Clasificación por Sonido
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
