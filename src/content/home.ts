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

/** One live example card per industry (Figma "Industry Solutions" cards). Bar values are percentages. */
export type IndustryJob = {
  project: string;
  amount: string;
  meta: string;
  consumed: number;
  progress: string;
  status: string;
  lines: { label: string; value: string; of: string; pct: number }[];
  footOk: string;
  footMeta: string;
};
export type Industry = { name: string; body: string; job: IndustryJob };

export const industries = {
  eyebrow: "Built for your trade",
  title: "Industry Solutions",
  items: [
    {
      name: "Construction & contracting",
      body: "Site stores, labour and machine hours paid against the job while it is still running — so the final bill confirms what you already knew instead of telling you something new.",
      job: {
        project: "Lakeside Highway Project",
        amount: "Rs 24.8 Lakhs",
        meta: "running cost · contract Rs 42L",
        consumed: 59,
        progress: "59% consumed · Week 14 of 24",
        status: "On track",
        lines: [
          { label: "Site Stores", value: "Rs 12.4L", of: "of Rs 18L", pct: 69 },
          { label: "Labour Hours", value: "1,840 hrs", of: "of 2,800", pct: 66 },
          { label: "Machine Hours", value: "620 hrs", of: "of 1,100", pct: 56 },
        ],
        footOk: "Final bill within contract",
        footMeta: "9.1% margin",
      },
    },
    {
      name: "Trading & distribution",
      body: "Stock, orders and receivables across every branch and warehouse, so you see the margin on each order instead of at month end.",
      job: {
        project: "Newa Trading Co.",
        amount: "Rs 6.8 Lakhs",
        meta: "open order value · margin Rs 1.2L",
        consumed: 73,
        progress: "73% of monthly target fulfilled",
        status: "Above target",
        lines: [
          { label: "Purchase Orders", value: "Rs 4.1L", of: "of Rs 5.5L", pct: 75 },
          { label: "Stock Value (godown)", value: "Rs 9.4L", of: "of Rs 12L cap", pct: 78 },
          { label: "Pending Deliveries", value: "14 orders", of: "of 19 dispatched", pct: 74 },
        ],
        footOk: "Margin within target range",
        footMeta: "17.6% avg",
      },
    },
    {
      name: "Manufacturing",
      body: "Bills of material, production runs and raw material used, costed against each batch, so product cost reflects what the floor actually consumed.",
      job: {
        project: "Himalayan Steel Works",
        amount: "Rs 18.3 Lakhs",
        meta: "production cost · batch #HB-224",
        consumed: 61,
        progress: "61% of batch cost consumed",
        status: "On schedule",
        lines: [
          { label: "Raw Materials", value: "Rs 11.2L", of: "of Rs 16L", pct: 70 },
          { label: "Machine Hours", value: "840 hrs", of: "of 1,400", pct: 60 },
          { label: "Labour Cost", value: "Rs 2.8L", of: "of Rs 4.5L", pct: 62 },
        ],
        footOk: "Cost per unit within standard",
        footMeta: "Rs 1,240 / unit",
      },
    },
    {
      name: "Agro & food",
      body: "Purchases from growers, batch and expiry tracking and cold-store stock in one ledger, so wastage shows up before it becomes a write-off.",
      job: {
        project: "Annapurna Agro · Wheat Season",
        amount: "Rs 31.5 Lakhs",
        meta: "season procurement · 3 depots",
        consumed: 54,
        progress: "54% of season budget used",
        status: "Under budget",
        lines: [
          { label: "Farmer Procurement", value: "182 MT", of: "of 320 MT target", pct: 57 },
          { label: "Processing Cost", value: "Rs 4.2L", of: "of Rs 7L", pct: 60 },
          { label: "Dispatched to Market", value: "148 MT", of: "of 182 MT received", pct: 81 },
        ],
        footOk: "Dispatch rate ahead of last season",
        footMeta: "81% vs 68%",
      },
    },
    {
      name: "Logistics & transport",
      body: "Fleet, trips, fuel and driver hours costed per trip, so every delivery shows what it earned once the truck is back.",
      job: {
        project: "Roshi Logistics · October",
        amount: "Rs 8.4 Lakhs",
        meta: "fleet operating cost · 24 vehicles",
        consumed: 68,
        progress: "68% of monthly budget used",
        status: "On track",
        lines: [
          { label: "Fuel Cost", value: "Rs 3.9L", of: "of Rs 5.5L", pct: 71 },
          { label: "Driver Hours", value: "2,640 hrs", of: "of 3,840", pct: 69 },
          { label: "Trips Completed", value: "312 trips", of: "of 460 planned", pct: 68 },
        ],
        footOk: "Cost per trip within target",
        footMeta: "Rs 2,692 avg",
      },
    },
  ] satisfies Industry[],
};

export type CoreModule = { name: string; icon: ModuleIconName; x: number; y: number; desc: string };

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
    // desc: shown on hover (Figma "Container" Hover variant). Only Procurement's line is from Figma; the rest need copy review.
    { name: "Projects", icon: "projects", x: 80, y: 258, desc: "Budgets and site costs for every job, tracked against the contract live." },
    { name: "Procurement", icon: "procurement", x: 325, y: 306, desc: "Requisition through to purchase order with every approval on the record." },
    { name: "Accounting", icon: "accounting", x: 80, y: 614, desc: "Invoices, payments and ledgers, posted straight from every module." },
    { name: "Assets", icon: "assets", x: 325, y: 562, desc: "Machines, vehicles and tools with location, hours and depreciation." },
    { name: "Inventory", icon: "inventory", x: 894, y: 306, desc: "Stock across every store and site, updated with each issue and receipt." },
    { name: "Operations", icon: "operations", x: 1139, y: 258, desc: "Work orders, schedules and daily site activity, planned and closed here." },
    { name: "People", icon: "people", x: 894, y: 562, desc: "Attendance, payroll and labour hours booked against the jobs worked." },
    { name: "Reports", icon: "reports", x: 1139, y: 614, desc: "Cost, margin and stock reports built live from the same records." },
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
