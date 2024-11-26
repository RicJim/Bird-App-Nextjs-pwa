"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { XMarkIcon, InformationCircleIcon, Bars3Icon, CameraIcon, RectangleStackIcon } from '@heroicons/react/24/solid';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: "/identify", label: "Identificar", icons: [<CameraIcon key="cam" className="w-5 h-5" />] },
    { href: "/gallery", label: "Catalogo", icons: [<RectangleStackIcon key="coll" className="w-5 h-5" />] },
    { href: "/about", label: "About", icons: [<InformationCircleIcon key="info" className="w-5 h-5" />] },
  ];

  const handleClick = () => {
    setIsOpen((prev) => !prev);
  };
  
  const renderNavLinks = () => (
    navLinks.map(({ href, label, icons }) => (
      <Link 
        key={href} 
        href={href} 
        className="flex items-center p-2 space-x-2 text-white 
          hover:text-yellow-400 hover:bg-green-600 rounded-md transition-all duration-300"
        onClick={handleClick}>
        {icons}<span className="text-sm font-medium">{label}</span>
      </Link>
    ))
  );

  return (
    <nav className="bg-green-700 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        
        {/* Logo */}
        <Link className="text-white text-2xl font-bold 
          hover:text-yellow-400 transition-colors flex items-center" href="/">
          <Image 
            src="/android/android-launchericon-144-144.png"
            alt="Bird Icon"
            width={48}
            height={48}
            className="mr-2"
          />
          BirdApp
        </Link>

        {/* Toggle Button */}
        <button onClick={handleClick} className="text-white lg:hidden 
          hover:text-yellow-400 transition-colors">
          {isOpen ? (<XMarkIcon className="w-6 h-6" />) : (<Bars3Icon className="w-6 h-6" />)}
        </button>

        {/* Menú de navegación para escritorio */}
        <div className="hidden lg:flex lg:space-x-4 text-white">
          {renderNavLinks()}
        </div>
      </div>

      {/* Menú desplegable para móviles */}
      {isOpen && (
        <div className="lg:hidden bg-gray-700 mt-2 p-3 space-y-2 text-white rounded-lg shadow-md">
          {renderNavLinks()}
        </div>
      )}
    </nav>
  );
}