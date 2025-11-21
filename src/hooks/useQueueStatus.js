"use client";

import { useState, useEffect, useCallback } from "react";

export function useQueueStatus() {
  const [queueStats, setQueueStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchQueueStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const res = await fetch("/api/queue/status");
      if (!res.ok) throw new Error("Error fetching queue status");

      const data = await res.json();
      setQueueStats(data.queue);
    } catch (err) {
      console.error("Error fetching queue status:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQueueStatus();

    const interval = setInterval(() => {
      fetchQueueStatus();
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchQueueStatus]);

  return {
    queueStats,
    isLoading,
    error,
    refetch: fetchQueueStatus,
  };
}

export function useQueueCleanup() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const cleanup = useCallback(async (action = "cleanup") => {
    try {
      setIsLoading(true);
      setError(null);

      const res = await fetch("/api/queue/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      if (!res.ok) throw new Error("Error al limpiar la cola");

      const data = await res.json();
      console.log(data.message);
      return data;
    } catch (err) {
      console.error("Error cleaning queue:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { cleanup, isLoading, error };
}
