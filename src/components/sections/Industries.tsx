"use client";

import { Fragment, useState, type CSSProperties } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { Check } from "@/components/icons/Misc";
import { industries, type IndustryJob } from "@/content/home";

/**
 * The live example card for one industry. Keyed by industry, so switching remounts it: the card rises in, its rows
 * follow (`.kid`) and the bars fill again (styles: .job in sections.css / motion.css).
 */
function JobCard({ job, label }: { job: IndustryJob; label: string }) {
  let k = 0;
  const kid = (cls: string) => ({ className: `${cls} kid`, style: { "--k": k++ } as CSSProperties });
  return (
    <div className="job" data-shine="once" role="group" aria-label={`${label}: live example`}>
      <div className="top">
        <div {...kid("row1")}>
          <p className="proj">{job.project}</p>
          <span className="live">
            <i />
            LIVE
          </span>
        </div>
        <p {...kid("amt")}>{job.amount}</p>
        <p {...kid("meta")}>{job.meta}</p>
        <div {...kid("bar")}>
          <b style={{ width: `${job.consumed}%` }} />
        </div>
        <div {...kid("row2")}>
          <span>{job.progress}</span>
          <em>{job.status}</em>
        </div>
      </div>
      <div className="lines">
        {job.lines.map((l) => (
          <div key={l.label} {...kid("line")}>
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
      <div {...kid("foot")}>
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
  );
}

export function Industries() {
  const [open, setOpen] = useState(0);
  const [shown, setShown] = useState(0); // the card keeps the last opened industry when every item is collapsed
  const toggle = (i: number) => {
    setOpen(open === i ? -1 : i);
    setShown(i);
  };
  const current = industries.items[shown];
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
                <Reveal className={`item${open === i ? " open" : ""}`} variant="slide" delay={i * 0.07}>
                  <button aria-expanded={open === i} aria-controls={`ind-p${i}`} id={`ind-b${i}`} onClick={() => toggle(i)}>
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
        <Reveal className="jobwrap" id="jobwrap" variant="card" delay={0.15}>
          <JobCard key={current.name} job={current.job} label={current.name} />
        </Reveal>
      </div>
    </section>
  );
}
