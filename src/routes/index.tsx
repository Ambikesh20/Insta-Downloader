import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { AlertCircle, ClipboardPaste, Download, Link2, Loader2, Lock, Mail, ShieldCheck, Smartphone, Zap } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import heroImg from "@/assets/hero-phone.jpg";
import { fetchReel, type ReelResult } from "@/lib/reel.functions";
import { isProxyableMediaUrl, normalizeInstagramUrl } from "@/lib/instagram-url";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "InstaReel — Download Instagram Reels in Seconds" },
      { name: "description", content: "Paste a public Instagram Reel link and download the MP4 instantly. Free, fast, no login." },
      { property: "og:title", content: "InstaReel — Download Instagram Reels in Seconds" },
      { property: "og:description", content: "Paste a public Instagram Reel link and download the MP4 instantly." },
    ],
  }),
  component: Index,
});

const btn = "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold transition-all";

function Index() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ReelResult | null>(null);

  const paste = async () => {
    try { setUrl(await navigator.clipboard.readText()); } catch { /* permission denied */ }
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!normalizeInstagramUrl(url)) {
      setResult({ success: false, error: "Please paste a valid Instagram Reel link, like instagram.com/reel/…" });
      return;
    }
    setLoading(true); setResult(null);
    try { setResult(await fetchReel({ data: { url } })); }
    catch { setResult({ success: false, error: "Something went wrong. Please try again." }); }
    finally { setLoading(false); }
  };

  const downloadHref = result?.success
    ? isProxyableMediaUrl(result.videoUrl) ? `/api/proxy-download?src=${encodeURIComponent(result.videoUrl)}` : result.videoUrl
    : "";

  return (
    <main>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-40 right-0 h-96 w-96 rounded-full bg-ig opacity-20 blur-3xl" />
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 lg:grid-cols-2 lg:py-24">
          <div className="animate-rise">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-muted-foreground">
              <Zap className="h-3.5 w-3.5 text-primary" /> Free · No login · HD MP4
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight sm:text-6xl">
              Download Instagram <span className="text-ig">Reels</span> in Seconds
            </h1>
            <p className="mt-4 max-w-lg text-lg text-muted-foreground">Paste your Reel link and download supported public videos easily.</p>

            <form onSubmit={submit} className="mt-8 rounded-2xl border border-border bg-card p-2 shadow-soft">
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="flex flex-1 items-center gap-2 px-3">
                  <Link2 className="h-5 w-5 shrink-0 text-muted-foreground" />
                  <input
                    value={url} onChange={(e) => setUrl(e.target.value)} aria-label="Instagram Reel URL"
                    placeholder="https://www.instagram.com/reel/…"
                    className="h-12 w-full bg-transparent outline-none placeholder:text-muted-foreground"
                  />
                  <button type="button" onClick={paste} className="flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground">
                    <ClipboardPaste className="h-4 w-4" /> Paste
                  </button>
                </div>
                <button disabled={loading} className={`${btn} bg-ig text-primary-foreground hover:scale-[1.02] hover:shadow-soft disabled:opacity-70`}>
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Download className="h-5 w-5" />}
                  {loading ? "Fetching…" : "Download"}
                </button>
              </div>
            </form>

            {result && !result.success && (
              <div role="alert" className="mt-4 flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive animate-rise">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {result.error}
              </div>
            )}
          </div>

          <div className="relative mx-auto w-full max-w-md">
            {result?.success ? (
              <div className="animate-rise overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
                <video src={result.videoUrl} poster={result.thumbnail ?? undefined} controls playsInline className="aspect-[9/16] max-h-[520px] w-full bg-muted object-contain" />
                <div className="space-y-3 p-5">
                  {result.title && <p className="line-clamp-2 text-sm text-muted-foreground">{result.title}</p>}
                  <a href={downloadHref} target="_blank" rel="noreferrer" className={`${btn} w-full bg-ig text-primary-foreground hover:shadow-soft`}>
                    <Download className="h-5 w-5" /> Download MP4
                  </a>
                </div>
              </div>
            ) : (
              <img src={heroImg} alt="Phone playing an Instagram Reel" width={1024} height={1024} className="animate-float rounded-3xl" />
            )}
          </div>
        </div>
      </section>

      <section id="how" className="mx-auto max-w-6xl px-4 py-20">
        <h2 className="text-center text-3xl font-bold sm:text-4xl">How to use</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { i: Link2, t: "Copy the link", d: "Open the Reel on Instagram, tap ••• or Share, then Copy link." },
            { i: ClipboardPaste, t: "Paste it here", d: "Paste the link into the box above and press Download." },
            { i: Download, t: "Save the MP4", d: "Preview the video and tap Download MP4 to save it." },
          ].map((s, n) => (
            <div key={s.t} className="rounded-2xl border border-border bg-card p-6 transition-transform hover:-translate-y-1 hover:shadow-soft">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-ig text-primary-foreground"><s.i className="h-5 w-5" /></span>
                <span className="font-display text-sm font-bold text-muted-foreground">Step {n + 1}</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold">{s.t}</h3>
              <p className="mt-1 text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-muted/50 py-20">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { i: Zap, t: "Lightning fast", d: "Results in a few seconds." },
            { i: Smartphone, t: "Any device", d: "Works on phone, tablet and desktop." },
            { i: ShieldCheck, t: "Private", d: "No account, no history stored." },
            { i: Lock, t: "Public only", d: "We never bypass private accounts." },
          ].map((f) => (
            <div key={f.t} className="rounded-2xl bg-card p-6">
              <f.i className="h-6 w-6 text-primary" />
              <h3 className="mt-3 font-semibold">{f.t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-3xl px-4 py-20">
        <h2 className="text-center text-3xl font-bold sm:text-4xl">Frequently asked questions</h2>
        <Accordion type="single" collapsible className="mt-10">
          {([
            ["Is InstaReel free?", "Yes, it's free to use with a fair-use limit of a few downloads per minute."],
            ["Can I download private Reels?", "No. Only publicly accessible Reels are supported. We never bypass logins or privacy settings."],
            ["Where are videos saved?", "In your device's Downloads folder. On iPhone, check the Files app."],
            ["Is it legal?", "Only download videos you own or have permission to use, and respect creators' copyright."],
            ["Why did my download fail?", "The Reel may be private, deleted, region-restricted, or the link may be mistyped."],
          ] as const).map(([q, a]) => (
            <AccordionItem key={q} value={q}>
              <AccordionTrigger className="text-left font-semibold">{q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section id="contact" className="mx-auto max-w-6xl px-4 pb-20">
        <div className="rounded-3xl bg-ig p-10 text-center text-primary-foreground">
          <Mail className="mx-auto h-8 w-8" />
          <h2 className="mt-3 text-3xl font-bold">Get in touch</h2>
          <p className="mt-2 opacity-90">Questions, feedback, or takedown requests — we're happy to help.</p>
          <a href="mailto:hello@instareel.app" className={`${btn} mt-6 bg-background text-foreground hover:scale-[1.02]`}>hello@instareel.app</a>
        </div>
      </section>
    </main>
  );
}
