const PATTERN = /^https?:\/\/(www\.|m\.)?instagram\.com\/(reel|reels|p|tv)\/([A-Za-z0-9_-]{5,})\/?(\?.*)?$/i;

/** Returns a cleaned canonical URL, or null if not a supported Instagram post/reel link. */
export function normalizeInstagramUrl(input: string): string | null {
  const trimmed = input.trim().slice(0, 500);
  const m = trimmed.match(PATTERN);
  if (!m) return null;
  const kind = m[2]!.toLowerCase() === "reels" ? "reel" : m[2]!.toLowerCase();
  return `https://www.instagram.com/${kind}/${m[3]}/`;
}

const ALLOWED_MEDIA_HOSTS = ["cdninstagram.com", "fbcdn.net"];

export function isProxyableMediaUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === "https:" && ALLOWED_MEDIA_HOSTS.some((h) => u.hostname === h || u.hostname.endsWith("." + h));
  } catch {
    return false;
  }
}
