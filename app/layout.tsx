import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const SITE_URL = "https://talk.digitalinsightsla.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "TALK Digital Insights – Rankings de marcas en redes sociales",
    template: "%s | TALK Digital Insights",
  },
  description:
    "Plataforma de real-time market research para El Salvador, Guatemala y Honduras. Rankings quincenales de publicaciones, seguidores y engagement de las principales marcas en Facebook, Instagram y TikTok.",
  keywords: [
    "ranking marcas redes sociales",
    "market research centroamerica",
    "social media analytics el salvador",
    "social media analytics guatemala",
    "social media analytics honduras",
    "foodtalk housetalk markettalk retailtalk",
  ],
  authors: [{ name: "Digital Insights", url: "https://www.digitalinsightsla.com" }],
  creator: "Digital Insights",
  openGraph: {
    type: "website",
    siteName: "TALK Digital Insights",
    locale: "es_SV",
    images: [{ url: "/galeria/logotalk.png", alt: "TALK Digital Insights" }],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@DigitalInsights",
    images: ["/galeria/logotalk.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: { canonical: SITE_URL },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className="h-full">
      <head>
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-WRKJQJW8');`,
          }}
        />
      </head>
      <body className={`${inter.variable} min-h-full antialiased`} style={{ background: "#060B1F" }}>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WRKJQJW8"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <Navbar />
        {/* pt-14 extra en móvil para que la barra CTA fija debajo del navbar no tape el contenido */}
        <div className="pt-14 sm:pt-0">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
