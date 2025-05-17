export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

import { savePrediction } from "@/lib/Mongodb/savePrediction";
import { adminAuth } from "@/lib/firebase/serverApp";

async function verifyToken(token: string) {
  try {
    const decodeToken = await adminAuth.verifyIdToken(token);
    return decodeToken.uid;
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error(e.message);
    }
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const { audioBase64, predictedLabel } = await req.json();
    const token = req.headers.get("authorization")?.split("Bearer ")[1];

    if (!audioBase64) {
      return NextResponse.json(
        { error: "No se proporcionó el audio" },
        { status: 400 }
      );
    }

    const userId = token ? await verifyToken(token) : null;

    if (userId) {
      const audioBuffer = Buffer.from(audioBase64, "base64");

      savePrediction({
        userId,
        fileBuffer: audioBuffer,
        predictedLabel,
        type: "audio",
      });
    }

    return NextResponse.json({ message: "Operancion Completada..." });
  } catch (error) {
    console.error("Error en la predicción de audio:", error);
    return NextResponse.json(
      { error: "Error interno en la predicción" },
      { status: 500 }
    );
  }
}
