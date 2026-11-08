import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — InstaReel" },
      { name: "description", content: "How InstaReel handles the links you paste and your data." },
      { property: "og:title", content: "Privacy Policy — InstaReel" },
      { property: "og:description", content: "How InstaReel handles the links you paste and your data." },
    ],
  }),
  component: () => (
    <LegalPage title="Privacy Policy">
      <p>InstaReel does not require an account and does not store the videos you download.</p>
      <h2>What we process</h2>
      <p>The Reel link you paste is sent to our server and a third-party retrieval service solely to fetch the public video. We don't keep a history of your links.</p>
      <h2>Technical data</h2>
      <p>Your IP address is used briefly in memory for rate limiting to prevent abuse, and is not stored long-term.</p>
      <h2>Cookies</h2>
      <p>We only store your light/dark theme choice in your browser.</p>
      <h2>Contact</h2>
      <p>Questions? Reach out via the contact section on the home page.</p>
    </LegalPage>
  ),
});
