import Link from "next/link";
import Image from "next/image";
import { TALKS } from "@/lib/talks-config";
import NetworkCanvas from "@/components/NetworkCanvas";
import TalkCard from "@/components/ui/TalkCard";

const STATS = [
  { label: "Talks activos", value: "4+", icon: "📊" },
  { label: "Disponible", value: "24/7", icon: "⚡" },
  { label: "Actualización", value: "Mensual", icon: "🔄" },
];

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
      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="hero-bg relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20">
        <NetworkCanvas className="opacity-60" dotCount={65} color="99,102,241" />

        {/* Decorative orbs */}
        <div
          className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          {/* Main logo */}
          <div className="animate-fade-up flex justify-center mb-6">
            <div className="animate-float-slow">
              <Image
                src="/galeria/logotalk.png"
                alt="TALK Digital Insights"
                width={480}
                height={144}
                className="w-80 sm:w-[420px] md:w-[560px] h-auto drop-shadow-2xl"
                priority
              />
            </div>
          </div>

          {/* Subtitle */}
          <p
            className="animate-fade-up delay-200 text-slate-300 text-lg md:text-xl max-w-xl mx-auto leading-relaxed mb-4"
          >
            Inteligencia de mercado permanente para marcas que quieren liderar el mundo digital.
          </p>

          {/* Stats badges */}
          <div className="animate-fade-up delay-300 flex flex-wrap gap-3 justify-center mt-8 mb-10">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="glass rounded-full px-5 py-2.5 flex items-center gap-2.5"
              >
                <span className="text-lg">{s.icon}</span>
                <div className="text-left">
                  <p className="text-xs text-slate-400 leading-none">{s.label}</p>
                  <p className="text-sm font-bold text-white leading-tight">{s.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="animate-fade-up delay-400 flex flex-wrap gap-3 justify-center">
            <Link
              href="/foodtalk"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-bold text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg"
              style={{
                background: "linear-gradient(135deg, #6366F1, #EC4899)",
                color: "white",
                boxShadow: "0 0 24px rgba(99,102,241,0.4)",
              }}
            >
              Ver Rankings →
            </Link>
            <Link
              href="#que-es"
              className="glass inline-flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-sm text-slate-200 hover:text-white transition-all duration-200 hover:bg-white/10"
            >
              Conocer más
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-9 border-2 border-white/20 rounded-full flex items-start justify-center p-1.5">
            <div className="w-1 h-2 bg-white/40 rounded-full animate-float" />
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

      {/* ── TALKS GRID ───────────────────────────────────── */}
      <section
        className="section-dark relative py-24 px-4 overflow-hidden"
      >
        <NetworkCanvas className="opacity-30" dotCount={40} color="6,182,212" />

        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold tracking-widest uppercase text-slate-500 mb-3">
              Nuestra cobertura
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Market Research{" "}
              <span className="text-gradient">Permanente</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm">
              Cada Talk es un estudio de mercado continuo para una industria específica.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {TALKS.map((talk, i) => (
              <TalkCard key={talk.slug} talk={talk} delay={(i + 1) * 100} />
            ))}
          </div>

        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section
        className="relative py-24 px-4 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0D1535 0%, #1a0a3d 50%, #0a1528 100%)",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 50% 50%, rgba(99,102,241,0.08) 0%, transparent 70%)",
          }}
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
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/foodtalk"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-full font-bold transition-all duration-300 hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #6366F1, #EC4899)",
                color: "white",
                boxShadow: "0 0 32px rgba(99,102,241,0.4)",
              }}
            >
              Explorar Rankings
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
