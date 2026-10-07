import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const BUCKET = "talk-images";
const DEMOS_PREFIX = "demos";

export async function GET(req: NextRequest) {
  const filename = req.nextUrl.searchParams.get("file");
  if (!filename) {
    return NextResponse.json({ error: "Missing file param" }, { status: 400 });
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

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(`${DEMOS_PREFIX}/${safeName}`, 300, { download: safeName });

  if (error || !data?.signedUrl) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  return NextResponse.redirect(data.signedUrl);
}
