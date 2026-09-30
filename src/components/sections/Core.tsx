"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { useInView } from "@/components/motion/useInView";
import { moduleIcons } from "@/components/icons/ModuleIcons";
import { core, type CoreModule } from "@/content/home";

/** Cards land outward from the centre photo. */
const radialDelay = (x: number) => 0.12 + Math.abs(x + 110 - 720) / 1600;

/**
 * A module card. On hover / focus it takes Figma's Hover variant: green glass, navy icon chip, name moves up under the
 * icon and the description opens at the bottom. The two spacers trade flex-grow so the move animates (styles: .mod).
 */
function ModuleCard({ m }: { m: CoreModule }) {
  const Icon = moduleIcons[m.icon];
  return (
    <Reveal
      className="mod"
      variant="card"
      delay={Number(radialDelay(m.x).toFixed(2))}
      tilt={7}
      shine="loop"
      tabIndex={0}
      style={{ "--x": `${m.x}px`, "--y": `${m.y}px` } as CSSProperties}
    >
      <span className="ic">
        <Icon />
      </span>
      <span className="sp1" aria-hidden="true" />
      <p className="name">{m.name}</p>
      <span className="sp2" aria-hidden="true" />
      <div className="desc">
        <p>{m.desc}</p>
      </div>
    </Reveal>
  );
}

export function Core() {
  const mods = useRef<HTMLDivElement>(null);
  const seen = useInView(mods, { threshold: 0.35 });
  const [loop, setLoop] = useState(false);
  // once every card has landed, a shine wave passes outward through the modules every few seconds
  useEffect(() => {
    if (!seen) return;
    const t = setTimeout(() => setLoop(true), 1500);
    return () => clearTimeout(t);
  }, [seen]);

  const [left, right] = [core.modules.filter((m) => m.x < 720), core.modules.filter((m) => m.x >= 720)];
  return (
    <section className="core layer" id="core" aria-labelledby="core-t">
      <div className="stage wrap">
        <div className="head">
          <SplitText className="eyebrow" mode="char" text={core.eyebrow} />
          <SplitText as="h2" className="h2 sm" id="core-t" mode="line" gradient text={core.title} />
        </div>
        <div className={`mods${loop ? " loop" : ""}`} ref={mods}>
          {left.map((m) => (
            <ModuleCard key={m.name} m={m} />
          ))}
          <Reveal className="photo-card baked" variant="fade" delay={0} scrollScale={{ scale: 0.88, zoom: 1.08 }}>
            <Image src={core.photo.src} alt={core.photo.alt} width={300} height={424} sizes="300px" />
            <p>{core.photo.caption}</p>
          </Reveal>
          {right.map((m) => (
            <ModuleCard key={m.name} m={m} />
          ))}
        </div>
      </div>
    </section>
  );
}
