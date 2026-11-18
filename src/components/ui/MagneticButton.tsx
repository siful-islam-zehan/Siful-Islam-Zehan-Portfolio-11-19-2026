"use client";

import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { isReducedMotion } from "@/utils/animation";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
  strength?: number; // Distance multiplier
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className = "",
  onClick,
  href,
  strength = 0.35,
  type = "button",
  disabled = false,
}) => {
  const buttonRef = useRef<HTMLAnchorElement | HTMLButtonElement>(null);

  useEffect(() => {
    const el = buttonRef.current;
    if (!el || isReducedMotion()) return;

    // Detect touch device — disable magnetic physics on touch
    const isTouch =
      window.matchMedia("(pointer: coarse)").matches ||
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0;
    if (isTouch) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distX = (e.clientX - centerX) * strength;
      const distY = (e.clientY - centerY) * strength;

      gsap.to(el, {
        x: distX,
        y: distY,
        duration: 0.35,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.7,
        ease: "elastic.out(1.1, 0.4)",
      });
    };

    el.addEventListener("mousemove", handleMouseMove as EventListener);
    el.addEventListener("mouseleave", handleMouseLeave as EventListener);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove as EventListener);
      el.removeEventListener("mouseleave", handleMouseLeave as EventListener);
    };
  }, [strength]);

  const baseStyles =
    "inline-flex items-center justify-center font-sans font-medium transition-colors select-none cursor-pointer";

  if (href) {
    return (
      <a
        ref={buttonRef as React.RefObject<HTMLAnchorElement>}
        href={href}
        className={`${baseStyles} ${className}`}
        onClick={onClick}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      ref={buttonRef as React.RefObject<HTMLButtonElement>}
      type={type}
      disabled={disabled}
      className={`${baseStyles} ${className} ${disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
