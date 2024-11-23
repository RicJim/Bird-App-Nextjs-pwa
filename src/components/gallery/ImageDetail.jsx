import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/solid";

export default function ImageDetail({ image }) {
  const router = useRouter();

  return (
    <div className="p-6 bg-gradient-to-r from-green-100 to-green-200 rounded-lg shadow-lg max-w-4xl mx-auto">
      <button
        onClick={() => router.back()}
        className="text-green-600 hover:text-green-800 mb-6 flex items-center"
      >
        <ArrowLeftIcon className="w-6 h-6 mr-3"></ArrowLeftIcon>
        Volver
      </button>

      <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-semibold text-green-800 mb-6">
        {image.Title}
      </h2>

      <div className="flex flex-col my-6 sm:flex-row sm:space-x-6">
        <Image
          src={image.Poster}
          alt={image.Title}
          width={300}
          height={300}
          className="rounded-lg mb-6 sm:mb-0 mx-auto sm:mx-0 shadow-xl object-cover"
        />
        <div className="text-green-700 space-y-4">
          <p className="text-sm sm:text-base">{image.Descripcion1}</p>
          <p className="text-sm sm:text-base">{image.Descripcion2}</p>
        </div>
      </div>
      {image.Audio && (
        <audio
          controls
          className="w-full sm:w-2/3 md:w-1/2 lg:w-1/3 mb-6 mx-auto rounded-lg shadow-lg border border-green-300 bg-green-50 hover:bg-green-100 transition-all"
        >
          <source src={image.Audio} type="audio/mpeg" />
          Tu navegador no soporta el elemento de audio.
        </audio>
      )}
    </div>
  );
}
