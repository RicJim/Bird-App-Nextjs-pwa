"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  XMarkIcon,
  InformationCircleIcon,
  Bars3Icon,
  CameraIcon,
  RectangleStackIcon,
  UserCircleIcon,
  UserPlusIcon,
  DocumentIcon,
} from "@heroicons/react/24/solid";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Navbar({ isLoggedIn }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathName = usePathname();
  const { logout } = useAuth();

  const navLinks = [
    {
      href: "/identify",
      label: "Identificar",
      icons: [<CameraIcon key="cam" className="w-5 h-5" />],
    },
    {
      href: "/gallery",
      label: "Catálogo",
      icons: [<RectangleStackIcon key="coll" className="w-5 h-5" />],
    },
    {
      href: "/about",
      label: "About",
      icons: [<InformationCircleIcon key="info" className="w-5 h-5" />],
    },
  ];

  const authOutLinks = [
    {
      href: "/login",
      label: "Login",
      icons: [<UserCircleIcon key="log" className="w-5 h-5" />],
    },
    {
      href: "/register",
      label: "Registro",
      icons: [<UserPlusIcon key="reg" className="w-5 h-5" />],
    },
  ];

  const authInLinks = [
    {
      href: "/",
      label: "Registros",
      icons: [<DocumentIcon key="regis" className="w-5 h-5" />],
    },
    {
      label: "LogOut",
      icons: [<UserCircleIcon key="logOut" className="w-5 h-5" />],
      onClick: logout,
    },
  ];

  const handleClick = () => {
    setIsOpen((prev) => !prev);
  };

  const renderLinks = (links) =>
    links.map(({ href, label, icons, onClick }, index) =>
      href ? (
        <Link
          key={href}
          href={href}
          className={`navbar-links
          ${pathName === href ? "bg-yellow-600" : ""}`}
          onClick={handleClick}
        >
          {icons[0]}
          <span className="text-sm font-medium">{label}</span>
        </Link>
      ) : (
        <button
          key={`${label}-${index}`}
          onClick={onClick}
          className={"navbar-links w-full"}
        >
          {icons[0]}
          <span className="text-sm font-medium">{label}</span>
        </button>
      )
    );

  return (
    <nav className="bg-green-700 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link
          className="text-white text-2xl font-bold 
          hover:text-yellow-400 transition-colors flex items-center"
          href="/"
        >
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
        <button
          onClick={handleClick}
          className="text-white lg:hidden 
          hover:text-yellow-400 transition-colors"
        >
          {isOpen ? (
            <XMarkIcon className="w-6 h-6" />
          ) : (
            <Bars3Icon className="w-6 h-6" />
          )}
        </button>

        {/* Menú de navegación para escritorio */}
        <div className="hidden lg:flex lg:space-x-4 text-white">
          {renderLinks(navLinks)}
          {isLoggedIn ? renderLinks(authInLinks) : renderLinks(authOutLinks)}
        </div>
      </div>

      {/* Menú desplegable para móviles */}
      {isOpen && (
        <div className="lg:hidden bg-gray-700 mt-2 p-3 space-y-2 text-white rounded-lg shadow-md">
          {renderLinks(navLinks)}
          {isLoggedIn ? renderLinks(authInLinks) : renderLinks(authOutLinks)}
        </div>
      )}
    </nav>
  );
}
