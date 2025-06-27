import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="bg-gradient-to-b from-green-100 to-green-50">
      <section className="bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6 text-yellow-400">
            Bienvenido a BirdApp
          </h1>
          <p className="text-lg text-yellow-200 mb-8">
            ¡Explora y aprende la importancia de las aves!
          </p>
          <Link
            href="/about"
            className="bg-orange-500 text-white text-lg px-6 py-2 rounded-full font-semibold hover:bg-yellow-500 transition-all"
          >
            Aprende más
          </Link>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 w-11/12">
        <h2 className="text-3xl font-bold text-green-600 text-center mb-8">
          Caracteristicas
        </h2>

        <div className="grid gap-6 md:grid-cols-2 text-center">
          <div
            className="bg-white p-6 rounded-lg shadow-lg border-2 border-green-300
              hover:shadow-lg hover:scale-105 transition-all"
          >
            <Link href={{ pathname: "/identify", query: { tab: "tab1" } }}>
              <h3 className="text-xl sm:text-2xl font-bold text-green-700 mb-2">
                ¡Identificación por Images!
              </h3>
              <p className="text-gray-700 text-sm sm:text-sm lg:text-lg">
                Utiliza la cámara de tu dispositivo para identificar las aves de
                una manera sencilla.
              </p>
            </Link>
          </div>

          <div
            className="bg-white p-6 rounded-lg shadow-lg border-2 border-green-300
              hover:shadow-lg hover:scale-105 transition-all"
          >
            <Link href={{ pathname: "/identify", query: { tab: "tab2" } }}>
              <h3 className="text-xl sm:text-2xl font-bold text-green-700 mb-2">
                ¡Identificación por Sonido!
              </h3>
              <p className="text-gray-700 text-sm sm:text-md lg:text-lg">
                Si no las puedes ver, ¡escucha su canto y descubre que ave es!
              </p>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-green-200 to-green-300 py-16">
        <div className="container mx-auto px-4 text-center">
          <Image
            src="/images/hero.png"
            alt="Hero"
            width={600}
            height={400}
            className="rounded-lg shadow-lg mx-auto w-auto h-auto"
          />
          <p className="text-green-800 mt-4 text-lg">
            ¡Descubre cómo esta herramienta amplia nuestro conocimiento de las
            aves!
          </p>
        </div>
      </section>
    </main>
  );
}
