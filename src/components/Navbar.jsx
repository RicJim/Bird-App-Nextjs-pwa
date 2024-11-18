"use client";

import Link from "next/link";
import { useState } from "react";
import { MenuIcon, XIcon, InformationCircleIcon, CameraIcon, CollectionIcon } from '@heroicons/react/solid';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: "/identify", label: "Identificar", icons: [<CameraIcon key="cam" className="w-5 h-5" />] },
    { href: "/gallery", label: "Catalogo", icons: [<CollectionIcon key="coll" className="w-5 h-5" />] },
    { href: "/about", label: "About", icons: [<InformationCircleIcon key="info" className="w-5 h-5" />] },
  ];

  const handleClick = () => {
    setIsOpen(!isOpen);
  };
  
  const renderNavLinks = () => (
    navLinks.map(({ href, label, icons }) => (
      <Link key={href} href={href} prefetch={true} className="flex items-center p-1 hover:text-red-300 space-x-1">
        {icons}<span>{label}</span>
      </Link>
    ))
  );

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        
        {/* Logo */}
        <Link className="text-white text-2xl font-bold" href="/">
          App Name
        </Link>

        {/* Toggle Button */}
        <button onClick={handleClick} className="text-white lg:hidden">
          {isOpen ? (<XIcon className="w-6 h-6" />) : (<MenuIcon className="w-6 h-6" />)}
        </button>

        {/* Menú de navegación para escritorio */}
        <div className="hidden lg:flex lg:space-x-4 text-white">
          {renderNavLinks()}
        </div>
      </div>

      {/* Menú desplegable para móviles */}
      {isOpen && (
        <div className="lg:hidden bg-gray-700 mt-2 p-3 space-y-2 text-white">
          {renderNavLinks()}
        </div>
      )}
    </nav>
  );
}