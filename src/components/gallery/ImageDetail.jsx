import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from '@heroicons/react/solid';

export default function ImageDetail({ image }) {
  const router = useRouter();

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      <button onClick={() => router.back()} className="text-blue-500 hover:text-blue-700 mb-4">
        <ArrowLeftIcon className="w-6 h-6 mr-3"></ArrowLeftIcon>
      </button>
      <h2 className="text-center text-xl sm:text-2xl md:text-3xl font-bold mb-4">{image.Title}</h2>
      <div className="flex flex-col my-2 sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <Image 
            src={image.Poster}
            alt={image.Title}
            width={300}
            height={300}
            className="mb-4 sm:mb-0 rounded-lg" 
            />
        <div className="">
          <p className="mb-4 text-sm sm:text-base">{image.Descripcion1}</p>
          <p className="mb-4 text-sm sm:text-base">{image.Descripcion2}</p>
        </div>
      </div>
      {image.Audio && (
        <audio controls className="w-full sm:w-2/3 md:w-1/2 lg:w-1/3 mb-4 mx-auto rounded-lg shadow-lg border border-gray-300 bg-gray-100 hover:bg-gray-200 transition-all">
          <source src={image.Audio} type="audio/mpeg" />
          Tu navegador no soporta el elemento de audio.
        </audio>
      )}
    </div>
  );
  }
  