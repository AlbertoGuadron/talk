import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import type { TalkSlug } from "@/types";

// Allow up to 300 s — staggered warm-up for SV, GT, HN avoids Google Sheets rate limits
export const maxDuration = 300;

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

  // Legacy SV pages: /foodtalk, /housetalk, … (static routes)
  for (const slug of SLUGS) {
    revalidatePath(`/${slug}`);
  }
  // Country pages /sv/foodtalk, /gt/foodtalk, /hn/foodtalk, … all come from the
  // dynamic route app/[pais]/[talk]. A literal path combined with type "page"
  // never matches a dynamic route, so those pages were never refreshed.
  // Revalidate the route pattern (all 18 pages) plus each literal URL.
  revalidatePath("/[pais]/[talk]", "page");
  revalidatePath("/[pais]", "page");
  for (const pais of PAISES) {
    revalidatePath(`/${pais}`);
    for (const slug of SLUGS) {
      revalidatePath(`/${pais}/${slug}`);
    }
  }
  revalidatePath("/");

  const host = req.headers.get("host") ?? "talk.digitalinsightsla.com";
  const proto = host.startsWith("localhost") ? "http" : "https";
  const baseUrl = `${proto}://${host}`;

  const warm = (paths: string[], timeoutMs = 10_000) =>
    Promise.allSettled(
      paths.map(p =>
        fetch(`${baseUrl}${p}`, { signal: AbortSignal.timeout(timeoutMs) })
          .catch(() => null)
      )
    );

  const wait = (ms: number) => new Promise(r => setTimeout(r, ms));

  // Stagger warm-up by country to avoid exceeding Google Sheets quota
  // (60 read req/min per service account; each page makes ~3 Sheets calls).
  // Firing all 22 pages at once = ~66 simultaneous calls → 429 errors → 15 s retries.
  // Staggering by 15 s keeps each burst under the quota window.
  const svPages = [...SLUGS.map(s => `/${s}`), ...SLUGS.map(s => `/sv/${s}`)];
  const gtPages = SLUGS.map(s => `/gt/${s}`);
  const hnPages = SLUGS.map(s => `/hn/${s}`);

  // Round 1 – SV (trigger ISR, no Sheets conflicts yet)
  await warm(["/", "/sv", ...svPages]);
  await wait(15_000);

  // Round 1 – GT (quota window clear after 15 s)
  await warm(["/gt", ...gtPages]);
  await wait(15_000);

  // Round 1 – HN (quota window clear after another 15 s)
  await warm(["/hn", ...hnPages]);

  // Wait for GT and HN background regenerations to finish (~40 s)
  await wait(40_000);

  // Round 2 – verify GT and HN have fresh content
  const warmupResults = await Promise.allSettled(
    [...svPages, ...gtPages, ...hnPages].map(p =>
      fetch(`${baseUrl}${p}`, { signal: AbortSignal.timeout(30_000) })
        .then(r => ({ path: p, status: r.status }))
        .catch((err: Error) => ({ path: p, error: err.message }))
    )
  );

  const warmup = warmupResults.map(r => r.status === "fulfilled" ? r.value : r.reason);

  return NextResponse.json({
    revalidated: true,
    warmup,
    at: new Date().toISOString(),
  });
}
