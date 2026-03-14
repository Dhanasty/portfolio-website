"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─── Data ─────────────────────────────────────────────────────────────────────

const projects = [
  {
    id: "01",
    title: "Deep Learning Video Colorization",
    category: "Computer Vision",
    year: "2024",
    image: "https://picsum.photos/seed/colorization/900/600",
  },
  {
    id: "02",
    title: "Job Market Analytics Platform",
    category: "Data Engineering",
    year: "2024",
    image: "https://picsum.photos/seed/jobmarket/900/600",
  },
  {
    id: "03",
    title: "E-commerce Price Optimization",
    category: "Machine Learning",
    year: "2023",
    image: "https://picsum.photos/seed/ecommerce/900/600",
  },
  {
    id: "04",
    title: "AI Voice Recorder",
    category: "AI Application",
    year: "2023",
    image: "https://picsum.photos/seed/voiceai/900/600",
  },
];

// Group into rows of 2 for separator injection
const rows = projects.reduce<(typeof projects)[]>((acc, p, i) => {
  if (i % 2 === 0) acc.push([p]);
  else acc[acc.length - 1].push(p);
  return acc;
}, []);

// ─── WorkCard ─────────────────────────────────────────────────────────────────

function WorkCard({ project }: { project: (typeof projects)[0] }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered]       = useState(false);
  const [displayNum, setDisplayNum] = useState("00");

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const target  = parseInt(project.id, 10);

    if (reduced) {
      setDisplayNum(project.id);
      return;
    }

    // ── Scroll reveal: scale 1.18 → 1 (reveal from depth) ──────────────
    gsap.set(el, { scale: 1.18, opacity: 0, force3D: true });

    const revealTween = gsap.to(el, {
      scale: 1,
      opacity: 1,
      duration: 1.2,
      ease: "power3.out",
      force3D: true,
      scrollTrigger: {
        trigger: el,
        start: "top 88%",
        once: true,
      },
    });

    // ── Number counter: 00 → project.id ─────────────────────────────────
    const counter = { val: 0 };
    const countTween = gsap.to(counter, {
      val: target,
      duration: 0.75,
      ease: "power2.out",
      onUpdate: () => {
        setDisplayNum(String(Math.round(counter.val)).padStart(2, "0"));
      },
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        once: true,
      },
    });

    return () => {
      revealTween.scrollTrigger?.kill();
      countTween.scrollTrigger?.kill();
    };
  }, [project.id]);

  return (
    <div
      ref={cardRef}
      className="relative overflow-hidden"
      style={{ aspectRatio: "16/10", willChange: "transform, opacity" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-cursor-hover
    >
      {/* ── Project image ─────────────────────────────────────────────── */}
      <motion.img
        src={project.image}
        alt={project.title}
        className="absolute inset-0 w-full h-full object-cover"
        animate={{ scale: hovered ? 1.05 : 1 }}
        transition={{ duration: 0.75, ease: [0.25, 0.1, 0.25, 1] }}
        style={{ willChange: "transform" }}
      />

      {/* ── Animated project number — top left ────────────────────────── */}
      <div
        className="absolute top-5 left-5 z-10 font-mono"
        style={{
          fontSize: "0.6875rem",
          letterSpacing: "0.25em",
          color: "rgba(232,228,217,0.35)",
        }}
      >
        {displayNum}
      </div>

      {/* ── Clip-path title reveal — slides up from bottom on hover ─────── */}
      <motion.div
        className="absolute inset-0 flex flex-col justify-end p-6"
        style={{
          background:
            "linear-gradient(to top, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.55) 45%, transparent 100%)",
          willChange: "clip-path",
        }}
        animate={{
          clipPath: hovered
            ? "inset(0% 0% 0% 0%)"
            : "inset(72% 0% 0% 0%)",
        }}
        transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
      >
        <p
          className="text-label mb-2"
          style={{ color: "rgba(232,228,217,0.55)" }}
        >
          {project.category}&nbsp;·&nbsp;{project.year}
        </p>
        <h3
          className="font-black tracking-tighter leading-none"
          style={{ fontSize: "clamp(1.8rem, 3vw, 3rem)", color: "#e8e4d9" }}
        >
          {project.title}
        </h3>
      </motion.div>

      {/* ── Subtle corner arrow ───────────────────────────────────────── */}
      <motion.span
        className="absolute bottom-5 right-5 z-10"
        style={{ color: "#e8e4d9", fontSize: "1rem" }}
        animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : -6 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        →
      </motion.span>
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function Works() {
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.set(headerRef.current, { opacity: 0, y: 22 });
    gsap.to(headerRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: "power2.out",
      scrollTrigger: {
        trigger: headerRef.current,
        start: "top 85%",
        once: true,
      },
    });
  }, []);

  return (
    <section id="work" className="px-8 py-32">

      {/* ── Section header ─────────────────────────────────────────────── */}
      <div
        ref={headerRef}
        className="flex justify-between items-baseline mb-20 pb-5"
        style={{
          borderBottom: "1px solid rgba(232,228,217,0.09)",
          opacity: 0,
        }}
      >
        <h2
          className="text-label"
          style={{ color: "#585858" }}
        >
          Selected Works
        </h2>
        <span
          className="font-mono"
          style={{
            fontSize: "0.6875rem",
            letterSpacing: "0.3em",
            color: "rgba(88,88,88,0.5)",
          }}
        >
          ({projects.length.toString().padStart(2, "0")})
        </span>
      </div>

      {/* ── 2-col grid with 1px cream separators between rows ──────────── */}
      <div className="flex flex-col">
        {rows.map((row, rowIdx) => (
          <Fragment key={rowIdx}>
            {/* Cream 1px separator — between rows (not before first) */}
            {rowIdx > 0 && (
              <div
                style={{
                  height: "1px",
                  background: "rgba(232,228,217,0.1)",
                  width: "100%",
                }}
              />
            )}

            {/* Row: two cards side by side */}
            <div className="grid grid-cols-2 gap-x-4 py-16">
              {row.map((project) => (
                <WorkCard key={project.id} project={project} />
              ))}
            </div>
          </Fragment>
        ))}
      </div>
    </section>
  );
}
