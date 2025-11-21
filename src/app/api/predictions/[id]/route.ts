import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getCollection } from "@/lib/Mongodb/mongodb";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "ID de predicción inválido" },
        { status: 400 }
      );
    }

    const collection = await getCollection("predictions");
    if (!collection) {
      return NextResponse.json(
        { error: "No se pudo acceder a la colección de predicciones" },
        { status: 503 }
      );
    }

    const result = await collection.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Predicción no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Predicción eliminada exitosamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al eliminar predicción:", error);
    return NextResponse.json(
      { error: "Error al eliminar la predicción" },
      { status: 500 }
    );
  }
}
