import Image from "next/image";
import type { CSSProperties } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { QuestionBig, QuestionSmall } from "@/components/icons/Misc";
import { problem } from "@/content/home";

export function Problem() {
  const { image } = problem;
  return (
    <section className="problem layer" aria-labelledby="problem-t">
      <div className="wrap">
        <div className="head">
          <div className="titles">
            <SplitText className="eyebrow" mode="char" text={problem.eyebrow} />
            <SplitText as="h2" className="h2" id="problem-t" mode="line" gradient text={problem.title} />
          </div>
          <Reveal as="p" className="body" variant="fade-blur" delay={0.25}>
            {problem.body}
          </Reveal>
        </div>
        {/* frame grows with scroll; the photo and its notes settle together inside .shot-in */}
        <Reveal className="shot" variant="fade" scrollScale={{ scale: 0.86, zoom: 1.14 }}>
          <div className="shot-in">
            <Image
              className="photo"
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              sizes="(min-width: 1280px) 1200px, 100vw"
            />
            <Reveal
              as="span"
              className="doodle"
              variant="pop"
              delay={0.55}
              style={{ left: "51.641%", top: "4.612%", width: "11.485%" }}
            >
              <QuestionBig />
            </Reveal>
            <Reveal
              as="span"
              className="doodle"
              variant="pop"
              delay={0.7}
              style={{ left: "59.753%", top: "7.304%", width: "5.651%" }}
            >
              <QuestionSmall />
            </Reveal>
            {problem.notes.map((n) => (
              <Reveal
                key={n.text}
                as="p"
                className="note"
                variant="note"
                delay={n.delay}
                style={
                  {
                    left: n.left,
                    top: n.top,
                    transform: `translate(-50%,-50%) rotate(${n.rotate}deg)`,
                  } as CSSProperties
                }
              >
                {n.text}
              </Reveal>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
