"use client";

import { useQueueStatus, useQueueCleanup } from "@/hooks/useQueueStatus";
import { useState } from "react";

export function QueueStatusMonitor({ showDetails = false }) {
  const { queueStats, isLoading, error, refetch } = useQueueStatus();
  const { cleanup, isLoading: isCleaningUp } = useQueueCleanup();
  const [showMonitor, setShowMonitor] = useState(false);

  if (!showMonitor && !showDetails) {
    return (
      <button
        onClick={() => setShowMonitor(true)}
        className="fixed bottom-4 right-4 bg-green-600 text-white px-3 py-2 rounded-lg text-xs hover:bg-green-700 transition"
      >
        Cola
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-xl p-4 max-w-sm border-2 border-green-300 z-50">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-green-700">Estado de Cola</h3>
        <button
          onClick={() => setShowMonitor(false)}
          className="text-gray-500 hover:text-gray-700 font-bold"
        >
          ✕
        </button>
      </div>

      {error && (
        <div className="mb-3 p-2 bg-red-50 border border-red-300 rounded text-sm text-red-700">
          Error: {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center text-gray-600 py-3">Cargando...</div>
      ) : queueStats ? (
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
            <span className="font-semibold">Total:</span>
            <span className="bg-gray-200 px-2 py-1 rounded font-bold">
              {queueStats.total}
            </span>
          </div>

          <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
            <span>Pendiente:</span>
            <span className="bg-yellow-200 px-2 py-1 rounded font-bold">
              {queueStats.pending}
            </span>
          </div>

          {queueStats.processing > 0 && (
            <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
              <span>Procesando:</span>
              <span className="bg-blue-200 px-2 py-1 rounded font-bold animate-pulse">
                {queueStats.processing}
              </span>
            </div>
          )}

          {queueStats.completed > 0 && (
            <div className="flex justify-between items-center p-2 bg-green-50 rounded">
              <span>Completado:</span>
              <span className="bg-green-200 px-2 py-1 rounded font-bold">
                {queueStats.completed}
              </span>
            </div>
          )}

          {queueStats.failed > 0 && (
            <div className="flex justify-between items-center p-2 bg-red-50 rounded">
              <span>Fallido:</span>
              <span className="bg-red-200 px-2 py-1 rounded font-bold">
                {queueStats.failed}
              </span>
            </div>
          )}

          <div className="flex items-center gap-2 p-2 bg-purple-50 rounded">
            <span>Estado:</span>
            <span className="font-semibold">
              {queueStats.isProcessing ? (
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse" />
                  Procesando
                </span>
              ) : queueStats.total > 0 ? (
                <span className="text-yellow-600">Esperando</span>
              ) : (
                <span className="text-green-600">Vacío</span>
              )}
            </span>
          </div>
        </div>
      ) : null}

      <div className="flex gap-2 mt-4">
        <button
          onClick={refetch}
          disabled={isLoading}
          className="flex-1 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 disabled:opacity-50 transition"
        >
          Refrescar
        </button>

        <button
          onClick={() => cleanup("cleanup")}
          disabled={isCleaningUp}
          className="flex-1 px-2 py-1 bg-orange-500 text-white rounded text-xs hover:bg-orange-600 disabled:opacity-50 transition"
          title="Limpia tareas completadas/fallidas"
        >
          Limpiar
        </button>

        <button
          onClick={() => cleanup("clear")}
          disabled={isCleaningUp}
          className="flex-1 px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 disabled:opacity-50 transition"
          title="Vacía toda la cola"
        >
          Vaciar
        </button>
      </div>

      <div className="text-xs text-gray-500 mt-2 text-center">
        Auto-refresca cada 5s
      </div>
    </div>
  );
}

export function QueueStatusBadge() {
  const { queueStats } = useQueueStatus();

  if (!queueStats || queueStats.total === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-1 px-2 py-1 bg-yellow-50 border border-yellow-300 rounded-lg text-xs">
      <div className="w-2 h-2 bg-yellow-600 rounded-full animate-pulse" />
      <span className="font-semibold">{queueStats.total} en cola</span>
    </div>
  );
}
