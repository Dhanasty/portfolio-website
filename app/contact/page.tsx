"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";

const CREAM  = "#e8e4d9";
const BORDER = "1px solid rgba(232,228,217,0.09)";
const CTA_TEXT = "LET'S TALK";

export default function ContactPage() {
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const charRefs   = useRef<(HTMLSpanElement | null)[]>([]);
  const bodyRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const chars   = charRefs.current.filter(Boolean) as HTMLSpanElement[];

    if (reduced) {
      gsap.set(chars, { opacity: 1, filter: "blur(0px)" });
      gsap.set([eyebrowRef.current, bodyRef.current], { opacity: 1 });
      return;
    }

    gsap.set(eyebrowRef.current, { opacity: 0, y: 12 });
    gsap.set(chars, { filter: "blur(14px)", opacity: 0, y: 10, force3D: true });
    gsap.set(bodyRef.current, { opacity: 0, y: 18 });

    const tl = gsap.timeline({ delay: 0.2 });

    tl.to(eyebrowRef.current, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" });

    tl.to(
      chars,
      {
        filter: "blur(0px)",
        opacity: 1,
        y: 0,
        duration: 0.65,
        stagger: 0.038,
        ease: "power2.out",
        force3D: true,
      },
      "-=0.25"
    );

    tl.to(
      bodyRef.current,
      { opacity: 1, y: 0, duration: 0.65, ease: "power2.out" },
      "-=0.45"
    );
  }, []);

  return (
    <main>
      {/* ── Contact section ──────────────────────────────────────────────── */}
      <section className="px-8 pt-28 pb-20">

        {/* Eyebrow */}
        <div
          ref={eyebrowRef}
          className="flex justify-between items-center mb-8"
          style={{ opacity: 0 }}
        >
          <p className="text-label" style={{ color: "#585858" }}>Get in Touch</p>
          <div className="flex items-center gap-2.5">
            <span
              style={{
                display: "inline-block",
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#4ade80",
                animation: "dot-pulse 2.2s ease-in-out infinite",
              }}
            />
            <p className="text-label" style={{ color: "rgba(88,88,88,0.7)" }}>
              Available for New Projects
            </p>
          </div>
        </div>

        {/* "LET'S TALK" — blur-to-sharp per character */}
        <h2
          className="mb-20 font-black tracking-tighter leading-none"
          style={{ fontSize: "clamp(4.5rem, 17vw, 21rem)", textTransform: "uppercase", color: CREAM }}
          aria-label={CTA_TEXT}
        >
          {CTA_TEXT.split("").map((char, i) => (
            <span
              key={i}
              ref={(el) => { charRefs.current[i] = el; }}
              className="inline-block"
              style={{ willChange: "transform, filter, opacity" }}
              aria-hidden="true"
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </h2>

        {/* Contact body */}
        <div
          ref={bodyRef}
          className="grid grid-cols-12 gap-x-4 gap-y-10 pt-12"
          style={{ borderTop: BORDER, opacity: 0 }}
        >
          {/* Email */}
          <div className="col-span-7">
            <p className="text-label mb-4" style={{ color: "rgba(88,88,88,0.45)" }}>
              Primary Contact
            </p>
            <motion.a
              href="mailto:dhanasty@gmail.com"
              data-cursor-hover
              className="font-bold tracking-tight transition-colors duration-300"
              style={{ fontSize: "clamp(1.2rem, 2.4vw, 2.2rem)", color: CREAM, display: "inline-block" }}
              whileHover={{ x: 10, color: "#585858" } as never}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
            >
              dhanasty@gmail.com
            </motion.a>
          </div>

          {/* CTA */}
          <div className="col-start-9 col-end-13 flex flex-col gap-5 justify-end">
            <motion.a
              href="mailto:dhanasty@gmail.com"
              data-cursor-hover
              className="inline-flex items-center justify-between gap-6 px-7 py-5 w-full"
              style={{ border: "1px solid rgba(232,228,217,0.15)" }}
              whileHover={{ backgroundColor: CREAM } as never}
              transition={{ duration: 0.28 }}
            >
              <span className="text-label" style={{ color: CREAM }}>Start a Project</span>
              <span style={{ color: CREAM, fontSize: "0.95rem" }}>→</span>
            </motion.a>

            <a
              href="/work"
              data-cursor-hover
              className="text-label transition-colors duration-300"
              style={{ color: "rgba(88,88,88,0.45)" }}
            >
              Or view selected work ↑
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer
        className="px-8 py-10"
        style={{
          borderTop: BORDER,
          background: "radial-gradient(ellipse 80% 120% at 50% 130%, rgba(20,14,8,1) 0%, #0a0a0a 55%)",
        }}
      >
        <div className="flex justify-between items-center">
          <p className="text-label" style={{ color: "rgba(88,88,88,0.35)" }}>
            © 2025 DHANASEKAR — ALL RIGHTS RESERVED
          </p>
          <div className="flex items-center gap-8">
            {[
              { label: "LinkedIn", href: "https://linkedin.com/in/dhanasekar" },
              { label: "GitHub",   href: "https://github.com/dhanasekar" },
              { label: "Email",    href: "mailto:dhanasty@gmail.com" },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                data-cursor-hover
                className="text-label transition-colors duration-300"
                style={{ color: "rgba(88,88,88,0.35)" }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = CREAM)}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(88,88,88,0.35)")}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}
