import { createFileRoute } from "@tanstack/react-router";
import { isProxyableMediaUrl } from "@/lib/instagram-url";

export const Route = createFileRoute("/api/proxy-download")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const src = new URL(request.url).searchParams.get("src") ?? "";
        if (!isProxyableMediaUrl(src)) return new Response("Unsupported media URL", { status: 400 });
        const upstream = await fetch(src);
        if (!upstream.ok || !upstream.body) return new Response("Media unavailable", { status: 502 });
        return new Response(upstream.body, {
          headers: {
            "Content-Type": upstream.headers.get("content-type") ?? "video/mp4",
            "Content-Disposition": `attachment; filename="instareel-${Date.now()}.mp4"`,
            "Cache-Control": "no-store",
          },
        });
      },
    },
  },
});
