import * as tf from "@tensorflow/tfjs";

const modelCache = new Map();

export async function LoadModels(key, url, ver, removedOld = false) {
  const fullKey = `${key}-${ver}`;
  const indexedDbUrl = `indexeddb://${fullKey}`;
  let model;

  if (modelCache.has(fullKey)) {
    return modelCache.get(fullKey);
  }

  try {
    switch (key) {
      case "audio-model":
        model = await tf.loadGraphModel(indexedDbUrl);
        break;
      default:
        model = await tf.loadLayersModel(indexedDbUrl);
    }
  } catch (e) {
    console.error(e.message);
    switch (key) {
      case "audio-model":
        model = await tf.loadGraphModel(url);
        break;
      default:
        model = await tf.loadLayersModel(url);
    }
    await model.save(indexedDbUrl);
  }

  modelCache.set(fullKey, model);
  if (removedOld) {
    await cleanOldVer(key, fullKey);
  }
  return model;
}

async function cleanOldVer(key, currentKey) {
  const models = await tf.io.listModels();
  for (const modelUrl in models) {
    if (
      modelUrl.startsWith("indexeddb://") &&
      modelUrl.includes(key) &&
      !modelUrl.includes(currentKey)
    ) {
      await tf.io.removeModel(modelUrl);
    }
  }
}
