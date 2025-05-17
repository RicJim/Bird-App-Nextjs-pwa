import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-10 px-6">
      <div className="max-w-4xl bg-white shadow-xl rounded-lg p-8 w-full sm:w-10/12">
        <h1 className="text-2xl md:text-4xl font-bold text-green-800 mb-6 text-center">
          Acerca de la Herramienta
        </h1>
        <p className="text-sm sm:text-lg text-gray-700 mb-6 text-center">
          La herramienta cuenta con tecnologías avanzadas para identificar aves
          utilizando imágenes y sonidos...
        </p>

        <div className="flex justify-center space-x-4 mt-8">
          {/*<p className="bg-yellow-400 text-green-900 px-6 py-3 rounded-full font-semibold hover:bg-yellow-500 transition-all">
            Características
          </p>*/}
          <Link
            href="mailto:ricardo.jimenez3@utp.ac.pa?subject=Consultas de la Herramienta"
            className="bg-green-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-700 transition-all"
          >
            Contacto
          </Link>
        </div>
      </div>
    </div>
  );
}
