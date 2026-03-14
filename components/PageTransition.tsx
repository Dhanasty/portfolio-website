"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import gsap from "gsap";

// --- Wipe overlay ---
function WipeOverlay() {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isFirst = useRef(true);

  useEffect(() => {
    // Prevent animation on initial site load
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }

    const el = ref.current;
    if (!el) return;

    // Timeline for better control
    const tl = gsap.timeline();

    tl.set(el, { xPercent: -100, display: "block" })
      .to(el, {
        xPercent: 0,
        duration: 0.4,
        ease: "power2.in",
      })
      .to(el, {
        xPercent: 100,
        duration: 0.4,
        ease: "power2.out",
        delay: 0.1, // Slight pause at full cover
        onComplete: () => {
          gsap.set(el, { display: "none" });
        },
      });

    return () => { tl.kill(); }; // Cleanup
  }, [pathname]);

  return (
    <div
      ref={ref}
      className="fixed inset-0 z-[9999] pointer-events-none bg-[#0a0a0a]"
      style={{ display: "none", willChange: "transform" }}
      aria-hidden="true"
    />
  );
}

// --- Page Animation Variants ---
const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, delay: 0.4 } // Delay to wait for wipe cover
  },
  exit: { 
    opacity: 0, 
    y: -20, 
    transition: { duration: 0.3 } 
  },
};

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      <WipeOverlay />
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          variants={contentVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  );
}