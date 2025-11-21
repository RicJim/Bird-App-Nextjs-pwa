import { NextResponse } from "next/server";
import { getCollection } from "@/lib/Mongodb/mongodb";

export async function GET() {
  try {
    const collection = await getCollection("predictions");
    if (!collection) {
      return NextResponse.json(
        {
          error:
            "No se pudo acceder a la colección. MongoDB no está disponible.",
          predictions: [],
        },
        { status: 503 }
      );
    }

    const predictions = await collection
      .find({})
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();

    return NextResponse.json(predictions);
  } catch (error) {
    console.error("Error al obtener predicciones:", error);
    return NextResponse.json(
      { error: "Error al obtener predicciones", predictions: [] },
      { status: 503 }
    );
  }
}
