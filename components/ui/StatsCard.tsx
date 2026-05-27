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
      className="glass rounded-2xl p-4 hover:scale-[1.02] transition-all duration-300 animate-fade-up"
      style={{ border: "1px solid rgba(255,255,255,0.07)" }}
    >
      {/* Mobile: vertical stack — Desktop: horizontal */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
          style={{ background: `${color}18`, border: `1px solid ${color}30` }}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-[10px] text-slate-500 font-semibold uppercase leading-snug">
            {label}
          </p>
          <p className="text-2xl font-black mt-0.5 leading-none" style={{ color }}>
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}
