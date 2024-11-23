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
    <div className="flex flex-col items-center justify-center bg-gray-200 rounded-3x1 m-2 px-10 py-5">

      {/* Hidden Canvas */}
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>

      {capturedImage === null && (
        <section>
          <div className="relative w-full aspect-video overflow-hidden rounded-lg shadow-lg bg-black">
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
            className="mt-6 bg-orange-500 text-white px-20 py-3 rounded-lg shadow-lg hover:bg-orange-600 focus:outline-none focus:ring focus:ring-orange-300"
          >
            Tomar Foto
          </button>
        </section>
      )}

      <div className="flex justify-center space-x-6">
        {capturedImage && (
          <section>
            <button
              onClick={retakeImage}
              className="py-2 px-10 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            >
              Tomar Otra Vez
            </button>
          </section>
        )}
      </div>
    </div>
  );
}
