"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { TALKS } from "@/lib/talks-config";

export default function Navbar() {
  const pathname = usePathname();

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
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <Image
              src="/galeria/logotalk.png"
              alt="TALK Digital Insights"
              width={200}
              height={60}
              className="h-24 w-auto"
              priority
            />
          </Link>

          {/* Nav links */}
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

          {/* CTA button */}
          {/*<Link
            href="/admin"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full transition-all duration-200"
            style={{
              background: "linear-gradient(135deg, #6366F1, #EC4899)",
              color: "white",
            }}
          >
            Admin
          </Link>*/}

          {/* Mobile menu toggle placeholder */}
          <button className="md:hidden text-slate-400 p-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
