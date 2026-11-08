import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — InstaReel" },
      { name: "description", content: "Rules for using InstaReel to download public Instagram Reels." },
      { property: "og:title", content: "Terms & Conditions — InstaReel" },
      { property: "og:description", content: "Rules for using InstaReel to download public Instagram Reels." },
    ],
  }),
  component: () => (
    <LegalPage title="Terms & Conditions">
      <p>By using InstaReel you agree to these terms.</p>
      <h2>Permitted use</h2>
      <p>Only download content you own or have permission to use. Respect creators' copyright and Instagram's Terms of Use.</p>
      <h2>Public content only</h2>
      <p>InstaReel works only with publicly accessible Reels. We never bypass logins, private accounts, or other access controls.</p>
      <h2>No affiliation</h2>
      <p>InstaReel is an independent tool and is not affiliated with, endorsed by, or connected to Instagram or Meta.</p>
      <h2>No warranty</h2>
      <p>The service is provided "as is". Availability depends on third-party services and may change without notice.</p>
    </LegalPage>
  ),
});
