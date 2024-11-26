import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="">
      <section className="bg-gray-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4x1 font-bold mb-4">Bienvenido a BirdApp</h1>
          <p className="text-lg mb-8">Funcionamiento de la herramienta</p>
          <Link
            href="/about"
            className="bg-yellow-400 text-green-900 px-6 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-all"
          >
            About
          </Link>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2x1 font-bold text-green-800 text-center mb-8">Caracteristicas</h2>

        <div className="grid gap-6 md:grid-cols-2">          
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Link href="/identify/image-processor">
                <h3 className="text-xl font-bold text-green-800 mb-2">Identificación por Images</h3>
                <p className="text-gray-700">
                  La herramienta permite identificar aves utilizando la camara de nuestro dispositivo...
                </p>
              </Link>
            </div>          
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Link href="/identify/audio-processor">
                <h3 className="text-xl font-bold text-green-800 mb-2">Identificación por Sonido</h3>
                <p className="text-gray-700">
                  También es posible la identificación aunque no podamos verlas.
                  Esto por medio de la grabación del canto de las aves...
                </p>
              </Link>
            </div>
        </div>
      </section>

      <section className="bg-green-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <Image
            src="/images/hero.png"
            alt="Hero"
            width={600}
            height={400}
            priority
            className="rounded-lg shadow-lg mx-auto"
          />
          <p className="text-green-800 mt-4">
            Descubre cómo esta herramienta amplia nuestro conocimiento de las aves...
          </p>
        </div>
      </section>
    </main>
  );
}
