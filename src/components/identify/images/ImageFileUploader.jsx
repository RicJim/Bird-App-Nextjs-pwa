export default function ImageFileUploader({ onFileSelect }) {
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      onFileSelect(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-11/12 max-w-xl py-6">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="block w-full text-yellow-500 text-xs
          border-2 border-yellow-300 bg-yellow-50 rounded-lg shadow-sm p-2 sm:p-3 mb-4
          focus:ring-2 focus:ring-green-500 focus:outline-none focus:border-green-500 
          transition-all duration-300 ease-in-out"
      />
    </div>
  );
}
