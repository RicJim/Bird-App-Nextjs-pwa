"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function IdentifyPage({
  imgprocess,
  audprocess,
}: {
  imgprocess: React.ReactNode;
  audprocess: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get("tab");
  const cleaned = useRef(false);

  const initialTab = useMemo(() => {
    return tabParam === "tab2" ? "tab2" : "tab1";
  }, [tabParam]);

  const [activeTab, setActiveTab] = useState<"tab1" | "tab2">(initialTab);

  useEffect(() => {
    if (tabParam && !cleaned.current) {
      cleaned.current = true;
      router.replace("/identify", { scroll: false });
    }
  }, [tabParam, router]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "tab1":
        return imgprocess;
      case "tab2":
        return audprocess;
      default:
        return null;
    }
  };
  return (
    <>
      <section className="w-full flex flex-wrap gap-2 sm:gap-4 justify-center items-center px-2 sm:px-4">
        <button
          onClick={() => setActiveTab("tab1")}
          className={`py-2 sm:py-3 px-3 sm:px-6 md:px-10 border-b-2 text-xs sm:text-sm md:text-base font-medium transition-colors duration-300 whitespace-nowrap ${
            activeTab === "tab1"
              ? "border-green-600 text-green-600"
              : "border-transparent text-gray-500 hover:text-green-600 hover:border-green-300"
          }`}
        >
          <span className="hidden sm:inline">Clasificación por </span>Imágenes
        </button>

        <button
          onClick={() => setActiveTab("tab2")}
          className={`py-2 sm:py-3 px-3 sm:px-6 md:px-10 border-b-2 text-xs sm:text-sm md:text-base font-medium transition-colors duration-300 whitespace-nowrap ${
            activeTab === "tab2"
              ? "border-green-600 text-green-600"
              : "border-transparent text-gray-500 hover:text-green-600 hover:border-green-300"
          }`}
        >
          <span className="hidden sm:inline">Clasificación por </span>Sonido
        </button>
      </section>
      <div className="w-full">{renderTabContent()}</div>
    </>
  );
}
