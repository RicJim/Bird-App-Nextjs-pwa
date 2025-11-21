export default function FileUploader({ onFileSelect }) {
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div className="w-full max-w-xl py-3 sm:py-6">
      <input
        type="file"
        accept="audio/*"
        onChange={handleFileChange}
        className="block w-full text-xs text-green-800
            border-2 border-green-300 bg-green-50 rounded-lg p-2 sm:p-3 mb-4 
            focus:ring-2 focus:ring-green-500 focus:outline-none transition-all cursor-pointer hover:bg-green-100"
      />
    </div>
  );
}
