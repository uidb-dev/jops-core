import type { Metadata } from "next";
import JopsApp from "jops-core/nextjs";

export const metadata: Metadata = { title: "JOPS SPA" };

// Launches the JOPS SPA in public/jops-spa/ inside this page. JopsApp loads
// /lib/jops-core.min.js once, adds its import map and mounts the app into its
// own <div>; leaving the page ends the app completely.
export default function JopsSpaPage() {
  return <JopsApp app="/jops-spa/App.js" id="jops-spa-root" />;
}
