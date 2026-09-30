"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { CountUp } from "@/components/motion/CountUp";
import { MetricArt } from "@/components/icons/MetricArt";
import { Button } from "@/components/ui/Button";
import { results, type Metric } from "@/content/home";

function MetricCard({ m, delay }: { m: Metric; delay: number }) {
  const [seen, setSeen] = useState(false);
  return (
    <Reveal
      as="article"
      className="metric"
      variant="fade-up"
      delay={delay}
      tilt={5}
      shine="once"
      onInView={() => setSeen(true)}
      style={{ "--c": m.color } as CSSProperties}
    >
      <p className="value" style={{ color: m.color }}>
        <CountUp value={m.value} start={seen} delay={delay} />
      </p>
      <div>
        <p className="label">{m.label}</p>
        <p className="sub">{m.sub}</p>
      </div>
      <MetricArt name={m.art} />
    </Reveal>
  );
}

export function Results() {
  const { image } = results;
  return (
    <section className="results layer" aria-labelledby="results-t">
      <div className="wrap">
        <div className="row">
          <div className="copy">
            <div className="titles">
              <SplitText className="eyebrow" mode="char" text={results.eyebrow} />
              <SplitText as="h2" className="h2" id="results-t" mode="line" gradient text={results.title} />
            </div>
            <Reveal as="p" className="body" variant="fade-blur" delay={0.3}>
              {results.body}
            </Reveal>
            <Button href={results.cta.href} size="sm" reveal="fade-blur" delay={0.4}>
              {results.cta.label}
            </Button>
          </div>
          <Reveal className="desk" variant="fade" delay={0.1} scrollScale={{ scale: 0.88, zoom: 1.14 }}>
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              sizes="(min-width: 1280px) 588px, 100vw"
            />
          </Reveal>
        </div>
        <div className="metrics">
          {results.metrics.map((m, i) => (
            <MetricCard key={m.label} m={m} delay={i * 0.15} />
          ))}
        </div>
      </div>
    </section>
  );
}
