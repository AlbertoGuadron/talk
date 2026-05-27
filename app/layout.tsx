import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "TALK by Digital Insights",
  description: "La plataforma de real-time market research que analiza tendencias, conversación y comportamiento digital para guiar a tu marca con datos actualizados.",
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
