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
    const res = await fetch(url, {
      signal: AbortSignal.timeout(10000),
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
        "Accept-Language": "es-ES,es;q=0.9,en;q=0.8",
        Referer: "https://www.google.com/",
      },
    });
    if (!res.ok) return null;
    const contentType = res.headers.get("content-type") || "image/jpeg";
    if (!contentType.startsWith("image/")) return null;
    return { buffer: await res.arrayBuffer(), contentType };
  } catch {
    return null;
  }
}

export interface SyncStats {
  total: number;
  downloaded: number;
  cached: number;
  failed: number;
  noUrl: number;
}

export async function syncPostImages(
  posts: PostData[],
  slug: string
): Promise<{ posts: PostData[]; stats: SyncStats }> {
  const emptyStats: SyncStats = { total: posts.length, downloaded: 0, cached: 0, failed: 0, noUrl: 0 };
  if (!process.env.BLOB_READ_WRITE_TOKEN) return { posts, stats: emptyStats };

  const { put, list, del } = await import("@vercel/blob");

  // ── 1. Load existing blobs → build key→url map ────────────────────────────
  const existingMap = new Map<string, string>();
  try {
    const { blobs } = await list({ prefix: `${BLOB_PREFIX}/${slug}/` });
    for (const b of blobs) existingMap.set(b.pathname, b.url);
  } catch { /* proceed without existing data */ }

  // ── 2. Process each post (10 concurrent) ──────────────────────────────────
  const CONCURRENCY = 10;
  const updated: PostData[] = [...posts];
  const usedKeys = new Set<string>();
  const stats: SyncStats = { total: posts.length, downloaded: 0, cached: 0, failed: 0, noUrl: 0 };

  for (let i = 0; i < posts.length; i += CONCURRENCY) {
    await Promise.allSettled(
      posts.slice(i, i + CONCURRENCY).map(async (post, idx) => {
        const globalIdx = i + idx;
        const key = postBlobKey(slug, extractMessageId(post));
        usedKeys.add(key);

        if (!post.imageLink) {
          stats.noUrl++;
          return;
        }

        // ✅ Already cached in Blob → reuse, skip download
        const cached = existingMap.get(key);
        if (cached) {
          updated[globalIdx] = { ...post, imageLink: cached };
          stats.cached++;
          return;
        }

        // 🌐 New image → try to download from CDN and save to Blob
        try {
          const img = await fetchImageAsBuffer(post.imageLink);
          if (!img) {
            console.warn(`[image-cache] Failed to fetch image for ${slug}: ${post.imageLink.slice(0, 80)}`);
            stats.failed++;
            return;
          }
          const { url } = await put(key, img.buffer, {
            access: "public",
            addRandomSuffix: false,
            contentType: img.contentType,
          });
          updated[globalIdx] = { ...post, imageLink: url };
          stats.downloaded++;
        } catch (e) {
          console.error(`[image-cache] Blob put error for ${slug}:`, e);
          stats.failed++;
        }
      })
    );
  }

  // ── 3. Delete blobs from previous month no longer in use ──────────────────
  const toDelete = [...existingMap.keys()].filter((k) => !usedKeys.has(k));
  if (toDelete.length > 0) {
    await Promise.allSettled(toDelete.map((k) => del(k)));
  }

  return { posts: updated, stats };
}
