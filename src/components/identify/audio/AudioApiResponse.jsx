export default function ApiResponse({ audiofile, setSegments }) {
  const handleUpload = async () => {
    if (!audiofile) {
      alert("Selecciona un archivo primero.");
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
      setSegments(data.segments || null);
    } catch (error) {
      console.error("Error al enviar el archivo:", error);
      alert("Hubo un error al procesar el archivo");
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto p-2 sm:p-4">
      <button
        onClick={handleUpload}
        className="w-full bg-gradient-to-r from-teal-500 to-teal-600 
          text-white text-xs sm:text-sm md:text-base p-2 sm:p-3 rounded-lg shadow-md
          hover:bg-teal-700 active:scale-95 transform transition-all duration-300"
      >
        Procesar y Clasificar...
      </button>
    </div>
  );
}
