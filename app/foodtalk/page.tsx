"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";

/* =======================
   TIPOS
======================= */
type Top10Item = {
  rank: number;
  brand: string;
  reactions: number;
  sharePct: number;
};

type CategoryItem = {
  category: string;
  reactions: number;
  sharePct: number;
};

type CategoryLeaders = {
  category: string;
  leaders: { brand: string; reactions: number }[];
};

/* =======================
   HELPERS
======================= */
function n(v: unknown): number {
  const num = Number(String(v ?? "").replace(/,/g, "").trim());
  return Number.isFinite(num) ? num : 0;
}

function s(v: unknown): string {
  return String(v ?? "").trim();
}

function formatPeriodoFromA2(value: unknown) {
  return String(value ?? "").trim() || "—";
}

// Función para obtener emoji según posición
function getRankEmoji(rank: number): string {
  const emojis: Record<number, string> = {
    1: "🥇",
    2: "🥈",
    3: "🥉",
  };
  return emojis[rank] || "🏆";
}

// Función para obtener emoji según categoría
function getCategoryEmoji(category: string): string {
  const lower = category.toLowerCase();
  if (lower.includes("hambur") || lower.includes("burger")) return "🍔";
  if (lower.includes("pizza")) return "🍕";
  if (lower.includes("pollo") || lower.includes("chicken")) return "🍗";
  if (lower.includes("cafes") || lower.includes("coffee")) return "☕";
  if (lower.includes("helado") || lower.includes("ice cream")) return "🍦";
  if (lower.includes("donut") || lower.includes("dona")) return "🍩";
  if (lower.includes("taco")) return "🌮";
  if (lower.includes("sushi")) return "🍣";
  if (lower.includes("italiano")) return "🍝";
  if (lower.includes("pan") || lower.includes("bakery")) return "🥖";
  if (lower.includes("bebida") || lower.includes("drink")) return "🥤";
  if (lower.includes("desayuno") || lower.includes("breakfast")) return "🥞";
  if (lower.includes("hot dog") || lower.includes("hot dog")) return "🌭";
  if (lower.includes("mariscos") || lower.includes("marisco")) return "🍤";
  if (lower.includes("Alitas") || lower.includes("alitas")) return "🐥";
  if (lower.includes("Pupusas") || lower.includes("pupusas")) return "🫓";
  if (lower.includes("Bares") || lower.includes("bar")) return "🍻🍸";
  if (lower.includes("Postres") || lower.includes("postres")) return "🍰";
  if (lower.includes("gourmet") || lower.includes("gourmet")) return "🤵🏻‍♂️";
  if (lower.includes("Asiatico") || lower.includes("asiatico")) return "🥡";
  return "🍽️";
}

/* =======================
   COMPONENTE
======================= */
export default function FoodTalkPage() {
  const [periodo, setPeriodo] = useState("—");
  const [top10, setTop10] = useState<Top10Item[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [leadersByCategory, setLeadersByCategory] = useState<CategoryLeaders[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [animateCards, setAnimateCards] = useState(false);

  /* =======================
     CONFIG GOOGLE SHEETS
  ======================= */
  const apiKey = "AIzaSyDgnyxSHZN5RHpYuPBqAVFYYYyIg7kkCwY";
  const spreadsheetId = "1XpulEjXQ-1McYOmthFxjeBkMBAgDOyprdJdd42w-GEg";
  const sheetName = "Foodtalk";

  const ranges = useMemo(
    () => [
      `${sheetName}!A2`,
      `${sheetName}!A5:C15`,
      `${sheetName}!A19:B35`,
      `${sheetName}!A38:B117`,
    ],
    [sheetName]
  );

  useEffect(() => {
    fetchSheetData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (top10.length > 0 || categories.length > 0) {
      setAnimateCards(true);
    }
  }, [top10, categories]);

  /* =======================
     FETCH SHEET
  ======================= */
  const fetchSheetData = async () => {
    try {
      setLoading(true);
      setError("");
      setAnimateCards(false);

      const url =
        `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(
          spreadsheetId
        )}/values:batchGet` +
        `?key=${encodeURIComponent(apiKey)}` +
        `&valueRenderOption=FORMATTED_VALUE` +
        `&ranges=${ranges.map(encodeURIComponent).join("&ranges=")}`;

      const res = await fetch(url, { cache: "no-store" });

      if (!res.ok) {
        const errText = await res.text();
        console.error("Sheets error:", errText);
        throw new Error("Error Google Sheets");
      }

      const json: {
        valueRanges?: { values?: unknown[][] }[];
      } = await res.json();

      const vr = json.valueRanges ?? [];
      const getValues = (i: number) => vr[i]?.values ?? [];

      /* ===== PERÍODO ===== */
      setPeriodo(formatPeriodoFromA2(getValues(0)?.[0]?.[0]));

      /* ===== TOP 10 ===== */
      const top10Rows = getValues(1).slice(1);

      const baseTop10 = top10Rows
        .map((r) => ({
          rank: n(r?.[0]),
          brand: s(r?.[1]),
          reactions: n(r?.[2]),
        }))
        .filter((x) => x.rank && x.brand);

      const totalTop10 = baseTop10.reduce((a, b) => a + b.reactions, 0) || 1;

      setTop10(
        baseTop10
          .sort((a, b) => a.rank - b.rank)
          .map((x) => ({
            ...x,
            sharePct: (x.reactions / totalTop10) * 100,
          }))
      );

      /* ===== CATEGORÍAS ===== */
      const catRows = getValues(2).slice(1);

      const baseCats = catRows
        .map((r) => ({
          category: s(r?.[0]),
          reactions: n(r?.[1]),
        }))
        .filter((x) => x.category);

      const totalCats = baseCats.reduce((a, b) => a + b.reactions, 0) || 1;

      setCategories(
        baseCats
          .sort((a, b) => b.reactions - a.reactions)
          .map((x) => ({
            ...x,
            sharePct: (x.reactions / totalCats) * 100,
          }))
      );

      /* ===== LÍDERES POR CATEGORÍA ===== */
      const leadersBlock = getValues(3);
      const out: CategoryLeaders[] = [];

      let i = 0;
      while (i < leadersBlock.length) {
        const title = s(leadersBlock[i]?.[0]);
        const value = leadersBlock[i]?.[1];

        // ❌ Ignorar títulos generales o filas basura
        if (
            !title ||
            value ||
            title.toUpperCase().includes("LIDERES")
        ) {
            i++;
            continue;
        }

        const category = title;
        const leaders: { brand: string; reactions: number }[] = [];


        let j = i + 1;
        while (j < leadersBlock.length) {
          const brand = s(leadersBlock[j]?.[0]);
          const rx = leadersBlock[j]?.[1];

          if (!brand || !rx) break;

          leaders.push({ brand, reactions: n(rx) });
          j++;
        }

        out.push({ category, leaders: leaders.slice(0, 3) });
        i = j;
      }

      setLeadersByCategory(out);
    } catch (e) {
      console.error(e);
      setError("No se pudo cargar tu Google Sheet.");
    } finally {
      setLoading(false);
    }
  };

  /* =======================
     UI
  ======================= */
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <Header />

      <main className="flex-grow">
        {/* HEADER */}
        <section className="py-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-100 to-purple-100 opacity-50"></div>
          <div className="container mx-auto px-4 text-center space-y-4 relative z-10">
            <div className="inline-block animate-bounce">
              <span className="text-6xl">🍔</span>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              FoodTalk 🍕
            </h1>
            <p className="text-gray-700 text-lg">
              📊 Período de estudio:{" "}
              <span className="font-semibold capitalize bg-white px-4 py-2 rounded-full shadow-sm">
                {periodo}
              </span>
            </p>

            <button
              onClick={fetchSheetData}
              disabled={loading}
              className="mt-4 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg disabled:opacity-50 transform transition-all hover:scale-105 active:scale-95"
            >
              {loading ? (
                <>
                  <span className="inline-block animate-spin mr-2">⏳</span>
                  Cargando...
                </>
              ) : (
                <>
                  🔄 Actualizar datos
                </>
              )}
            </button>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-4 py-2 rounded-lg inline-block">
                ❌ {error}
              </p>
            )}
          </div>
        </section>

        {/* TOP 10 */}
        <section className="py-12 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                🏆 Top 10 Marcas
              </h2>
              <p className="text-gray-600">Las marcas más populares del período</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {top10.map((x, idx) => (
                <div
                  key={x.rank}
                  className={`bg-white p-6 rounded-2xl shadow-lg border-2 border-transparent hover:border-purple-300 transform transition-all duration-500 hover:scale-105 hover:shadow-2xl ${
                    animateCards ? "animate-fadeInUp" : "opacity-0"
                  }`}
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{getRankEmoji(x.rank)}</span>
                      <div>
                        <div className="text-sm text-gray-500 font-medium">
                          Posición #{x.rank}
                        </div>
                        <div className="font-bold text-xl text-gray-800">
                          {x.brand}
                        </div>
                        <div className="text-sm text-gray-600 flex items-center gap-1">
                          <span>❤️</span>
                          {x.reactions.toLocaleString()} reacciones
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        {x.sharePct.toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-500">del total</div>
                    </div>
                  </div>

                  <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: animateCards ? `${x.sharePct}%` : "0%",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CATEGORÍAS */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                🍽️ Top Categorías
              </h2>
              <p className="text-gray-600">
                Descubre qué tipos de comida generan más engagement
              </p>
            </div>

            <div className="space-y-4 max-w-4xl mx-auto">
              {categories.map((c, idx) => (
                <div
                  key={c.category}
                  className={`bg-gradient-to-r from-white to-gray-50 p-5 rounded-2xl shadow-md hover:shadow-xl border border-gray-200 transform transition-all duration-500 hover:scale-102 ${
                    animateCards ? "animate-fadeInLeft" : "opacity-0"
                  }`}
                  style={{ animationDelay: `${idx * 80}ms` }}
                >
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{getCategoryEmoji(c.category)}</span>
                      <span className="font-bold text-lg text-gray-800">
                        {c.category}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-purple-600 text-lg">
                        {c.sharePct.toFixed(1)}%
                      </span>
                      <span className="text-sm text-gray-500 ml-2">
                        ({c.reactions.toLocaleString()})
                      </span>
                    </div>
                  </div>

                  <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-pink-500 via-pink-400 to-purple-500 rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: animateCards ? `${c.sharePct}%` : "0%",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* LÍDERES */}
        <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                👑 Líderes por Categoría
              </h2>
              <p className="text-gray-600">
                Las marcas que dominan cada segmento
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {leadersByCategory.map((b, idx) => (
                <div
                  key={b.category}
                  className={`bg-white p-6 rounded-2xl shadow-lg border-2 border-gray-100 hover:border-purple-300 transform transition-all duration-500 hover:scale-105 ${
                    animateCards ? "animate-fadeInUp" : "opacity-0"
                  }`}
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-purple-100">
                    <span className="text-2xl">{getCategoryEmoji(b.category)}</span>
                    <div className="font-bold text-lg text-gray-800">
                      {b.category}
                    </div>
                  </div>
                  <div className="space-y-3">
                    {b.leaders.map((l, i) => (
                      <div
                        key={l.brand}
                        className="flex justify-between items-center p-3 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-purple-600">
                            {getRankEmoji(i + 1)}
                          </span>
                          <span className="font-medium text-gray-700">
                            {l.brand}
                          </span>
                        </div>
                        <span className="font-bold text-purple-600 bg-white px-3 py-1 rounded-full text-sm">
                          {l.reactions.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .animate-fadeInLeft {
          animation: fadeInLeft 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}