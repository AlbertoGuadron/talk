import { google } from "googleapis";
import { TalkSlug, TalkMeta } from "@/types";
import {
  parseFoodtalkData,
  parseHousetalkData,
  parseMarkettalkData,
  parseRetailtalkData,
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

const SHEET_TAB: Record<TalkSlug, { datos: string; config: string }> = {
  foodtalk: { datos: "foodtalk_datos", config: "foodtalk_config" },
  housetalk: { datos: "housetalk_datos", config: "housetalk_config" },
  markettalk: { datos: "markettalk_datos", config: "markettalk_config" },
  retailtalk: { datos: "retailtalk_datos", config: "retailtalk_config" },
};

function extractSpreadsheetId(raw: string): string {
  // Accept both the full URL and the bare ID
  const match = raw.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : raw.trim();
}

export async function getTalkData(slug: TalkSlug): Promise<TalkDashboardData> {
  const spreadsheetId = extractSpreadsheetId(process.env.GOOGLE_SPREADSHEET_ID!);
  const tabs = SHEET_TAB[slug];

  const [dataRows, configRows] = await Promise.all([
    getSheetValues(spreadsheetId, `${tabs.datos}!A1:P500`),
    getSheetValues(spreadsheetId, `${tabs.config}!A1:B20`),
  ]);

  const meta = parseConfigRows(configRows);

  let profiles;
  if (slug === "foodtalk") profiles = parseFoodtalkData(dataRows);
  else if (slug === "housetalk") profiles = parseHousetalkData(dataRows);
  else if (slug === "markettalk") profiles = parseMarkettalkData(dataRows);
  else profiles = parseRetailtalkData(dataRows);

  return buildDashboardData(slug, profiles, meta);
}
