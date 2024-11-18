import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="">
      <section className="bg-gray-500 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4x1 font-bold mb-4">Bienvenido a App Name</h1>
          <p className="text-lg mb-8">
            Funcionamiento de la herramienta
          </p>
          <Link href="/about">
            About
          </Link>
        </div>
        <p className="fixed right-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Get started by editing Next.js API&nbsp;
          <Link href="/api/helloNextJs">
            <code className="font-mono font-bold">app/api/helloNextJs</code>
          </Link>
        </p>
      </section>

      <section className="container mx-auto px-4 py-12">
        <h2 className="font-bold">Caracteristicas</h2>
        <div className="bg-white p-6 rounded-lg shadow-md my-5">
          <h3 className="text-xl font-bold mb-2">Identificar usando Images</h3>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md my-5">
          <h3 className="text-xl font-bold mb-2">Identificar usando Sonido</h3>
        </div>
      </section>

      <section className="bg-gray-200 py-16">
        <div className="container mx-auto px-4 text-center">
          <Image src="/images/hero.png"
            alt="Imagen de bienvenida"
            width={600}
            height={400}
            className="rounded-lg shadow-lg mx-auto" />
        </div>
      </section>
    </main>
  );
}