import * as tf from '@tensorflow/tfjs';

export async function LoadModel(modelPath) {
    try {
        const model = await tf.loadGraphModel(modelPath);
        return model;
    } catch (error) {
        console.error(error);
        return null;
    }
}