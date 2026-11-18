"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { isReducedMotion } from "@/utils/animation";

export const CustomCursor: React.FC = () => {
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    // Only run on desktop with fine pointer
    if (
      typeof window === "undefined" ||
      isReducedMotion() ||
      window.matchMedia("(pointer: coarse)").matches
    ) {
      return;
    }

    const dot = cursorDotRef.current;
    if (!dot) return;

    // Fast coordinate tracking via GSAP quickTo for zero layout thrash
    const xTo = gsap.quickTo(dot, "x", { duration: 0.18, ease: "power2.out" });
    const yTo = gsap.quickTo(dot, "y", { duration: 0.18, ease: "power2.out" });

    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);
      xTo(e.clientX);
      yTo(e.clientY);

      // Check if target is clickable
      const target = e.target as HTMLElement;
      const isClickable = Boolean(
        target.closest("a, button, [role='button'], input, textarea, .cursor-pointer")
      );
      setIsPointer(isClickable);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isVisible]);

  return (
    <div
      ref={cursorDotRef}
      aria-hidden="true"
      className={`fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none z-50 transition-opacity duration-300 hidden lg:block ${
        isVisible ? "opacity-100" : "opacity-0"
      } ${
        isPointer
          ? "w-8 h-8 bg-foreground/15 border border-foreground/40 scale-125"
          : "w-2.5 h-2.5 bg-foreground"
      }`}
      style={{
        transitionProperty: "width, height, background-color, border-color, transform, opacity",
        transitionDuration: "0.25s",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    />
  );
};
