import Gallery from "@/components/gallery/Gallery";
import images from "@/data/bird-data.json";

export default function GalleryPage() {
  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-center text-green-600">
        Catálogo de Aves
      </h1>

      <div className="grid grid-cols-1">
        <Gallery images={images} />
      </div>
    </div>
  );
}
