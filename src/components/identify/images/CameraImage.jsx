import React, { useState, useRef, useEffect } from "react";
import "@/styles/camera.css";

export default function CameraImage({ onFileSelect }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [scale, setScale] = useState(1);
  const [initialDistance, setInitialDistance] = useState(null);

  const startCamera = async () => {
    if (videoRef.current?.srcObject) {
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
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
    if (videoRef.current?.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    startCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        stopCamera();
      }
    };
  }, []);

  const calculateDistance = (touch1, touch2) => {
    return Math.sqrt(
      Math.pow(touch2.pageX - touch1.pageX, 2) +
      Math.pow(touch2.pageY - touch1.pageY, 2)
    );
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const dist = calculateDistance(e.touches[0], e.touches[1]);
      setInitialDistance(dist);
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && initialDistance) {
      e.preventDefault(); 
      const dist = calculateDistance(e.touches[0], e.touches[1]);
      const newScale = Math.min(Math.max((dist / initialDistance) * scale, 1), 4);
      setScale(newScale);
    }
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const zoomFactor = 0.01;

    const newScale = Math.min(Math.max(scale + e.deltaY * -zoomFactor, 1), 4);
    setScale(newScale);
  };

  const handleSliderChange = (e) => {
    const newScale = Math.min(Math.max(e.target.value, 1), 4); // Limitar entre 1 y 4
    setScale(newScale);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      const videoWidth = videoRef.current.videoWidth;
      const videoHeight = videoRef.current.videoHeight;

      canvas.width = videoWidth;
      canvas.height = videoHeight;

      context.save();
      context.translate(videoWidth / 2, videoHeight / 2);
      context.scale(scale, scale);
      context.translate(-videoWidth / 2, -videoHeight / 2);
      context.drawImage(videoRef.current, 0, 0, videoWidth, videoHeight);

      context.restore();

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
    stopCamera();
    setCapturedImage(null);
    startCamera();
    onFileSelect(null);
  };

  return (
    <div 
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onWheel={handleWheel}
      className="relative flex flex-col items-center w-full sm::w-lvw">
      {/* Hidden Canvas */}
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>

      {!capturedImage ? (
        <section className="w-full items-center justify-center flex flex-col h-[60vh] sm:w-[70vh] sm:h-[80vh] lg:w-10/12 lg:h-5/6 xl:w-6/12">
          <div className="relative w-full rounded-sm overflow-hidden sm:rounded-lg">
            <div
              style={{
                transform: `scale(${scale})`,
                transformOrigin: "center",
              }}
              className="w-full h-full"
            >
              <video
                ref={videoRef}
                autoPlay
                muted
                className="w-full h-full object-cover"
              ></video>
            </div>

            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
              <div className="corner top-left"></div>
              <div className="corner top-right"></div>
              <div className="corner bottom-left"></div>
              <div className="corner bottom-right"></div>
            </div>
          </div>

          <div className="bottom-0 w-full flex flex-col justify-center items-center gap-[10px] p-1 m-1">
            <input
              type="range"
              min="1"
              max="4"
              step="0.01"
              value={scale}
              onChange={handleSliderChange}
              className="w-3/4 sm:w-1/2"
            />
            <button
              onClick={capturePhoto}
              className="bg-orange-500 text-white px-14 sm:px-16 h-12
                rounded-lg shadow-lg hover:bg-orange-600 focus:outline-none 
                focus:ring focus:ring-orange-300 transform transition duration-300"
            >
              Tomar Foto
            </button>
          </div>
        </section>
      ) : (
        <div className="flex flex-col justify-center gap-4 mt-4">
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
