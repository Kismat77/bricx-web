import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Self-hosted brand fonts (no request to Google at runtime or build time).
const plexSans = localFont({
  variable: "--font-plex-sans",
  display: "swap",
  src: [
    { path: "./fonts/ibm-plex-sans-latin-400-normal.woff2", weight: "400" },
    { path: "./fonts/ibm-plex-sans-latin-600-normal.woff2", weight: "600" },
    { path: "./fonts/ibm-plex-sans-latin-700-normal.woff2", weight: "700" },
  ],
});
const plexMono = localFont({
  variable: "--font-plex-mono",
  display: "swap",
  src: [{ path: "./fonts/ibm-plex-mono-latin-500-normal.woff2", weight: "500" }],
});
const inter = localFont({
  variable: "--font-inter",
  display: "swap",
  src: [
    { path: "./fonts/inter-latin-400-normal.woff2", weight: "400" },
    { path: "./fonts/inter-latin-500-normal.woff2", weight: "500" },
    { path: "./fonts/inter-latin-600-normal.woff2", weight: "600" },
    { path: "./fonts/inter-latin-700-normal.woff2", weight: "700" },
  ],
});
const geist = localFont({
  variable: "--font-geist",
  display: "swap",
  src: [{ path: "./fonts/geist-latin-500-normal.woff2", weight: "500" }],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://bricx.com.np"),
  title: "Bricx — All your operational departments on one platform",
  description:
    "Modular ERP for businesses that build, move and sell: projects, procurement, inventory, accounting, people and more on one platform.",
  openGraph: {
    title: "Bricx — One system to rule them all",
    description: "Modular ERP built for businesses that build, move and sell.",
    images: ["/images/problem.jpg"],
  },
};

export const viewport: Viewport = { themeColor: "#ffffff" };

/**
 * Runs before first paint:
 * - `js-hero`  hides the hero text until its reveal plays
 * - `anim`     enables scroll-in states, only when IntersectionObserver exists and the user allows motion
 * - `hero-done` safety net so content never stays hidden
 */
const motionBoot = `document.documentElement.classList.add("js-hero");if("IntersectionObserver" in window&&!matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("anim");setTimeout(function(){document.documentElement.classList.add("hero-done")},3500)`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${plexSans.variable} ${plexMono.variable} ${inter.variable} ${geist.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionBoot }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
