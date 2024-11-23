import * as tf from '@tensorflow/tfjs';

export const LoadGraphModel = async(modelPath) => {
    try {
        const model = await tf.loadGraphModel(modelPath);

        return model;
    } catch {
        console.error(error);
        return null
    }
}

/*export async function LoadTFHubModel(modelPath) {
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
}*/