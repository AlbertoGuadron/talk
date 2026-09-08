import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import type { TalkSlug } from "@/types";

// Allow up to 60 s for image downloads (Vercel Pro / Hobby max)
export const maxDuration = 60;

const SLUGS: TalkSlug[] = [
  "foodtalk", "housetalk", "markettalk",
  "retailtalk", "moneytalk", "tourismtalk",
];
const PAISES = ["sv", "gt", "hn"];

export async function POST(req: NextRequest) {
  const token = req.headers.get("x-revalidate-token");
  if (!process.env.REVALIDATE_TOKEN || token !== process.env.REVALIDATE_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // SV pages: /foodtalk, /housetalk, …
  for (const slug of SLUGS) {
    revalidatePath(`/${slug}`, "page");
  }
  // GT + HN pages: /gt/foodtalk, /hn/foodtalk, …
  for (const pais of ["gt", "hn"]) {
    for (const slug of SLUGS) {
      revalidatePath(`/${pais}/${slug}`, "page");
    }
  }
  revalidatePath("/");

  revalidatePath("/sv", "page");
  revalidatePath("/gt", "page");
  revalidatePath("/hn", "page");

  const pages = [
    "/", "/sv", "/gt", "/hn",
    ...SLUGS.map(s => `/${s}`),
    ...["gt", "hn"].flatMap(p => SLUGS.map(s => `/${p}/${s}`)),
  ];

  // Warm up: pre-generate all pages in parallel so the first real visitor
  // doesn't have to wait for Google Sheets API calls.
  const host = req.headers.get("host") ?? "talk.digitalinsightsla.com";
  const proto = host.startsWith("localhost") ? "http" : "https";
  const baseUrl = `${proto}://${host}`;

  const warmupResults = await Promise.allSettled(
    pages.map(path =>
      fetch(`${baseUrl}${path}`, { signal: AbortSignal.timeout(50_000) })
        .then(r => ({ path, status: r.status }))
        .catch((err: Error) => ({ path, error: err.message }))
    )
  );

  const warmup = warmupResults.map(r => r.status === "fulfilled" ? r.value : r.reason);

  return NextResponse.json({
    revalidated: true,
    pages,
    warmup,
    at: new Date().toISOString(),
  });
}
