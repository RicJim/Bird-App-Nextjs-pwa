"use client";

import { useAuth } from "@/context/AuthContext";
import Navbar from "./Navbar";

export default function NavbarWrapper() {
  const { user } = useAuth();

  return <Navbar isLoggedIn={!!user} />;
}
