import { Suspense } from "react";
import IdentifyPage from "./page";

export default function IdentifyLayout({
  imgprocess,
  audprocess,
}: {
  imgprocess: React.ReactNode;
  audprocess: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center text-center sm:p-10 shadow-lg
            bg-gray-50 bg-gradient-to-b from-white to-green-300"
    >
      <h1 className="text-2xl sm:text-3xl font-bold text-yellow-600 mb-4 text-center">
        ¡Explora la Naturaleza!
      </h1>
      <Suspense fallback={<div>Cargando interfaz...</div>}>
        <IdentifyPage imgprocess={imgprocess} audprocess={audprocess} />
      </Suspense>
    </div>
  );
}
