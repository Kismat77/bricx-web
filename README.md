# Bricx — marketing site

Landing page for **Bricx**, the modular ERP for businesses that build, move and sell.
Built from the Figma file **Bricx-Marketing-Page** (node `447:11882`, 1440 × 5656).

- **Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4
- **Approved prototype:** https://claude.ai/artifact/C3Zw3g5Dp1qW5jSiB8ur4G (the rope version). This repo matches it pixel for pixel at 1440px.

---

## Getting started

Needs Node 20+ (see `.nvmrc`).

```bash
npm install
npm run dev          # http://localhost:3000
```

| Script                            | What it does                                |
| --------------------------------- | ------------------------------------------- |
| `npm run dev`                     | Local dev server with hot reload            |
| `npm run build`                   | Production build (Vercel / `next start`)    |
| `npm start`                       | Serve the production build                  |
| `npm run build:static`            | Static export to `out/` for any static host |
| `npm run lint`                    | ESLint (Next + React hooks rules)           |
| `npm run typecheck`               | TypeScript, no emit                         |
| `npm run format` / `format:check` | Prettier                                    |

Run `npm run lint && npm run typecheck && npm run build` before opening a PR. CI runs the same.

## Project structure

```
src/
  app/
    layout.tsx          fonts (self-hosted), metadata, motion boot script
    page.tsx            page composition: sections in order
    globals.css         design tokens + Tailwind theme, imports the style layers
    fonts/              IBM Plex Sans/Mono, Inter, Geist (woff2, OFL)
  content/home.ts       ALL page copy and data (edit text here)
  config/site.ts        rope colour, rope breakpoint
  components/
    layout/             Nav, Footer
    sections/           Hero, Problem, Results, Industries, Core, Closing
    ui/Button.tsx       brand button (magnetic on desktop)
    brand/              Logo + traced logo paths
    icons/              module icons, metric illustrations, misc (from Figma)
    motion/             Reveal, SplitText, CountUp + hooks (in-view, tilt, magnetic, scroll-scale)
    line/               the page rope: PageRope.tsx (React) + rope-engine.js (canvas) + rope-path.ts (the path)
  styles/
    base.css            element resets, shared type (.eyebrow, .h2, .btn, .wrap)
    sections.css        section styles, mobile first
    desktop-frame.css   ≥1280px: locks every section to the Figma geometry
    motion.css          all animation styles
public/images/          photos exported from Figma
docs/HANDOFF.md         design → dev notes, animation spec, how to edit the rope
```

## Everyday changes

- **Copy / numbers / links** → `src/content/home.ts`. No component changes needed.
- **Colours, fonts** → tokens at the top of `src/app/globals.css`. They're also exposed to Tailwind (`bg-brand`, `text-brand-ink`, `font-mono`, `desk:` breakpoint…).
- **New section** → add a component in `components/sections/`, put its copy in `content/`, add it to `app/page.tsx`. Use `<Reveal>` / `<SplitText>` for motion (see below). Tailwind utilities are fine for new work.
- **Images** → replace files in `public/images/` keeping the names and aspect ratios, or update the paths in `content/home.ts`.

> ⚠️ At ≥1280px the layout is fixed to the Figma frame so the rope passes exactly where it was designed. If you change a section's height in `desktop-frame.css`, re-check the rope on desktop (see HANDOFF.md → "Editing the rope").

## Motion API (short version)

```tsx
<Reveal variant="fade-up" delay={0.15} tilt={5} shine="once">…</Reveal>   // scroll-in presets, tilt, glass shine
<Reveal variant="fade" scrollScale={{ scale: 0.88, zoom: 1.14 }}>…</Reveal> // scroll-scrubbed image scale
<SplitText as="h2" className="h2" mode="line" gradient text="…" />         // line reveal + navy→green fill
<SplitText className="eyebrow" mode="char" text="…" />                      // typed eyebrow with caret
<CountUp value="99.2%" start={seen} />                                      // number count-up
```

Everything respects `prefers-reduced-motion`: content shows immediately in its final state, and the rope is drawn in full.
Full spec in [docs/HANDOFF.md](docs/HANDOFF.md).

## Deploying

- **Vercel (recommended):** import the repo, framework preset _Next.js_, no settings needed. Set `NEXT_PUBLIC_SITE_URL` to the production URL (used for social preview images).
- **Any static host:** `npm run build:static` and upload `out/`.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for branches, commits and PR review.
