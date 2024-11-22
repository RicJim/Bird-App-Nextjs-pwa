import { useState } from "react";

export default function ApiResponse({ audiofile, setSegments }) {
    const [responseMessage, setResponseMessage] = useState("");

    const handleUpload = async () => {
        if (!audiofile) {
            alert("Seleciona un archivo primero.");
            return;
        }

        const formData = new FormData();
        formData.append("file", audiofile);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/mel_spectrogram`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const data = await response.json();
            setResponseMessage(data.message || "Archivo procesado con exito");
            setSegments(data.segments || null);
        } catch (error) {
            console.error("Error al enviar el archivo:", error);
            setResponseMessage("Hubo un error al procesar el archivo");
        }
    };

    return (
        <div>
            <button
                onClick={handleUpload}
                className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
            >
                Enviar archivo al API
            </button>

            {/* Mensaje de respuesta */}
            {responseMessage && (
                <p className="text-center mt-4 text-gray-700">{responseMessage}</p>
            )}
        </div>
    );
}
