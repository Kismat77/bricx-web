import { Logo } from "@/components/brand/Logo";
import { Reveal } from "@/components/motion/Reveal";
import { footer } from "@/content/home";

export function Footer() {
  return (
    <footer>
      <div className="wrap cols">
        <Reveal className="about" variant="fade-blur">
          <p>{footer.about}</p>
          {footer.contact.map((c) => (
            <p key={c}>{c}</p>
          ))}
        </Reveal>
        <div className="links3">
          {footer.columns.map((col, i) => (
            <Reveal key={col.title} variant="fade-blur" delay={i * 0.08}>
              <h3>{col.title}</h3>
              <ul>
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    <a href={href}>{label}</a>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
      <Reveal className="big" aria-hidden="true" variant="rise">
        <Logo width={1200} height={340} mono="#2A353C" />
      </Reveal>
    </footer>
  );
}
