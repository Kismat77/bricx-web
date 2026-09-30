"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { SplitText } from "@/components/motion/SplitText";
import { Button } from "@/components/ui/Button";
import { prefersReducedMotion } from "@/lib/motion";
import { hero } from "@/content/home";

/** Fired when the hero reveal starts; the page line starts its intro on it. */
export const HERO_GO_EVENT = "hero:go";

export function Hero() {
  const [go, setGo] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      const raf = requestAnimationFrame(() => setGo(true));
      return () => cancelAnimationFrame(raf);
    }
    let cancelled = false;
    const fonts = document.fonts ? document.fonts.ready : Promise.resolve();
    Promise.race([fonts, new Promise((r) => setTimeout(r, 700))]).then(() => {
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          if (cancelled) return;
          setGo(true);
          document.dispatchEvent(new Event(HERO_GO_EVENT));
        }),
      );
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <header className={`hero layer${go ? "go" : ""}`} id="top">
      <div className="wrap">
        <div className="hero-copy">
          <div className="titles">
            <SplitText as="p" className="eyebrow" mode="char" text={hero.eyebrow} play={go} />
            {/* each word rises out of its own mask, one after another */}
            <h1 id="heroTitle" aria-label={hero.words.join(" ").replace(" .", ".")}>
              {hero.words.map((w, i) => (
                <span key={w + i}>
                  <span className="w" aria-hidden="true">
                    <span style={{ transitionDelay: `${0.35 + i * 0.08}s` } as CSSProperties}>{w}</span>
                  </span>
                  {i < hero.words.length - 2 ? " " : ""}
                </span>
              ))}
            </h1>
          </div>
          <div className="cta-row">
            <Button href={hero.primary.href}>{hero.primary.label}</Button>
            <Button href={hero.secondary.href} variant="ghost">
              {hero.secondary.label}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
