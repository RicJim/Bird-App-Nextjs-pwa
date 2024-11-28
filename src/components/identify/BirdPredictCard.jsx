import React from "react";
import data from "@/data/bird-data.json";
import Image from "next/image";

export default function BirdPredictCard({ predictedLabel }) {
  const bird = data[predictedLabel];

  return (
    <section className="bg-green-50 p-6 rounded-lg shadow-md max-w-4xl mx-auto mt-8">
  <div className="text-center">
    <h3 className="text-2xl font-bold text-green-700 mb-6">
      Predicción de Ave
    </h3>
  </div>

  <div className="flex flex-col items-center">
    <div className="relative w-64 h-64 mb-6">
      <Image
        src={bird.Poster}
        alt={bird.Name}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="rounded-full shadow-md object-cover border-4 border-green-200"
      />
    </div>

    <p className="text-center text-gray-800 text-xl font-semibold mb-4">
      <span className="text-green-700">Ave Predicha:</span> {bird.Name}
    </p>

    <div className="text-center text-gray-700">
      <p className="text-lg font-bold text-green-700">Descripción:</p>
      <ul className="mt-4 space-y-3 text-base leading-relaxed">
        <li className="flex items-start">
          <span className="text-green-500 mr-2">●</span> {bird.Descripcion1}
        </li>
        <li className="flex items-start">
          <span className="text-green-500 mr-2">●</span> {bird.Descripcion2}
        </li>
      </ul>
    </div>

        {/*<div className="flex justify-center gap-4">
          <button className="bg-green-600 text-white p-2 rounded-lg shadow-md hover:bg-green-500 transition duration-300 ease-in-out">
            Más información
          </button>
        </div>*/}
      </div>
    </section>
  );
}
