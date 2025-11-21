export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

import { predictionQueue } from "@/lib/Mongodb/predictionQueue";
import { adminAuth, isFirebaseAdminConfigured } from "@/lib/firebase/serverApp";

async function verifyToken(token: string) {
  // Si Firebase Admin no está configurado, retornar null
  if (!isFirebaseAdminConfigured || !adminAuth) {
    console.warn("Firebase Admin no está disponible");
    return null;
  }

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

    const audioBuffer = Buffer.from(audioBase64, "base64");

    const userId = token ? await verifyToken(token) : null;

    // Encolamos la predicción sin esperar
    if (userId) {
      const taskId = await predictionQueue.enqueue({
        userId,
        fileBuffer: audioBuffer,
        predictedLabel,
        type: "audio",
      });

      return NextResponse.json({
        message: "Predicción encolada para guardado",
        taskId,
        status: "queued",
      });
    }

    // Si no hay usuario, retornar éxito igual (sin guardar)
    return NextResponse.json({
      message: "Predicción procesada",
      status: "success",
    });
  } catch (error) {
    console.error("Error en la predicción de audio:", error);
    return NextResponse.json(
      { error: "Error procesando la predicción" },
      { status: 500 }
    );
  }
}
