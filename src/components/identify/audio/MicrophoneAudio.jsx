import { useState, useEffect } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import { encodeWAV } from "@/utils/audioUtils";

export default function MicrophoneAudio({ onFileSelect }) {
    const [timer, setTimer] = useState(10);

    const { startRecording, stopRecording, mediaBlobUrl, status } = useReactMediaRecorder({
        audio: true,
        onStop: async (blobUrl, blob) => {
            const wavBlob = await encodeWAV(blob);
            onFileSelect(wavBlob);
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
        startRecording();
    };

    return (
        <div className="flex flex-col items-center justify-center p-4">
            <div className="mb-4">
                <button
                    onClick={status === "recording" ? stopRecording : handleStart}
                    className={`px-6 py-3 rounded-lg text-white font-semibold ${
                        status === "recording" ? "bg-red-600" : "bg-green-500"
                    } hover:${
                        status === "recording" ? "bg-red-700" : "bg-green-600"
                    } transition`}
                >
                    {status === "recording" ? "Detener Grabación" : "Iniciar Grabación"}
                </button>
            </div>
            {status === "recording" && (
                <p className="text-xl font-semibold mb-4">{timer} seconds left</p>
            )}
        </div>
    );
}
