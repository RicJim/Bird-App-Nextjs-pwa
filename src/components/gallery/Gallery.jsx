import Link from "next/link";
import Image from "next/image";

export default function Gallery({ images }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 text-center">
      {images.map(({ id, Poster, Name }) => (
        <Link key={id} href={`/gallery/${id}`}>
            <Image
              src={Poster}
              alt={Name}
              width={300}
              height={200}
              className="w-full h-32 sm:h-40 md:h-48 object-cover rounded-lg shadow-md transition-transform transform hover:scale-105"
            />
            <span className="">{Name}</span>
        </Link>
      ))}
    </div>
  );
}
