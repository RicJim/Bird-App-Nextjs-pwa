import { useState, useCallback, useRef, useEffect } from "react";
import { sanitizeForLogging } from "@/lib/security";

export function useCameraAccess() {
  const [isSupported, setIsSupported] = useState(true);
  const [permissionStatus, setPermissionStatus] = useState("prompt");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const streamRef = useRef(null);

  useEffect(() => {
    const hasGetUserMedia =
      !!(
        navigator.mediaDevices &&
        navigator.mediaDevices.getUserMedia &&
        navigator.mediaDevices.enumerateDevices
      ) || !!navigator.getUserMedia;

    setIsSupported(hasGetUserMedia);

    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: "camera" }).then((result) => {
        setPermissionStatus(result.state);
        result.addEventListener("change", () => {
          setPermissionStatus(result.state);
        });
      });
    }
  }, []);

  const startCamera = useCallback(
    async (videoElement, constraints = {}) => {
      if (!videoElement) {
        setError("Elemento de video no disponible");
        return false;
      }

      if (!isSupported) {
        setError("Tu dispositivo no soporta acceso a cámara");
        return false;
      }

      if (videoElement.srcObject) {
        // Verificar si el stream está activo
        const tracks = videoElement.srcObject.getTracks();
        if (
          tracks.length > 0 &&
          tracks.every((track) => track.readyState === "live")
        ) {
          console.log("Camera ya está iniciada");
          return true;
        }
        // Si el stream no está vivo, limpiarlo
        videoElement.srcObject = null;
      }

      try {
        setIsLoading(true);
        setError(null);

        const defaultConstraints = {
          video: {
            facingMode: "environment",
            width: { ideal: 1280 },
            height: { ideal: 720 },
            ...constraints.video,
          },
          audio: false,
          ...constraints,
        };

        let stream;
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          stream = await navigator.mediaDevices.getUserMedia(
            defaultConstraints
          );
        } else if (navigator.getUserMedia) {
          stream = await new Promise((resolve, reject) => {
            navigator.getUserMedia(defaultConstraints, resolve, reject);
          });
        } else {
          throw new Error("getUserMedia no disponible");
        }

        videoElement.srcObject = stream;
        streamRef.current = stream;

        return new Promise((resolve) => {
          const onLoadedMetadata = () => {
            videoElement.removeEventListener(
              "loadedmetadata",
              onLoadedMetadata
            );
            setPermissionStatus("granted");
            resolve(true);
          };
          videoElement.addEventListener("loadedmetadata", onLoadedMetadata);
        });
      } catch (error) {
        let errorMsg = "Error al acceder a la cámara";

        if (error.name === "NotAllowedError" || error.code === 13) {
          errorMsg =
            "Permiso de cámara denegado. Verifica la configuración de tu dispositivo.";
          setPermissionStatus("denied");
        } else if (error.name === "NotFoundError" || error.code === 8) {
          errorMsg = "No se encontró cámara en el dispositivo";
        } else if (error.name === "NotReadableError" || error.code === 0) {
          errorMsg =
            "La cámara está siendo utilizada por otra aplicación. Ciérrala e intenta de nuevo.";
        } else if (error.name === "OverconstrainedError") {
          errorMsg =
            "Tu dispositivo no cumple con los requisitos de cámara. Intenta reducir la resolución.";
        } else if (error.name === "TypeError") {
          errorMsg = "Configuración de cámara inválida";
        } else if (error.message?.includes("Permission denied")) {
          errorMsg = "Permiso de cámara denegado por el sistema";
          setPermissionStatus("denied");
        }

        setError(errorMsg);
        console.error("Camera error:", error.name, sanitizeForLogging(error));
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [isSupported]
  );

  const stopCamera = useCallback((videoElement) => {
    if (videoElement?.srcObject) {
      const tracks = videoElement.srcObject.getTracks();
      tracks.forEach((track) => {
        track.stop();
      });
      videoElement.srcObject = null;
    }

    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach((track) => {
        track.stop();
      });
      streamRef.current = null;
    }
  }, []);

  const pauseCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.enabled = false;
      });
    }
  }, []);

  const resumeCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.enabled = true;
      });
    }
  }, []);

  const requestCameraPermission = useCallback(async () => {
    if (!isSupported) {
      setError("Tu dispositivo no soporta acceso a cámara");
      return false;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());

      setPermissionStatus("granted");
      return true;
    } catch (error) {
      if (error.name === "NotAllowedError") {
        setPermissionStatus("denied");
      }
      setError("No se pudo obtener permiso de cámara");
      return false;
    }
  }, [isSupported]);

  return {
    isSupported,
    permissionStatus,
    error,
    isLoading,
    startCamera,
    stopCamera,
    pauseCamera,
    resumeCamera,
    requestCameraPermission,
  };
}
