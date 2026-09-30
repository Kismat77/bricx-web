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

function ModuleCard({ m }: { m: CoreModule }) {
  const Icon = moduleIcons[m.icon];
  const icon = (
    <span className="ic">
      <Icon />
    </span>
  );
  return (
    <Reveal
      className={`mod${m.active ? "active" : ""}`}
      variant="card"
      delay={Number(radialDelay(m.x).toFixed(2))}
      tilt={7}
      shine="loop"
      style={{ "--x": `${m.x}px`, "--y": `${m.y}px` } as CSSProperties}
    >
      {m.active ? (
        <>
          <div className="top">
            {icon}
            <p className="name">{m.name}</p>
          </div>
          <p className="desc">{m.desc}</p>
        </>
      ) : (
        <>
          {icon}
          <p className="name">{m.name}</p>
        </>
      )}
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
        <div className={`mods${loop ? "loop" : ""}`} ref={mods}>
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
