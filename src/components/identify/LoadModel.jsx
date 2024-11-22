import * as tf from '@tensorflow/tfjs';

export async function LoadModel(modelPath) {
    try {
        const model = await tf.loadGraphModel(modelPath);
        model.inputs.forEach(input => {
            console.log('Shape de la entrada:', input.shape);
          });
        return model;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function LoadLayerModel(modelPath) {
    try {
        const model = await tf.loadLayersModel(modelPath);
        model.inputs.forEach(input => {
            console.log('Shape de la entrada:', input.shape);
          });
        return model;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function LoadTFHubModel(modelPath) {
    try {
        const model = await tf.loadGraphModel(modelPath, { fromTFHub: true });
        model.inputs.forEach(input => {
            console.log('Shape de la entrada:', input.shape);
          });
        return model;
    } catch (error) {
        console.error(error);
        return null;
    }
}