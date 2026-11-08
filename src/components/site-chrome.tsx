import { Link } from "@tanstack/react-router";
import { Download, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function SiteHeader() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const d = localStorage.getItem("theme") === "dark";
    setDark(d);
    document.documentElement.classList.toggle("dark", d);
  }, []);
  const toggle = () => {
    const d = !dark;
    setDark(d);
    document.documentElement.classList.toggle("dark", d);
    localStorage.setItem("theme", d ? "dark" : "light");
  };
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-ig text-primary-foreground shadow-soft">
            <Download className="h-5 w-5" />
          </span>
          InstaReel
        </Link>
        <nav className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
          <a href="/#how" className="hidden rounded-lg px-3 py-2 hover:text-foreground sm:block">How it works</a>
          <a href="/#faq" className="hidden rounded-lg px-3 py-2 hover:text-foreground sm:block">FAQ</a>
          <button onClick={toggle} aria-label="Toggle dark mode" className="rounded-lg p-2 hover:bg-muted hover:text-foreground">
            {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-muted-foreground sm:flex-row">
        <p>© {new Date().getFullYear()} InstaReel. Not affiliated with Instagram or Meta.</p>
        <div className="flex gap-5">
          <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
          <Link to="/terms" className="hover:text-foreground">Terms</Link>
          <a href="/#contact" className="hover:text-foreground">Contact</a>
        </div>
      </div>
    </footer>
  );
}
