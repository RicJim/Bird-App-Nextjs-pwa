"use client";

import Link from "next/link";
import Image from "next/image";

export default function Gallery({ images }) {
  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
        {images.map(({ id, Poster, Name }, index) => (
          <Link
            key={id}
            href={`/gallery/${id}`}
            className="block group"
            style={{
              animation: `slideInUp 0.5s ease-out ${index * 0.05}s forwards`,
              opacity: 0,
            }}
          >
            <div className="relative overflow-hidden rounded-lg shadow-lg">
              <Image
                src={Poster}
                alt={Name}
                width={300}
                height={200}
                className="w-full h-32 sm:h-40 md:h-48 object-cover transition-transform duration-300 transform group-hover:scale-110"
              />
            </div>
            <span className="block mt-2 text-sm sm:text-base text-center text-green-800 font-semibold group-hover:text-green-600 transition-colors">
              {Name}
            </span>
          </Link>
        ))}
      </div>
      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
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
