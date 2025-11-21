import { useState, useEffect } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import { sanitizeForLogging } from "@/lib/security";
import { encodeWAV } from "@/utils/audioUtils";
import { MicrophoneIcon, StopIcon } from "@heroicons/react/24/outline";

export default function MicrophoneAudio({ onFileSelect }) {
  const [timer, setTimer] = useState(10);
  const [error, setError] = useState(null);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const { startRecording, stopRecording, status } = useReactMediaRecorder({
    audio: {
      // sampleRate: 16000,
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: false,
    },
    onStop: async (_blobUrl, blob) => {
      try {
        setIsProcessing(true);
        setError(null);

        const sizeInMB = blob.size / (1024 * 1024);
        if (sizeInMB > 10) {
          setError("Archivo de audio muy grande. Máximo 10MB.");
          setIsProcessing(false);
          return;
        }

        if (blob.size === 0) {
          setError("No se capturó audio. Intenta de nuevo.");
          setIsProcessing(false);
          return;
        }

        const wavBlob = await encodeWAV(blob);
        setRecordedAudio(wavBlob);
        onFileSelect(wavBlob);
      } catch (error) {
        setError("Error al procesar el audio");
        console.error("Audio processing error:", sanitizeForLogging(error));
      } finally {
        setIsProcessing(false);
      }
    },
    onStart: () => {
      setError(null);
    },
  });

  useEffect(() => {
    let interval;
    if (status === "recording" && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0 && status === "recording") {
      stopRecording();
    }
    return () => clearInterval(interval);
  }, [status, timer, stopRecording]);

  const handleStart = () => {
    setTimer(10);
    setRecordedAudio(null);
    setError(null);
    startRecording();
  };

  const handleRetake = () => {
    setRecordedAudio(null);
    setError(null);
    setTimer(10);
  };

  const getTimerColor = () => {
    if (timer <= 2) return "text-red-600 animate-pulse";
    if (timer <= 4) return "text-orange-500";
    return "text-green-600";
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      {error && (
        <div className="w-full mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg animate-pulse">
          <p className="font-semibold text-sm sm:text-base">{error}</p>
        </div>
      )}

      {!recordedAudio ? (
        <div className="w-full max-w-md">
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <p className="text-center text-sm sm:text-base font-semibold text-gray-700">
              {status === "recording"
                ? "Grabando..."
                : status === "stopped"
                ? "Grabación completada"
                : "Listo para grabar"}
            </p>
          </div>

          {status === "recording" && (
            <div className="mb-6 text-center">
              <div
                className={`text-5xl sm:text-6xl font-bold ${getTimerColor()} transition-colors`}
              >
                {timer}
              </div>
              <p className="text-gray-600 text-xs sm:text-sm mt-2">
                segundos restantes
              </p>
            </div>
          )}

          {status === "recording" && (
            <div className="mb-6 flex justify-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <div
                className="w-3 h-3 bg-red-500 rounded-full animate-pulse"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-3 h-3 bg-red-500 rounded-full animate-pulse"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
          )}

          <button
            onClick={status === "recording" ? stopRecording : handleStart}
            disabled={isProcessing}
            className={`w-full py-3 sm:py-4 px-6 rounded-lg text-white font-semibold flex items-center justify-center gap-2
              transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
              ${
                status === "recording"
                  ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                  : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              }`}
          >
            {status === "recording" ? (
              <>
                <StopIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="text-sm sm:text-base">Detener Grabación</span>
              </>
            ) : isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span className="text-sm sm:text-base">Procesando...</span>
              </>
            ) : (
              <>
                <MicrophoneIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="text-sm sm:text-base">Iniciar Grabación</span>
              </>
            )}
          </button>

          <p className="text-center text-xs sm:text-sm text-gray-600 mt-4">
            Máximo 10 segundos de grabación
          </p>
        </div>
      ) : (
        <div className="w-full max-w-md">
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg text-center">
            <p className="font-semibold text-sm sm:text-base">
              Audio capturado exitosamente
            </p>
          </div>

          <div className="mb-6 p-4 bg-gray-100 rounded-lg">
            <p className="text-sm font-semibold text-gray-700">
              Tamaño del archivo:
            </p>
            <p className="text-lg font-bold text-gray-900">
              {(recordedAudio.size / 1024).toFixed(2)} KB
            </p>
          </div>

          <button
            onClick={handleRetake}
            className="w-full py-3 sm:py-4 px-6 bg-gradient-to-r from-orange-600 to-orange-700 
              hover:from-orange-700 hover:to-orange-800 text-white font-semibold rounded-lg
              transition-all duration-300 transform hover:scale-105 active:scale-95 
              flex items-center justify-center gap-2"
          >
            <MicrophoneIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-sm sm:text-base">Grabar De Nuevo</span>
          </button>
        </div>
      )}
    </div>
  );
}
