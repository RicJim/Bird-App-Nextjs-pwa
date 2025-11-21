import React from "react";
import data from "@/data/bird-data.json";
import Image from "next/image";

export default function BirdPredictCard({ predictedLabel }) {
  const bird = data[predictedLabel];

  return (
    <section className="bg-gradient-to-br from-green-50 to-emerald-100 p-4 sm:p-6 md:p-8 rounded-lg sm:rounded-xl shadow-md md:shadow-lg max-w-2xl md:max-w-4xl mx-auto">
      <div className="text-center mb-6 sm:mb-8">
        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-green-700">
          Predicción de Ave
        </h3>
      </div>

      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 sm:gap-8">
        {/* Imagen del ave */}
        <div className="flex-shrink-0 w-48 sm:w-56 md:w-64 h-48 sm:h-56 md:h-64">
          <div className="relative w-full h-full">
            <Image
              src={bird.Poster}
              alt={bird.Name}
              fill
              sizes="(max-width: 640px) 192px, (max-width: 768px) 224px, 256px"
              className="rounded-full shadow-md md:shadow-lg object-cover border-4 border-green-200 hover:border-green-400 transition-colors"
              priority
            />
          </div>
        </div>

        {/* Contenido de texto */}
        <div className="flex-1 text-center lg:text-left">
          <p className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-4">
            <span className="text-green-700 font-bold">Ave: </span>
            <br className="lg:hidden" />
            <span className="lg:ml-2">{bird.Name}</span>
          </p>

          <div className="text-left text-gray-700 space-y-3 sm:space-y-4">
            <div>
              <p className="text-base sm:text-lg md:text-xl font-bold text-green-700 mb-2 sm:mb-3">
                Descripción:
              </p>
              <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 flex-shrink-0">●</span>
                  <span>{bird.Descripcion1}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 flex-shrink-0">●</span>
                  <span>{bird.Descripcion2}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
