# Contributing

## Workflow

1. Branch from `main`: `feat/<short-name>`, `fix/<short-name>`, `chore/<short-name>` (e.g. `feat/pricing-section`).
2. Keep PRs small and focused: one section or one concern per PR.
3. Commits follow [Conventional Commits](https://www.conventionalcommits.org): `feat: add pricing section`, `fix(hero): caret overlaps on Safari`.
4. Before pushing: `npm run lint && npm run typecheck && npm run build`.
5. Open a PR using the template. Add before/after screenshots at **1440px** and **390px** for anything visual.
6. At least one review. Design review (Kismat) for visual or motion changes.
7. Squash-merge to `main`. `main` deploys to production.

## Code conventions

- **Content lives in `src/content/`.** Components should not hard-code copy.
- **Server components by default.** Add `"use client"` only where there is state, effects or browser APIs (motion, accordion, rope).
- **Styling:** the existing sections use the class-based styles in `src/styles/` (ported from the approved prototype). New work can use Tailwind utilities and the brand tokens (`bg-brand`, `text-brand-ink`, …). Utilities win over the section styles, because those sit in the `components` layer.
- **Avoid Tailwind class names as custom class names** (`grid`, `flex`, `hidden`, `block`, `container`, …). They collide with utilities.
- **Motion:** use `Reveal` / `SplitText` / `CountUp` instead of new one-off observers. Anything that hides content before it animates must be scoped to `html.anim`, so it stays visible without JS and with reduced motion.
- **Desktop geometry** (≥1280px) is fixed to the Figma frame. Changing a section height means checking the rope route.
- **Accessibility:** keep headings in order, give images real `alt` text, keep focus styles, and check keyboard use of interactive parts (accordion).

## Design ↔ code

- Figma: _Bricx-Marketing-Page_, node `447:11882`.
- Brand: navy `#03314B`, green `#2BE080`.
- Questions about motion or the rope go to design before changing the numbers in `motion.css` or `rope-engine.js`.
