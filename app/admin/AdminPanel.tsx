"use client";

import { useState } from "react";
import { TalkConfig } from "@/types";

interface Props {
  talks: TalkConfig[];
  sheetId?: string;
  isConfigured: boolean;
  revalidateToken: string;
}

export default function AdminPanel({ talks, sheetId, isConfigured, revalidateToken }: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handlePublish() {
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/revalidate", {
        method: "POST",
        headers: { "x-revalidate-token": revalidateToken },
      });
      if (res.ok) {
        setStatus("success");
        setMessage("✅ Sitio actualizado correctamente. Los cambios ya son visibles.");
      } else {
        setStatus("error");
        setMessage("❌ Error al actualizar. Verifica la configuración.");
      }
    } catch {
      setStatus("error");
      setMessage("❌ Error de conexión.");
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900">Panel de Administrador</h1>
        <p className="text-gray-500 mt-1">
          Gestiona los datos y publica actualizaciones del sitio.
        </p>
      </div>

      {/* Status badge */}
      <div
        className={`rounded-2xl p-5 mb-8 border ${
          isConfigured
            ? "bg-green-50 border-green-200"
            : "bg-amber-50 border-amber-200"
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{isConfigured ? "✅" : "⚠️"}</span>
          <div>
            <p className="font-bold text-gray-800">
              {isConfigured ? "Google Sheets configurado" : "Modo demo (sin Google Sheets)"}
            </p>
            <p className="text-sm text-gray-600 mt-0.5">
              {isConfigured
                ? "Los datos se leen en tiempo real desde Google Sheets."
                : "El sitio muestra datos de ejemplo. Configura el .env.local para conectar con Google Sheets."}
            </p>
          </div>
        </div>
      </div>


      {/* Talks list */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span>📋</span> Talks activos
        </h2>
        <div className="space-y-3">
          {talks.map((talk) => (
            <a
              key={talk.slug}
              href={`/${talk.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{talk.icon}</span>
                <div>
                  <p className="font-semibold text-gray-800">{talk.label}</p>
                  <p className="text-xs text-gray-400">{talk.description}</p>
                </div>
              </div>
              <span className="text-gray-400 text-sm group-hover:text-gray-600">Ver →</span>
            </a>
          ))}
        </div>
      </div>

      {/* How to update guide */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span>📝</span> Cómo actualizar los datos (cada mes)
        </h2>
        <ol className="space-y-3 text-sm text-gray-600">
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-500 text-xs">1</span>
            <p>
              Abre el <strong>Google Sheets</strong>.
            </p>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-500 text-xs">2</span>
            <p>
              Ve a la pestaña del Talk que quieres actualizar (ej.{" "}
              <strong>foodtalk_datos</strong>).
            </p>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-500 text-xs">3</span>
            <p>
              <strong>Borra todos los datos viejos</strong> (excepto la fila de encabezado) y pega los nuevos desde el Excel del mes actual.
            </p>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-500 text-xs">4</span>
            <p>
              Ve a la pestaña <strong>foodtalk_config</strong> y actualiza el{" "}
              <strong>mes</strong> y el texto de <strong>análisis</strong>.
            </p>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-500 text-xs">5</span>
            <p>
              Vuelve aquí y presiona <strong>Publicar cambios</strong>.
            </p>
          </li>
        </ol>
      </div>

      {/* Publish button */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
          <span>🚀</span> Publicar cambios
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Esto actualiza el sitio con los datos más recientes del Google Sheets.
        </p>
        <button
          onClick={handlePublish}
          disabled={status === "loading"}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gray-900 text-white font-bold px-8 py-3 rounded-xl hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          {status === "loading" ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Publicando…
            </>
          ) : (
            "🚀 Publicar cambios"
          )}
        </button>
        {message && (
          <p className="mt-3 text-sm font-medium text-gray-700">{message}</p>
        )}
      </div>
    </div>
  );
}
