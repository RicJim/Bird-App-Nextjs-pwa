import { useState, useRef, useEffect } from "react";

export default function CameraImage({ onFileSelect }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);

  const startCamera = async () => {
    if (videoRef.current?.srcObject) { return; }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: {facingMode: "environment"}, audio: false });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error al acceder a la cámara: ", error);
    }
  };

  const stopCamera = () => {
    const tracks = videoRef.current.srcObject.getTracks();
    tracks.forEach((track) => track.stop());
    videoRef.current.srcObject = null;
  };

  useEffect(() => {
    startCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        stopCamera();
      }
    };
  }, []);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      const imgData = canvas.toDataURL("image/jpeg");

      setCapturedImage(imgData);
      onFileSelect(imgData);

      stopCamera();
    }
  };

  const retakeImage = () => {
    setCapturedImage(null);
    startCamera();
    onFileSelect(null);
  };

  return (
    <div className="flex flex-col items-center justify-center m-4 p-6 
      sm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%]">

      {/* Hidden Canvas */}
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>

      {capturedImage === null && (
        <section className="w-full flex flex-col items-center justify-center">
          <div className="w-72 h-56 sm:w-96 sm:h-72 overflow-hidden 
            rounded-xl shadow-2xl bg-black mb-3">
            <video
              ref={videoRef}
              autoPlay
              muted
              className="w-full h-full object-cover"
            ></video>
          </div>

          {/* Capture Button */}
          <button
            onClick={capturePhoto}
            className="mt-6 bg-orange-500 text-white px-16 py-3 
            rounded-xl shadow-lg hover:bg-orange-600 focus:outline-none 
            focus:ring focus:ring-orange-300 transform transition duration-300"
          >
            Tomar Foto
          </button>
        </section>
      )}

        {capturedImage && (
          <div className="flex justify-center">
            <button
              onClick={retakeImage}
              className="bg-red-600 text-white px-10 py-3
              rounded-xl shadow-lg hover:bg-red-700 focus:outline-none
              transition duration-300"
            >
              Tomar Otra Vez
            </button>
          </div>
        )}
    </div>
  );
}
