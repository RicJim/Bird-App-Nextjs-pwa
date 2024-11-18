from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os

from .audio_predict import mel_spectrogram, process_audio

### Create FastAPI instance with custom docs and openapi url
app = FastAPI(docs_url="/api/py/docs", openapi_url="/api/py/openapi.json")

origins = [
    "https://bird-app-nextjs-fastapi.vercel.app",
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/py/helloFastApi")
def hello_fast_api():
    return {"message": "Hello from FastAPI"}

@app.post("/api/py/predict_sound")
async def predict_sound(file: UploadFile = File(...)):
    try:
        audio_data = mel_spectrogram(file)

        result = process_audio(audio_data)
        
        return JSONResponse(
            content={
                "message": f"Archivo procesado con éxito.", 
                "details": [audio_data, result],
            },
            status_code=200,
        )
    except Exception as e:
        return JSONResponse(
            content={"error": f"Error al procesar el archivo: {str(e)}"}, 
            status_code=500,)