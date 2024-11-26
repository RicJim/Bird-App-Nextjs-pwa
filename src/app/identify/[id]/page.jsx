"use client";

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowUturnLeftIcon } from "@heroicons/react/24/outline";

import AudioProcessor from "@/components/identify/audio/AudioProcessor";
import ImageProcessor from "@/components/identify/images/ImageProcessor";

export default function IdentifyPage() {
    const { id } = useParams();
    const router = useRouter();
    const [selectedInput, setSelectedInput] = useState(id);

    let Component;

    switch (selectedInput) {
        case 'image-processor':
            Component = ImageProcessor;
            break;
        case 'audio-processor':
            Component = AudioProcessor;
            break;
        default:
            return <div>Componente no encontrado</div>;
    }

    const handleGoBack = () => {
        router.back();
    }

    return (
        <div className="min-h-screen flex flex-col items-center text-center sm:p-10 shadow-lg
            bg-gray-50 bg-gradient-to-b from-white to-green-300">
            <div className="flex flex-col text-center items-center w-full mt-12">
                <div className="flex items-center justify-start space-x-4 mb-2">
                    <div
                        onClick={handleGoBack}
                        className="cursor-pointer text-green-700 hover:text-green-900 
                            transition-all duration-300">
                        <ArrowUturnLeftIcon className="h-8 w-8 sm:h-10 sm:w-10" />
                    </div>
                    <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-green-700">
                        {selectedInput === 'image-processor' ? 'Clasificación por Imágenes' : 'Clasificación por Sonido'}
                    </h1>
                </div>

                <div className="w-full mt-2">
                    <Component  />
                </div>
            </div>
        </div>
    );
}