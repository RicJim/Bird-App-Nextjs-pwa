import React, { useState, useRef, useEffect } from "react";
import { sanitizeForLogging } from "@/lib/security";
import { useCameraAccess } from "@/hooks/useCameraAccess";
import {
  CameraIcon,
  ArrowPathIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import "@/styles/camera.css";

export default function CameraImage({ onFileSelect }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [scale, setScale] = useState(1);
  const [initialDistance, setInitialDistance] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(false);
  const [isFirstAttempt, setIsFirstAttempt] = useState(true);
  const isRetakingRef = useRef(false);

  const {
    isSupported,
    permissionStatus,
    error: cameraError,
    isLoading: isCameraLoading,
    startCamera: hookStartCamera,
    stopCamera: hookStopCamera,
    pauseCamera,
    resumeCamera,
    requestCameraPermission,
  } = useCameraAccess();

  const startCamera = async () => {
    if (!isSupported) {
      setError(
        "Tu dispositivo no soporta acceso a cámara. Prueba con otro navegador o dispositivo."
      );
      return;
    }

    if (permissionStatus === "denied") {
      setShowPermissionPrompt(true);
      setError(
        "Permiso denegado. Ve a configuración del dispositivo > Aplicaciones > [Tu Navegador] > Permisos > Cámara y habilita el acceso."
      );
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const success = await hookStartCamera(videoRef.current);

      if (success) {
        const track = videoRef.current?.srcObject?.getVideoTracks()[0];
        if (track) {
          const capabilities = track.getCapabilities?.();
          if (capabilities?.zoom) {
            console.log("Zoom soportado:", capabilities.zoom);
          }
        }
      } else if (cameraError) {
        setError(cameraError);
      }
    } catch (error) {
      setError("Error inesperado al acceder a la cámara");
      console.error("Camera error:", sanitizeForLogging(error));
    } finally {
      setIsLoading(false);
      setIsFirstAttempt(false);
    }
  };

  const stopCamera = (videoElement) => {
    hookStopCamera(videoElement);
  };

  useEffect(() => {
    startCamera();

    const videoEl = videoRef.current;

    return () => {
      if (videoEl?.srcObject) {
        stopCamera(videoEl);
      }
    };
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && videoRef.current?.srcObject) {
        pauseCamera();
      } else if (!document.hidden && !capturedImage) {
        resumeCamera();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [pauseCamera, resumeCamera, capturedImage]);

  const calculateDistance = (touch1, touch2) => {
    return Math.sqrt(
      Math.pow(touch2.pageX - touch1.pageX, 2) +
        Math.pow(touch2.pageY - touch1.pageY, 2)
    );
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const dist = calculateDistance(e.touches[0], e.touches[1]);
      setInitialDistance(dist);
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && initialDistance) {
      e.preventDefault();
      const dist = calculateDistance(e.touches[0], e.touches[1]);
      const newScale = Math.min(
        Math.max((dist / initialDistance) * scale, 1),
        4
      );
      setScale(newScale);
      applyRealZoom(newScale);
    }
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const zoomFactor = 0.01;

    const newScale = Math.min(Math.max(scale + e.deltaY * -zoomFactor, 1), 4);
    setScale(newScale);
    applyRealZoom(newScale);
  };

  const handleSliderChange = (e) => {
    const newScale = Math.min(Math.max(e.target.value, 1), 4);
    setScale(newScale);
    applyRealZoom(newScale);
  };

  const applyRealZoom = async (zoomLevel) => {
    try {
      const videoStream = videoRef.current?.srcObject;
      if (!videoStream) return;

      const videoTrack = videoStream.getVideoTracks()[0];
      if (!videoTrack) return;

      const capabilities = videoTrack.getCapabilities
        ? videoTrack.getCapabilities()
        : {};
      const settings = videoTrack.getSettings ? videoTrack.getSettings() : {};

      if (capabilities.zoom) {
        const { min: minZoom, max: maxZoom } = capabilities.zoom;

        const deviceZoom =
          minZoom + ((zoomLevel - 1) / 3) * (maxZoom - minZoom);
        const clampedZoom = Math.min(Math.max(deviceZoom, minZoom), maxZoom);

        await videoTrack.applyConstraints({
          advanced: [{ zoom: clampedZoom }],
        });
      }
    } catch (error) {
      console.error("Error aplicando zoom:", sanitizeForLogging(error));
    }
  };

  const capturePhoto = () => {
    try {
      if (!videoRef.current || !canvasRef.current) {
        setError("Cámara no disponible");
        return;
      }

      // Validar que el video está listo
      if (
        videoRef.current.videoWidth === 0 ||
        videoRef.current.videoHeight === 0
      ) {
        setError("Por favor espera a que la cámara se cargue completamente");
        return;
      }

      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (!context) {
        setError("Error al procesar la imagen");
        return;
      }

      const videoWidth = videoRef.current.videoWidth;
      const videoHeight = videoRef.current.videoHeight;

      // Validar dimensiones
      if (videoWidth < 100 || videoHeight < 100) {
        setError("Resolución de video insuficiente");
        return;
      }

      canvas.width = videoWidth;
      canvas.height = videoHeight;

      context.save();
      context.translate(videoWidth / 2, videoHeight / 2);
      context.scale(scale, scale);
      context.translate(-videoWidth / 2, -videoHeight / 2);
      context.drawImage(videoRef.current, 0, 0, videoWidth, videoHeight);
      context.restore();

      const cropX = canvas.width * 0.1;
      const cropY = canvas.height * 0.1;
      const cropWidth = canvas.width * 0.8;
      const cropHeight = canvas.height * 0.8;

      const croppedCanvas = document.createElement("canvas");
      const croppedContext = croppedCanvas.getContext("2d");

      if (!croppedContext) {
        setError("Error al procesar la imagen");
        return;
      }

      croppedCanvas.width = cropWidth;
      croppedCanvas.height = cropHeight;

      croppedContext.drawImage(
        canvas,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        cropWidth,
        cropHeight
      );

      const imgData = croppedCanvas.toDataURL("image/jpeg", 0.9);

      const sizeInMB = (imgData.length * 3) / (4 * 1024 * 1024);
      if (sizeInMB > 5) {
        setError("Imagen muy grande. Reduce la resolución.");
        return;
      }

      setCapturedImage(imgData);
      setError(null);
      onFileSelect(imgData);
      stopCamera(videoRef.current);
    } catch (error) {
      setError("Error al capturar la foto");
      console.error("Capture error:", sanitizeForLogging(error));
    }
  };

  const retakeImage = async () => {
    isRetakingRef.current = true;

    // Detener la cámara actual
    if (videoRef.current?.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }

    // Resetear estados
    setCapturedImage(null);
    setError(null);
    setShowPermissionPrompt(false);
    setScale(1);
    setInitialDistance(null);
    setIsFirstAttempt(true);
    onFileSelect(null);

    // Delay para permitir que se limpie completamente
    setTimeout(async () => {
      await startCamera();
      isRetakingRef.current = false;
    }, 200);
  };

  const handleRequestPermission = async () => {
    const hasPermission = await requestCameraPermission();
    if (hasPermission) {
      setShowPermissionPrompt(false);
      startCamera();
    }
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onWheel={handleWheel}
      className="relative flex flex-col items-center w-full"
    >
      {/* Hidden Canvas */}
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>

      {!isSupported && (
        <div className="w-full mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-start gap-3">
          <XCircleIcon className="w-6 h-6 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Dispositivo no soportado</p>
            <p className="text-sm mt-1">
              Tu dispositivo o navegador no soporta acceso a cámara. Intenta con
              otro navegador.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div
          className={`w-full mb-4 p-4 rounded-lg flex items-start gap-3 ${
            showPermissionPrompt
              ? "bg-yellow-100 border border-yellow-400 text-yellow-800"
              : "bg-red-100 border border-red-400 text-red-700"
          }`}
        >
          {showPermissionPrompt ? (
            <ExclamationTriangleIcon className="w-6 h-6 flex-shrink-0 mt-0.5" />
          ) : (
            <XCircleIcon className="w-6 h-6 flex-shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <p className="font-semibold">{error}</p>
            {showPermissionPrompt && !capturedImage && isFirstAttempt && (
              <button
                onClick={handleRequestPermission}
                className="mt-2 text-sm px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition"
              >
                Reintentar acceso
              </button>
            )}
          </div>
        </div>
      )}

      {!capturedImage ? (
        <section className="w-full items-center justify-center flex flex-col h-[60vh]">
          <div className="relative w-full h-full rounded-sm overflow-hidden sm:rounded-lg">
            {(isLoading || isCameraLoading) && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              </div>
            )}

            <div className="w-full h-full">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover bg-black"
              ></video>
            </div>

            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
              <div className="corner top-left"></div>
              <div className="corner top-right"></div>
              <div className="corner bottom-left"></div>
              <div className="corner bottom-right"></div>
            </div>

            <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-2 rounded-lg text-sm font-semibold">
              Zoom: {scale.toFixed(1)}x
            </div>
          </div>

          <div className="bottom-0 w-full flex flex-col justify-center items-center gap-4 p-4 md:p-6 bg-gradient-to-t from-black/40 to-transparent">
            <div className="w-full flex items-center gap-3">
              <span className="text-white text-xs sm:text-sm font-semibold">
                −
              </span>
              <input
                type="range"
                min="1"
                max="4"
                step="0.01"
                value={scale}
                onChange={handleSliderChange}
                disabled={isLoading || isCameraLoading || !isSupported}
                className="w-full sm:w-2/3 md:w-1/2 cursor-pointer accent-orange-500 disabled:opacity-50"
                aria-label="Zoom slider"
              />
              <span className="text-white text-xs sm:text-sm font-semibold">
                +
              </span>
            </div>

            <button
              onClick={capturePhoto}
              disabled={
                isLoading ||
                isCameraLoading ||
                !videoRef.current?.srcObject ||
                !isSupported
              }
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 sm:px-14 md:px-16 h-12 md:h-14
                rounded-lg shadow-lg hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed
                focus:outline-none focus:ring-2 focus:ring-orange-300 transform transition duration-300 
                font-semibold text-sm sm:text-base flex items-center justify-center gap-2"
            >
              <CameraIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              {isLoading || isCameraLoading ? "Inicializando..." : "Tomar Foto"}
            </button>

            <p className="text-white text-xs sm:text-sm text-center opacity-80">
              Usa el deslizador para ajustar el zoom • Toca dos dedos para zoom
              táctil
            </p>
          </div>
        </section>
      ) : (
        <div className="w-full flex flex-col items-center justify-center gap-6 mt-6 p-4">
          <div className="rounded-lg overflow-hidden shadow-lg border-4 border-green-500 max-w-full">
            <img
              src={capturedImage}
              alt="Foto capturada"
              className="w-full h-auto max-h-96 object-cover"
            />
          </div>

          <div className="w-full p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg text-center">
            <p className="font-semibold">Foto capturada exitosamente</p>
          </div>

          <button
            onClick={retakeImage}
            className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 sm:px-12 py-3 md:py-4
              rounded-lg shadow-lg hover:from-red-700 hover:to-red-800 focus:outline-none
              focus:ring-2 focus:ring-red-300 transition duration-300 font-semibold text-sm sm:text-base
              flex items-center justify-center gap-2"
          >
            <ArrowPathIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            Tomar Otra Foto
          </button>
        </div>
      )}
    </div>
  );
}
