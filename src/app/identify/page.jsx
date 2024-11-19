"use client";

import { useState, useEffect } from "react";
import { LoadModel } from "@/components/identify/LoadModel";
import { LoadTFHubModel } from "@/components/identify/LoadTFHubModel";
import ImageClassifier from "@/components/identify/ImageClassifier";
import AudioClassifier from "@/components/identify/audio/AudioClassifier";
import { CameraIcon, MusicNoteIcon } from "@heroicons/react/outline";

export default function IdentifyPage() {
    // image
    const [imageClass, setImageClass] = useState(null);
    const [imageModel, setImageModel] = useState(null);
    const imageModelPath = "/models/image/model.json";

    // audio
    const [audioClass, setAudioClass] = useState(null);
    const [yamnetModel, setYAMnetModel] = useState(null);
    const yamnetModelUrl =
        "https://www.kaggle.com/models/google/yamnet/TfJs/tfjs/1";

    useEffect(() => {
        const loadModels = async () => {
            try {
                const loadedImageModel = await LoadModel(imageModelPath);
                setImageModel(loadedImageModel);

                const loadedYamnetModel = await LoadTFHubModel(yamnetModelUrl);
                setYAMnetModel(loadedYamnetModel);
            } catch (error) {
                console.error(error);
            }
        };

        loadModels();
    }, []);

    const handleInputType = (type) => {
        if (type === "image") {
            setImageClass(true);
            setAudioClass(false);
        } else {
            setImageClass(false);
            setAudioClass(true);
        }
    };

    return (
        <div className="min-h-screen justify-center text-center bg-gray-50 m-5">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8">
                Página de Identificación de Aves
            </h1>
            <div className="flex justify-center space-x-6 mb-8 my-5 flex-wrap">
                <button
                    onClick={() => handleInputType("image")}
                    className="flex items-center py-2 px-8 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 focus:outline-none"
                >
                    <CameraIcon className="h-5 w-5 mr-2" />
                    Clasificación por Imágenes
                </button>
                <button
                    onClick={() => handleInputType("sound")}
                    className="flex items-center py-2 px-8 bg-green-600 text-white rounded-md hover:bg-green-700 transition-all duration-300 transform hover:scale-105 focus:outline-none"
                >
                    <MusicNoteIcon className="h-5 w-5 mr-2" />
                    Clasificación por Sonido
                </button>
            </div>
            {imageModel && imageClass && <ImageClassifier imageModel={imageModel} />}
            {audioClass && yamnetModel && <AudioClassifier yamnetModel={yamnetModel} />}
        </div>
    );
}
