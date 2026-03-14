"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const HEADLINE = "DHANASEKAR";

// Repeated enough times so each "half" is wider than any viewport
const MARQUEE_SEGMENT =
  "AI ENGINEER · MACHINE LEARNING · COMPUTER VISION · DATA ENGINEERING · REACT · NEXT.JS · PYTHON · ETL PIPELINES · NLP · DEEP LEARNING · ";
const MARQUEE_CONTENT = Array(5).fill(MARQUEE_SEGMENT).join("");

export default function Hero() {
  const charsRef   = useRef<(HTMLSpanElement | null)[]>([]);
  const roleRef    = useRef<HTMLParagraphElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const hintRef    = useRef<HTMLDivElement>(null);
  const metaRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // ── Respect prefers-reduced-motion ──────────────────────────────────
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const chars   = charsRef.current.filter(Boolean) as HTMLSpanElement[];

    if (reduced) {
      gsap.set(chars, { yPercent: 0, opacity: 1 });
      gsap.set([roleRef.current, dividerRef.current, hintRef.current, metaRef.current], {
        opacity: 1,
      });
      return;
    }

    // ── Initial hidden state ─────────────────────────────────────────────
    gsap.set(chars, { yPercent: 115, force3D: true });
    gsap.set([roleRef.current, dividerRef.current, hintRef.current, metaRef.current], {
      opacity: 0,
    });

    const tl = gsap.timeline({ delay: 0.2 });

    // 1. Role text fades in
    tl.to(roleRef.current, {
      opacity: 1,
      duration: 0.7,
      ease: "power2.out",
    });

    // 2. AROCK — each character slides up, staggered
    tl.to(
      chars,
      {
        yPercent: 0,
        duration: 1.15,
        ease: "power4.out",
        stagger: 0.065,
        force3D: true,
      },
      "-=0.35"
    );

    // 3. Divider scales in from left
    tl.to(
      dividerRef.current,
      {
        opacity: 1,
        scaleX: 1,
        duration: 0.65,
        ease: "power2.inOut",
      },
      "-=0.55"
    );

    // 4. Bottom strip fades in
    tl.to(
      [hintRef.current, metaRef.current],
      { opacity: 1, duration: 0.5, ease: "power2.out" },
      "-=0.35"
    );

    // 5. Breathing pulse on scroll hint (starts after everything settles)
    gsap.to(hintRef.current, {
      opacity: 0.2,
      duration: 2.1,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      delay: 3.0,
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      className="relative w-full h-screen flex flex-col overflow-hidden"
      style={{ background: "#0a0a0a" }}
    >
      {/* ── Video background ───────────────────────────────────────────── */}
      <video
        className="absolute inset-0 w-full h-full object-contain"
        autoPlay
        muted
        loop
        playsInline
        poster="/profile.png"
        style={{ willChange: "transform" }}
      >
        <source src="/placeholder-video.mp4" type="video/mp4" />
      </video>

      {/* ── Gradient: clear top → heavy bottom ─────────────────────────── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(10,10,10,0.08) 0%, rgba(10,10,10,0.04) 28%, rgba(10,10,10,0.55) 72%, rgba(10,10,10,0.96) 100%)",
        }}
        aria-hidden="true"
      />

      {/* ── Role text (sits below fixed brand mark) ─────────────────────── */}
      <div className="relative z-10 px-8 pt-28">
        <p
          ref={roleRef}
          className="text-label"
          style={{ color: "rgba(232,228,217,0.38)", opacity: 0 }}
        >
          AI Engineer &amp; Creative Developer
        </p>
      </div>

      {/* ── Pushes headline toward the bottom third ──────────────────────── */}
      <div className="flex-1" aria-hidden="true" />

      {/* ── AROCK — left-anchored, each letter clipped for slide-up ─────── */}
      <div
        className="relative z-10 px-8 pb-4 flex gap-[0.01em]"
        aria-label={HEADLINE}
      >
        {HEADLINE.split("").map((char, i) => (
          <span
            key={i}
            className="overflow-hidden"
            style={{ lineHeight: 0.82 }}
            aria-hidden="true"
          >
            <span
              ref={(el) => {
                charsRef.current[i] = el;
              }}
              className="block font-black tracking-tighter"
              style={{
                fontSize: "clamp(3rem, 11vw, 13rem)",
                color: "#e8e4d9",
                lineHeight: 0.82,
                willChange: "transform",
              }}
            >
              {char}
            </span>
          </span>
        ))}
      </div>

      {/* ── Divider — scaleX animates from 0 → 1 ───────────────────────── */}
      <div
        ref={dividerRef}
        className="relative z-10 mx-8"
        style={{
          height: "1px",
          background: "rgba(232,228,217,0.1)",
          transformOrigin: "left center",
          transform: "scaleX(0)",
          opacity: 0,
        }}
      />

      {/* ── Bottom strip: scroll hint ←→ location/status ────────────────── */}
      <div className="relative z-10 flex justify-between items-center px-8 py-7">
        <div
          ref={hintRef}
          className="flex items-center gap-4"
          style={{ opacity: 0 }}
        >
          <div
            style={{
              width: "1px",
              height: "42px",
              background: "rgba(232,228,217,0.28)",
            }}
          />
          <span
            className="text-label"
            style={{ color: "rgba(232,228,217,0.48)" }}
          >
            Scroll to Explore
          </span>
        </div>

        <div
          ref={metaRef}
          className="flex flex-col gap-1 text-right"
          style={{ opacity: 0 }}
        >
          <span
            className="text-label"
            style={{ color: "rgba(232,228,217,0.26)" }}
          >
            Based in Bengaluru
          </span>
          <span
            className="text-label"
            style={{ color: "rgba(232,228,217,0.26)" }}
          >
            Available for Work
          </span>
        </div>
      </div>

      {/* ── Marquee ticker — bottom edge of hero ────────────────────────── */}
      <div
        className="relative z-10 overflow-hidden"
        style={{
          borderTop: "1px solid rgba(232,228,217,0.07)",
          background: "rgba(10,10,10,0.55)",
        }}
        aria-hidden="true"
      >
        <div
          className="flex whitespace-nowrap py-3"
          style={{
            animation: "marquee 26s linear infinite",
            willChange: "transform",
          }}
        >
          {/* Two identical spans — first scrolls off, second seamlessly continues */}
          <span
            className="text-label flex-shrink-0"
            style={{ color: "rgba(232,228,217,0.2)", paddingRight: "0" }}
          >
            {MARQUEE_CONTENT}
          </span>
          <span
            className="text-label flex-shrink-0"
            style={{ color: "rgba(232,228,217,0.2)" }}
          >
            {MARQUEE_CONTENT}
          </span>
        </div>
      </div>
    </section>
  );
}
