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
      <div className="flex justify-center mb-6">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    );
  }
  