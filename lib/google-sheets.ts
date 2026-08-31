import { google } from "googleapis";
import { TalkSlug, TalkMeta } from "@/types";
import {
  parseFoodtalkData,
  parseHousetalkData,
  parseMarkettalkData,
  parseRetailtalkData,
  parseSvMoneyTalkData,
  parseSvTourismtalkData,
  parseGtFoodtalkData,
  parseMoneyTalkData,
  parseGtMarkettalkData,
  parseGtRetailtalkData,
  parseGtHousetalkData,
  parseTourismtalkData,
  parseHnFoodtalkData,
  parseHnMoneytalkData,
  parseHnMarkettalkData,
  parseHnRetailtalkData,
  parseHnHousetalkData,
  parseHnTourismtalkData,
  parsePostsData,
  buildDashboardData,
} from "./data-parser";
import type { TalkDashboardData } from "@/types";

function getAuth() {
  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
}

async function getSheetValues(
  spreadsheetId: string,
  range: string
): Promise<unknown[][]> {
  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });
  return (response.data.values as unknown[][]) || [];
}

function parseConfigRows(rows: unknown[][]): TalkMeta {
  const map: Record<string, string> = {};
  for (const row of rows) {
    if (row[0] && row[1]) {
      map[String(row[0]).toLowerCase()] = String(row[1]);
    }
  }
  return {
    titulo: map["titulo"] || "",
    subtitulo: map["subtitulo"] || "",
    mes: map["mes"] || "",
    analisis: map["analisis"] || "",
    analisis2: map["analisis 2"] || "",
    analisis3: map["analisis 3"] || "",
  };
}

// SV spreadsheet tabs
const SHEET_TAB: Record<TalkSlug, { datos: string; config: string; publicaciones: string }> = {
  foodtalk:    { datos: "foodtalk_datos",    config: "foodtalk_config",    publicaciones: "Publicaciones_Foodtalk" },
  housetalk:   { datos: "housetalk_datos",   config: "housetalk_config",   publicaciones: "Publicaciones_Housetalk" },
  markettalk:  { datos: "markettalk_datos",  config: "markettalk_config",  publicaciones: "Publicaciones_Markettalk" },
  retailtalk:  { datos: "retailtalk_datos",  config: "retailtalk_config",  publicaciones: "Publicaciones_Retailtalk" },
  moneytalk:   { datos: "moneytalk_datos",   config: "moneytalk_config",   publicaciones: "Publicaciones_Moneytalk" },
  tourismtalk: { datos: "tourismtalk_datos", config: "tourismtalk_config", publicaciones: "Publicaciones_Tourismtalk" },
};

// GT spreadsheet tabs — all 6 talks (note: housetalk datos tab has a typo in the spreadsheet)
type GtSlug = "foodtalk" | "moneytalk" | "tourismtalk" | "housetalk" | "markettalk" | "retailtalk";
const GT_SHEET_TAB: Record<GtSlug, { datos: string; config: string; publicaciones: string }> = {
  foodtalk:    { datos: "foodtalk_datos",    config: "foodtalk_config",    publicaciones: "Publicaciones_foodtalk" },
  moneytalk:   { datos: "moneytalk_datos",   config: "moneytalk_config",   publicaciones: "Publicaciones_moneytalk" },
  tourismtalk: { datos: "tourismtalk_datos", config: "tourismtalk_config", publicaciones: "Publicaciones_tourismtalk" },
  housetalk:   { datos: "houstalk_datos",    config: "housetalk_config",   publicaciones: "Publicaciones_housetalk" },
  markettalk:  { datos: "markettalk_datos",  config: "markettalk_config",  publicaciones: "Publicaciones_markettalk" },
  retailtalk:  { datos: "retailtalk_datos",  config: "retailtalk_config",  publicaciones: "Publicaciones_retailtalk" },
};

// HN spreadsheet tabs — all 6 talks
type HnSlug = "foodtalk" | "moneytalk" | "tourismtalk" | "housetalk" | "markettalk" | "retailtalk";
const HN_SHEET_TAB: Record<HnSlug, { datos: string; config: string; publicaciones: string }> = {
  foodtalk:    { datos: "foodtalk_datos",    config: "foodtalk_config",    publicaciones: "Publicaciones_Foodtalk" },
  moneytalk:   { datos: "moneytalk_datos",   config: "moneytalk_config",   publicaciones: "Publicaciones_Moneytalk" },
  tourismtalk: { datos: "tourismtalk_datos", config: "tourismtalk_config", publicaciones: "Publicaciones_Tourismtalk" },
  housetalk:   { datos: "housetalk_datos",   config: "housetalk_config",   publicaciones: "Publicaciones_Housetalk" },
  markettalk:  { datos: "markettalk_datos",  config: "markettalk_config",  publicaciones: "Publicaciones_Markettalk" },
  retailtalk:  { datos: "retailtalk_datos",  config: "retailtalk_config",  publicaciones: "Publicaciones_Retailtalk" },
};

function extractSpreadsheetId(raw: string): string {
  // Accept both the full URL and the bare ID
  const match = raw.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : raw.trim();
}

export async function getTalkData(slug: TalkSlug): Promise<TalkDashboardData> {
  const spreadsheetId = extractSpreadsheetId(process.env.GOOGLE_SPREADSHEET_ID!);
  // Publicaciones can live in a separate spreadsheet (GOOGLE_SPREADSHEET_POSTS_ID)
  // or fall back to the same one if not configured
  const postsSpreadsheetId = process.env.GOOGLE_SPREADSHEET_POSTS_ID
    ? extractSpreadsheetId(process.env.GOOGLE_SPREADSHEET_POSTS_ID)
    : spreadsheetId;
  const tabs = SHEET_TAB[slug];

  const [dataRows, configRows, postRows] = await Promise.all([
    getSheetValues(spreadsheetId, `${tabs.datos}!A1:P500`),
    getSheetValues(spreadsheetId, `${tabs.config}!A1:B20`),
    getSheetValues(postsSpreadsheetId, `${tabs.publicaciones}!A1:O10000`).catch(() => [] as unknown[][]),
  ]);

  const meta = parseConfigRows(configRows);

  let profiles;
  if (slug === "foodtalk") profiles = parseFoodtalkData(dataRows);
  else if (slug === "housetalk") profiles = parseHousetalkData(dataRows);
  else if (slug === "markettalk") profiles = parseMarkettalkData(dataRows);
  else if (slug === "retailtalk") profiles = parseRetailtalkData(dataRows);
  else if (slug === "moneytalk") profiles = parseSvMoneyTalkData(dataRows);
  else profiles = parseSvTourismtalkData(dataRows);

  let posts = parsePostsData(postRows, slug);

  if (process.env.SUPABASE_URL) {
    const { syncPostImages } = await import("./image-cache");
    // Prefix sv- so SV moneytalk/tourismtalk don't collide with GT in Supabase
    const cacheKey = (slug === "moneytalk" || slug === "tourismtalk") ? `sv-${slug}` : slug;
    const result = await syncPostImages(posts, cacheKey);
    posts = result.posts;
    console.log(`[image-cache] sv/${slug}:`, result.stats);
  }

  return buildDashboardData(slug, profiles, meta, posts);
}

export async function getGtTalkData(slug: GtSlug, meta: TalkMeta): Promise<TalkDashboardData> {
  const spreadsheetId = extractSpreadsheetId(process.env.GOOGLE_SPREADSHEET_GT_ID!);
  const postsSpreadsheetId = process.env.GOOGLE_SPREADSHEET_GT_POSTS_ID
    ? extractSpreadsheetId(process.env.GOOGLE_SPREADSHEET_GT_POSTS_ID)
    : spreadsheetId;
  const tabs = GT_SHEET_TAB[slug];

  const [dataRows, configRows, postRows] = await Promise.all([
    getSheetValues(spreadsheetId, `${tabs.datos}!A1:P500`),
    getSheetValues(spreadsheetId, `${tabs.config}!A1:B20`).catch(() => [] as unknown[][]),
    getSheetValues(postsSpreadsheetId, `${tabs.publicaciones}!A1:P10000`).catch(() => [] as unknown[][]),
  ]);

  const configMeta = configRows.length > 1 ? parseConfigRows(configRows) : null;
  const finalMeta = configMeta?.titulo ? configMeta : meta;

  let profiles;
  switch (slug) {
    case "foodtalk":    profiles = parseGtFoodtalkData(dataRows); break;
    case "moneytalk":   profiles = parseMoneyTalkData(dataRows); break;
    case "markettalk":  profiles = parseGtMarkettalkData(dataRows); break;
    case "retailtalk":  profiles = parseGtRetailtalkData(dataRows); break;
    case "housetalk":   profiles = parseGtHousetalkData(dataRows); break;
    default:            profiles = parseTourismtalkData(dataRows);
  }

  let posts = parsePostsData(postRows, slug as TalkSlug);

  if (process.env.SUPABASE_URL) {
    const { syncPostImages } = await import("./image-cache");
    const result = await syncPostImages(posts, `gt-${slug}`);
    posts = result.posts;
    console.log(`[image-cache] gt/${slug}:`, result.stats);
  }

  return buildDashboardData(slug as TalkSlug, profiles, finalMeta, posts);
}

export async function getHnTalkData(slug: HnSlug, meta: TalkMeta): Promise<TalkDashboardData> {
  const spreadsheetId = extractSpreadsheetId(process.env.GOOGLE_SPREADSHEET_HN_ID!);
  const postsSpreadsheetId = process.env.GOOGLE_SPREADSHEET_HN_POSTS_ID
    ? extractSpreadsheetId(process.env.GOOGLE_SPREADSHEET_HN_POSTS_ID)
    : spreadsheetId;
  const tabs = HN_SHEET_TAB[slug];

  const [dataRows, configRows, postRows] = await Promise.all([
    getSheetValues(spreadsheetId, `${tabs.datos}!A1:P500`),
    getSheetValues(spreadsheetId, `${tabs.config}!A1:B20`).catch(() => [] as unknown[][]),
    getSheetValues(postsSpreadsheetId, `${tabs.publicaciones}!A1:O10000`).catch(() => [] as unknown[][]),
  ]);

  const configMeta = configRows.length > 1 ? parseConfigRows(configRows) : null;
  const finalMeta = configMeta?.titulo ? configMeta : meta;

  let profiles;
  switch (slug) {
    case "foodtalk":    profiles = parseHnFoodtalkData(dataRows); break;
    case "moneytalk":   profiles = parseHnMoneytalkData(dataRows); break;
    case "markettalk":  profiles = parseHnMarkettalkData(dataRows); break;
    case "retailtalk":  profiles = parseHnRetailtalkData(dataRows); break;
    case "housetalk":   profiles = parseHnHousetalkData(dataRows); break;
    default:            profiles = parseHnTourismtalkData(dataRows);
  }

  let posts = parsePostsData(postRows, slug as TalkSlug);

  if (process.env.SUPABASE_URL) {
    const { syncPostImages } = await import("./image-cache");
    const result = await syncPostImages(posts, `hn-${slug}`);
    posts = result.posts;
    console.log(`[image-cache] hn/${slug}:`, result.stats);
  }

  return buildDashboardData(slug as TalkSlug, profiles, finalMeta, posts);
}
