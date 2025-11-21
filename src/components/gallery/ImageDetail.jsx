import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/outline";

export default function ImageDetail({ image }) {
  const router = useRouter();

  return (
    <>
      <div
        className="p-6 bg-gradient-to-r from-green-100 to-green-200 rounded-lg shadow-lg max-w-4xl mx-auto"
        style={{
          animation: "fadeInDown 0.6s ease-out",
        }}
      >
        <button
          onClick={() => router.back()}
          className="text-green-600 hover:text-green-800 mb-6 flex items-center transition-all duration-300 transform hover:translate-x-1"
          style={{
            animation: "slideInLeft 0.5s ease-out",
          }}
        >
          <ArrowUturnLeftIcon className="w-6 h-6 mr-3" />
          Volver
        </button>

        <h2
          className="text-center text-2xl sm:text-3xl md:text-4xl font-semibold text-green-800 mb-6"
          style={{
            animation: "slideInDown 0.5s ease-out 0.1s forwards",
            opacity: 0,
          }}
        >
          {image.Title}
        </h2>

        <div
          className="flex flex-col my-6 sm:flex-row sm:space-x-6"
          style={{
            animation: "fadeInUp 0.6s ease-out 0.2s forwards",
            opacity: 0,
          }}
        >
          <Image
            src={image.Poster}
            alt={image.Title}
            width={300}
            height={300}
            className="rounded-lg mb-6 sm:mb-0 mx-auto sm:mx-0 shadow-xl object-cover transition-transform duration-500 transform hover:scale-105"
          />
          <div className="text-green-700 space-y-4 mx-4">
            <p className="text-sm sm:text-base transition-all duration-300">
              <strong>Descripción: </strong>
              {image.Descripcion1}
            </p>
            <p className="text-sm sm:text-base transition-all duration-300">
              {image.Descripcion2}
            </p>
            <p className="text-sm sm:text-base transition-all duration-300">
              <strong>Nombres comunes: </strong>
              {image.CommonNames}
            </p>
            <div className="my-6 p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-lg sm:text-xl font-semibold text-green-700 mb-4">
                Características
              </h3>
              <p className="text-sm sm:text-base">
                <strong>Tamaño: </strong>
                {image.Talla}
              </p>
              <p className="text-sm sm:text-base">
                <strong>Colores: </strong>
                {image.Colores}
              </p>
              <p className="text-sm sm:text-base">
                <strong>Peso: </strong>
                {image.Peso}
              </p>
              <p className="text-sm sm:text-base">
                <strong>Hábitat: </strong>
                {image.Habitat}
              </p>
            </div>
          </div>
        </div>
        {image.Call && (
          <div
            style={{
              animation: "slideInUp 0.5s ease-out 0.3s forwards",
              opacity: 0,
            }}
          >
            <p className="text-green-600 font-semibold mb-3">Llamada:</p>
            <audio
              controls
              className="w-full sm:w-2/3 md:w-1/2 lg:w-1/3 mb-6 mx-auto rounded-lg shadow-lg border border-green-300 bg-green-50 hover:bg-green-100 transition-all"
            >
              <source src={image.Call} type="audio/mpeg" />
              Tu navegador no soporta el elemento de audio.
            </audio>
          </div>
        )}
        {image.Song && (
          <div
            style={{
              animation: "slideInUp 0.5s ease-out 0.4s forwards",
              opacity: 0,
            }}
          >
            <p className="text-green-600 font-semibold mb-3">Canto:</p>
            <audio
              controls
              className="w-full sm:w-2/3 md:w-1/2 lg:w-1/3 mb-6 mx-auto rounded-lg shadow-lg border border-green-300 bg-green-50 hover:bg-green-100 transition-all"
            >
              <source src={image.Song} type="audio/mpeg" />
              Tu navegador no soporta el elemento de audio.
            </audio>
          </div>
        )}
      </div>
      <style jsx>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
