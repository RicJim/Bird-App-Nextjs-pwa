import "@/styles/globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Head from "next/head";
import { Roboto } from "next/font/google";
import { ModelProvider } from "@/context/ModelContext";

const roboto = Roboto({
  weight: ["300", "400", "500"],
  style: ["italic", "normal"],
  subsets: ["latin"],
});

export const metadata = {
  title: "BirdApp",
  description: "BirdApp Description",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Head>
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <body className={roboto.className}>
        <Navbar />

        <ModelProvider>{children}</ModelProvider>

        <Footer />
      </body>
    </html>
  );
}
