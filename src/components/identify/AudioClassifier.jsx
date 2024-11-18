import { useState } from "react";

export default function AudioClassifier() {
  const [audioUrl, setAudioUrl] = useState("");
  const [audiofile, setAudioFile] = useState(null);
  const [responseMessage, setResponseMessage] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
      setAudioFile(file);

      return () => URL.revokeObjectURL(url);
    }
  };

  const handleUpload = async () => {
    if (!audiofile) {
      alert("Seleciona un archivo primero.");
      return;
    } else {
      const formData = new FormData();
      formData.append("file", audiofile);

      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/py/predict_sound",
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
      } catch (error) {
        console.error("Error al enviar el archivo:", error);
        setResponseMessage("Hubo un error al procesar el archivo");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-gray-50 m-3">
      <div className="w-full max-w-3xl bg-white p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-semibold text-center mb-6 text-blue-600">
          Clasificador de Sonido
        </h1>

        {/* Carga de archivo de audio */}
        <div className="mb-10">
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg p-2 mb-4 focus:ring-2 focus:ring-blue-500"
          />
          {audioUrl && (
            <audio
              controls
              src={audioUrl}
              className="w-full rounded-lg mb-4"
            ></audio>
          )}
        </div>

        {/* Botón para enviar el archivo */}
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
    </div>
  );
}
