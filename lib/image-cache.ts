import type { PostData } from "@/types";
import { createClient } from "@supabase/supabase-js";

const BUCKET = "talk-images";
const PREFIX = "posts";

function imageKey(slug: string, messageId: string): string {
  return `${PREFIX}/${slug}/${messageId}.jpg`;
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

function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function refererForUrl(url: string): string {
  if (url.includes("fbcdn.net") || url.includes("facebook.com")) return "https://www.facebook.com/";
  if (url.includes("cdninstagram.com") || url.includes("instagram.com")) return "https://www.instagram.com/";
  if (url.includes("tiktok.com") || url.includes("tiktokcdn.com")) return "https://www.tiktok.com/";
  return "https://www.google.com/";
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
        Referer: refererForUrl(url),
        "sec-fetch-dest": "image",
        "sec-fetch-mode": "no-cors",
        "sec-fetch-site": "cross-site",
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

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return { posts, stats: emptyStats };
  }

  const supabase = getSupabase();

  // ── 1. List existing files in this slug's folder ──────────────────────────
  const existingMap = new Map<string, string>();
  try {
    const { data: files } = await supabase.storage
      .from(BUCKET)
      .list(`${PREFIX}/${slug}`, { limit: 1000 });

    for (const file of files ?? []) {
      const path = `${PREFIX}/${slug}/${file.name}`;
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      existingMap.set(path, data.publicUrl);
    }
  } catch { /* proceed without existing cache */ }

  // ── 2. Process each post (10 concurrent) ─────────────────────────────────
  const CONCURRENCY = 10;
  const updated: PostData[] = [...posts];
  const usedKeys = new Set<string>();
  const stats: SyncStats = { total: posts.length, downloaded: 0, cached: 0, failed: 0, noUrl: 0 };

  for (let i = 0; i < posts.length; i += CONCURRENCY) {
    await Promise.allSettled(
      posts.slice(i, i + CONCURRENCY).map(async (post, idx) => {
        const globalIdx = i + idx;
        const key = imageKey(slug, extractMessageId(post));
        usedKeys.add(key);

        if (!post.imageLink) {
          stats.noUrl++;
          return;
        }

        // ✅ Already cached in Supabase → reuse, skip download
        const cached = existingMap.get(key);
        if (cached) {
          updated[globalIdx] = { ...post, imageLink: cached };
          stats.cached++;
          return;
        }

        // 🌐 New image → download and upload to Supabase Storage
        try {
          const img = await fetchImageAsBuffer(post.imageLink);
          if (!img) {
            console.warn(`[image-cache] Failed to fetch image for ${slug}: ${post.imageLink.slice(0, 80)}`);
            stats.failed++;
            return;
          }

          const { error } = await supabase.storage
            .from(BUCKET)
            .upload(key, img.buffer, {
              contentType: img.contentType,
              upsert: false,
            });

          if (error && error.message !== "The resource already exists") {
            console.error(`[image-cache] Supabase upload error for ${slug}:`, error.message);
            stats.failed++;
            return;
          }

          const { data } = supabase.storage.from(BUCKET).getPublicUrl(key);
          updated[globalIdx] = { ...post, imageLink: data.publicUrl };
          stats.downloaded++;
        } catch (e) {
          console.error(`[image-cache] Upload error for ${slug}:`, e);
          stats.failed++;
        }
      })
    );
  }

  // ── 3. Delete files from previous month no longer in use ─────────────────
  const toDelete = [...existingMap.keys()].filter((k) => !usedKeys.has(k));
  if (toDelete.length > 0) {
    await supabase.storage.from(BUCKET).remove(toDelete);
  }

  return { posts: updated, stats };
}
