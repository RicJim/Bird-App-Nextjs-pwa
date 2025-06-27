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
      <section className="flex gap-4 justify-center items-center">
        <button
          onClick={() => setActiveTab("tab1")}
          className={`py-3 px-10 border-b-2 text-md font-medium transition-colors duration-300 ${
            activeTab === "tab1"
              ? "border-green-600 text-green-600"
              : "border-transparent text-gray-500 hover:text-green-600 hover:border-green-300"
          }`}
        >
          Clasificación por Imágenes
        </button>

        <button
          onClick={() => setActiveTab("tab2")}
          className={`py-3 px-10 border-b-2 text-md font-medium transition-colors duration-300 ${
            activeTab === "tab2"
              ? "border-green-600 text-green-600"
              : "border-transparent text-gray-500 hover:text-green-600 hover:border-green-300"
          }`}
        >
          Clasificación por Sonido
        </button>
      </section>
      <div>{renderTabContent()}</div>
    </>
  );
}
