"use client";

import { useParams } from "next/navigation";
import ImageDetail from "@/components/gallery/ImageDetail";
import images from "@/data/bird-data.json";

export default function ImageDetailPage() {
  const { id } = useParams();

  const image = images.find((img) => img.id.toString() === id);

  if (!image) return <p>Imagen no encontrada.</p>;

  return (
    <div className="container mx-auto p-4">
      <ImageDetail image={image} />
    </div>
  );
}
