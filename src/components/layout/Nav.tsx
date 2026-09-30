import { Logo } from "@/components/brand/Logo";
import { ChevronDown } from "@/components/icons/Misc";
import { nav } from "@/content/home";

export function Nav() {
  return (
    <nav className="nav layer" aria-label="Main">
      <div className="wrap">
        <a className="logo" href="#top" aria-label="Bricx home">
          <Logo />
        </a>
        <div className="links">
          {nav.links.map((l) => (
            <a key={l.label} href={l.href}>
              {l.label} {l.menu && <ChevronDown />}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
