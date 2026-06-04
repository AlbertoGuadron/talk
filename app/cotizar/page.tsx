"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const PAISES = [
  "El Salvador", "Guatemala", "Honduras", "Nicaragua", "Costa Rica", "Panamá",
  "México", "Colombia", "Venezuela", "Perú", "Ecuador", "Bolivia",
  "Chile", "Argentina", "Uruguay", "Paraguay", "España", "Estados Unidos", "Otro",
];

type Status = "idle" | "loading" | "success" | "error";

export default function CotizarPage() {
  const [form, setForm] = useState({
    nombre: "", empresa: "", cargo: "", telefono: "", pais: "", mensaje: "",
  });
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/cotizar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("success");
        setForm({ nombre: "", empresa: "", cargo: "", telefono: "", pais: "", mensaje: "" });
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data.error ?? "Error al enviar. Intenta de nuevo.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Error de conexión. Intenta de nuevo.");
      setStatus("error");
    }
  };

  const inputClass = `
    w-full rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none
    transition-all duration-200 focus:ring-2
    bg-white/5 border border-white/10 focus:border-pink-500/50 focus:ring-pink-500/20
  `;

  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(135deg, #060B1F 0%, #0D1535 100%)" }}
    >
      {/* Simple header */}
      <header
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: "rgba(6,11,31,0.85)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/">
            <Image src="/galeria/logotalk.png" alt="TALK" width={160} height={48} className="h-16 w-auto" />
          </Link>
          <Link
            href="/"
            className="text-slate-400 hover:text-white text-sm font-medium transition-colors"
          >
            ← Volver al inicio
          </Link>
        </div>
      </header>

      <div className="pt-32 pb-20 px-4 max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <span
            className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
            style={{ background: "rgba(255,20,147,0.15)", color: "#FF1493", border: "1px solid rgba(255,20,147,0.3)" }}
          >
            Cotízanos
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-3">
            Solicita tu cotización
          </h1>
          <p className="text-slate-400 text-base">
            Completa el formulario y nos pondremos en contacto contigo a la brevedad.
          </p>
        </div>

        {/* Form card */}
        <div
          className="rounded-2xl p-6 sm:p-8"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(12px)",
          }}
        >
          {status === "success" ? (
            <div className="text-center py-10">
              <div className="text-5xl mb-4">✅</div>
              <h2 className="text-xl font-black text-white mb-2">¡Mensaje enviado!</h2>
              <p className="text-slate-400 text-sm mb-6">
                Hemos recibido tu solicitud. Te contactaremos pronto.
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="px-6 py-2.5 rounded-full text-sm font-bold text-white transition-all"
                style={{ background: "linear-gradient(135deg,#FF1493,#00B4D8)" }}
              >
                Enviar otra solicitud
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Row 1: Nombre + Empresa */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">
                    Nombre completo *
                  </label>
                  <input
                    type="text" name="nombre" required
                    value={form.nombre} onChange={handleChange}
                    placeholder="Juan Pérez"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">
                    Empresa *
                  </label>
                  <input
                    type="text" name="empresa" required
                    value={form.empresa} onChange={handleChange}
                    placeholder="Mi Empresa S.A."
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Row 2: Cargo + Teléfono */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">
                    Cargo *
                  </label>
                  <input
                    type="text" name="cargo" required
                    value={form.cargo} onChange={handleChange}
                    placeholder="Gerente de Marketing"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">
                    Teléfono *
                  </label>
                  <input
                    type="tel" name="telefono" required
                    value={form.telefono} onChange={handleChange}
                    placeholder="+503 7000 0000"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Row 3: País */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">
                  País *
                </label>
                <select
                  name="pais" required
                  value={form.pais} onChange={handleChange}
                  className={inputClass}
                  style={{ appearance: "none" }}
                >
                  <option value="" disabled>Selecciona tu país</option>
                  {PAISES.map((p) => (
                    <option key={p} value={p} style={{ background: "#0D1535" }}>{p}</option>
                  ))}
                </select>
              </div>

              {/* Row 4: Mensaje */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">
                  Mensaje *
                </label>
                <textarea
                  name="mensaje" required rows={4}
                  value={form.mensaje} onChange={handleChange}
                  placeholder="Cuéntanos en qué podemos ayudarte..."
                  className={inputClass}
                  style={{ resize: "vertical" }}
                />
              </div>

              {/* Error */}
              {status === "error" && (
                <p className="text-sm text-red-400 font-medium">❌ {errorMsg}</p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full py-3.5 rounded-xl text-white font-black text-sm tracking-wide transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: "linear-gradient(135deg,#FF1493,#00B4D8)" }}
              >
                {status === "loading" ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Enviando…
                  </span>
                ) : (
                  "Enviar solicitud →"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
