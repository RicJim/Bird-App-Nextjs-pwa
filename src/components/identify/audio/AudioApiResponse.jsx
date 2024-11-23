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
    <div className="w-full max-w-xl mx-auto p-1 sm:p-5">
        <button
          onClick={handleUpload}
          className="w-full bg-gradient-to-r from-teal-500 to-teal-600 
          text-white text-sm sm:text-base p-2 sm:p-3 rounded-lg shadow-md
            hover:scale-105 transform transition-all duration-300"
        >
          Procesar y Clasificar...
        </button>

        {/* Mensaje de respuesta 
            {responseMessage && (
                <p className="text-center font-semibold mt-4 text-green-700">{responseMessage}</p>
            )}*/}
    </div>
  );
}
