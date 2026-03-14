"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import gsap from "gsap";

// ─── Wipe overlay ─────────────────────────────────────────

function WipeOverlay() {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }

    const el = ref.current;
    if (!el) return;

    // Reset start position
    gsap.set(el, { xPercent: -100, display: "block" });

    // Animate wipe
    gsap.to(el, {
      xPercent: 100,
      duration: 0.8,
      ease: "power3.inOut",
      onComplete: () => {
        gsap.set(el, { display: "none" });
      },
      force3D: true,
    });

  }, [pathname]);

  return (
    <div
      ref={ref}
      className="fixed inset-0 z-[9990] pointer-events-none"
      style={{
        background: "#0a0a0a",
        transform: "translateX(-100%)",
        display: "none",
        willChange: "transform",
      }}
      aria-hidden="true"
    />
  );
}

// ─── Page animation ───────────────────────────────────────

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
      delay: 0.15,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.25, ease: "easeIn" },
  },
};

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <>
      <WipeOverlay />

      <AnimatePresence mode="wait" initial={false}>
  <motion.div
    key={pathname}
    variants={contentVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
    style={{ willChange: "transform, opacity" }}
  >
    {children}
  </motion.div>
</AnimatePresence>
    </>
  );
}