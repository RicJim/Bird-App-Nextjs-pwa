import os
# import librosa
from io import BytesIO
# import numpy as np

def mel_spectrogram(file):
    try:
        # Leer el archivo en memoria
        audio_data = file.file.read()
        audio_file = BytesIO(audio_data)

        # Cargar el archivo usando librosa
        # y, sr = librosa.load(audio_file, sr=None)
        # mel_spectrogram = librosa.feature.melspectrogram(y=y, sr=sr)

        print("Entró en mel_spectrogram y procesó el archivo")  # Mensaje de verificación
        return "Tarea mel_spectrogram completada"
    except Exception as e:
        print(f"Error en mel_spectrogram: {str(e)}")
        raise
    
def process_audio(audio_data):
    try:
        # Calcular alguna métrica, por ejemplo, promedio de valores
        print("Entró en process_audio y procesó el espectrograma")  # Mensaje de verificación
        return "Tarea process_audio completada"
    except Exception as e:
        print(f"Error en process_audio: {str(e)}")
        raise