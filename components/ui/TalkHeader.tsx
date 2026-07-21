import Image from "next/image";
import { TalkConfig, TalkMeta } from "@/types";
import { TALK_LOGOS } from "@/lib/talks-config";
import NetworkCanvas from "@/components/NetworkCanvas";

interface Props {
  config: TalkConfig;
  meta: TalkMeta;
}

export default function TalkHeader({ config, meta }: Props) {
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
          <div className="flex-shrink-0">
            <Image
              src={TALK_LOGOS[config.slug]}
              alt={config.label}
              width={280}
              height={84}
              className="h-24 md:h-28 w-auto object-contain drop-shadow-xl"
            />
          </div>

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
              <span className="text-xs text-slate-500">Ranking mensual</span>
              <a
                href="#metodologia"
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors underline underline-offset-2"
              >
                Ver metodología
              </a>
            </div>
            <p className="text-slate-400 text-sm">{meta.subtitulo}</p>
          </div>
        </div>
      </div>

      <div className={`h-1 w-full bg-gradient-to-r ${config.bgGradient}`} />
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
