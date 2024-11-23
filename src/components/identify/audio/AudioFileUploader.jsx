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
    <div className="w-full max-w-xl py-2">
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          className="block w-full text-xs text-green-800
            border border-green-300 bg-green-50 rounded-lg p-2 sm:p-3 mb-4 
            focus:ring-2 focus:ring-green-500 focus:outline-none transition-all"
        />
        {audioUrl && (
          <div className="w-full bg-green-50">
            <audio
              controls
              src={audioUrl}
              className="w-full rounded-lg border border-gray-300 shadow-sm"
            ></audio>
          </div>
        )}
      </div>
  );
}
