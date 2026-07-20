import Link from "next/link";
import Image from "next/image";
import { COUNTRIES } from "@/lib/countries-config";
import NetworkCanvas from "@/components/NetworkCanvas";

const FEATURES = [
  {
    icon: "📡",
    title: "Datos en Tiempo Real",
    desc: "Monitoreamos miles de perfiles en redes sociales para darte el panorama más actualizado del mercado digital.",
  },
  {
    icon: "🎯",
    title: "Claridad Estratégica",
    desc: "Rankings claros por categoría, red social y métricas clave para tomar decisiones informadas con confianza.",
  },
];

export default function Home() {
  return (
    <div>
      {/* ── HERO + SELECTOR DE PAÍS ───────────────────────── */}
      <section className="hero-bg relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20 pb-16">
        <NetworkCanvas className="opacity-60" dotCount={65} color="99,102,241" />

        <div
          className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)", filter: "blur(40px)" }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)", filter: "blur(40px)" }}
        />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto w-full">
          {/* Logo */}
          <div className="animate-fade-up flex justify-center mb-6">
            <div className="animate-float-slow">
              <Image
                src="/galeria/logotalk.png"
                alt="TALK Digital Insights"
                width={480}
                height={144}
                className="w-72 sm:w-[380px] md:w-[480px] h-auto drop-shadow-2xl"
                priority
              />
            </div>
          </div>

          <p className="animate-fade-up delay-200 text-slate-300 text-lg md:text-xl max-w-xl mx-auto leading-relaxed mb-10">
            Inteligencia de mercado permanente para marcas que quieren liderar el mundo digital.
          </p>

          {/* Selector de país */}
          <div className="animate-fade-up delay-300">
            <p className="text-xs font-bold tracking-widest uppercase text-slate-500 mb-6">
              Selecciona tu país
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
              {COUNTRIES.map((country) => (
                <Link
                  key={country.code}
                  href={`/${country.code}`}
                  className="glass rounded-2xl p-6 text-center hover:scale-[1.04] transition-all duration-300 group"
                  style={{ border: "1px solid rgba(255,255,255,0.09)" }}
                >
                  <div className="text-5xl mb-3">{country.flag}</div>
                  <h3 className="text-white font-black text-base mb-1">{country.name}</h3>
                  <p className="text-slate-500 text-xs mb-3">
                    {country.talks.length} Talk{country.talks.length !== 1 ? "s" : ""} disponibles
                  </p>
                  <span className="text-xs font-bold tracking-wider uppercase text-indigo-400 group-hover:text-indigo-300 transition-colors">
                    Ver rankings →
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-10">
            <Link
              href="#que-es"
              className="glass inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm text-slate-400 hover:text-white transition-all hover:bg-white/10"
            >
              Conocer más ↓
            </Link>
          </div>
        </div>
      </section>

      {/* ── QUÉ ES TALK ──────────────────────────────────── */}
      <section
        id="que-es"
        style={{ background: "linear-gradient(180deg, #0A1020 0%, #0D1535 100%)" }}
        className="py-24 px-4"
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold tracking-widest uppercase text-slate-500 mb-3">
              Sobre nosotros
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-5">
              ¿Qué es la Serie{" "}
              <span className="text-gradient">TALK</span>?
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-base leading-relaxed">
              La Serie TALK es una plataforma de inteligencia digital que monitorea y clasifica
              marcas por su presencia en redes sociales. Datos reales, actualizados mensualmente,
              por industria.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className={`glass rounded-2xl p-7 hover:scale-[1.02] transition-all duration-300 ${
                  i === 0 ? "animate-slide-left" : "animate-slide-right"
                }`}
              >
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section
        className="relative py-24 px-4 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0D1535 0%, #1a0a3d 50%, #0a1528 100%)" }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(99,102,241,0.08) 0%, transparent 70%)" }}
        />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
            ¿Listo para llevar tu marca al{" "}
            <span className="text-gradient">siguiente nivel</span>{" "}
            en 2026?
          </h2>
          <p className="text-slate-400 mb-10 text-lg">
            Accede a los rankings y descubre dónde está tu marca frente a la competencia.
          </p>
          <Link
            href="/cotizar"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-full font-bold transition-all duration-300 hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #6366F1, #EC4899)",
              color: "white",
              boxShadow: "0 0 32px rgba(99,102,241,0.4)",
            }}
          >
            Haz tu cotización
          </Link>
        </div>
      </section>
    </div>
  );
}
