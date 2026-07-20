import { notFound } from "next/navigation";
import Link from "next/link";
import { getCountryInfo, getCountryTalks } from "@/lib/countries-config";
import { TALK_LOGOS } from "@/lib/talks-config";
import NetworkCanvas from "@/components/NetworkCanvas";

interface Props {
  params: Promise<{ pais: string }>;
}

export default async function CountryPage({ params }: Props) {
  const { pais } = await params;
  const country = getCountryInfo(pais);
  if (!country) notFound();

  const talks = getCountryTalks(pais);

  return (
    <div>
      <section className="hero-bg relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20">
        <NetworkCanvas className="opacity-40" dotCount={50} color="99,102,241" />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="mb-4 text-6xl">{country.flag}</div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3">
            {country.name}
          </h1>
          <p className="text-slate-400 text-lg mb-12">
            Inteligencia de mercado permanente para el mercado digital de {country.name}.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
            {talks.map((talk) => (
              <Link
                key={talk.slug}
                href={`/${pais}/${talk.slug}`}
                className="glass rounded-2xl p-6 text-left hover:scale-[1.03] transition-all duration-300 group"
                style={{ border: `1px solid ${talk.color}30` }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{talk.icon}</span>
                  <div
                    className="w-8 h-1 rounded-full"
                    style={{ background: talk.color }}
                  />
                </div>
                <h2 className="text-white font-black text-xl mb-1">{talk.label}</h2>
                <p className="text-slate-500 text-sm leading-relaxed">{talk.description}</p>
                <div
                  className="mt-4 text-xs font-bold tracking-wider uppercase group-hover:translate-x-1 transition-transform"
                  style={{ color: talk.color }}
                >
                  Ver ranking →
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12">
            <Link
              href="/"
              className="text-slate-500 text-sm hover:text-slate-300 transition-colors"
            >
              ← Cambiar país
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
