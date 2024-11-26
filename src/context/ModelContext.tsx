"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { LoadGraphModel } from "@/lib/loadModel";
import * as tf from '@tensorflow/tfjs';

interface ModelContextType {
    tf: typeof tf;
    imageModel: tf.GraphModel | null;
    audioModel: tf.GraphModel | null;
}

const ModelContext = createContext<ModelContextType | undefined>(undefined);
interface ModelProviderProps {
    children: ReactNode;
  }

  export const ModelProvider: React.FC<ModelProviderProps> = ({ children }) => {
    //image
    const [imageModel, setImageModel] = useState<tf.GraphModel | null>(null);
    const imageModelPath = "/models/image/model.json";

    //audio
    const [audioModel, setAudioModel] = useState<tf.GraphModel | null>(null);
    const audioModelPath = "/models/sound/model.json";

    useEffect(() => {
        const loadModels = async () => {
            try {
                const loadedImageModel = await LoadGraphModel(imageModelPath);
                const loadedAudioModel = await LoadGraphModel(audioModelPath);

                setImageModel(loadedImageModel);
                setAudioModel(loadedAudioModel);
            } catch (error) {
                console.error(error);
            }
        };

        loadModels();
    }, []);

    return (
        <ModelContext.Provider value={{ tf, imageModel, audioModel }}>
            {children}
        </ModelContext.Provider>
    );
};

export const useModelContext = (): ModelContextType => {
    const context = useContext(ModelContext);
  
    if (!context) {
      throw new Error("useModelContext debe usarse dentro de un ModelProvider");
    }
  
    return context;
  };