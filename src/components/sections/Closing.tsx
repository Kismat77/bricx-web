import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { Button } from "@/components/ui/Button";
import { closing } from "@/content/home";

export function Closing() {
  return (
    <section className="closing layer wrap" id="demo" aria-labelledby="cta-t">
      <Reveal as="p" className="kick" variant="fade-blur">
        {closing.kicker}
      </Reveal>
      <SplitText as="h2" className="h2" id="cta-t" mode="line" gradient delay={0.1} text={closing.title} />
      <Button href={closing.cta.href} size="sm" reveal="fade-blur" delay={0.45}>
        {closing.cta.label}
      </Button>
    </section>
  );
}
