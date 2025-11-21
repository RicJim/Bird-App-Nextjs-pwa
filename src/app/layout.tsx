import "@/styles/globals.css";
import Footer from "@/components/Footer";
import { Roboto } from "next/font/google";
import NavbarWrapper from "@/components/Navbar/NavbarWrapper";
import { AuthProvider } from "@/context/AuthContext";
import { PWAProvider, OfflineIndicator } from "@/context/PWAContext";

const roboto = Roboto({
  weight: ["300", "400", "500"],
  style: ["italic", "normal"],
  subsets: ["latin"],
});

export const metadata = {
  title: "YiBirdApp",
  description: "BirdApp Description - Identifica especies de aves con IA",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "BirdApp",
  },
};

export const viewport = {
  themeColor: "#1f2937",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: "yes",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="BirdApp" />
        <meta name="application-name" content="BirdApp" />
        <meta name="msapplication-TileColor" content="#1f2937" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body className={`layout-nmf ${roboto.className} bg-green-100`}>
        <PWAProvider>
          <AuthProvider>
            <NavbarWrapper />
            <main>{children}</main>
            <OfflineIndicator />
          </AuthProvider>

          <Footer />
        </PWAProvider>
      </body>
    </html>
  );
}
