import "@/styles/globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  weight: ["300", "400", "500"],
  style: ["italic", "normal"],
  subsets: ["latin"],
});

export const metadata = {
  title: "App Name",
  description: "App Description",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
