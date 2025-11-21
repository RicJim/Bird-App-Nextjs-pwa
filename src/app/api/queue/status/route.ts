export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { predictionQueue } from "@/lib/Mongodb/predictionQueue";

export async function GET() {
  try {
    const stats = predictionQueue.getStats();

    return NextResponse.json({
      status: "ok",
      queue: stats,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error obteniendo estado de cola:", error);
    return NextResponse.json(
      { error: "Error al obtener estado de la cola" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { action } = await req.json();

    if (action === "cleanup") {
      predictionQueue.cleanup();
      const stats = predictionQueue.getStats();

      return NextResponse.json({
        message: "Cola limpiada",
        queue: stats,
      });
    }

    if (action === "clear") {
      predictionQueue.clear();

      return NextResponse.json({
        message: "Cola vaciada completamente",
        queue: { total: 0, pending: 0, processing: 0, completed: 0, failed: 0 },
      });
    }

    return NextResponse.json({ error: "Acción no válida" }, { status: 400 });
  } catch (error) {
    console.error("Error procesando cola:", error);
    return NextResponse.json(
      { error: "Error al procesar la cola" },
      { status: 500 }
    );
  }
}
