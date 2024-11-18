import * as tf from "@tensorflow/tfjs";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";

export default function ImageClassifier({ imageModel }) {
  const [image, setImage] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [isCamera, setIsCamera] = useState(false);
  const videoRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result);
      setCapturedImage(null);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const predictImage = async () => {
    if (!imageModel || !image) return;

    const imgElement = document.createElement("img");
    imgElement.src = image;

    imgElement.onload = async () => {
      const tensorImg = tf.browser
        .fromPixels(imgElement)
        .resizeNearestNeighbor([224, 224])
        .toFloat()
        .expandDims(0);

      const predictionResult = await imageModel.predict(tensorImg).data();
      setPrediction(predictionResult);
    };
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error al acceder a la cámara: ", error);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
    }
  };

  const captureImage = () => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imgData = canvas.toDataURL("image/jpeg");
    setCapturedImage(imgData);
    setImage(imgData);
    stopCamera();
  };

  const retakeImage = () => {
    setCapturedImage(null);
    setImage(null);
    setIsCamera(true);
    startCamera();
  };

  const handleInputType = (type) => {
    setImage(null);
    setPrediction(null);
    setCapturedImage(null);

    if (type === "camera") {
      setIsCamera(true);
      startCamera();
    } else {
      setIsCamera(false);
      stopCamera();
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
        Clasificador de Imágenes
      </h1>
      <div className="flex justify-center space-x-6 mb-8">
        <button
          onClick={() => handleInputType("file")}
          className="py-2 px-8 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Subir Imagen
        </button>
        <button
          onClick={() => handleInputType("camera")}
          className="py-2 px-8 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
        >
          Usar Cámara
        </button>
      </div>

      {isCamera && !capturedImage && (
        <div className="mb-8">
          <div className="flex justify-center mb-6">
            <video
              ref={videoRef}
              autoPlay
              className="w-full max-w-lg border-2 border-gray-300 rounded-lg"
            ></video>
          </div>
          <div className="flex justify-center mb-6">
            <button
              onClick={captureImage}
              className="py-2 px-8 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition"
            >
              Capturar Imagen
            </button>
          </div>
        </div>
      )}

      {(capturedImage || image) && (
        <div className="flex justify-center mb-6">
          <div className="relative w-96 h-96 overflow-hidden border-2 border-gray-300 rounded-lg">
            <Image
              src={capturedImage || image}
              alt="Imagen"
              fill
              className="object-cover"
            />
          </div>
        </div>
      )}

      {!isCamera && !capturedImage && (
        <div className="flex justify-center mb-6">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      <div className="flex justify-center mb-6 space-x-6">
        {capturedImage && (
          <>
            <button
              onClick={retakeImage}
              className="py-2 px-8 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            >
              Tomar Otra Vez
            </button>
            <button
              onClick={predictImage}
              className="py-2 px-8 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300"
              disabled={!imageModel || !image}
            >
              Predecir
            </button>
          </>
        )}
        {!capturedImage && (
          <button
            onClick={predictImage}
            className="py-2 px-8 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300"
            disabled={!imageModel || !image}
          >
            Predecir
          </button>
        )}
      </div>

      {prediction && (
        <div className="text-center mt-4">
          <h2 className="text-xl font-semibold">Predicción:</h2>
          <p className="text-lg">{prediction.join(", ")}</p>
        </div>
      )}
    </div>
  );
}
