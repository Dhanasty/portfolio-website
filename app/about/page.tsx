"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CREAM  = "#e8e4d9";
const BORDER = "1px solid rgba(232,228,217,0.09)";

const SKILLS = [
  "Python / JavaScript",
  "Machine Learning / Deep Learning",
  "Computer Vision / NLP",
  "React / Next.js",
  "SQL / PostgreSQL",
  "ETL Pipelines / Data Engineering",
  "Splunk / Jenkins / OpenShift",
  "Pandas / NumPy / Scikit-learn",
];

export default function AboutPage() {
  const sectionRef = useRef<HTMLElement>(null);
  const col1Ref    = useRef<HTMLDivElement>(null);
  const col2Ref    = useRef<HTMLDivElement>(null);
  const col3Ref    = useRef<HTMLDivElement>(null);
  const statNumRef = useRef<HTMLSpanElement>(null);
  const skillRefs  = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cols    = [col1Ref.current, col2Ref.current, col3Ref.current];

    if (reduced) {
      gsap.set(cols, { opacity: 1, y: 0 });
      if (statNumRef.current) statNumRef.current.textContent = "3+";
      skillRefs.current.forEach((el) => el && gsap.set(el, { opacity: 1, y: 0 }));
      return;
    }

    gsap.set(cols, { opacity: 0, y: 32, force3D: true });

    // Columns stagger in on load
    gsap.to(cols, {
      opacity: 1,
      y: 0,
      duration: 0.95,
      ease: "power3.out",
      stagger: 0.1,
      force3D: true,
      delay: 0.3,
    });

    // Count-up: 0 → 3
    const counter = { val: 0 };
    gsap.to(counter, {
      val: 3,
      duration: 1.6,
      ease: "power2.out",
      delay: 0.4,
      onUpdate: () => {
        if (statNumRef.current) {
          statNumRef.current.textContent = Math.round(counter.val) + "+";
        }
      },
    });

    // Skills staggered fade-in
    const skillEls = skillRefs.current.filter(Boolean) as HTMLDivElement[];
    gsap.set(skillEls, { opacity: 0, y: 14 });
    gsap.to(skillEls, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.08,
      ease: "power2.out",
      delay: 0.7,
    });
  }, []);

  return (
    <main>
      <section
        ref={sectionRef}
        id="about"
        className="px-8 py-20 pt-28"
      >
        {/* Eyebrow */}
        <div
          className="flex justify-between items-baseline mb-20 pb-5"
          style={{ borderBottom: BORDER }}
        >
          <p className="text-label" style={{ color: "#585858" }}>About</p>
          <p className="text-label" style={{ color: "rgba(88,88,88,0.45)" }}>Est. 2020</p>
        </div>

        {/* Three columns */}
        <div className="grid grid-cols-12 gap-x-4 gap-y-16">

          {/* Col A — Stat */}
          <div ref={col1Ref} className="col-span-3">
            <p
              className="font-black leading-none tracking-tighter"
              style={{ fontSize: "clamp(4rem, 8vw, 9rem)", color: CREAM, lineHeight: 0.85 }}
            >
              <span ref={statNumRef}>0+</span>
            </p>
            <p className="text-label mt-5" style={{ color: "#585858" }}>
              Years of Experience
            </p>
            <p className="text-label mt-2" style={{ color: "rgba(88,88,88,0.5)" }}>
              FIS Global · Bengaluru
            </p>
          </div>

          {/* Col B — Heading */}
          <div ref={col2Ref} className="col-start-5 col-span-4 flex items-end pb-1">
            <h2
              className="font-black leading-none tracking-tighter"
              style={{ fontSize: "clamp(2.5rem, 5vw, 6rem)", color: CREAM }}
            >
              Crafted
              <br />
              <span style={{ color: "#585858" }}>With Care</span>
            </h2>
          </div>

          {/* Col C — Bio + shimmer + skills */}
          <div ref={col3Ref} className="col-start-9 col-end-13 flex flex-col gap-7">
            <p className="text-body" style={{ color: "rgba(232,228,217,0.42)" }}>
              AI and data engineering enthusiast specialising in machine learning,
              computer vision, and scalable data pipelines. Currently building
              critical fintech infrastructure at FIS Global.
            </p>
            <p className="text-body" style={{ color: "rgba(232,228,217,0.24)" }}>
              Passionate about transforming raw data into intelligent, actionable
              systems — from model training to production deployment.
            </p>

            <div className="shimmer-rule" />

            <div className="flex flex-col gap-3">
              {SKILLS.map((skill, i) => (
                <div
                  key={skill}
                  ref={(el) => { skillRefs.current[i] = el; }}
                  className="flex items-center gap-3"
                >
                  <span
                    className="rounded-full flex-shrink-0"
                    style={{ width: 3, height: 3, background: "rgba(88,88,88,0.55)" }}
                  />
                  <p className="text-label" style={{ color: "rgba(88,88,88,0.75)" }}>
                    {skill}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
