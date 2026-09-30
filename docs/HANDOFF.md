# Handoff notes: design → dev

Source of truth for how the Bricx landing page looks and moves. The approved prototype is
https://claude.ai/artifact/C3Zw3g5Dp1qW5jSiB8ur4G. This repo reproduces it at 1440px (page height 5656px).

## Layout

| Breakpoint         | Behaviour                                                                                                              |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| < 900px            | Mobile flow layout; nav links hidden                                                                                   |
| 900–1279px         | Tablet flow layout; nav links shown                                                                                    |
| ≥ 1280px (`desk:`) | Locked to the Figma frame: container 1200px, fixed section heights (`desktop-frame.css`). The rope is drawn only here. |

Desktop section heights (Figma): hero 735 (under a 104px nav) · problem head 212 + photo 691 · results 918 · industries 531 · core 936 · closing 219 · footer 565.

## Tokens

Navy `--brand-ink #03314B` · Green `--brand #2BE080` · Green 600 `#1FBD69` · Green 950 `#0C311D` (hero text)
Metric accents: success `#1A9353`, gold `#D9A441`, coral `#E07A5F`, blue `#2C6FB5`.
Type: IBM Plex Sans (titles/body) · IBM Plex Mono 500 (eyebrows) · Inter (UI, job card, footer) · Geist 500 (large buttons).

## Motion spec

All timings live in `src/styles/motion.css`. Easing tokens: `--out` = `cubic-bezier(.16,1,.3,1)`, `--ease` = `cubic-bezier(.22,1,.36,1)`, `--spring` = `cubic-bezier(.34,1.56,.64,1)`.
Scroll-in triggers when an element is 12% visible, 10% above the bottom of the viewport, and plays once.

| Where                                | Effect                                                                                                                                        |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Hero eyebrow                         | Types out 45ms per letter with a green caret; the caret blinks 3× then fades                                                                  |
| Hero headline                        | Word by word out of a mask: `translateY(112%) rotate(6deg)` → 0, 1.1s, 80ms apart, starting at 0.35s                                          |
| Hero buttons                         | Fade up 14px at 1.05s                                                                                                                         |
| Section headings (`h2`)              | Rise 24px line by line (120ms per line), then a navy → green gradient washes in (1.8s)                                                        |
| Other eyebrows                       | Typed, as in the hero                                                                                                                         |
| Body copy / buttons                  | Fade in from a 12px blur                                                                                                                      |
| Problem & meeting photos, Core photo | Scroll-scrubbed: frame 86–88% → 100%, photo zoom 1.14/1.08 → 1                                                                                |
| Doodles / sticky notes               | Spring pop in after the photo                                                                                                                 |
| Metric cards                         | Fade up 90px, 150ms apart; numbers count up (1.6s); icons draw in; one glass shine sweep; hover: colour glow from the top, tilt 5°, spotlight |
| Industry list                        | Rows slide up 16px, 70ms apart; the green rule draws across when an industry opens                                                            |
| Job card                             | Rises 64px, then its rows follow (60ms apart); bars fill; light runs along the bars; LIVE ping; rotating green border                         |
| Core modules                         | Rise from the centre outward; tilt 7°; a shine wave passes through every 7s                                                                   |
| Closing kicker                       | Shimmer                                                                                                                                       |
| Buttons                              | Magnetic pull on desktop                                                                                                                      |
| Footer wordmark                      | Slow 60px rise                                                                                                                                |

Reduced motion: `html.anim` is never set, so every element renders in its final state, and the rope is drawn in full with no intro.

## The page rope

Files: `components/line/PageRope.tsx` (mounts it), `rope-engine.js` (canvas drawing), `rope-path.ts` (the path).

- **Path:** Figma layer "Vector 3", redrawn and smoothed, stored as an SVG `d` string in Figma-local coordinates; `ROPE_OFFSET` moves it into the page. The canvas is fixed behind all sections (`.page-line`, z-index 0; sections are `.layer`, z-index 1; the footer sits above and hides the tail).
- **Route:** enters from beyond the left edge → runs under "one platform." → one round turn inside the container on the right → down the problem gutter → behind the photo → across behind the metric cards → one smooth S down the gap between the industry list and job card → through The Core → round turn on the right → underlines "it in thirty minutes." → down into the footer.
- **Width (engine `build()`):** 50px max. It starts at 36% where it enters the viewport and reaches full weight over 700px. It gets +10% under the hero headline (`focus`), −50% behind the metric cards (`thin`) and +12% under the closing line (`heavy`). All of these are blurred over about 360px, so they never jump. It also eases thinner in tight turns.
- **3D gaps:** where the rope crosses itself, the upper strand gets a thin white outline. Fold hairlines sit along the tightest turns but are kept out of the hero.
- **Intro:** on the `hero:go` event (fired when the headline starts), it draws for 2.4s and stops at `INTRO_X/INTRO_Y` (end of the hero turn). Scroll then continues from that point.
- **Scroll mapping:** downward travel counts fully and sideways travel at 35%, so the head stays around 62% of the viewport height. The stretch under the footer costs almost no scroll.

### Editing the rope

1. Redraw the path in Figma, keeping the 1440px frame.
2. Export the layer as SVG and copy its `d`.
3. Replace `ROPE_D` in `rope-path.ts` and update `ROPE_OFFSET` to the layer's x/y in the frame.
4. If the hero turn moved, update `INTRO_X/INTRO_Y` in `rope-engine.js`.
5. If the rope's y position changed at the metric cards or the closing line, update the `thin`/`heavy` y ranges.
6. Check at 1440px and 1920px, and with reduced motion on.

## Accessibility notes

- Split text keeps the full string in `aria-label` and hides the animated fragments.
- Decorative SVGs and the rope canvas are `aria-hidden`.
- The accordion uses `aria-expanded` / `aria-controls` with a labelled region.
- Contrast: the closing heading is dark navy because the rope sits behind it.

## Open items

- Industry descriptions are draft copy and need final wording.
- Nav dropdowns (Products, Solutions) link to sections; menus aren't designed yet.
- The rope is desktop-only; a mobile path hasn't been designed.
- The footer contact details are placeholders.
