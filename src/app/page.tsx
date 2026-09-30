import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { PageRope } from "@/components/line/PageRope";
import { Hero } from "@/components/sections/Hero";
import { Problem } from "@/components/sections/Problem";
import { Results } from "@/components/sections/Results";
import { Industries } from "@/components/sections/Industries";
import { Core } from "@/components/sections/Core";
import { Closing } from "@/components/sections/Closing";

export default function Home() {
  return (
    <div className="page" id="page">
      <PageRope />
      <Nav />
      <Hero />
      <Problem />
      <div className="rule r1 layer" role="presentation" />
      <Results />
      <Industries />
      <Core />
      <Closing />
      <Footer />
    </div>
  );
}
