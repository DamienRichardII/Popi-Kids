import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { CartProvider } from "@/components/CartProvider";
import { SITE } from "@/lib/site";
import "./globals.css";

const serif = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-cormorant", display: "swap" });
const sans = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: "POPI KIDS – Mode enfantine premium", template: "%s | POPI KIDS" },
  description: "Vêtements et accessoires pour enfants, de 6 mois à 16 ans. Coton doux, retours sous 30 jours.",
  openGraph: { siteName: "POPI KIDS", locale: "fr_FR", type: "website" },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

// Applique le thème mémorisé avant le premier rendu (évite le flash). Démo interne uniquement.
const themeScript = `try{var t=localStorage.getItem('popi-theme');if(t==='midnight'||t==='ivory')document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" data-theme="ivory" className={`${serif.variable} ${sans.variable}`} suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>
      <body><CartProvider>{children}</CartProvider></body>
    </html>
  );
}
