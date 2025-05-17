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

    if (userId) {
      savePrediction({
        userId,
        fileBuffer: imageBuffer,
        predictedLabel,
        type: "image",
      }).catch(console.error);
    }

    return NextResponse.json({ message: "Operancion Completada..." });
  } catch (e) {
    console.error("Error en la predicción de imagen:", e);
    return NextResponse.json(
      { error: "Error interno en la predicción" },
      { status: 500 }
    );
  }
}
