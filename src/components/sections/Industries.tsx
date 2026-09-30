"use client";

import { Fragment, useState, type CSSProperties } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { Check } from "@/components/icons/Misc";
import { industries } from "@/content/home";

/** The live job card. Its rows follow it in (`.kid`), and the bars fill once it has landed. */
function JobCard() {
  const { job } = industries;
  let k = 0;
  const kid = () => ({ className: "kid", style: { "--k": k++ } as CSSProperties });
  const kidCls = (cls: string) => {
    const p = kid();
    return { ...p, className: `${cls} kid` };
  };
  return (
    <Reveal className="jobwrap" id="jobwrap" variant="card" delay={0.15}>
      <div className="job" data-shine="once">
        <div className="top">
          <div {...kidCls("row1")}>
            <p className="proj">{job.project}</p>
            <span className="live">
              <i />
              LIVE
            </span>
          </div>
          <p {...kidCls("amt")}>{job.amount}</p>
          <p {...kidCls("meta")}>{job.meta}</p>
          <div {...kidCls("bar")}>
            <b style={{ width: `${job.consumed}%` }} />
          </div>
          <div {...kidCls("row2")}>
            <span>{job.consumed}% consumed</span>
            <em>{job.status}</em>
          </div>
        </div>
        <div className="lines">
          {job.lines.map((l) => (
            <div key={l.label} {...kidCls("line")}>
              <div className="k">
                <span>{l.label}</span>
                <span>
                  <strong>{l.value} </strong>
                  <span>{l.of}</span>
                </span>
              </div>
              <div className="t">
                <b style={{ width: `${l.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div {...kidCls("foot")}>
          <span className="ok">
            <i>
              <Check />
            </i>
            {job.footOk}
          </span>
          <span className="m">{job.footMeta}</span>
        </div>
        <span className="shine" aria-hidden="true" />
      </div>
      <div className="chips">
        {job.chips.map((c) => (
          <span key={c} {...kid()}>
            {c}
          </span>
        ))}
      </div>
    </Reveal>
  );
}

export function Industries() {
  const [open, setOpen] = useState(0);
  return (
    <section className="industries layer" id="industries" aria-labelledby="ind-t">
      <div className="wrap ind-grid">
        <div className="left">
          <div className="titles">
            <SplitText className="eyebrow" mode="char" text={industries.eyebrow} />
            <SplitText as="h2" className="h2 sm" id="ind-t" mode="line" gradient text={industries.title} />
          </div>
          <div className="acc">
            {industries.items.map((it, i) => (
              <Fragment key={it.name}>
                <hr className={open === i ? "on" : undefined} />
                <Reveal className={`item${open === i ? "open" : ""}`} variant="slide" delay={i * 0.07}>
                  <button
                    aria-expanded={open === i}
                    aria-controls={`ind-p${i}`}
                    id={`ind-b${i}`}
                    onClick={() => setOpen(open === i ? -1 : i)}
                  >
                    {it.name}
                  </button>
                  <div className="panel" id={`ind-p${i}`} role="region" aria-labelledby={`ind-b${i}`}>
                    <div>{it.body}</div>
                  </div>
                </Reveal>
              </Fragment>
            ))}
          </div>
        </div>
        <JobCard />
      </div>
    </section>
  );
}
