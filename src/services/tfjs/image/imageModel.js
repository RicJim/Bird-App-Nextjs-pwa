import { LoadModels } from "../loadModels";

export function LoadImageModel() {
  return LoadModels("image-model", "/models/image/model.json", "v2.0", true);
}
