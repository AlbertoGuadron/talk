interface Props {
  text: string;
  color: string;
  label?: string;
}

export default function AnalisisBox({ text, color, label = "Análisis" }: Props) {
  if (!text) return null;

  return (
    <div
      className="glass rounded-2xl px-6 py-5 mb-8"
      style={{
        border: `1px solid ${color}30`,
        background: `linear-gradient(135deg, ${color}08 0%, transparent 100%)`,
      }}
    >
      <p
        className="text-xs font-bold uppercase tracking-widest mb-2"
        style={{ color }}
      >
        {label}
      </p>
      <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
        {text}
      </p>
    </div>
  );
}
