export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

import { predictionQueue } from "@/lib/Mongodb/predictionQueue";
import { adminAuth, isFirebaseAdminConfigured } from "@/lib/firebase/serverApp";

async function verifyToken(token: string) {
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
    const { imageBase64, predictedLabel } = await req.json();
    const token = req.headers.get("authorization")?.split("Bearer ")[1];

    if (!imageBase64) {
      return NextResponse.json(
        { error: "No se proporciono la imagen" },
        { status: 400 }
      );
    }

    const imageBuffer = Buffer.from(imageBase64, "base64");

    const userId = token ? await verifyToken(token) : null;

    // lista de espera
    if (userId) {
      const taskId = await predictionQueue.enqueue({
        userId,
        fileBuffer: imageBuffer,
        predictedLabel,
        type: "image",
      });

      return NextResponse.json({
        message: "Predicción encolada para guardado",
        taskId,
        status: "queued",
      });
    }

    return NextResponse.json({
      message: "Predicción procesada",
      status: "success",
    });
  } catch (e) {
    console.error("Error en la predicción de imagen:", e);
    return NextResponse.json(
      { error: "Error procesando la predicción" },
      { status: 500 }
    );
  }
}
