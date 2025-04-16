"use client";

import data from "@/data/bird-data.json";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function PredictionsLog() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("es-PA", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const res = await fetch("/api/predictions");
        const data = await res.json();
        setRecords(data);
      } catch (err) {
        console.error("Error al cargar registros:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, []);

  if (loading) return <p className="p-4">Cargando registros...</p>;

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">
        Registros de Predicción
      </h2>

      {records.length === 0 ? (
        <p className="text-center text-gray-600">
          No hay registros disponibles.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {records.map((rec) => {
            const bird = data[rec.predictedLabel];
            const fecha = formatDate(rec.createdAt);

            return (
              <div
                key={rec._id}
                className="bg-green-50 p-6 rounded-lg shadow-md"
              >
                <div className="flex flex-col items-center">
                  {/* Imagen real si es tipo imagen */}
                  {rec.type === "image" ? (
                    <img
                      src={`/api/file/${rec.fileId}`}
                      alt="Imagen utilizada"
                      className="w-52 h-52 object-cover rounded-full shadow-md border-4 border-green-200 mb-4"
                    />
                  ) : (
                    // Poster del ave si es audio
                    bird?.Poster && (
                      <div className="relative w-52 h-52 mb-4">
                        <Image
                          src={bird.Poster}
                          alt={bird.Name}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="rounded-full shadow-md object-cover border-4 border-green-200"
                        />
                      </div>
                    )
                  )}

                  {/* Reproductor si es tipo audio */}
                  {rec.type === "audio" && (
                    <audio
                      controls
                      src={`/api/file/${rec.fileId}`}
                      className="mb-4"
                    />
                  )}

                  <p className="text-gray-800 text-lg font-semibold text-center">
                    <span className="text-green-700">Ave predicha:</span>{" "}
                    {bird?.Name || `Ave #${rec.predictedLabel}`}
                  </p>

                  <p className="text-sm text-gray-600 mb-3">
                    <strong>Fecha:</strong> {fecha}
                  </p>

                  <Link
                    href={`/gallery/${rec.predictedLabel}`}
                    className="mt-3 inline-block bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-500 transition"
                  >
                    Ver en catálogo
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
