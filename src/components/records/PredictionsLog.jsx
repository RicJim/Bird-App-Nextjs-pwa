"use client";

import data from "@/data/bird-data.json";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import {
  LoadingState,
  EmptyState,
  ErrorState,
} from "@/components/loading/LoadingComponents";

export default function PredictionsLog() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("es-PA", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const fetchPredictions = async () => {
    try {
      setError(null);
      setLoading(true);
      const res = await fetch("/api/predictions");
      const data = await res.json();
      setRecords(data || []);
    } catch (err) {
      console.error("Error al cargar registros:", err);
      setError("No se pudieron cargar los registros. Intenta más tarde.");
    } finally {
      setLoading(false);
    }
  };

  const deletePrediction = async (id) => {
    if (
      !window.confirm("¿Estás seguro de que deseas eliminar esta predicción?")
    ) {
      return;
    }

    try {
      setDeletingId(id);
      const res = await fetch(`/api/predictions/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Error al eliminar");
      }

      setRecords(records.filter((rec) => rec._id !== id));
    } catch (err) {
      console.error("Error al eliminar predicción:", err);
      setError("No se pudo eliminar la predicción. Intenta más tarde.");
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchPredictions();
  }, []);

  if (loading)
    return <LoadingState title="Registros de Predicción" cardCount={4} />;

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">
        Registros de Predicción
      </h2>

      {error && (
        <div className="mb-6">
          <ErrorState message={error} onRetry={fetchPredictions} />
        </div>
      )}

      {records.length === 0 && !error && (
        <EmptyState
          title="No hay registros disponibles"
          subtitle="Comienza identificando aves para crear registros."
        />
      )}

      {records.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {records.map((rec, index) => {
            const bird = data[rec.predictedLabel];
            const fecha = formatDate(rec.createdAt);

            return (
              <div
                key={rec._id}
                className="bg-green-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 animate-fadeIn relative"
                style={{
                  animation: `fadeIn 0.5s ease-in-out ${index * 0.1}s both`,
                }}
              >
                {/* Botón eliminar */}
                <button
                  onClick={() => deletePrediction(rec._id)}
                  disabled={deletingId === rec._id}
                  className="absolute top-4 right-4 p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Eliminar predicción"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>

                <div className="flex flex-col items-center">
                  {/* Imagen real si es tipo imagen */}
                  {rec.type === "image" ? (
                    <div className="relative w-52 h-52 mb-4 rounded-full shadow-md border-4 border-green-200 overflow-hidden group">
                      <Image
                        src={`/api/file/${rec.fileId}`}
                        alt="Imagen utilizada"
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    // Poster del ave si es audio
                    bird?.Poster && (
                      <div className="relative w-52 h-52 mb-4 rounded-full shadow-md border-4 border-green-200 overflow-hidden group">
                        <Image
                          src={bird.Poster}
                          alt={bird.Name}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    )
                  )}

                  {/* Reproductor si es tipo audio */}
                  {rec.type === "audio" && (
                    <audio
                      controls
                      src={`/api/file/${rec.fileId}`}
                      className="mb-4 w-full"
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
                    className="mt-3 inline-block bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-500 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    Ver en catálogo
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
