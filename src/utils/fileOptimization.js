export async function compressImage(base64String, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const maxWidth = 1024;
      const maxHeight = 1024;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      const compressed = canvas.toDataURL("image/jpeg", quality);
      resolve(compressed);
    };

    img.onerror = () => {
      reject(new Error("Error al cargar la imagen"));
    };

    img.src = base64String;
  });
}

export function getBase64Size(base64String) {
  const bytes = Buffer.byteLength(base64String, "utf8");
  return (bytes / 1024).toFixed(2);
}

export function compressAudio(audioBuffer, targetSampleRate = 16000) {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const originalSampleRate = audioContext.sampleRate;

  if (targetSampleRate >= originalSampleRate) {
    return audioBuffer;
  }

  const offlineContext = new OfflineAudioContext(
    1,
    (audioBuffer.length * targetSampleRate) / originalSampleRate,
    targetSampleRate
  );

  const source = offlineContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(offlineContext.destination);
  source.start(0);

  return offlineContext.startRendering();
}

export async function fileToOptimizedBase64(file, options = {}) {
  const { maxSize = 5 * 1024 * 1024, quality = 0.8 } = options;

  return new Promise((resolve, reject) => {
    if (file.size > maxSize) {
      reject(
        new Error(
          `Archivo muy grande: ${(file.size / 1024 / 1024).toFixed(
            2
          )}MB (máximo: ${(maxSize / 1024 / 1024).toFixed(2)}MB)`
        )
      );
      return;
    }

    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        let base64 = e.target.result;

        if (file.type.startsWith("image/")) {
          base64 = await compressImage(base64, quality);
        }

        resolve(base64);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error("Error al leer el archivo"));
    };

    reader.readAsDataURL(file);
  });
}

export function getFileInfo(base64String) {
  const sizeKB = getBase64Size(base64String);
  const match = base64String.match(/^data:([^;]+);/);
  const mimeType = match ? match[1] : "unknown";

  return {
    sizeKB: parseFloat(sizeKB),
    sizeMB: (parseFloat(sizeKB) / 1024).toFixed(2),
    mimeType,
  };
}

export function validateFile(file, type = "image") {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const validImageTypes = ["image/jpeg", "image/png", "image/jpg"];
  const validAudioTypes = ["audio/wav", "audio/mpeg", "audio/mp3"];

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `Archivo muy grande: ${(file.size / 1024 / 1024).toFixed(2)}MB`,
    };
  }

  const validTypes = type === "audio" ? validAudioTypes : validImageTypes;

  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Tipo de archivo no válido: ${
        file.type
      }. Tipos válidos: ${validTypes.join(", ")}`,
    };
  }

  return { valid: true };
}
