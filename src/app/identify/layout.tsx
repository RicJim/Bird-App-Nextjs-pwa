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
    <div className="min-h-screen flex flex-col bg-gray-50 bg-gradient-to-b from-white to-green-300">
      <div className="flex-1 flex flex-col justify-center items-center text-center px-4 py-6 sm:p-8 md:p-10">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-yellow-600 mb-3 sm:mb-4 text-center">
          ¡Explora la Naturaleza!
        </h1>
        <Suspense
          fallback={
            <div className="text-center text-gray-600">
              Cargando interfaz...
            </div>
          }
        >
          <IdentifyPage imgprocess={imgprocess} audprocess={audprocess} />
        </Suspense>
      </div>
    </div>
  );
}
