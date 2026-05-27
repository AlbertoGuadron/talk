import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "TALK by Digital Insights",
  description: "Rankings de presencia en redes sociales — Foodtalk, Housetalk, Markettalk",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className="h-full">
      <body className={`${inter.variable} min-h-full antialiased`} style={{ background: "#060B1F" }}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
