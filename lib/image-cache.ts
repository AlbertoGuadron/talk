import type { PostData } from "@/types";

const BLOB_PREFIX = "talks-posts";

function postBlobKey(slug: string, messageId: string): string {
  return `${BLOB_PREFIX}/${slug}/${messageId}.jpg`;
}

function extractMessageId(post: PostData): string {
  if (post.link) {
    const parts = post.link.replace(/\/+$/, "").split("/");
    const last = parts[parts.length - 1];
    if (last && last.length > 4) return last;
  }
  return `${post.profile}-${post.date}-${post.engagement}`
    .replace(/[^a-zA-Z0-9-]/g, "_")
    .slice(0, 80);
}

async function fetchImageAsBuffer(
  url: string
): Promise<{ buffer: ArrayBuffer; contentType: string } | null> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
    if (!res.ok) return null;
    const contentType = res.headers.get("content-type") || "image/jpeg";
    if (!contentType.startsWith("image/")) return null;
    return { buffer: await res.arrayBuffer(), contentType };
  } catch {
    return null;
  }
}

export async function syncPostImages(
  posts: PostData[],
  slug: string
): Promise<PostData[]> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return posts;

  const { put, list, del } = await import("@vercel/blob");

  // ── 1. Load existing blobs → build key→url map ────────────────────────────
  const existingMap = new Map<string, string>(); // pathname → public url
  try {
    const { blobs } = await list({ prefix: `${BLOB_PREFIX}/${slug}/` });
    for (const b of blobs) existingMap.set(b.pathname, b.url);
  } catch { /* proceed without existing data */ }

  // ── 2. Process each post (10 concurrent) ──────────────────────────────────
  const CONCURRENCY = 10;
  const updated: PostData[] = [...posts];
  const usedKeys = new Set<string>();

  for (let i = 0; i < posts.length; i += CONCURRENCY) {
    await Promise.allSettled(
      posts.slice(i, i + CONCURRENCY).map(async (post, idx) => {
        const globalIdx = i + idx;
        const key = postBlobKey(slug, extractMessageId(post));
        usedKeys.add(key);

        if (!post.imageLink) return;

        // ✅ Already cached in Blob → reuse, skip download
        const cached = existingMap.get(key);
        if (cached) {
          updated[globalIdx] = { ...post, imageLink: cached };
          return;
        }

        // 🌐 New image → try to download from CDN and save to Blob
        try {
          const img = await fetchImageAsBuffer(post.imageLink);
          if (!img) return;
          const { url } = await put(key, img.buffer, {
            access: "public",
            addRandomSuffix: false,
            contentType: img.contentType,
          });
          updated[globalIdx] = { ...post, imageLink: url };
        } catch { /* keep original CDN url as fallback */ }
      })
    );
  }

  // ── 3. Delete blobs from previous month no longer in use ──────────────────
  const toDelete = [...existingMap.keys()].filter((k) => !usedKeys.has(k));
  if (toDelete.length > 0) {
    await Promise.allSettled(toDelete.map((k) => del(k)));
  }

  return updated;
}
