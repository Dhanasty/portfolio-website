"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { X } from "lucide-react";

const NAV_LINKS = [
  { label: "Home",    href: "/",        index: "01", desc: "Start here" },
  { label: "Work",    href: "/work",    index: "02", desc: "Selected projects" },
  { label: "About",   href: "/about",   index: "03", desc: "Who I am" },
  { label: "Contact", href: "/contact", index: "04", desc: "Let's talk" },
];

const SOCIALS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/dhanasekar-s-b8935a1b7/" },
  { label: "GitHub",   href: "https://github.com/dhanasty" },
  { label: "Email",    href: "mailto:dhanasty@gmail.com" },
];

const EASE = [0.22, 1, 0.36, 1] as const;

export default function MenuPage() {
  const router = useRouter();

  const handleNavigate = (href: string) => {
    router.push(href);
  };

  return (
    <div
      className="fixed inset-0 z-[9996] flex"
      style={{ background: "#020c0f" }}
    >
      {/* Close button */}
      <button
        onClick={() => router.back()}
        className="fixed top-6 right-8 z-[9999] flex items-center gap-2.5 p-1"
        data-cursor-hover
        aria-label="Close menu"
      >
        <span style={{ display: "flex", color: "#e8e4d9" }}>
          <X size={20} strokeWidth={1.5} />
        </span>
        <span
          className="text-label hidden sm:block"
          style={{ color: "#e8e4d9" }}
        >
          Close
        </span>
      </button>

      {/* ══ LEFT — nav (30%) ══════════════════════════════════════════════ */}
      <div
        className="flex flex-col justify-between flex-shrink-0 px-10 sm:px-14 py-8"
        style={{
          width: "30%",
          background: "linear-gradient(135deg, #0a2e32 0%, #061a1e 55%, #020c0f 100%)",
        }}
      >
        {/* Top bar */}
        <motion.div
          className="flex justify-between items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.2, duration: 0.4 } }}
        >
          <span className="text-label" style={{ color: "rgba(232,228,217,0.4)" }}>
            DS
          </span>
          <span className="text-label" style={{ color: "rgba(94,212,212,0.35)" }}>
            Portfolio — 2025
          </span>
        </motion.div>

        {/* Middle: about + nav */}
        <div className="flex flex-col gap-8">

          {/* About blurb */}
          <motion.p
            className="text-body max-w-xs"
            style={{ color: "rgba(232,228,217,0.3)" }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.25, duration: 0.5, ease: EASE } }}
          >
            AI &amp; data engineering enthusiast — machine learning, computer
            vision, scalable pipelines. Currently at FIS Global, Bengaluru.
          </motion.p>

          {/* Nav links */}
          <nav className="flex flex-col">
            {NAV_LINKS.map((link, i) => (
              <motion.div
                key={link.label}
                initial={{ opacity: 0, y: 40 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { delay: 0.3 + i * 0.08, duration: 0.55, ease: EASE },
                }}
              >
                <motion.a
                  href={link.href}
                  data-cursor-hover
                  onClick={(e) => { e.preventDefault(); handleNavigate(link.href); }}
                  className="flex items-baseline gap-4 py-0.5 w-fit"
                  whileHover="hover"
                  initial="rest"
                >
                  {/* Index */}
                  <motion.span
                    className="font-mono select-none"
                    style={{
                      fontSize: "0.6875rem",
                      letterSpacing: "0.3em",
                      color: "rgba(94,212,212,0.45)",
                      lineHeight: 1,
                    }}
                    variants={{
                      rest:  { opacity: 0, x: -8 },
                      hover: { opacity: 1, x: 0, transition: { duration: 0.2 } },
                    }}
                  >
                    {link.index}
                  </motion.span>

                  {/* Label */}
                  <span className="relative">
                    <motion.span
                      className="block font-black leading-none tracking-tighter"
                      style={{
                        fontSize: "clamp(1.6rem, 3vw, 3.5rem)",
                        color: "#e8e4d9",
                        willChange: "transform",
                      }}
                      variants={{
                        rest:  { x: 0,  color: "#e8e4d9" },
                        hover: { x: 12, color: "#ffffff", transition: { duration: 0.3, ease: EASE } },
                      }}
                    >
                      {link.label}
                    </motion.span>
                    {/* Underline */}
                    <motion.span
                      className="absolute left-0 bottom-0 block h-px"
                      style={{ background: "rgba(94,212,212,0.6)", originX: 0 }}
                      variants={{
                        rest:  { scaleX: 0 },
                        hover: { scaleX: 1, transition: { duration: 0.3, ease: EASE } },
                      }}
                    />
                  </span>

                  {/* Desc */}
                  <motion.span
                    className="text-label self-center"
                    style={{ color: "rgba(94,212,212,0.5)" }}
                    variants={{
                      rest:  { opacity: 0, x: -6 },
                      hover: { opacity: 1, x: 0, transition: { duration: 0.2, delay: 0.04 } },
                    }}
                  >
                    {link.desc}
                  </motion.span>
                </motion.a>
              </motion.div>
            ))}
          </nav>
        </div>

        {/* Bottom: copyright + socials */}
        <motion.div
          className="flex justify-between items-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.65, duration: 0.4 } }}
        >
          <p className="text-label" style={{ color: "rgba(94,212,212,0.3)" }}>
            © 2025 Dhanasekar S
          </p>
          <div className="flex gap-8">
            {SOCIALS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                data-cursor-hover
                className="text-label transition-colors duration-300"
                style={{ color: "rgba(94,212,212,0.4)" }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#e8e4d9")}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(94,212,212,0.4)")}
              >
                {label}
              </a>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ══ RIGHT — portrait (70%) ══════════════════════════════════════════ */}
      <motion.div
        className="relative hidden md:block flex-1"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE } }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/profile.png"
          alt="Dhanasekar S"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center top",
            filter: "grayscale(0.1) brightness(0.68)",
            display: "block",
          }}
        />
        {/* Gradient overlays */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(2,12,15,0.5) 0%, transparent 40%, rgba(2,12,15,0.85) 100%)",
          }}
        />
        <div
          className="absolute inset-y-0 left-0"
          style={{
            width: 80,
            background: "linear-gradient(to left, transparent, #020c0f)",
          }}
        />

        {/* Name + role pinned bottom */}
        <div className="absolute bottom-10 left-10 right-8">
          <p
            className="font-black tracking-tighter leading-tight mb-2"
            style={{ fontSize: "clamp(1.4rem, 2.5vw, 2.4rem)", color: "#e8e4d9" }}
          >
            Dhanasekar S
          </p>
          <p className="text-label" style={{ color: "rgba(94,212,212,0.65)" }}>
            AI Engineer &amp; Creative Developer
          </p>
        </div>
      </motion.div>
    </div>
  );
}
