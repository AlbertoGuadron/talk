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

// ── Parsers for El Salvador — moneytalk & tourismtalk ────────────────────────

// SV moneytalk: same column order as markettalk/retailtalk (SV category-based format)
export function parseSvMoneyTalkData(rows: unknown[][]): ProfileData[] {
  // Columns: 0=Categoria 1=Profile 2=Network 3=Seguidores 4=Publicaciones
  //          5=Likes 6=Comentarios 7=Engagement(total) 8=ProfileID 9=Link 10=ExtLink 11=ImageLink
  const profiles: ProfileData[] = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row[1] || String(row[1]).trim() === "") continue;
    const likes = parseNumber(row[5]);
    const comentarios = parseNumber(row[6]);
    const engagement = parseNumber(row[7]);
    profiles.push({
      categoria: String(row[0] || "SIN CATEGORÍA").trim().replace(/\s+/g, " ").toUpperCase(),
      profile: String(row[1]).trim(),
      network: String(row[2] || "").toUpperCase().trim(),
      seguidores: parseNumber(row[3]),
      publicaciones: parseNumber(row[4]),
      likes,
      comentarios,
      compartidos: Math.max(0, engagement - likes - comentarios),
      engagement,
      impresiones: 0,
      imageLink: String(row[11] || "").trim(),
    });
  }
  return profiles;
}

// SV tourismtalk: no categories column
// Columns: 0=Profile 1=Network 2=Seguidores 3=Publicaciones 4=Likes 5=Comentarios
//          6=Engagement(total) 7=ProfileID 8=Link 9=ExtLink 10=ImageLink
export function parseSvTourismtalkData(rows: unknown[][]): ProfileData[] {
  const profiles: ProfileData[] = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row[0] || String(row[0]).trim() === "") continue;
    const likes = parseNumber(row[4]);
    const comentarios = parseNumber(row[5]);
    const engagement = parseNumber(row[6]);
    profiles.push({
      categoria: "TURISMO",
      profile: String(row[0]).trim(),
      network: String(row[1] || "").toUpperCase().trim(),
      seguidores: parseNumber(row[2]),
      publicaciones: parseNumber(row[3]),
      likes,
      comentarios,
      compartidos: Math.max(0, engagement - likes - comentarios),
      engagement,
      impresiones: 0,
      imageLink: String(row[10] || "").trim(),
    });
  }
  return profiles;
}

// ── Shared helpers for Guatemala & Honduras ───────────────────────────────────

// 15-col WITH categories: foodtalk/moneytalk/markettalk/retailtalk (GTM & HND)
// Cols: 0=Cat 1=Profile 2=Network 3=Seg 4=Pub 5=Likes 6=Com 7=Engagement ... 14=ImageLink
function parse15ColData(rows: unknown[][]): ProfileData[] {
  const profiles: ProfileData[] = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row[1] || String(row[1]).trim() === "") continue;
    const likes = parseNumber(row[5]);
    const comentarios = parseNumber(row[6]);
    const engagement = parseNumber(row[7]);
    profiles.push({
      categoria: String(row[0] || "SIN CATEGORÍA").trim().replace(/\s+/g, " ").toUpperCase(),
      profile: String(row[1]).trim(),
      network: String(row[2] || "").toUpperCase().trim(),
      seguidores: parseNumber(row[3]),
      publicaciones: parseNumber(row[4]),
      likes,
      comentarios,
      compartidos: Math.max(0, engagement - likes - comentarios),
      engagement,
      impresiones: 0,
      imageLink: String(row[14] || "").trim(),
    });
  }
  return profiles;
}

// 14-col WITHOUT categories: housetalk/tourismtalk (GTM & HND)
// Cols: 0=Profile 1=Network 2=Seg 3=Pub 4=Likes 5=Com 6=Engagement ... 13=ImageLink
function parse14ColData(rows: unknown[][], fixedCategoria: string): ProfileData[] {
  const profiles: ProfileData[] = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row[0] || String(row[0]).trim() === "") continue;
    const likes = parseNumber(row[4]);
    const comentarios = parseNumber(row[5]);
    const engagement = parseNumber(row[6]);
    profiles.push({
      categoria: fixedCategoria,
      profile: String(row[0]).trim(),
      network: String(row[1] || "").toUpperCase().trim(),
      seguidores: parseNumber(row[2]),
      publicaciones: parseNumber(row[3]),
      likes,
      comentarios,
      compartidos: Math.max(0, engagement - likes - comentarios),
      engagement,
      impresiones: 0,
      imageLink: String(row[13] || "").trim(),
    });
  }
  return profiles;
}

// ── Parsers for Guatemala ─────────────────────────────────────────────────────

export function parseGtFoodtalkData(rows: unknown[][]): ProfileData[] { return parse15ColData(rows); }
export function parseMoneyTalkData(rows: unknown[][]): ProfileData[] { return parse15ColData(rows); }
export function parseGtMarkettalkData(rows: unknown[][]): ProfileData[] { return parse15ColData(rows); }
export function parseGtRetailtalkData(rows: unknown[][]): ProfileData[] { return parse15ColData(rows); }
export function parseGtHousetalkData(rows: unknown[][]): ProfileData[] { return parse14ColData(rows, "INMOBILIARIA"); }

// GTM tourismtalk: 11 cols (unique shorter format)
// Cols: 0=Profile 1=Network 2=Seg 3=Pub 4=Likes 5=Com 6=Engagement 7=ProfileID 8=Link 9=ExtLink 10=ImageLink
export function parseTourismtalkData(rows: unknown[][]): ProfileData[] {
  const profiles: ProfileData[] = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row[0] || String(row[0]).trim() === "") continue;
    const likes = parseNumber(row[4]);
    const comentarios = parseNumber(row[5]);
    const engagement = parseNumber(row[6]);
    profiles.push({
      categoria: "TURISMO",
      profile: String(row[0]).trim(),
      network: String(row[1] || "").toUpperCase().trim(),
      seguidores: parseNumber(row[2]),
      publicaciones: parseNumber(row[3]),
      likes,
      comentarios,
      compartidos: Math.max(0, engagement - likes - comentarios),
      engagement,
      impresiones: 0,
      imageLink: String(row[10] || "").trim(),
    });
  }
  return profiles;
}

// ── Parsers for Honduras ──────────────────────────────────────────────────────

export function parseHnFoodtalkData(rows: unknown[][]): ProfileData[] { return parse15ColData(rows); }
export function parseHnMoneytalkData(rows: unknown[][]): ProfileData[] { return parse15ColData(rows); }
export function parseHnMarkettalkData(rows: unknown[][]): ProfileData[] { return parse15ColData(rows); }
export function parseHnRetailtalkData(rows: unknown[][]): ProfileData[] { return parse15ColData(rows); }
export function parseHnHousetalkData(rows: unknown[][]): ProfileData[] { return parse14ColData(rows, "INMOBILIARIA"); }
export function parseHnTourismtalkData(rows: unknown[][]): ProfileData[] { return parse14ColData(rows, "TURISMO"); }

// ── Column mapping per talk for posts ────────────────────────────────────────
type PostColMap = { date: number; msg: number; cat: number; profile: number; network: number; engagement: number; link: number; img: number };

// Default (GTM/HND): 15 cols with cat / 14 cols without cat
const POST_COLS: Record<TalkSlug, PostColMap> = {
  foodtalk:    { date: 0, msg: 1, cat: 2,  profile: 3, network: 4, engagement: 8, link: 12, img: 14 },
  housetalk:   { date: 0, msg: 1, cat: -1, profile: 2, network: 3, engagement: 7, link: 11, img: 13 },
  markettalk:  { date: 0, msg: 1, cat: 2,  profile: 3, network: 4, engagement: 8, link: 12, img: 14 },
  retailtalk:  { date: 0, msg: 1, cat: 2,  profile: 3, network: 4, engagement: 8, link: 12, img: 14 },
  moneytalk:   { date: 0, msg: 1, cat: 2,  profile: 3, network: 4, engagement: 8, link: 12, img: 14 },
  tourismtalk: { date: 0, msg: 1, cat: -1, profile: 2, network: 3, engagement: 7, link: 11, img: 13 },
};

// SLV overrides — SLV publicaciones has extra columns in housetalk (Tasa de interacción +
// Impresiones shift link/img by 1) and markettalk uses a different column order entirely.
export const SV_POST_COLS_OVERRIDE: Partial<Record<TalkSlug, Partial<PostColMap>>> = {
  housetalk:  { link: 12, img: 14 },
  markettalk: { cat: 2, profile: 3, network: 4, engagement: 5, link: 11, img: 13 },
};

export function parsePostsData(rows: unknown[][], slug: TalkSlug, colOverride?: Partial<PostColMap>): PostData[] {
  if (rows.length < 2) return [];
  const c = colOverride ? { ...POST_COLS[slug], ...colOverride } : POST_COLS[slug];
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
  const hasCategoria = slug === "foodtalk" || slug === "markettalk" || slug === "retailtalk" || slug === "moneytalk";

  const topPublicaciones: ChartDataPoint[] = profiles
    .filter((p) => p.publicaciones > 0)
    .sort((a, b) => b.publicaciones - a.publicaciones)
    .slice(0, 10)
    .map((p) => ({ name: p.profile, value: p.publicaciones, network: p.network, fill: color }));

  // Top 10 reacciones: aggregate by brand (legacy, kept for compat)
  const topReacciones: ChartDataPoint[] = (() => {
    const map: Record<string, { total: number; bestImg: string; bestEng: number }> = {};
    for (const p of profiles) {
      if (p.engagement <= 0) continue;
      if (!map[p.profile]) map[p.profile] = { total: 0, bestImg: "", bestEng: 0 };
      map[p.profile].total += p.engagement;
      if (p.engagement > map[p.profile].bestEng) {
        map[p.profile].bestEng = p.engagement;
        map[p.profile].bestImg = p.imageLink || "";
      }
    }
    return Object.entries(map)
      .sort(([, a], [, b]) => b.total - a.total)
      .slice(0, 10)
      .map(([name, { total, bestImg }]) => ({
        name, value: total, fill: color, imageLink: bestImg,
      }));
  })();

  // Carousel: top categories by engagement — use image from top brand per category
  const carouselItems: ChartDataPoint[] = hasCategoria ? (() => {
    const map: Record<string, { total: number; bestImg: string; bestEng: number; bestBrand: string }> = {};
    for (const p of profiles) {
      if (p.engagement <= 0) continue;
      const cat = toTitleCase(p.categoria || "Sin Categoría");
      if (!map[cat]) map[cat] = { total: 0, bestImg: "", bestEng: 0, bestBrand: "" };
      map[cat].total += p.engagement;
      if (p.engagement > map[cat].bestEng) {
        map[cat].bestEng = p.engagement;
        map[cat].bestImg = p.imageLink || "";
        map[cat].bestBrand = p.profile;
      }
    }
    return Object.entries(map)
      .sort(([, a], [, b]) => b.total - a.total)
      .slice(0, 10)
      .map(([name, { total, bestImg, bestBrand }]) => ({
        name, value: total, fill: color, imageLink: bestImg, brand: bestBrand,
      }));
  })() : [];

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

  const totalSeguidores = profiles.reduce((s, p) => s + p.seguidores, 0);
  const totalReacciones = profiles.reduce((s, p) => s + p.engagement, 0);

  const stats = {
    totalPerfiles: profiles.length,
    totalSeguidores,
    totalPublicaciones: profiles.reduce((s, p) => s + p.publicaciones, 0),
    totalReacciones,
    engagementRate: totalSeguidores > 0 ? (totalReacciones / totalSeguidores) * 100 : 0,
  };

  return {
    meta,
    profiles,
    topPublicaciones,
    topReacciones,
    topSeguidores,
    carouselItems,
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
