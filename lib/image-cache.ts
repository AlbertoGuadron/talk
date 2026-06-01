import type { PostData } from "@/types";

const BLOB_PREFIX = "talks-posts";

function postBlobKey(slug: string, messageId: string): string {
  return `${BLOB_PREFIX}/${slug}/${messageId}.jpg`;
}

function extractMessageId(post: PostData): string {
  // Use the last segment of the link URL as a stable ID
  if (post.link) {
    const parts = post.link.replace(/\/+$/, "").split("/");
    const last = parts[parts.length - 1];
    if (last && last.length > 4) return last;
  }
  // Fallback: combine profile + date + engagement
  return `${post.profile}-${post.date}-${post.engagement}`
    .replace(/[^a-zA-Z0-9-]/g, "_")
    .slice(0, 80);
}

async function fetchImageAsBuffer(url: string): Promise<{ buffer: ArrayBuffer; contentType: string } | null> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
    if (!res.ok) return null;
    const contentType = res.headers.get("content-type") || "image/jpeg";
    if (!contentType.startsWith("image/")) return null;
    const buffer = await res.arrayBuffer();
    return { buffer, contentType };
  } catch {
    return null;
  }
}

export async function syncPostImages(posts: PostData[], slug: string): Promise<PostData[]> {
  // Only run when Blob is configured
  if (!process.env.BLOB_READ_WRITE_TOKEN) return posts;

  const { put, list, del } = await import("@vercel/blob");

  // ── 1. Fetch all existing blobs for this slug ──────────────────────────────
  let existingBlobs: string[] = [];
  try {
    const { blobs } = await list({ prefix: `${BLOB_PREFIX}/${slug}/` });
    existingBlobs = blobs.map((b) => b.pathname);
  } catch {
    // If listing fails, proceed without cleanup
  }

  // ── 2. Download and upload each post image in parallel (max 5 at a time) ──
  const CONCURRENCY = 5;
  const updatedPosts: PostData[] = [...posts];
  const usedKeys = new Set<string>();

  for (let i = 0; i < posts.length; i += CONCURRENCY) {
    const chunk = posts.slice(i, i + CONCURRENCY);
    const results = await Promise.allSettled(
      chunk.map(async (post, idx) => {
        const globalIdx = i + idx;
        const messageId = extractMessageId(post);
        const key = postBlobKey(slug, messageId);
        usedKeys.add(key);

        if (!post.imageLink) return;

        try {
          const img = await fetchImageAsBuffer(post.imageLink);
          if (!img) return;

          const { url } = await put(key, img.buffer, {
            access: "public",
            addRandomSuffix: false,
            contentType: img.contentType,
          });

          updatedPosts[globalIdx] = { ...post, imageLink: url };
        } catch {
          // Keep original URL if upload fails
        }
      })
    );
    // Suppress unused results warning
    void results;
  }

  // ── 3. Delete blobs that are no longer in the current post set ─────────────
  const toDelete = existingBlobs.filter((key) => !usedKeys.has(key));
  if (toDelete.length > 0) {
    try {
      await Promise.allSettled(toDelete.map((key) => del(key)));
    } catch {
      // Cleanup failures are non-critical
    }
  }

  return updatedPosts;
}
