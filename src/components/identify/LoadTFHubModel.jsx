import * as tf from '@tensorflow/tfjs';

export async function LoadTFHubModel(modelUrl) {
    try {
        const model = await tf.loadGraphModel(modelUrl, { fromTFHub: true });
        return model;
    } catch (error) {
        console.error(error);
        return null;
    }
}