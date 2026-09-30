/* eslint-disable */
// Canvas engine ported 1:1 from the approved prototype. Types: rope-engine.d.ts. Wrapper: PageRope.tsx.
/**
 * Rope line: a tapered ribbon in the style of the Bricx mark, drawn with scroll.
 * - path: ROPE_D (Figma "Vector 3", smoothed) in Figma-local coords, offset by ROPE_X/ROPE_Y into the 1440px page frame
 * - width: lighter where it enters from the left edge, full under the hero headline, thinner behind the metric cards,
 *   a touch heavier where it underlines the closing line; all transitions blurred over ~360px
 * - where it crosses itself the upper strand gets a thin white gap (the mark's 3D fold)
 * - intro: on the hero:go event it draws in with the headline and stops at INTRO_X/INTRO_Y, then follows scroll
 * - forming: like the animated Bricx mark (bricx-mark-rope.svg) it runs thin to bold. The taper behind the head is a
 *   smootherstep whose length follows the (smoothed) drawing speed, so it stretches out while the rope is laid and
 *   relaxes back to full weight when it rests
 * - highlight: under the hero's last headline line the rope covers the x-height like a highlighter (ascenders and
 *   descenders may overflow); that
 *   weight holds ~360px either side (so it enters thick from the left edge) and eases off over ~360px
 * - tail: past the Core the Figma path is cut; in the full-screen closing band (opts.end) a bold tail sweeps down and out
 *   past the right edge, then a second stroke comes back in from the left and curves down behind the footer
 * - the canvas lives in the page (absolute, a viewport tall plus PAD above and below) so it scrolls with the content on
 *   the compositor; it is re-placed and redrawn only as the viewport nears its edges
 *
 * @param {HTMLCanvasElement} cv  page-level canvas (see .page-line in base.css)
 * @param {{ reduce: boolean, green: string, heroEvent: string, minWidth: number, ropeD: string, offset: [number, number] }} opts
 * @returns {() => void} stop — removes listeners and cancels the frame loop
 */
export function startRope(cv, opts) {
  const { reduce, green: GREEN, heroEvent, minWidth, ropeD: ROPE_D, offset: [ROPE_X, ROPE_Y], end, highlight } = opts;
  const ctx = cv.getContext('2d');
  const STEP = 4;
  let R = null, current = 0, target = 0, raf = 0, bootAt = performance.now(), dpr = 1, introAt = null;
  const LEAD = 0, INTRO_X = 1306, INTRO_Y = 360, INTRO_D = 2400;     // px of lead-in off the left edge; where the intro stops (right-hand space); intro ms
  const THIN = 0.14, TAPER_K = 420, TAPER_MAX = 480;                 // head width share; taper px per (px/ms) of speed; longest taper
  const EASE_MS = 150, RISE_MS = 110, FALL_MS = 360;                 // scroll follow; taper grows fast and relaxes slowly
  const PAD = 360;                                                   // px drawn above and below the viewport
  const TAIL_BOLD = 2.3;                                             // tail weight vs the body (the mark's bold end)
  const HL_PAD = 0, HL_HOLD = 90, HL_EASE = 30;                     // highlighter: px beyond the ink; samples it holds full weight either side; ramp radius
  let speed = 0, lastT = 0, lastCur = 0, cvTop = -1e9, cvH = 0, docH = 0;
  const onHero = () => { if (introAt === null) introAt = performance.now() + 60; if (!raf && R) raf = requestAnimationFrame(tick); };
  document.addEventListener(heroEvent, onHero);
  function leadIn(d) {                          // extend the path straight back off-screen so it enters the page at full width
    const n = d.trim().split(/[\s,MC]+/).filter(Boolean).slice(0, 4).map(Number), m = Math.hypot(n[2] - n[0], n[3] - n[1]), ux = (n[2] - n[0]) / m, uy = (n[3] - n[1]) / m;
    const p = k => (n[0] - ux * LEAD * k).toFixed(2) + ' ' + (n[1] - uy * LEAD * k).toFixed(2);
    return `M${p(1)} C${p(2 / 3)} ${p(1 / 3)} ${n[0]} ${n[1]} ` + d.trim().replace(/^M\s*\S+\s+\S+\s*/, '');
  }

  function flatten(d) {                       // M + cubic C path -> points every STEP px (page coords)
    const n = d.trim().split(/[\s,MC]+/).filter(Boolean).map(Number), raw = [[n[0], n[1]]];
    let cx = n[0], cy = n[1];
    for (let i = 2; i + 5 < n.length; i += 6) {
      const [x1, y1, x2, y2, x, y] = n.slice(i, i + 6);
      for (let k = 1; k <= 24; k++) { const t = k / 24, m = 1 - t;
        raw.push([m*m*m*cx + 3*m*m*t*x1 + 3*m*t*t*x2 + t*t*t*x, m*m*m*cy + 3*m*m*t*y1 + 3*m*t*t*y2 + t*t*t*y]); }
      cx = x; cy = y;
    }
    return resample(raw, ROPE_X, ROPE_Y);
  }
  function resample(raw, ox = 0, oy = 0) {     // polyline -> points every STEP px
    const P = [[raw[0][0] + ox, raw[0][1] + oy]]; let carry = 0;
    for (let k = 1; k < raw.length; k++) {
      const [ax, ay] = raw[k - 1], [bx, by] = raw[k], dd = Math.hypot(bx - ax, by - ay);
      let pos = STEP - carry;
      while (pos <= dd) { P.push([ax + (bx - ax) * pos / dd + ox, ay + (by - ay) * pos / dd + oy]); pos += STEP; }
      carry = dd - (pos - STEP);
    }
    return P;
  }
  const cubic = (p0, p1, p2, p3, out) => { for (let k = 1; k <= 48; k++) { const t = k / 48, m = 1 - t;
    out.push([0, 1].map(c => m*m*m*p0[c] + 3*m*m*t*p1[c] + 3*m*t*t*p2[c] + t*t*t*p3[c])); } return out; };

  // closing tail (page frame coords): the Figma path is cut where it enters the band; stroke A sweeps down and out past the
  // right edge, stroke B comes back in from the left in the lower half and curves down behind the footer. G = last index of A.
  function withTail(P, box) {
    const { top, bottom } = box, H = bottom - top, out = document.documentElement.clientWidth / 2 - 720 + 170;
    let c = P.findIndex(p => p[1] >= top - 8); if (c < 2) return { P, G: -1, c: P.length };
    const [x0, y0] = P[c], tx = P[c][0] - P[c - 2][0], ty = P[c][1] - P[c - 2][1], tm = Math.hypot(tx, ty) || 1;
    const xr = 1440 + out, ye = top + 0.42 * H, xl = -out, yb = top + 0.74 * H;
    const A = resample(cubic([x0, y0], [x0 + tx / tm * 0.22 * H, y0 + ty / tm * 0.22 * H], [xr - 330, ye - 0.14 * H], [xr, ye], [[x0, y0]])).slice(1);
    const B = resample(cubic([xl, yb], [150, top + 0.56 * H], [420, top + 0.64 * H], [340, bottom + 40], [[xl, yb]]).concat([[330, bottom + 320]]));
    const head = P.slice(0, c + 1).concat(A);
    return { P: head.concat(B), G: head.length - 1, c };
  }
  const blur = (a, r) => { let b = a; for (let p = 0; p < 3; p++) { const o = new Float32Array(b.length); for (let i = 0; i < b.length; i++) { let s = 0, c = 0; for (let j = Math.max(0, i - r); j <= Math.min(b.length - 1, i + r); j++) { s += b[j]; c++; } o[i] = s / c; } b = o; } return b; };
  const sstep = x => { x = Math.min(1, Math.max(0, x)); return x * x * (3 - 2 * x); };

  function build() {
    if (innerWidth < minWidth) { cv.style.display = 'none'; R = null; return; }   // the path is drawn for the desktop layout
    cv.style.display = '';
    const box = end && end(), cut = box ? withTail(flatten(LEAD ? leadIn(ROPE_D) : ROPE_D), box) : { P: flatten(LEAD ? leadIn(ROPE_D) : ROPE_D), G: -1, c: 1e9 };
    const { P, G } = cut, N = P.length, L = (N - 1) * STEP, WMAX = 50, hidY = box ? box.bottom + 40 : 5100;
    const nx = new Float32Array(N), ny = new Float32Array(N), ang = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      const a = P[Math.max(0, i - 1)], b = P[Math.min(N - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], m = Math.hypot(dx, dy) || 1;
      nx[i] = -dy / m; ny[i] = dx / m; ang[i] = Math.atan2(dy, dx);
    }
    if (G > 0) for (const [i, j] of [[G, G - 1], [G + 1, G + 2]]) { nx[i] = nx[j]; ny[i] = ny[j]; ang[i] = ang[j]; }   // no normals across the break
    const kS = new Float32Array(N);                       // signed curvature (rad / px)
    for (let i = 1; i < N - 1; i++) { let d = ang[i + 1] - ang[i - 1]; d -= Math.round(d / (2 * Math.PI)) * 2 * Math.PI; kS[i] = d / (2 * STEP); }
    if (G > 0) kS[G] = kS[G + 1] = 0;
    const kA = blur(kS.map(Math.abs), 14);
    // width: thin at both ends, bold through the body, easing thinner through tight turns like the mark's folds
    // the rope enters from beyond the viewport's left edge: lighter as it comes into view, full weight ~700px later
    const edgeX = -(document.documentElement.clientWidth / 2 - 720) - 20; let iE = 0; while (iE < N - 1 && P[iE][0] < edgeX) iE++;
    const sEdge = iE * STEP;
    const W = new Float32Array(N), M = new Float32Array(N); let wTop = 0;
    for (let i = 0; i < N; i++) {
      const s = i * STEP, kn = Math.min(1, kA[i] / 0.018);
      const body = WMAX * (1 - 0.26 * Math.pow(kn, 1.2)) * (1 + 0.05 * Math.sin(s / 1100 * 2 * Math.PI));
      const [x, y] = P[i];
      const heavy = i > cut.c ? 1 : 0;                                   // bold through the closing tail
      const thin = sstep((y - 2400) / 90) * sstep((2880 - y) / 90);                           // eases off behind the metric cards
      M[i] = (1 + (TAIL_BOLD - 1) * heavy) * (1 - 0.5 * thin);
      W[i] = body * (0.36 + 0.64 * sstep((s - sEdge) / 700));
    }
    const Ms = blur(M, 45);                                              // long, soft transitions between weights (~360px)
    for (let i = 0; i < N; i++) {
      W[i] = Math.max(3, W[i] * Ms[i]);
    }
    const hl = highlight && highlight();
    if (hl) {   // highlighter floor: cover the ink box, held flat past the words, then a long blurred ramp
      let F = new Float32Array(N); const cy = (hl.top + hl.bottom) / 2;
      for (let i = 0; i < N; i++) { const [x, y] = P[i]; if (x >= hl.x0 - 16 && x <= hl.x1 + 16 && Math.abs(y - cy) < 160) F[i] = 2 * (Math.max(y - hl.top, hl.bottom - y) + HL_PAD); }
      const D = new Float32Array(N);
      for (let i = 0; i < N; i++) if (F[i]) for (let j = Math.max(0, i - HL_HOLD); j <= Math.min(N - 1, i + HL_HOLD); j++) D[j] = Math.max(D[j], F[i]);
      F = blur(D, HL_EASE);
      for (let i = 0; i < N; i++) W[i] = Math.max(W[i], F[i]);
    }
    for (let i = 0; i < N; i++) wTop = Math.max(wTop, W[i]);
    // where the rope passes over itself, the upper strand gets a thin gap (the mark's 3D fold)
    const near = wTop + 4, grid = new Map(), over = new Uint8Array(N), skip = Math.ceil(WMAX * 3 / STEP);
    for (let i = 0; i < N; i++) {
      const [x, y] = P[i], cx = Math.floor(x / near), cy = Math.floor(y / near);
      for (let dx = -1; dx <= 1 && !over[i]; dx++) for (let dy = -1; dy <= 1 && !over[i]; dy++) {
        const list = grid.get((cx + dx) * 1e5 + cy + dy); if (!list) continue;
        for (const j of list) if (j < i - skip && Math.hypot(P[j][0] - x, P[j][1] - y) < (W[i] + W[j]) / 2 + 4) { over[i] = 1; break; }
      }
      const key = cx * 1e5 + cy; (grid.get(key) || grid.set(key, []).get(key)).push(i);
    }
    const zones = [], pad = Math.ceil(WMAX * .7 / STEP);
    for (let i = 0; i < N; i++) if (over[i]) { let j = i; while (j < N && over[j]) j++; zones.push([Math.max(1, i - pad), Math.min(N - 1, j + pad)]); i = j; }
    // fold slivers: a hairline gap along the outside of the tightest turns, like the cuts inside the mark
    const slivers = [];
    for (let i = 0; i < N; i++) if (kA[i] > 0.0105) { let j = i; while (j < N && kA[j] > 0.0105) j++; if (j - i >= 14 && P[(i + j) >> 1][1] > 840 && !(i <= G + 1 && j >= G)) slivers.push([i, j, -Math.sign(kS[(i + j) >> 1]) || 1]); i = j; }
    // scroll mapping: downward travel counts fully, loops and sideways travel partly
    const v = [0];
    for (let i = 1; i < N; i++) { if (i === G + 1) { v.push(v[i - 1] + 60); continue; }   // the off-screen hop costs a short pause
      const dy = P[i][1] - P[i - 1][1], hid = P[i][1] > hidY ? 0.04 : 1; v.push(v[i - 1] + hid * (Math.max(dy, 0) + 0.35 * (STEP - Math.max(dy, 0)))); }   // stretches hidden under the footer cost almost no scroll
    // scroll picks up where the intro stops: 0 at the intro point, 1 at the end of the path
    let IS = iE, bd = 1e9; for (let i = iE; i < Math.min(N, iE + 900); i++) { const dd = Math.hypot(P[i][0] - INTRO_X, P[i][1] - INTRO_Y); if (dd < bd) { bd = dd; IS = i; } }
    const y1 = Math.max(...P.map(p => p[1]));
    const u = v.map(x => Math.max(0, (x - v[IS]) / (v[N - 1] - v[IS])));
    let iEnd = N - 1; while (iEnd > G + 1 && P[iEnd][1] > hidY) iEnd--;   // where stroke B slips under the footer
    R = { P, N, L, G, W, tail: box ? { c: cut.c, iEnd, top: box.top } : null, nx, ny, zones, slivers, u, IS, y1, IL: IS * STEP, I0: Math.max(0, sEdge - 40) };
    resize(); onScroll(); if (reduce) current = target; draw();
  }

  function resize() {
    const w = document.documentElement.clientWidth;
    dpr = Math.min(2, devicePixelRatio || 1); cvH = innerHeight + 2 * PAD; cvTop = -1e9;
    cv.width = Math.round(w * dpr); cv.height = Math.round(cvH * dpr); cv.style.width = w + 'px'; cv.style.height = cvH + 'px';
    cv.style.height = '0px'; docH = document.documentElement.scrollHeight; cv.style.height = cvH + 'px';   // measure the page without the canvas
  }
  // keep the canvas band around the viewport; moving it is a transform, so it never shifts layout
  function place() {
    const y = scrollY, vh = innerHeight, maxTop = Math.max(0, docH - cvH);
    if (cvTop > -1e9 && (cvTop <= y - PAD / 2 || cvTop === 0) && (cvTop + cvH >= y + vh + PAD / 2 || cvTop === maxTop)) return;
    cvTop = Math.round(Math.min(maxTop, Math.max(0, y - PAD)));
    cv.style.transform = `translate3d(0,${cvTop}px,0)`;
  }

  // width of slice i: thin at the head, smootherstep to full weight over a taper that follows the drawing speed
  let taper = 0;
  const wd = i => {
    if (taper < 2) return R.W[i];
    const x = (current - i * STEP) / taper; if (x >= 1) return R.W[i];
    const t = x <= 0 ? 0 : x * x * x * (x * (6 * x - 15) + 10);
    return R.W[i] * (THIN + (1 - THIN) * t);
  };

  // outline of the ribbon between sample a and position f (fractional index), widened by `grow`
  function ribbon(a, f, grow) {
    const { P, nx, ny, N } = R, b = Math.min(N - 1, Math.floor(f)), fr = Math.min(1, f - b), wb = wd(b);
    const tip = b < N - 1 ? [P[b][0] + (P[b + 1][0] - P[b][0]) * fr, P[b][1] + (P[b + 1][1] - P[b][1]) * fr, wb + (wd(b + 1) - wb) * fr] : [P[b][0], P[b][1], wb];
    ctx.beginPath();
    for (let i = a; i <= b; i++) { const h = wd(i) / 2 + grow; i === a ? ctx.moveTo(P[i][0] + nx[i] * h, P[i][1] + ny[i] * h) : ctx.lineTo(P[i][0] + nx[i] * h, P[i][1] + ny[i] * h); }
    const ht = tip[2] / 2 + grow;
    ctx.lineTo(tip[0] + nx[b] * ht, tip[1] + ny[b] * ht);
    ctx.arc(tip[0], tip[1], ht, Math.atan2(ny[b], nx[b]), Math.atan2(-ny[b], -nx[b]), true);   // round, rope-like head
    for (let i = b; i >= a; i--) { const h = wd(i) / 2 + grow; ctx.lineTo(P[i][0] - nx[i] * h, P[i][1] - ny[i] * h); }
    const h0 = wd(a) / 2 + grow;
    ctx.arc(P[a][0], P[a][1], h0, Math.atan2(-ny[a], -nx[a]), Math.atan2(ny[a], nx[a]), true);
    ctx.closePath(); ctx.fill();
  }

  function draw() {
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height);
    if (!R) return;
    place();
    if (current < 1) return;
    taper = reduce ? 0 : Math.min(TAPER_MAX, speed * TAPER_K);
    const f = current / STEP, ox = document.documentElement.clientWidth / 2 - 720, oy = -cvTop;
    ctx.setTransform(dpr, 0, 0, dpr, ox * dpr, oy * dpr);
    ctx.fillStyle = GREEN;
    if (R.G > 0 && f > R.G) { ribbon(0, R.G, 0); if (f > R.G + 1) ribbon(R.G + 1, f, 0); }   // two strokes either side of the off-screen hop
    else ribbon(0, f, 0);
    for (const [a, b] of R.zones) {
      if (a >= f) break;
      if (R.G > 0 && a <= R.G && b > R.G) continue;
      ctx.fillStyle = '#fff'; ribbon(a, Math.min(b, f), 5);                              // gap around the upper strand
      ctx.fillStyle = GREEN; ribbon(Math.max(0, a - 12), Math.min(b + 12, f), 0);        // redraw it on top, overlapping so no seams
    }
    ctx.fillStyle = '#fff';
    for (const [a, b, side] of R.slivers) {
      if (a >= f) break;
      const e = Math.min(b, Math.floor(f)), len = b - a; if (e - a < 2) continue;
      const { P, nx, ny } = R;
      ctx.beginPath();
      for (let i = a; i <= e; i++) { const u = (i - a) / len, off = side * wd(i) * 0.27, hw = 1.15 * Math.sin(Math.PI * u); const x = P[i][0] + nx[i] * off, y = P[i][1] + ny[i] * off; i === a ? ctx.moveTo(x + nx[i] * hw, y + ny[i] * hw) : ctx.lineTo(x + nx[i] * hw, y + ny[i] * hw); }
      for (let i = e; i >= a; i--) { const u = (i - a) / len, off = side * wd(i) * 0.27, hw = 1.15 * Math.sin(Math.PI * u); ctx.lineTo(P[i][0] + nx[i] * off - nx[i] * hw, P[i][1] + ny[i] * off - ny[i] * hw); }
      ctx.closePath(); ctx.fill();
    }
  }

  function onScroll() {
    if (!R) return;
    if (reduce) { target = R.L; draw(); return; }
    const vh = innerHeight, max = Math.max(1, document.documentElement.scrollHeight - vh), f = Math.min(1, scrollY / max);
    const T0 = vh * 0.62, T = scrollY + vh * (0.62 + 0.38 * f * f), uT = (T - T0) / Math.max(1, R.y1 - T0);
    let lo = R.IS, hi = R.N - 1;
    while (lo < hi) { const m = (lo + hi) >> 1; if (R.u[m] < uT) lo = m + 1; else hi = m; }
    const t = R.tail;
    if (t) {   // the tail is paced by the band: starts as its top passes 75% down the screen, done when it fills the screen
      const q = sstep((scrollY - (t.top - vh * 0.75)) / (vh * 0.75));
      lo = q > 0 ? Math.max(t.c, t.c + (t.iEnd - t.c) * q) : Math.min(lo, t.c);
    }
    target = f > 0.995 ? R.L : lo * STEP;
    if (!raf) raf = requestAnimationFrame(tick);
    else draw();
  }
  // smoothed forward drawing speed (px/ms): drives the taper length
  function track(now) {
    const dt = Math.min(64, Math.max(1, now - (lastT || now - 16))); lastT = now;
    const v = Math.max(0, current - lastCur) / dt; lastCur = current;
    speed += (v - speed) * (1 - Math.exp(-dt / (v > speed ? RISE_MS : FALL_MS)));
    return dt;
  }
  function tick() {
    raf = 0;
    const now = performance.now();
    if (introAt === null && now - bootAt > 1400) introAt = now;      // safety if the hero never signals
    if (introAt === null || now < introAt) { current = 0; draw(); raf = requestAnimationFrame(tick); return; }
    const el = now - introAt;
    if (el < INTRO_D) {                                             // intro: enters from off-screen alongside the headline, climbs into the right-hand space
      const p = el / INTRO_D, e = p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      current = Math.min(target, R.I0 + (R.IL - R.I0) * e); track(now); draw(); raf = requestAnimationFrame(tick); return;
    }
    const dt = Math.min(64, Math.max(1, now - (lastT || now - 16)));
    current += (target - current) * (1 - Math.exp(-dt / EASE_MS));   // frame-rate independent follow
    if (Math.abs(target - current) < 0.3) current = target;
    track(now); draw();
    if (current !== target || speed > 0.002) raf = requestAnimationFrame(tick);
    else { speed = 0; lastT = 0; draw(); }
  }

  document.fonts?.ready.then(() => { if (R) build(); });   // re-measure the highlight with the web font
  let rt, lastW = innerWidth, lastH = innerHeight;   // the closing band is a viewport tall, so height changes re-route the tail
  const onResize = () => { resize(); draw(); if (innerWidth === lastW && innerHeight === lastH) return; lastW = innerWidth; lastH = innerHeight; clearTimeout(rt); rt = setTimeout(build, 150); };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onResize);
  build();

  return function stop() {
    removeEventListener('scroll', onScroll);
    removeEventListener('resize', onResize);
    document.removeEventListener(heroEvent, onHero);
    clearTimeout(rt);
    cancelAnimationFrame(raf);
  };
}
