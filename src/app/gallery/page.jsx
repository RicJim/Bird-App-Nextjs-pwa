import Gallery from "@/components/gallery/Gallery";
import images from "@/data/bird-data.json";

export default function GalleryPage() {
  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-center">Galería</h1>
      <Gallery images={images} />
    </div>
  );
}
