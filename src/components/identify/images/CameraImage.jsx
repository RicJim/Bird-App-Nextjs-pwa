import { useState, useRef, useEffect } from "react";
import "@/styles/camera.css";

export default function CameraImage({ onFileSelect }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);

  const startCamera = async () => {
    if (videoRef.current?.srcObject) {
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", zoom: true },
        audio: false,
      });

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

      const cropX = canvas.width * 0.1;
      const cropY = canvas.height * 0.1;
      const cropWidth = canvas.width * 0.8;
      const cropHeight = canvas.height * 0.8;

      const croppedCanvas = document.createElement("canvas");
      const croppedContext = croppedCanvas.getContext("2d");
      croppedCanvas.width = cropWidth;
      croppedCanvas.height = cropHeight;
      croppedContext.drawImage(
        canvas,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        cropWidth,
        cropHeight
      );

      const imgData = croppedCanvas.toDataURL("image/jpeg");

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
    <div className="relative flex flex-col items-center w-lvw">
      {/* Hidden Canvas */}
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>

      {!capturedImage ? (
        <div className="relative w-[45vh] h-[60vh] sm:w-[60vh] sm:h-[80vh] lg:w-5/12 lg:h-5/6 overflow-hidden sm:rounded-lg">
          <video
            ref={videoRef}
            autoPlay
            muted
            className="w-full h-full object-cover"
          ></video>

          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <div className="corner top-left"></div>
            <div className="corner top-right"></div>
            <div className="corner bottom-left"></div>
            <div className="corner bottom-right"></div>
          </div>

          <div className="absolute bottom-5 w-full flex justify-center items-center gap-[10px]">
            <button
              onClick={capturePhoto}
              className="bg-orange-500 text-white px-14 sm:px-16 h-12
                rounded-lg shadow-lg hover:bg-orange-600 focus:outline-none 
                focus:ring focus:ring-orange-300 transform transition duration-300"
            >
              Tomar Foto
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center">
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
