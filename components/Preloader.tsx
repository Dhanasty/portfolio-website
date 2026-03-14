"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function Preloader() {
  const [visible, setVisible] = useState(true);
  const overlayRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!visible) return;

    document.body.style.overflow = "hidden";

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = "";
          setVisible(false);
        },
      });

      tl.to(barRef.current, {
        width: "100%",
        duration: 1.4,
        ease: "power2.inOut",
      })
        .to(
          barRef.current,
          { opacity: 0, duration: 0.3 },
          "-=0.1"
        )
        .to(
          textRef.current,
          { opacity: 0, duration: 0.5 },
          "<"
        )
        .to(overlayRef.current, {
          yPercent: -100,
          duration: 0.8,
          ease: "power3.inOut",
        });
    });

    return () => ctx.revert();
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9998] flex flex-col items-center justify-center"
      style={{ background: "#0a0a0a" }}
    >
      <div ref={textRef} className="flex flex-col items-center gap-8 w-full px-12 max-w-sm">
        <p className="text-label text-secondary tracking-widest">Loading</p>
        <div className="w-full h-px bg-[#1a1a1a] relative overflow-hidden">
          <div
            ref={barRef}
            className="absolute left-0 top-0 h-full bg-white"
            style={{ width: "0%" }}
          />
        </div>
      </div>
    </div>
  );
}
