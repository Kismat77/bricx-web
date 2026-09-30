/**
 * Landing page copy and data. Content edits happen here — components only handle layout and motion.
 * Positions marked "Figma" come from the Bricx-Marketing-Page file (node 447:11882, 1440 × 5656).
 */
import type { ModuleIconName } from "@/components/icons/ModuleIcons";
import type { MetricArtName } from "@/components/icons/MetricArt";

export const nav = {
  links: [
    { label: "Products", href: "#core", menu: true },
    { label: "Solutions", href: "#industries", menu: true },
    { label: "Pricing", href: "#demo" },
    { label: "Resources", href: "#demo" },
  ],
};

export const hero = {
  eyebrow: "One system to rule them all.",
  /** Each entry reveals as one masked unit ("one platform" stays together). */
  words: ["All", "your", "operational", "departments", "on", "one platform", "."],
  primary: { label: "Book a demo", href: "#demo" },
  secondary: { label: "Get Started", href: "#core" },
};

export const problem = {
  eyebrow: "Problem Statement",
  title: "Nobody knows what the project really costs until its finished.",
  body: "By then the money is spent, the material is gone, and the reconciliation is an argument between three spreadsheets that were never going to agree.",
  image: {
    src: "/images/problem.jpg",
    alt: "Frustrated man at his desk, staring past his laptop",
    width: 1200,
    height: 691,
  },
  notes: [
    { text: "Profit??", left: "63.896%", top: "90.363%", rotate: -6.25, delay: 0.85 },
    { text: "Sales??", left: "82.859%", top: "81.043%", rotate: -46.42, delay: 1 },
  ],
};

export type Metric = { value: string; label: string; sub: string; color: string; art: MetricArtName };

export const results = {
  eyebrow: "After ninety days",
  title: "What changes in the first quarter.",
  body: "Numbers from live implementations, measured ninety days after go-live.",
  cta: { label: "Book a free consultation.", href: "#demo" },
  image: { src: "/images/desk.jpg", alt: "Team reviewing growth charts in a meeting", width: 588, height: 394 },
  metrics: [
    { value: "40 hrs", label: "estimated hours saved", sub: "per month, per site", color: "#1A9353", art: "clock" },
    { value: "6 wks", label: "compared to old ERP", sub: "to go live", color: "#D9A441", art: "calendar" },
    { value: "99.2%", label: "stock accuracy by count", sub: "post implementation", color: "#E07A5F", art: "pie" },
    { value: "Rs 2.4 Cr", label: "monthly spend tracked", sub: "across all modules", color: "#2C6FB5", art: "budget" },
  ] satisfies Metric[],
};

export const industries = {
  eyebrow: "Built for your trade",
  title: "Industry Solutions",
  items: [
    {
      name: "Construction & contracting",
      body: "Site stores, labour and machine hours paid against the job while it is still running — so the final bill confirms what you already knew instead of telling you something new.",
    },
    {
      name: "Trading & distribution",
      body: "Stock, orders and receivables across every branch and warehouse, so you see the margin on each order instead of at month end.",
    },
    {
      name: "Manufacturing",
      body: "Bills of material, production runs and raw material used, costed against each batch, so product cost reflects what the floor actually consumed.",
    },
    {
      name: "Agro & food",
      body: "Purchases from growers, batch and expiry tracking and cold-store stock in one ledger, so wastage shows up before it becomes a write-off.",
    },
    {
      name: "Logistics & transport",
      body: "Fleet, trips, fuel and driver hours costed per trip, so every delivery shows what it earned once the truck is back.",
    },
  ],
  job: {
    project: "Lakeside Highway Project",
    amount: "Rs 24.8 Lakhs",
    meta: "running cost · contract Rs 42L",
    consumed: 59,
    status: "On track",
    lines: [
      { label: "Site Stores", value: "Rs 12.4L", of: "of Rs 18L", pct: 69 },
      { label: "Labour Hours", value: "1,840 hrs", of: "of 2,800", pct: 66 },
      { label: "Machine Hours", value: "620 hrs", of: "of 1,100", pct: 56 },
    ],
    footOk: "Final bill within contract",
    footMeta: "9.1% margin",
    chips: ["7 sites", "62 line", "30 articles"],
  },
};

export type CoreModule = { name: string; icon: ModuleIconName; x: number; y: number; active?: boolean; desc?: string };

export const core = {
  eyebrow: "The Core",
  title: "The same eight modules under every industry.",
  photo: {
    src: "/images/core.jpg",
    alt: "Laptop showing a spreadsheet dashboard on a home-office desk",
    caption: "One system. Any industry.",
  },
  /** x/y: Figma position inside the 1440px Core frame (desktop). */
  modules: [
    { name: "Projects", icon: "projects", x: 80, y: 258 },
    {
      name: "Procurement",
      icon: "procurement",
      x: 325,
      y: 306,
      active: true,
      desc: "Requisition through to purchase order with every approval on the record.",
    },
    { name: "Accounting", icon: "accounting", x: 80, y: 614 },
    { name: "Assets", icon: "assets", x: 325, y: 562 },
    { name: "Inventory", icon: "inventory", x: 894, y: 306 },
    { name: "Operations", icon: "operations", x: 1139, y: 258 },
    { name: "People", icon: "people", x: 894, y: 562 },
    { name: "Reports", icon: "reports", x: 1139, y: 614 },
  ] satisfies CoreModule[],
};

export const closing = {
  kicker: "Not sure which modules you need?",
  title: "Tell us how you operate. We'll map it in thirty minutes.",
  cta: { label: "Book a free consultation.", href: "#demo" },
};

export const footer = {
  about: "Modular ERP built for businesses that build, move and sell",
  contact: ["📍 Kathmandu, Bagmati, Nepal", "📞 +977 1 4000000", "✉️ hello@bricx.com.np"],
  columns: [
    {
      title: "Solutions",
      links: [
        ["Projects", "#core"],
        ["Procurement", "#core"],
        ["Inventory", "#core"],
        ["Accounting", "#core"],
        ["People", "#core"],
      ],
    },
    {
      title: "Company",
      links: [
        ["About", "#top"],
        ["Customers", "#top"],
        ["Careers", "#top"],
        ["Blog", "#top"],
        ["Contact Us", "#demo"],
      ],
    },
    {
      title: "Resources",
      links: [
        ["Help centre", "#top"],
        ["Implementation guide", "#top"],
        ["Training", "#top"],
        ["System status", "#top"],
        ["Terms & privacy", "#top"],
      ],
    },
  ],
};
