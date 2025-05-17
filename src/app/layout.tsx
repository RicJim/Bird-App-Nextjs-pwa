import "@/styles/globals.css";
import Footer from "@/components/Footer";
import { Roboto } from "next/font/google";
import NavbarWrapper from "@/components/Navbar/NavbarWrapper";
import { AuthProvider } from "@/context/AuthContext";

const roboto = Roboto({
  weight: ["300", "400", "500"],
  style: ["italic", "normal"],
  subsets: ["latin"],
});

export const metadata = {
  title: "YiBirdApp",
  description: "BirdApp Description",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`layout-nmf ${roboto.className} bg-green-100`}>
        <AuthProvider>
          <NavbarWrapper />
          <main>{children}</main>
        </AuthProvider>

        <Footer />
      </body>
    </html>
  );
}
