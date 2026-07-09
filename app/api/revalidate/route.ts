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

  // Invalida el cache de todas las páginas.
  // La próxima visita a cada /talk regenerará la página, llamará a syncPostImages
  // y guardará las imágenes en Blob (mientras las CDN URLs todavía sean válidas).
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
