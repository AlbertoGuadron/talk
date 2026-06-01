import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  const token = req.headers.get("x-revalidate-token");
  const expectedToken = process.env.REVALIDATE_TOKEN;

  if (!expectedToken || token !== expectedToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    revalidatePath("/foodtalk", "page");
    revalidatePath("/housetalk", "page");
    revalidatePath("/markettalk", "page");
    revalidatePath("/retailtalk", "page");
    return NextResponse.json({
      revalidated: true,
      pages: ["foodtalk", "housetalk", "markettalk", "retailtalk"],
      at: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Revalidation error:", err);
    return NextResponse.json({ error: "Revalidation failed" }, { status: 500 });
  }
}
