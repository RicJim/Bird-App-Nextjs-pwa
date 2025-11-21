"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface PWAContextType {
  isOnline: boolean;
  isInstalled: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deferredPrompt: any;
  showInstallPrompt: () => void;
  cacheSize: number;
  clearCache: () => Promise<void>;
}

const PWAContext = createContext<PWAContextType | undefined>(undefined);

export function PWAProvider({ children }: { children: ReactNode }) {
  const [isOnline, setIsOnline] = useState(true);
  const [isInstalled, setIsInstalled] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [cacheSize, setCacheSize] = useState(0);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.controller?.postMessage({
          type: "SYNC_DATA",
        });
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  useEffect(() => {
    const calculateCacheSize = async () => {
      if ("storage" in navigator && "estimate" in navigator.storage) {
        try {
          const estimate = await navigator.storage.estimate();
          const usage = estimate.usage || 0;
          setCacheSize(Math.round(usage / 1024 / 1024));
        } catch (error) {
          console.error("Error calculando tamaño de caché:", error);
        }
      }
    };

    calculateCacheSize();
    const interval = setInterval(calculateCacheSize, 30000);
    return () => clearInterval(interval);
  }, []);

  const showInstallPrompt = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setDeferredPrompt(null);
      }
    }
  };

  const clearCache = async () => {
    try {
      if ("caches" in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
        setCacheSize(0);
      }
    } catch (error) {
      console.error("Error limpiando caché:", error);
    }
  };

  return (
    <PWAContext.Provider
      value={{
        isOnline,
        isInstalled,
        deferredPrompt,
        showInstallPrompt,
        cacheSize,
        clearCache,
      }}
    >
      {children}
    </PWAContext.Provider>
  );
}

export function usePWA(): PWAContextType {
  const context = useContext(PWAContext);
  if (context === undefined) {
    throw new Error("usePWA debe ser usado dentro de PWAProvider");
  }
  return context;
}

export function OfflineIndicator() {
  const { isOnline } = usePWA();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 mx-auto max-w-sm px-4 py-3 bg-red-100 text-red-800 rounded-lg shadow-lg border border-red-200 z-50 flex items-center gap-2">
      <span className="text-sm font-medium">Sin conexión - Modo offline</span>
    </div>
  );
}
