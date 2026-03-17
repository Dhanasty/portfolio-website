"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { X, Menu } from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────

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

// ─── Parallax Stack Config ────────────────────────────────────────────────────
//
// Each layer uses the same source image but a different speedMultiplier.
// Math: layerX = mouseX * speedMultiplier
//       layerY = mouseY * speedMultiplier
// mouseX/Y are raw pixel offsets from the container centre.
//
// multiplier = 0   → anchor, locked in place (visual ground)
// multiplier > 0   → moves with the mouse (same direction)
// multiplier < 0   → moves opposite to the mouse ("looking around" the subject)

const PARALLAX_LAYERS = [
  {
    id: "anchor",
    // Drifts slightly with the mouse — stable cinematic backdrop
    speedMultiplier: 0.02,
    filter: "brightness(0.32) blur(3px) saturate(0.65)",
    opacity: 0.5,
    blendMode: "normal" as const,
    zIndex: 1,
    ghostOffsetX: 0,
  },
  {
    id: "midground",
    // Trails behind with low-stiffness spring — holographic echo
    speedMultiplier: 0.05,
    filter: "brightness(0.7) hue-rotate(180deg) saturate(2.5) blur(0.5px)",
    opacity: 0.2,
    blendMode: "screen" as const,
    zIndex: 2,
    ghostOffsetX: 14,
  },
  {
    id: "foreground",
    // Counter-movement: moves OPPOSITE to mouse — "looking around" the subject
    speedMultiplier: -0.06,
    filter: "brightness(0.8) contrast(1.08) saturate(0.95)",
    opacity: 0.6,
    blendMode: "normal" as const,
    zIndex: 3,
    ghostOffsetX: 0,
  },
] as const;

// ─── Single Layer (sub-component so hooks run per-layer cleanly) ──────────────

function ParallaxLayer({
  src,
  layer,
  mouseX,
  mouseY,
  isAlt,
  alt,
}: {
  src: string;
  layer: typeof PARALLAX_LAYERS[number];
  mouseX: ReturnType<typeof useSpring>;
  mouseY: ReturnType<typeof useSpring>;
  isAlt: boolean;
  alt: string;
}) {
  // layerX = mouseX * speedMultiplier + ghostOffsetX (static)
  const x = useTransform(mouseX, (v) => v * layer.speedMultiplier + layer.ghostOffsetX);
  const y = useTransform(mouseY, (v) => v * layer.speedMultiplier);

  return (
    <motion.div
      className="absolute inset-0"
      style={{
        x,
        y,
        // scale(1.2) gives each layer room to pan without revealing edges
        scale: 1.2,
        zIndex: layer.zIndex,
        willChange: "transform",
        mixBlendMode: layer.blendMode,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={isAlt ? alt : ""}
        aria-hidden={!isAlt}
        draggable={false}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center top",
          display: "block",
          userSelect: "none",
          pointerEvents: "none",
          filter: layer.filter,
          opacity: layer.opacity,
        }}
      />
    </motion.div>
  );
}

// ─── ParallaxPortrait ─────────────────────────────────────────────────────────

function ParallaxPortrait({ src, alt }: { src: string; alt: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  // Three separate springs — each layer gets its own stiffness so they
  // settle at different rates, creating a trailing / liquid catch-up effect.
  const anchorX = useSpring(rawX, { stiffness: 80,  damping: 22, mass: 0.9 });
  const anchorY = useSpring(rawY, { stiffness: 80,  damping: 22, mass: 0.9 });
  const midX    = useSpring(rawX, { stiffness: 40,  damping: 18, mass: 1.2 }); // sluggish — trails behind
  const midY    = useSpring(rawY, { stiffness: 40,  damping: 18, mass: 1.2 });
  const foreX   = useSpring(rawX, { stiffness: 120, damping: 25, mass: 0.8 }); // snappy — leads the stack
  const foreY   = useSpring(rawY, { stiffness: 120, damping: 25, mass: 0.8 });

  // Card tilt uses the foreground spring (most responsive)
  const rotateY = useTransform(foreX, (v) => Math.max(-10, Math.min(10,  v * 0.03)));
  const rotateX = useTransform(foreY, (v) => Math.max(-10, Math.min(10, -v * 0.03)));

  const boxShadow = useTransform(
    [foreX, foreY],
    ([sx, sy]: number[]) => {
      const bx = -sx * 0.06;
      const by =  sy * 0.06 + 30;
      return `${bx}px ${by}px 80px rgba(0,0,0,0.85), ${bx * 0.3}px ${by * 0.3}px 120px rgba(94,212,212,0.1), 0 0 0 1px rgba(94,212,212,0.07)`;
    }
  );

  const rimLight = useTransform(
    [foreX, foreY],
    ([x, y]: number[]) => {
      const cx = 50 + (x as number) * 0.06 * 100;
      const cy = 50 + (y as number) * 0.06 * 100;
      return `radial-gradient(ellipse at ${cx}% ${cy}%, rgba(94,212,212,0.1) 0%, transparent 60%)`;
    }
  );

  // Map each layer to its dedicated spring pair
  const layerSprings = [
    { x: anchorX, y: anchorY },
    { x: midX,    y: midY    },
    { x: foreX,   y: foreY   },
  ];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    // Pixel offset from centre — this is what gets multiplied per layer
    rawX.set(e.clientX - (rect.left + rect.width  / 2));
    rawY.set(e.clientY - (rect.top  + rect.height / 2));
  };

  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    // overflow-hidden lives here (not on the tilting card) so it doesn't
    // cancel transformStyle: "preserve-3d" on the card below
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{ perspective: "1000px", perspectiveOrigin: "50% 50%", overflow: "hidden" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Tilting card — must be free of overflow-hidden */}
      <motion.div
        className="relative w-full h-full"
        style={{
          rotateX,
          rotateY,
          boxShadow,
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
      >
        {PARALLAX_LAYERS.map((layer, i) => (
          <ParallaxLayer
            key={layer.id}
            src={src}
            layer={layer}
            mouseX={layerSprings[i].x}
            mouseY={layerSprings[i].y}
            isAlt={layer.id === "foreground"}
            alt={alt}
          />
        ))}

        {/* Gradient overlays — sit above all image layers */}
        <div className="absolute inset-0 pointer-events-none" style={{
          zIndex: 10,
          background: "linear-gradient(to bottom, rgba(2,12,15,0.5) 0%, transparent 30%, rgba(2,12,15,0.93) 86%, rgba(2,12,15,1) 100%)",
        }} />
        <div className="absolute inset-y-0 left-0 pointer-events-none" style={{
          zIndex: 10, width: 100,
          background: "linear-gradient(to left, transparent, #020c0f)",
        }} />

        {/* Rim-light follows cursor */}
        <motion.div className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 11, background: rimLight }}
        />

        {/* Name card — translateZ pushes it toward the viewer in 3D space */}
        <div className="absolute bottom-10 left-10 right-8 pointer-events-none"
          style={{ zIndex: 20, transform: "translateZ(40px)" }}
        >
          <p className="font-black tracking-tighter leading-tight mb-2"
            style={{ fontSize: "clamp(1.4rem, 2.5vw, 2.4rem)", color: "#e8e4d9" }}
          >
            Dhanasekar S
          </p>
          <p className="text-label" style={{ color: "rgba(94,212,212,0.72)" }}>
            AI Engineer &amp; Creative Developer
          </p>
        </div>

      </motion.div>
    </div>
  );
}

// ─── MagneticMenu ─────────────────────────────────────────────────────────────

export default function MagneticMenu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleNavigate = (href: string) => {
    setOpen(false);
    setTimeout(() => router.push(href), 400);
  };

  return (
    <>
      {/* ── Toggle button ────────────────────────────────────────────────── */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed top-6 right-8 z-[9998] flex items-center gap-2.5 p-1"
        data-cursor-hover
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1, transition: { duration: 0.3, ease: EASE } }}
              exit={{ rotate: 90, opacity: 0, transition: { duration: 0.2 } }}
              style={{ display: "flex", color: "#e8e4d9" }}
            >
              <X size={20} strokeWidth={1.5} />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1, transition: { duration: 0.3, ease: EASE } }}
              exit={{ rotate: -90, opacity: 0, transition: { duration: 0.2 } }}
              style={{ display: "flex", color: "rgba(232,228,217,0.6)" }}
            >
              <Menu size={20} strokeWidth={1.5} />
            </motion.span>
          )}
        </AnimatePresence>

        <motion.span
          className="text-label hidden sm:block"
          animate={{ color: open ? "#e8e4d9" : "rgba(232,228,217,0.45)" }}
          transition={{ duration: 0.25 }}
        >
          {open ? "Close" : "Menu"}
        </motion.span>
      </button>

      {/* ── Full-screen overlay ──────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="overlay"
            className="fixed inset-0 z-[9996] flex"
            style={{ background: "#020c0f" }}
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)", transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] } }}
            exit={{ clipPath: "inset(0 0 100% 0)", transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1], delay: 0.25 } }}
          >

            {/* ══ LEFT — nav (30%) ══════════════════════════════════════ */}
            <div
              className="flex flex-col justify-between flex-shrink-0 px-10 sm:px-14 py-8"
              style={{ width: "30%", background: "linear-gradient(135deg, #0a2e32 0%, #061a1e 55%, #020c0f 100%)" }}
            >
              {/* Top: DS / tagline */}
              <motion.div
                className="flex justify-between items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.35, duration: 0.4 } }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
              >
                <span className="text-label" style={{ color: "rgba(232,228,217,0.4)" }}>DS</span>
                <span className="text-label" style={{ color: "rgba(94,212,212,0.35)" }}>Portfolio — 2025</span>
              </motion.div>

              {/* Middle: about + nav */}
              <div className="flex flex-col gap-8">

                {/* About snippet */}
                <motion.p
                  className="text-body max-w-xs"
                  style={{ color: "rgba(232,228,217,0.3)" }}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: 0.4, duration: 0.5, ease: EASE } }}
                  exit={{ opacity: 0, transition: { duration: 0.15 } }}
                >
                  AI &amp; data engineering enthusiast — machine learning,
                  computer vision, scalable pipelines. Currently at FIS Global.
                </motion.p>

                {/* Nav items */}
                <nav className="flex flex-col">
                  {NAV_LINKS.map((link, i) => (
                    <motion.div
                      key={link.label}
                      initial={{ opacity: 0, y: 48 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        transition: { delay: 0.42 + i * 0.08, duration: 0.55, ease: EASE },
                      }}
                      exit={{
                        opacity: 0,
                        y: -24,
                        transition: { delay: (NAV_LINKS.length - 1 - i) * 0.05, duration: 0.25 },
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
                          style={{ fontSize: "0.6875rem", letterSpacing: "0.3em", color: "rgba(94,212,212,0.45)", lineHeight: 1 }}
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
                            style={{ fontSize: "clamp(1.6rem, 3vw, 3.5rem)", color: "#e8e4d9", willChange: "transform" }}
                            variants={{
                              rest:  { x: 0,  color: "#e8e4d9" },
                              hover: { x: 12, color: "#ffffff", transition: { duration: 0.3, ease: EASE } },
                            }}
                          >
                            {link.label}
                          </motion.span>
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
                animate={{ opacity: 1, transition: { delay: 0.75, duration: 0.4 } }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
              >
                <p className="text-label" style={{ color: "rgba(94,212,212,0.3)" }}>© 2025 Dhanasekar S</p>
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

            {/* ══ RIGHT — 3D Parallax portrait (70%) ═══════════════════════ */}
            <motion.div
              className="relative hidden md:block flex-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.6, delay: 0.25 } }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              style={{ padding: "32px 32px 32px 0" }}
            >
              <ParallaxPortrait src="/profile.png" alt="Dhanasekar S" />
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
