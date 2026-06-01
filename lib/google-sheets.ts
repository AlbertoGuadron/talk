import { google } from "googleapis";
import { TalkSlug, TalkMeta } from "@/types";
import {
  parseFoodtalkData,
  parseHousetalkData,
  parseMarkettalkData,
  parseRetailtalkData,
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
  };
}

const SHEET_TAB: Record<TalkSlug, { datos: string; config: string; publicaciones: string }> = {
  foodtalk:   { datos: "foodtalk_datos",   config: "foodtalk_config",   publicaciones: "Publicaciones_Foodtalk" },
  housetalk:  { datos: "housetalk_datos",  config: "housetalk_config",  publicaciones: "Publicaciones_Housetalk" },
  markettalk: { datos: "markettalk_datos", config: "markettalk_config", publicaciones: "Publicaciones_Markettalk" },
  retailtalk: { datos: "retailtalk_datos", config: "retailtalk_config", publicaciones: "Publicaciones_Retailtalk" },
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
  else profiles = parseRetailtalkData(dataRows);

  let posts = parsePostsData(postRows, slug);

  // Cache post images to Vercel Blob so they don't expire
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { syncPostImages } = await import("./image-cache");
    posts = await syncPostImages(posts, slug);
  }

  return buildDashboardData(slug, profiles, meta, posts);
}
