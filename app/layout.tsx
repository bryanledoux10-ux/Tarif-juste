import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Fraunces, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["600", "800"],
  variable: "--font-fraunces",
  display: "swap",
});

const plex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex",
  display: "swap",
});

const titre = "Tarif Juste — Combien tu perds à facturer trop bas";
const description =
  "Ton tarif au ressenti oublie les charges, les congés et le temps non facturable. Fais le calcul en 2 minutes, gratuitement.";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"
  ),
  title: titre,
  description,
  openGraph: {
    title: titre,
    description,
    locale: "fr_FR",
    type: "website",
    siteName: "Tarif Juste",
  },
  twitter: { card: "summary_large_image", title: titre, description },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#14213d",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${fraunces.variable} ${plex.variable}`}>
      <body className="min-h-dvh flex flex-col">
        <div className="flex-1">{children}</div>
        <footer className="border-t border-trait px-4 py-6 text-sm text-gris">
          <div className="mx-auto max-w-xl flex flex-wrap gap-x-5 gap-y-2">
            <span>© Tarif Juste</span>
            <Link href="/mentions-legales" className="underline underline-offset-2">
              Mentions légales
            </Link>
            <Link href="/cgv" className="underline underline-offset-2">
              CGV
            </Link>
            <Link href="/confidentialite" className="underline underline-offset-2">
              Confidentialité
            </Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
