import Link from "next/link";
import Image from "next/image";

export default function Gallery({ images }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
      {images.map(({ id, Poster, Name }) => (
        <Link key={id} href={`/gallery/${id}`} className="block group">
          <Image
            src={Poster}
            alt={Name}
            width={300}
            height={200}
            className="w-full h-32 sm:h-40 md:h-48 object-cover rounded-lg shadow-lg transition-transform transform group-hover:scale-105 group-hover:shadow-2xl"
          />
          <span className="block mt-2 text-sm sm:text-base text-center text-green-800 font-semibold group-hover:text-green-600">
            {Name}
          </span>
        </Link>
      ))}
    </div>
  );
}
