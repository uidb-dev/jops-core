import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Next.js + JOPS", template: "%s · Next.js + JOPS" },
  description: "A Next.js app hosting an embedded JOPS SPA",
};

// Root layout (Next.js): a shared shell around every page. The JOPS SPA is
// launched only by /jops-spa, inside this shell.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full font-sans">
        <header className="border-b border-slate-200 bg-white">
          <nav className="mx-auto flex max-w-5xl items-center gap-6 px-6 py-4 text-sm">
            <span className="font-semibold text-indigo-700">Next.js + JOPS</span>
            <Link href="/about" className="text-slate-600 hover:text-slate-900">About</Link>
            <Link href="/jops-spa" className="text-slate-600 hover:text-slate-900">JOPS SPA</Link>
          </nav>
        </header>
        <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
