import Image from "next/image";
import { TalkConfig, TalkMeta } from "@/types";
import { TALK_LOGOS } from "@/lib/talks-config";
import NetworkCanvas from "@/components/NetworkCanvas";

interface Props {
  config: TalkConfig;
  meta: TalkMeta;
}

export default function TalkHeader({ config, meta }: Props) {
  const [c1, c2] = config.bgGradient
    .replace("from-", "").replace("to-", "").replace("via-", "")
    .split(" ").filter((s) => s.startsWith("["))
    .map((s) => s.replace(/[\[\]]/g, ""));

  return (
    <div
      className="relative rounded-3xl overflow-hidden mb-8"
      style={{
        background: `linear-gradient(135deg, #0A1020 0%, #0D1535 100%)`,
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <NetworkCanvas
        className="opacity-40"
        dotCount={40}
        color={hexToRgb(config.color)}
      />

      {/* Glow blob */}
      <div
        className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${config.color}22 0%, transparent 70%)`,
          filter: "blur(30px)",
          transform: "translate(30%, -30%)",
        }}
      />

      <div className="relative z-10 p-8 md:p-10">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Image
              src={TALK_LOGOS[config.slug]}
              alt={config.label}
              width={280}
              height={84}
              className="h-24 md:h-28 w-auto object-contain drop-shadow-xl"
            />
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap mb-2">
              <span
                className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest"
                style={{
                  background: `${config.color}22`,
                  color: config.color,
                  border: `1px solid ${config.color}44`,
                }}
              >
                {meta.mes}
              </span>
              <span className="text-xs text-slate-500">Ranking mensuak</span>
            </div>
            <p className="text-slate-400 text-sm mb-0">{meta.subtitulo}</p>
          </div>
        </div>

        {/* Analysis */}
        {meta.analisis && (
          <div
            className="mt-6 pt-6 border-t text-sm leading-relaxed text-slate-300"
            style={{ borderColor: "rgba(255,255,255,0.08)" }}
          >
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: config.color }}>
              Análisis del mes
            </p>
            <p>{meta.analisis}</p>
          </div>
        )}
      </div>

      {/* Bottom color line */}
      <div
        className={`h-1 w-full bg-gradient-to-r ${config.bgGradient}`}
      />
    </div>
  );
}

function hexToRgb(hex: string): string {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `${r},${g},${b}`;
}
