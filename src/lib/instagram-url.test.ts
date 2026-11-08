import { describe, expect, it } from "vitest";
import { isProxyableMediaUrl, normalizeInstagramUrl } from "./instagram-url";

describe("normalizeInstagramUrl", () => {
  it("accepts reel links and strips tracking params", () => {
    expect(normalizeInstagramUrl("https://www.instagram.com/reel/C8abcDEF12/?igsh=xyz")).toBe(
      "https://www.instagram.com/reel/C8abcDEF12/",
    );
  });
  it("accepts /p/ and /tv/ links", () => {
    expect(normalizeInstagramUrl("instagram.com/p/abcde")).toBeNull();
    expect(normalizeInstagramUrl("https://instagram.com/tv/abcdef")).toBe("https://www.instagram.com/tv/abcdef/");
  });
  it("rejects non-instagram and profile links", () => {
    expect(normalizeInstagramUrl("https://evil.com/reel/abcdef")).toBeNull();
    expect(normalizeInstagramUrl("https://www.instagram.com/someuser/")).toBeNull();
  });
});

describe("isProxyableMediaUrl", () => {
  it("only allows Instagram CDN hosts", () => {
    expect(isProxyableMediaUrl("https://scontent.cdninstagram.com/v/a.mp4")).toBe(true);
    expect(isProxyableMediaUrl("https://example.com/a.mp4")).toBe(false);
    expect(isProxyableMediaUrl("http://scontent.cdninstagram.com/a.mp4")).toBe(false);
  });
});
