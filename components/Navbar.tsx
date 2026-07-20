"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { COUNTRIES, getCountryInfo, getCountryTalks } from "@/lib/countries-config";
import type { TalkSlug } from "@/types";

const TALK_SLUGS: TalkSlug[] = ["foodtalk", "housetalk", "markettalk", "retailtalk"];
const COUNTRY_CODES = ["sv", "hn", "gt"];

function detectCountry(pathname: string): string | null {
  const seg = pathname.split("/").filter(Boolean);
  if (COUNTRY_CODES.includes(seg[0])) return seg[0];
  if (TALK_SLUGS.includes(seg[0] as TalkSlug)) return "sv"; // rutas legacy SV
  return null;
}

function talkHref(countryCode: string, slug: string): string {
  return countryCode === "sv" ? `/${slug}` : `/${countryCode}/${slug}`;
}

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);

  const close = () => { setMenuOpen(false); setCountryOpen(false); };

  const currentCode = detectCountry(pathname);
  const currentCountry = currentCode ? getCountryInfo(currentCode) : null;
  const currentTalks = currentCode ? getCountryTalks(currentCode) : [];

  return (
    <>
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
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                  pathname === "/" ? "text-white bg-white/10" : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                Inicio
              </Link>

              {currentTalks.map((talk) => {
                const href = talkHref(currentCode!, talk.slug);
                const active = pathname === href || pathname === `/${currentCode}/${talk.slug}` || pathname === `/${talk.slug}`;
                return (
                  <Link
                    key={talk.slug}
                    href={href}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      active ? "text-white bg-white/10" : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {talk.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {/* Country picker */}
              <div className="relative">
                <button
                  onClick={() => setCountryOpen((v) => !v)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all hover:bg-white/8"
                  style={{ border: "1px solid rgba(255,255,255,0.10)", color: "#cbd5e1" }}
                >
                  <span className="text-base">{currentCountry?.flag ?? "🌎"}</span>
                  <span className="hidden sm:block">{currentCountry?.name ?? "País"}</span>
                  <svg className="w-3 h-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {countryOpen && (
                  <>
                    {/* Overlay para cerrar */}
                    <div className="fixed inset-0 z-10" onClick={() => setCountryOpen(false)} />
                    <div
                      className="absolute right-0 top-full mt-2 z-20 rounded-2xl overflow-hidden py-1 min-w-[180px]"
                      style={{
                        background: "rgba(10,16,40,0.98)",
                        border: "1px solid rgba(255,255,255,0.10)",
                        boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
                      }}
                    >
                      {COUNTRIES.map((c) => (
                        <Link
                          key={c.code}
                          href={`/${c.code}`}
                          onClick={() => setCountryOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-white/6"
                          style={{
                            color: c.code === currentCode ? "#fff" : "#94a3b8",
                            fontWeight: c.code === currentCode ? 700 : 500,
                          }}
                        >
                          <span className="text-lg">{c.flag}</span>
                          <span>{c.name}</span>
                          {c.code === currentCode && (
                            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400" />
                          )}
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* CTA — desktop */}
              <Link
                href="/cotizar"
                className="hidden sm:inline-flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-full transition-all duration-200 hover:opacity-90 hover:scale-105"
                style={{ background: "linear-gradient(135deg,#FF1493,#00B4D8)", color: "#fff" }}
              >
                Haz tu cotización
              </Link>

              {/* Hamburger — móvil */}
              <button
                className="md:hidden text-slate-400 p-2 rounded-lg hover:bg-white/5 transition-colors"
                onClick={() => setMenuOpen((v) => !v)}
                aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
              >
                {menuOpen ? (
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
        </div>

        {/* Menú móvil */}
        {menuOpen && (
          <div className="md:hidden px-4 pb-4" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            <nav className="flex flex-col gap-1 pt-3">
              <Link
                href="/"
                onClick={close}
                className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  pathname === "/" ? "text-white bg-white/10" : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                Inicio
              </Link>
              {currentTalks.map((talk) => {
                const href = talkHref(currentCode!, talk.slug);
                return (
                  <Link
                    key={talk.slug}
                    href={href}
                    onClick={close}
                    className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                  >
                    {talk.label}
                  </Link>
                );
              })}
              {/* Países en móvil */}
              <div className="mt-2 pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                <p className="px-4 pb-1 text-xs font-bold uppercase tracking-widest text-slate-600">País</p>
                {COUNTRIES.map((c) => (
                  <Link
                    key={c.code}
                    href={`/${c.code}`}
                    onClick={close}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all hover:bg-white/5"
                    style={{ color: c.code === currentCode ? "#fff" : "#94a3b8", fontWeight: c.code === currentCode ? 700 : 500 }}
                  >
                    <span>{c.flag}</span>
                    <span>{c.name}</span>
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Barra CTA fija — solo móvil (fuera del header para evitar bug de backdrop-filter) */}
      <div
        className="sm:hidden fixed top-20 left-0 right-0 z-40 px-4 py-2"
        style={{ background: "rgba(6,11,31,0.92)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}
      >
        <Link
          href="/cotizar"
          onClick={close}
          className="flex items-center justify-center w-full text-sm font-bold py-3 rounded-2xl transition-all hover:opacity-90 active:scale-[0.98]"
          style={{ background: "linear-gradient(135deg,#FF1493,#00B4D8)", color: "#fff" }}
        >
          Haz tu cotización
        </Link>
      </div>
    </>
  );
}
