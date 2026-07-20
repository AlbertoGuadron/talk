import Link from "next/link";
import Image from "next/image";
import { COUNTRIES } from "@/lib/countries-config";
import NetworkCanvas from "@/components/NetworkCanvas";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">

      {/* ── LADO IZQUIERDO — Branding ─────────────────────── */}
      <div className="relative flex-1 flex flex-col items-center justify-center min-h-[45vh] md:min-h-screen overflow-hidden"
        style={{ background: "linear-gradient(135deg, #060B1F 0%, #0D1535 50%, #1a0a3d 100%)" }}
      >
        <NetworkCanvas className="opacity-50" dotCount={55} color="99,102,241" />

        {/* Orbs decorativos */}
        <div className="absolute top-1/4 left-1/3 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)", filter: "blur(50px)" }}
        />
        <div className="absolute bottom-1/4 right-1/4 w-56 h-56 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 70%)", filter: "blur(40px)" }}
        />

        <div className="relative z-10 text-center px-8 py-16 md:py-0">
          <div className="animate-float-slow">
            <Image
              src="/galeria/logotalk.png"
              alt="TALK Digital Insights"
              width={480}
              height={144}
              className="w-64 sm:w-80 md:w-96 h-auto drop-shadow-2xl mx-auto"
              priority
            />
          </div>
          <p className="mt-6 text-slate-300 text-base md:text-lg max-w-sm mx-auto leading-relaxed">
            Inteligencia de mercado permanente para marcas que quieren liderar el mundo digital.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            {[
              { label: "Países", value: "3" },
              { label: "Actualización", value: "Mensual" },
              { label: "Disponible", value: "24/7" },
            ].map((s) => (
              <div key={s.label} className="glass rounded-full px-4 py-2 flex items-center gap-2">
                <p className="text-xs text-slate-400">{s.label}</p>
                <p className="text-sm font-bold text-white">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SEPARADOR vertical (solo desktop) ─────────────── */}
      <div className="hidden md:block w-px" style={{ background: "rgba(255,255,255,0.07)" }} />

      {/* ── LADO DERECHO — Selector de país ───────────────── */}
      <div
        className="flex-1 flex flex-col items-center justify-center px-8 py-16"
        style={{ background: "#F8F9FC" }}
      >
        <div className="w-full max-w-sm">
          <p className="text-slate-500 text-sm mb-2 text-center">Te damos la bienvenida a</p>
          <div className="flex justify-center mb-2">
            <Image
              src="/galeria/logotalk.png"
              alt="TALK"
              width={160}
              height={48}
              className="h-10 w-auto"
            />
          </div>

          <h2 className="text-2xl font-black text-slate-800 text-center mt-6 mb-1">
            Estamos en Centroamérica
          </h2>
          <p className="text-slate-500 text-sm text-center mb-8">
            Selecciona tu país para ver los rankings de tu mercado
          </p>

          <div className="grid grid-cols-1 gap-3">
            {COUNTRIES.map((country) => (
              <Link
                key={country.code}
                href={`/${country.code}`}
                className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all duration-200 group"
              >
                <span className="text-3xl">{country.flag}</span>
                <div className="flex-1">
                  <p className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                    {country.name}
                  </p>
                  <p className="text-xs text-slate-400">
                    {country.talks.length} Talk{country.talks.length !== 1 ? "s" : ""} disponibles
                  </p>
                </div>
                <svg className="w-5 h-5 text-slate-300 group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
