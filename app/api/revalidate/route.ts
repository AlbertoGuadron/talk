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

  const pages = [
    ...SLUGS.map(s => `/${s}`),
    ...["gt", "hn"].flatMap(p => SLUGS.map(s => `/${p}/${s}`)),
    "/",
  ];

  return NextResponse.json({
    revalidated: true,
    pages,
    at: new Date().toISOString(),
  });
}
