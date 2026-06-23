"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { TALKS } from "@/lib/talks-config";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: "rgba(6,11,31,0.85)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0" onClick={close}>
            <Image
              src="/galeria/logotalk.png"
              alt="TALK Digital Insights"
              width={200}
              height={60}
              className="h-24 w-auto"
              priority
            />
          </Link>

          {/* Nav links — desktop */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className={`px-5 py-2 rounded-full text-base font-bold transition-all duration-200 ${
                pathname === "/"
                  ? "text-white bg-white/10"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              Inicio
            </Link>
            {TALKS.map((talk) => (
              <Link
                key={talk.slug}
                href={`/${talk.slug}`}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  pathname === `/${talk.slug}`
                    ? "text-white bg-white/10"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {talk.label}
              </Link>
            ))}
          </nav>

          {/* CTA — desktop */}
          <Link
            href="/cotizar"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-full transition-all duration-200 hover:opacity-90 hover:scale-105"
            style={{ background: "linear-gradient(135deg,#FF1493,#00B4D8)", color: "#fff" }}
          >
            Haz tu cotización
          </Link>

          {/* Hamburger — mobile */}
          <button
            className="md:hidden text-slate-400 p-2 rounded-lg hover:bg-white/5 transition-colors"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
          >
            {open ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div
          className="md:hidden px-4 pb-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
        >
          <nav className="flex flex-col gap-1 pt-3">
            <Link
              href="/"
              onClick={close}
              className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                pathname === "/"
                  ? "text-white bg-white/10"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              Inicio
            </Link>
            {TALKS.map((talk) => (
              <Link
                key={talk.slug}
                href={`/${talk.slug}`}
                onClick={close}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  pathname === `/${talk.slug}`
                    ? "text-white bg-white/10"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {talk.label}
              </Link>
            ))}
            <Link
              href="/cotizar"
              onClick={close}
              className="mt-2 text-center text-sm font-bold px-4 py-3 rounded-xl transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg,#FF1493,#00B4D8)", color: "#fff" }}
            >
              Haz tu cotización
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
