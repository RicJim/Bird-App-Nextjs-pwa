export async function encodeWAV(blob) {
  // Crear un contexto de audio
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();

  // Convertir el blob a ArrayBuffer
  const arrayBuffer = await blob.arrayBuffer();

  // Decodificar los datos de audio
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  // Convertir el AudioBuffer a WAV
  return audioBufferToWav(audioBuffer);
}

function audioBufferToWav(audioBuffer) {
  const numberOfChannels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const format = 1; // Formato PCM lineal
  const bitDepth = 16;

  // Crear un buffer para almacenar los datos WAV
  const wavData = new Uint8Array(
    44 + audioBuffer.length * numberOfChannels * 2
  );
  const view = new DataView(wavData.buffer);

  // Escribir encabezado RIFF
  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + audioBuffer.length * numberOfChannels * 2, true); // Tamaño total
  writeString(view, 8, "WAVE");

  // Escribir subchunk "fmt "
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true); // Tamaño del subchunk
  view.setUint16(20, format, true); // Formato de audio (PCM)
  view.setUint16(22, numberOfChannels, true); // Número de canales
  view.setUint32(24, sampleRate, true); // Frecuencia de muestreo
  view.setUint32(28, sampleRate * numberOfChannels * (bitDepth / 8), true); // Byte rate
  view.setUint16(32, numberOfChannels * (bitDepth / 8), true); // Block align
  view.setUint16(34, bitDepth, true); // Bits por muestra

  // Escribir subchunk "data"
  writeString(view, 36, "data");
  view.setUint32(40, audioBuffer.length * numberOfChannels * 2, true); // Tamaño del subchunk de datos

  // Escribir datos PCM
  const offset = 44;
  const channelData = [];
  for (let i = 0; i < numberOfChannels; i++) {
    channelData.push(audioBuffer.getChannelData(i));
  }

  let index = offset;
  for (let i = 0; i < audioBuffer.length; i++) {
    for (let channel = 0; channel < numberOfChannels; channel++) {
      const sample = Math.max(-1, Math.min(1, channelData[channel][i]));
      const int16Sample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
      view.setInt16(index, int16Sample, true);
      index += 2;
    }
  }

  return new Blob([wavData], { type: "audio/wav" });
}

function writeString(view, offset, string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}
