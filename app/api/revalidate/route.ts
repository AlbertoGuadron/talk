import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import type { TalkSlug } from "@/types";

// Allow up to 60 s for image downloads (Vercel Pro / Hobby max)
export const maxDuration = 60;

const SLUGS: TalkSlug[] = ["foodtalk", "housetalk", "markettalk", "retailtalk"];

export async function POST(req: NextRequest) {
  const token = req.headers.get("x-revalidate-token");
  if (!process.env.REVALIDATE_TOKEN || token !== process.env.REVALIDATE_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ── 1. Fetch fresh data + sync images to Blob RIGHT NOW ───────────────────
  //    (not lazily on next page visit — this ensures images are downloaded
  //     while CDN URLs are still valid)
  if (
    process.env.BLOB_READ_WRITE_TOKEN &&
    process.env.GOOGLE_SPREADSHEET_ID &&
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
    process.env.GOOGLE_PRIVATE_KEY
  ) {
    try {
      const { getTalkData } = await import("@/lib/get-talk-data");
      await Promise.allSettled(SLUGS.map((s) => getTalkData(s)));
      console.log("Image sync completed for all talks");
    } catch (e) {
      console.error("Image sync error:", e);
      // Non-fatal — revalidation continues regardless
    }
  }

  // ── 2. Mark all pages as stale so next visit serves fresh data ────────────
  for (const slug of SLUGS) {
    revalidatePath(`/${slug}`, "page");
  }
  revalidatePath("/");

  return NextResponse.json({
    revalidated: true,
    pages: SLUGS,
    at: new Date().toISOString(),
  });
}
