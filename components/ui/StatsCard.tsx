interface Props {
  label: string;
  value: string;
  icon: string;
  color: string;
  colorLight: string;
}

export default function StatsCard({ label, value, icon, color }: Props) {
  return (
    <div
      className="glass rounded-2xl p-5 flex items-center gap-4 hover:scale-[1.02] transition-all duration-300 animate-fade-up"
      style={{ border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
        style={{ background: `${color}18`, border: `1px solid ${color}30` }}
      >
        {icon}
      </div>
      <div>
        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">
          {label}
        </p>
        <p className="text-2xl font-black mt-0.5" style={{ color }}>
          {value}
        </p>
      </div>
    </div>
  );
}
