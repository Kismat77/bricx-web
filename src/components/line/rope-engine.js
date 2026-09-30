/* eslint-disable */
// Canvas engine ported 1:1 from the approved prototype. Types: rope-engine.d.ts. Wrapper: PageRope.tsx.
/**
 * Rope line: a tapered ribbon in the style of the Bricx mark, drawn with scroll.
 * - path: ROPE_D (Figma "Vector 3", smoothed) in Figma-local coords, offset by ROPE_X/ROPE_Y into the 1440px page frame
 * - width: lighter where it enters from the left edge, full under the hero headline, thinner behind the metric cards,
 *   a touch heavier where it underlines the closing line; all transitions blurred over ~360px
 * - where it crosses itself the upper strand gets a thin white gap (the mark's 3D fold)
 * - intro: on the hero:go event it draws in with the headline and stops at INTRO_X/INTRO_Y, then follows scroll
 *
 * @param {HTMLCanvasElement} cv  fixed, full-viewport canvas (see .page-line in base.css)
 * @param {{ reduce: boolean, green: string, heroEvent: string, minWidth: number, ropeD: string, offset: [number, number] }} opts
 * @returns {() => void} stop — removes listeners and cancels the frame loop
 */
export function startRope(cv, opts) {
  const { reduce, green: GREEN, heroEvent, minWidth, ropeD: ROPE_D, offset: [ROPE_X, ROPE_Y] } = opts;
  const ctx = cv.getContext('2d');
  const STEP = 4;
  let R = null, current = 0, target = 0, raf = 0, bootAt = performance.now(), dpr = 1, introAt = null;
  const LEAD = 0, INTRO_X = 1306, INTRO_Y = 360, INTRO_D = 2400;     // px of lead-in off the left edge; where the intro stops (right-hand space); intro ms
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
    const P = [[raw[0][0] + ROPE_X, raw[0][1] + ROPE_Y]]; let carry = 0;
    for (let k = 1; k < raw.length; k++) {
      const [ax, ay] = raw[k - 1], [bx, by] = raw[k], dd = Math.hypot(bx - ax, by - ay);
      let pos = STEP - carry;
      while (pos <= dd) { P.push([ax + (bx - ax) * pos / dd + ROPE_X, ay + (by - ay) * pos / dd + ROPE_Y]); pos += STEP; }
      carry = dd - (pos - STEP);
    }
    return P;
  }
  const blur = (a, r) => { let b = a; for (let p = 0; p < 3; p++) { const o = new Float32Array(b.length); for (let i = 0; i < b.length; i++) { let s = 0, c = 0; for (let j = Math.max(0, i - r); j <= Math.min(b.length - 1, i + r); j++) { s += b[j]; c++; } o[i] = s / c; } b = o; } return b; };
  const sstep = x => { x = Math.min(1, Math.max(0, x)); return x * x * (3 - 2 * x); };

  function build() {
    if (innerWidth < minWidth) { cv.style.display = 'none'; R = null; return; }   // the path is drawn for the desktop layout
    cv.style.display = '';
    const P = flatten(LEAD ? leadIn(ROPE_D) : ROPE_D), N = P.length, L = (N - 1) * STEP, WMAX = 50;
    const nx = new Float32Array(N), ny = new Float32Array(N), ang = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      const a = P[Math.max(0, i - 1)], b = P[Math.min(N - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], m = Math.hypot(dx, dy) || 1;
      nx[i] = -dy / m; ny[i] = dx / m; ang[i] = Math.atan2(dy, dx);
    }
    const kS = new Float32Array(N);                       // signed curvature (rad / px)
    for (let i = 1; i < N - 1; i++) { let d = ang[i + 1] - ang[i - 1]; d -= Math.round(d / (2 * Math.PI)) * 2 * Math.PI; kS[i] = d / (2 * STEP); }
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
      const heavy = sstep((y - 4560) / 200) * sstep((5000 - y) / 120);   // a touch heavier where it underlines the closing line
      const focus = sstep((y - 520) / 50) * sstep((700 - y) / 50) * sstep((860 - x) / 90);   // weight under "one platform."
      const thin = sstep((y - 2400) / 90) * sstep((2880 - y) / 90);                           // eases off behind the metric cards
      M[i] = (1 + 0.12 * heavy) * (1 + 0.1 * focus) * (1 - 0.5 * thin);
      W[i] = body * (0.36 + 0.64 * sstep((s - sEdge) / 700));
    }
    const Ms = blur(M, 45);                                              // long, soft transitions between weights (~360px)
    for (let i = 0; i < N; i++) {
      W[i] = Math.max(3, W[i] * Ms[i]);
      wTop = Math.max(wTop, W[i]);
    }
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
    for (let i = 0; i < N; i++) if (kA[i] > 0.0105) { let j = i; while (j < N && kA[j] > 0.0105) j++; if (j - i >= 14 && P[(i + j) >> 1][1] > 840) slivers.push([i, j, -Math.sign(kS[(i + j) >> 1]) || 1]); i = j; }
    // scroll mapping: downward travel counts fully, loops and sideways travel partly
    const v = [0];
    for (let i = 1; i < N; i++) { const dy = P[i][1] - P[i - 1][1], hid = P[i][1] > 5100 ? 0.04 : 1; v.push(v[i - 1] + hid * (Math.max(dy, 0) + 0.35 * (STEP - Math.max(dy, 0)))); }   // stretches hidden under the footer cost almost no scroll
    // scroll picks up where the intro stops: 0 at the intro point, 1 at the end of the path
    let IS = iE, bd = 1e9; for (let i = iE; i < Math.min(N, iE + 900); i++) { const dd = Math.hypot(P[i][0] - INTRO_X, P[i][1] - INTRO_Y); if (dd < bd) { bd = dd; IS = i; } }
    const y1 = Math.max(...P.map(p => p[1]));
    const u = v.map(x => Math.max(0, (x - v[IS]) / (v[N - 1] - v[IS])));
    R = { P, N, L, W, nx, ny, zones, slivers, u, IS, y1, IL: IS * STEP, I0: Math.max(0, sEdge - 40) };
    resize(); onScroll(); if (reduce) current = target; draw();
  }

  function resize() { dpr = Math.min(2, devicePixelRatio || 1); cv.width = Math.round(innerWidth * dpr); cv.height = Math.round(innerHeight * dpr); cv.style.width = innerWidth + 'px'; cv.style.height = innerHeight + 'px'; }

  // outline of the ribbon between sample a and position f (fractional index), widened by `grow`
  function ribbon(a, f, grow) {
    const { P, W, nx, ny, N } = R, b = Math.min(N - 1, Math.floor(f)), fr = Math.min(1, f - b);
    const tip = b < N - 1 ? [P[b][0] + (P[b + 1][0] - P[b][0]) * fr, P[b][1] + (P[b + 1][1] - P[b][1]) * fr, W[b] + (W[b + 1] - W[b]) * fr] : [P[b][0], P[b][1], W[b]];
    ctx.beginPath();
    for (let i = a; i <= b; i++) { const h = W[i] / 2 + grow; i === a ? ctx.moveTo(P[i][0] + nx[i] * h, P[i][1] + ny[i] * h) : ctx.lineTo(P[i][0] + nx[i] * h, P[i][1] + ny[i] * h); }
    const ht = tip[2] / 2 + grow;
    ctx.lineTo(tip[0] + nx[b] * ht, tip[1] + ny[b] * ht);
    ctx.arc(tip[0], tip[1], ht, Math.atan2(ny[b], nx[b]), Math.atan2(-ny[b], -nx[b]), true);   // round, rope-like head
    for (let i = b; i >= a; i--) { const h = W[i] / 2 + grow; ctx.lineTo(P[i][0] - nx[i] * h, P[i][1] - ny[i] * h); }
    const h0 = W[a] / 2 + grow;
    ctx.arc(P[a][0], P[a][1], h0, Math.atan2(-ny[a], -nx[a]), Math.atan2(ny[a], nx[a]), true);
    ctx.closePath(); ctx.fill();
  }

  function draw() {
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height);
    if (!R || current < 1) return;
    const f = current / STEP, ox = document.documentElement.clientWidth / 2 - 720 - scrollX, oy = -scrollY;
    ctx.setTransform(dpr, 0, 0, dpr, ox * dpr, oy * dpr);
    ctx.fillStyle = GREEN; ribbon(0, f, 0);
    for (const [a, b] of R.zones) {
      if (a >= f) break;
      ctx.fillStyle = '#fff'; ribbon(a, Math.min(b, f), 5);                              // gap around the upper strand
      ctx.fillStyle = GREEN; ribbon(Math.max(0, a - 12), Math.min(b + 12, f), 0);        // redraw it on top, overlapping so no seams
    }
    ctx.fillStyle = '#fff';
    for (const [a, b, side] of R.slivers) {
      if (a >= f) break;
      const e = Math.min(b, Math.floor(f)), len = b - a; if (e - a < 2) continue;
      const { P, W, nx, ny } = R;
      ctx.beginPath();
      for (let i = a; i <= e; i++) { const u = (i - a) / len, off = side * W[i] * 0.27, hw = 1.15 * Math.sin(Math.PI * u); const x = P[i][0] + nx[i] * off, y = P[i][1] + ny[i] * off; i === a ? ctx.moveTo(x + nx[i] * hw, y + ny[i] * hw) : ctx.lineTo(x + nx[i] * hw, y + ny[i] * hw); }
      for (let i = e; i >= a; i--) { const u = (i - a) / len, off = side * W[i] * 0.27, hw = 1.15 * Math.sin(Math.PI * u); ctx.lineTo(P[i][0] + nx[i] * off - nx[i] * hw, P[i][1] + ny[i] * off - ny[i] * hw); }
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
    target = f > 0.995 ? R.L : lo * STEP;
    if (!raf) raf = requestAnimationFrame(tick);
    else draw();
  }
  function tick() {
    raf = 0;
    const now = performance.now();
    if (introAt === null && now - bootAt > 1400) introAt = now;      // safety if the hero never signals
    if (introAt === null || now < introAt) { current = 0; draw(); raf = requestAnimationFrame(tick); return; }
    const el = now - introAt;
    if (el < INTRO_D) {                                             // intro: enters from off-screen alongside the headline, climbs into the right-hand space
      const p = el / INTRO_D, e = p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      current = Math.min(target, R.I0 + (R.IL - R.I0) * e); draw(); raf = requestAnimationFrame(tick); return;
    }
    current += (target - current) * 0.12;
    if (Math.abs(target - current) < 0.3) current = target;
    draw();
    if (current !== target) raf = requestAnimationFrame(tick);
  }

  let rt, lastW = innerWidth;
  const onResize = () => { resize(); draw(); if (innerWidth === lastW) return; lastW = innerWidth; clearTimeout(rt); rt = setTimeout(build, 150); };
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
