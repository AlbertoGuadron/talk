import { ProfileData, PostData, TalkDashboardData, TalkMeta, ChartDataPoint } from "@/types";
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
      imageLink: String(row[14] || "").trim(), // col O
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
      imageLink: String(row[13] || "").trim(), // col N
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
      imageLink: String(row[12] || "").trim(), // col M
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
      imageLink: String(row[13] || "").trim(), // col N
    });
  }
  return profiles;
}

// ── Column mapping per talk for posts ────────────────────────────────────────
type PostColMap = { date: number; msg: number; cat: number; profile: number; network: number; engagement: number; link: number; img: number };

const POST_COLS: Record<TalkSlug, PostColMap> = {
  foodtalk:   { date: 0, msg: 1, cat: 2,  profile: 3,  network: 4, engagement: 8, link: 12, img: 14 },
  housetalk:  { date: 0, msg: 1, cat: -1, profile: 2,  network: 3, engagement: 7, link: 12, img: 14 },
  markettalk: { date: 0, msg: 1, cat: 2,  profile: 3,  network: 4, engagement: 5, link: 11, img: 13 },
  retailtalk: { date: 0, msg: 1, cat: 2,  profile: 3,  network: 4, engagement: 8, link: 12, img: 14 },
};

export function parsePostsData(rows: unknown[][], slug: TalkSlug): PostData[] {
  if (rows.length < 2) return [];
  const c = POST_COLS[slug];
  const posts: PostData[] = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const profile = c.profile >= 0 ? String(row[c.profile] || "").trim() : "";
    if (!profile) continue;
    posts.push({
      date: String(row[c.date] || "").trim(),
      message: String(row[c.msg] || "").trim(),
      categoria: c.cat >= 0 ? String(row[c.cat] || "").trim().replace(/\s+/g, " ").toUpperCase() : "",
      profile,
      network: String(row[c.network] || "").toUpperCase().trim(),
      engagement: parseNumber(row[c.engagement]),
      link: String(row[c.link] || "").trim(),
      imageLink: String(row[c.img] || "").trim(),
    });
  }
  const withEngagement = posts.filter(p => p.engagement > 0);

  // Top 10 per (network × category) so every combination is covered
  const groups: Record<string, PostData[]> = {};
  for (const p of withEngagement) {
    const key = `${p.network}|${p.categoria || "__none__"}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(p);
  }
  const seen = new Set<string>();
  const result: PostData[] = [];
  for (const grp of Object.values(groups)) {
    for (const p of grp.sort((a, b) => b.engagement - a.engagement).slice(0, 10)) {
      const id = p.link || `${p.profile}|${p.date}|${p.engagement}`;
      if (!seen.has(id)) { seen.add(id); result.push(p); }
    }
  }
  return result.sort((a, b) => b.engagement - a.engagement);
}

export function buildDashboardData(
  slug: TalkSlug,
  profiles: ProfileData[],
  meta: TalkMeta,
  posts: PostData[] = []
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
    .map((p) => ({ name: p.profile, value: p.engagement, network: p.network, fill: color, imageLink: p.imageLink }));

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
    topPosts: posts,
    stats,
  };
}
