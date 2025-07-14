import { LoadModels } from "../loadModels";

export function LoadAudioModel() {
  return LoadModels("audio-model", "/models/sound/model.json", "v2.1", true);
}
