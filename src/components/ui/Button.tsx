import type { CSSProperties, ReactNode } from "react";
import { Reveal, type RevealVariant } from "@/components/motion/Reveal";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  size?: "lg" | "sm";
  /** Scroll-in preset; omit for buttons that are revealed by their parent (hero). */
  reveal?: RevealVariant;
  delay?: number;
  style?: CSSProperties;
};

/** Brand button: green primary or light ghost. Widens on hover (styles: .btn in base.css). */
export function Button({ href, children, variant = "primary", size = "lg", reveal, delay, style }: Props) {
  return (
    <Reveal
      as="a"
      href={href}
      className={`btn btn-${variant} btn-${size}`}
      variant={reveal}
      delay={delay}
      style={style}
    >
      {children}
    </Reveal>
  );
}
