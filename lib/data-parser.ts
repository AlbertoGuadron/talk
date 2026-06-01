import { ProfileData, TalkDashboardData, TalkMeta, ChartDataPoint } from "@/types";
import { NETWORK_COLORS, TALK_COLORS } from "./talks-config";
import type { TalkSlug } from "@/types";

function parseNumber(val: unknown): number {
  if (val === null || val === undefined || val === "-" || val === "") return 0;
  if (typeof val === "number") return val;
  const str = String(val).replace(/[$,%\s]/g, "");
  const num = parseFloat(str);
  return isNaN(num) ? 0 : num;
}

function toTitleCase(str: string): string {
  return str
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function parseFoodtalkData(rows: unknown[][]): ProfileData[] {
  const profiles: ProfileData[] = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row[1] || String(row[1]).trim() === "") continue;
    profiles.push({
      categoria: String(row[0] || "SIN CATEGORÍA").trim().replace(/\s+/g, " ").toUpperCase(),
      profile: String(row[1]).trim(),
      network: String(row[2] || "").toUpperCase().trim(),
      seguidores: parseNumber(row[3]),
      publicaciones: parseNumber(row[4]),
      comentarios: parseNumber(row[5]),
      likes: parseNumber(row[6]),
      compartidos: parseNumber(row[7]),
      engagement: parseNumber(row[8]),
      impresiones: parseNumber(row[9]),
      crecimientoSeguidores: parseNumber(row[10]),
    });
  }
  return profiles;
}

export function parseHousetalkData(rows: unknown[][]): ProfileData[] {
  const profiles: ProfileData[] = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row[0] || String(row[0]).trim() === "") continue;
    profiles.push({
      categoria: "INMOBILIARIA",
      profile: String(row[0]).trim(),
      network: String(row[1] || "").toUpperCase().trim(),
      seguidores: parseNumber(row[2]),
      publicaciones: parseNumber(row[3]),
      likes: parseNumber(row[4]),
      comentarios: parseNumber(row[5]),
      compartidos: parseNumber(row[6]),
      engagement: parseNumber(row[7]),
      impresiones: parseNumber(row[8]),
      valorPublicitario: parseNumber(row[9]),
    });
  }
  return profiles;
}

export function parseMarkettalkData(rows: unknown[][]): ProfileData[] {
  const profiles: ProfileData[] = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row[1] || String(row[1]).trim() === "") continue;
    profiles.push({
      categoria: String(row[0] || "SIN CATEGORÍA").trim().replace(/\s+/g, " ").toUpperCase(),
      profile: String(row[1]).trim(),
      network: String(row[2] || "").toUpperCase().trim(),
      seguidores: parseNumber(row[3]),
      publicaciones: parseNumber(row[4]),
      likes: parseNumber(row[5]),
      comentarios: parseNumber(row[6]),
      compartidos: parseNumber(row[7]),
      engagement: parseNumber(row[8]),
      impresiones: 0,
    });
  }
  return profiles;
}

function buildNetworkSum(
  profiles: ProfileData[],
  field: "publicaciones" | "likes" | "seguidores" | "engagement"
): ChartDataPoint[] {
  const map: Record<string, number> = {};
  for (const p of profiles) {
    const net = p.network || "OTRO";
    map[net] = (map[net] || 0) + p[field];
  }
  return Object.entries(map)
    .filter(([, v]) => v > 0)
    .sort(([, a], [, b]) => b - a)
    .map(([name, value]) => ({
      name,
      value,
      fill: NETWORK_COLORS[name] || NETWORK_COLORS.OTHER,
    }));
}

function buildCategoriaSum(
  profiles: ProfileData[],
  field: "publicaciones" | "likes" | "seguidores" | "engagement",
  color: string
): ChartDataPoint[] {
  const map: Record<string, number> = {};
  for (const p of profiles) {
    const cat = toTitleCase(p.categoria);
    map[cat] = (map[cat] || 0) + p[field];
  }
  return Object.entries(map)
    .filter(([, v]) => v > 0)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 12)
    .map(([name, value]) => ({ name, value, fill: color }));
}

export function parseRetailtalkData(rows: unknown[][]): ProfileData[] {
  const profiles: ProfileData[] = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row[1] || String(row[1]).trim() === "") continue;
    profiles.push({
      categoria: String(row[0] || "SIN CATEGORÍA").trim().replace(/\s+/g, " ").toUpperCase(),
      profile: String(row[1]).trim(),
      network: String(row[2] || "").toUpperCase().trim(),
      seguidores: parseNumber(row[3]),
      publicaciones: parseNumber(row[4]),
      likes: parseNumber(row[5]),
      comentarios: parseNumber(row[6]),
      compartidos: parseNumber(row[7]),
      engagement: parseNumber(row[8]),
      impresiones: 0,
    });
  }
  return profiles;
}

export function buildDashboardData(
  slug: TalkSlug,
  profiles: ProfileData[],
  meta: TalkMeta
): TalkDashboardData {
  const color = TALK_COLORS[slug];
  const hasCategoria = slug === "foodtalk" || slug === "markettalk" || slug === "retailtalk";

  const topPublicaciones: ChartDataPoint[] = profiles
    .filter((p) => p.publicaciones > 0)
    .sort((a, b) => b.publicaciones - a.publicaciones)
    .slice(0, 10)
    .map((p) => ({ name: p.profile, value: p.publicaciones, network: p.network, fill: color }));

  const topReacciones: ChartDataPoint[] = profiles
    .filter((p) => p.engagement > 0)
    .sort((a, b) => b.engagement - a.engagement)
    .slice(0, 10)
    .map((p) => ({ name: p.profile, value: p.engagement, network: p.network, fill: color }));

  const topSeguidores: ChartDataPoint[] = profiles
    .filter((p) => p.seguidores > 0)
    .sort((a, b) => b.seguidores - a.seguidores)
    .slice(0, 10)
    .map((p) => ({ name: p.profile, value: p.seguidores, network: p.network, fill: color }));

  const porRedPublicaciones = buildNetworkSum(profiles, "publicaciones");
  const porRedReacciones = buildNetworkSum(profiles, "engagement");
  const porRedSeguidores = buildNetworkSum(profiles, "seguidores");

  const porCategoriaPublicaciones = hasCategoria
    ? buildCategoriaSum(profiles, "publicaciones", color)
    : undefined;
  const porCategoriaReacciones = hasCategoria
    ? buildCategoriaSum(profiles, "engagement", color)
    : undefined;
  const porCategoriaSeguidores = hasCategoria
    ? buildCategoriaSum(profiles, "seguidores", color)
    : undefined;

  const stats = {
    totalPerfiles: profiles.length,
    totalSeguidores: profiles.reduce((s, p) => s + p.seguidores, 0),
    totalPublicaciones: profiles.reduce((s, p) => s + p.publicaciones, 0),
    totalReacciones: profiles.reduce((s, p) => s + p.engagement, 0),
  };

  return {
    meta,
    profiles,
    topPublicaciones,
    topReacciones,
    topSeguidores,
    porRedPublicaciones,
    porRedReacciones,
    porRedSeguidores,
    porCategoriaPublicaciones,
    porCategoriaReacciones,
    porCategoriaSeguidores,
    stats,
  };
}
