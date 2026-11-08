import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { z } from "zod";
import { normalizeInstagramUrl } from "./instagram-url";

export type ReelResult =
  | { success: true; thumbnail: string | null; title: string | null; videoUrl: string }
  | { success: false; error: string };

const hits = new Map<string, number[]>();
function rateLimited(ip: string) {
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
  list.push(now);
  hits.set(ip, list);
  return list.length > 10;
}

function findUrl(obj: unknown, test: (k: string, v: string) => boolean, depth = 0): string | null {
  if (!obj || depth > 6) return null;
  if (Array.isArray(obj)) {
    for (const x of obj) { const r = findUrl(x, test, depth + 1); if (r) return r; }
    return null;
  }
  if (typeof obj === "object") {
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      if (typeof v === "string" && /^https:\/\//.test(v) && test(k.toLowerCase(), v)) return v;
    }
    for (const v of Object.values(obj as Record<string, unknown>)) {
      if (typeof v === "object") { const r = findUrl(v, test, depth + 1); if (r) return r; }
    }
  }
  return null;
}
function findText(obj: unknown, keys: string[], depth = 0): string | null {
  if (!obj || typeof obj !== "object" || depth > 6) return null;
  for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
    if (keys.includes(k.toLowerCase()) && typeof v === "string" && v.trim()) return v.slice(0, 300);
  }
  for (const v of Object.values(obj as Record<string, unknown>)) {
    const r = findText(v, keys, depth + 1); if (r) return r;
  }
  return null;
}

export const fetchReel = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ url: z.string().min(1).max(500) }).parse(d))
  .handler(async ({ data }): Promise<ReelResult> => {
    const url = normalizeInstagramUrl(data.url);
    if (!url) return { success: false, error: "That doesn't look like an Instagram Reel link." };

    const ip = getRequestHeader("cf-connecting-ip") ?? getRequestHeader("x-forwarded-for") ?? "anon";
    if (rateLimited(ip)) return { success: false, error: "Too many requests. Please wait a minute and try again." };

    const key = process.env["RAPIDAPI_KEY"];
    const host = process.env["RAPIDAPI_HOST"];
    if (!key || !host) return { success: false, error: "The downloader isn't configured yet. Please try again later." };
    const path = process.env["RAPIDAPI_PATH"] || "/download";

    try {
      const res = await fetch(`https://${host}${path}?url=${encodeURIComponent(url)}`, {
        headers: { "x-rapidapi-key": key, "x-rapidapi-host": host },
      });
      if (res.status === 429) return { success: false, error: "The service is busy. Try again shortly." };
      if (!res.ok) {
        console.error("RapidAPI error", res.status, (await res.text()).slice(0, 300));
        return { success: false, error: "We couldn't fetch this Reel. It may be private, deleted, or unsupported." };
      }
      const json = await res.json();
      if (json && typeof json === "object" && (json as { success?: unknown }).success === false) {
        console.error("RapidAPI returned failure", JSON.stringify(json).slice(0, 300));
        const code = (json as { code?: unknown }).code;
        return {
          success: false,
          error: code === 500 || code === 503
            ? "The download service is temporarily down for maintenance. Please try again in a little while."
            : "We couldn't fetch this Reel. It may be private, deleted, or unsupported.",
        };
      }
      const videoUrl =
        findUrl(json, (k, v) => k.includes("video") || /\.mp4/.test(v)) ??
        findUrl(json, (k) => k === "url" || k === "download_url" || k === "media");
      if (!videoUrl) return { success: false, error: "No downloadable video found. The Reel may be private or unavailable." };
      const thumbnail = findUrl(json, (k) => k.includes("thumb") || k.includes("cover") || k.includes("display") || k.includes("image"));
      const title = findText(json, ["title", "caption", "text", "description"]);
      return { success: true, videoUrl, thumbnail, title };
    } catch (e) {
      console.error(e);
      return { success: false, error: "Something went wrong reaching the service. Please try again." };
    }
  });
