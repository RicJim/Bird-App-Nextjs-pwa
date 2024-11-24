"use client";

import { useState } from "react";
import AudioProcessor from "@/components/identify/audio/AudioProcessor";
import ImageProcessor from "@/components/identify/images/ImageProcessor";

import { useModelContext } from "@/context/ModelContext";
import { CameraIcon, MusicNoteIcon, ChevronLeftIcon } from "@heroicons/react/outline";

export default function IdentifyPage() {
    const { imageModel, audioModel } = useModelContext();
    // image
    const [imageClass, setImageClass] = useState(null);

    // audio    
    const [audioClass, setAudioClass] = useState(null);

    const [selectedInput, setSelectedInput] = useState(null);

    const handleInputType = (type) => {
        setSelectedInput(type);
        if (type === "image") {
            setImageClass(true);
            setAudioClass(false);
        } else {
            setImageClass(false);
            setAudioClass(true);
        }
    };

    const handleGoBack = () => {
        setSelectedInput(null);
    };

    return (
        <div className="min-h-screen flex flex-col items-center text-center sm:p-10 shadow-lg
            bg-gray-50 bg-gradient-to-b from-white to-green-300">
            {selectedInput === null && (
                <section>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-green-800 mb-8">
                        Página de Identificación de Aves
                    </h1>
                    <div className="flex flex-wrap justify-center items-center mb-8 gap-6">
                        <button
                            onClick={() => handleInputType("image")}
                            className="flex items-center py-3 px-10 text-white rounded-lg shadow-md 
                            bg-gradient-to-r from-green-500 to-green-600                             
                            hover:scale-105 transform transition-all duration-300 focus:outline-none"
                        >
                            <CameraIcon className="h-6 w-6 mr-3" />
                            Clasificación por Imágenes
                        </button>
                        <button
                            onClick={() => handleInputType("sound")}
                            className="flex items-center py-3 px-10 
                            bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-md                            
                            hover:scale-105 transform transition-all duration-300 focus:outline-none"
                        >
                            <MusicNoteIcon className="h-6 w-6 mr-3" />
                            Clasificación por Sonido
                        </button>
                    </div>
                </section>
            )}

            {selectedInput && (
                <section className="w-full mt-2">
                    <div
                        onClick={handleGoBack}
                        className="flex justify-start cursor-pointer
                        text-green-700 hover:text-green-900 transition-all duration-300"
                    >
                        <ChevronLeftIcon className="h-8 w-8" />
                    </div>

                    {imageModel && imageClass && (
                        <div className="w-full mt-2">
                            <ImageProcessor imageModel={imageModel} />
                        </div>
                    )}
                    {audioModel && audioClass && (
                        <div className="w-full mt-2">
                            <AudioProcessor audioModel={audioModel} />
                        </div>
                    )}
                </section>
            )}
        </div>
    );
}
