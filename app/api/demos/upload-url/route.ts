import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const BUCKET = "talk-images";
const DEMOS_PREFIX = "demos";

export async function GET(req: NextRequest) {
  const token = req.headers.get("x-revalidate-token");
  if (!process.env.REVALIDATE_TOKEN || token !== process.env.REVALIDATE_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const filename = req.nextUrl.searchParams.get("filename");
  if (!filename || !filename.toLowerCase().endsWith(".pdf")) {
    return NextResponse.json({ error: "Filename (.pdf) required" }, { status: 400 });
  }

  // Allow alphanumeric, spaces, dots, hyphens and underscores only
  const safeName = filename.replace(/[^a-zA-Z0-9 ._-]/g, "").trim();
  if (!safeName) {
    return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const path = `${DEMOS_PREFIX}/${safeName}`;
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUploadUrl(path, { upsert: true });

  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? "Failed to create upload URL" }, { status: 500 });
  }

  return NextResponse.json({ signedUrl: data.signedUrl, path: data.path });
}
