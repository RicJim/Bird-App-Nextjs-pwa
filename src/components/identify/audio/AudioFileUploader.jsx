import { useState } from "react";

export default function FileUploader({ onFileSelect }) {
  const [audioUrl, setAudioUrl] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
      onFileSelect(file);

      return () => URL.revokeObjectURL(url);
    }
  };

  return (
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
  );
}