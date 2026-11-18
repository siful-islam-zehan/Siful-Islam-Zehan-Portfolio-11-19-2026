"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { isReducedMotion } from "@/utils/animation";

interface HeroPortraitProps {
  className?: string;
}

export const HeroPortrait: React.FC<HeroPortraitProps> = ({ className = "" }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const skeletonRef = useRef<HTMLDivElement>(null);
  const lensRingRef = useRef<HTMLDivElement>(null);
  const coordTextRef = useRef<HTMLSpanElement>(null);

  // Position state for the circular lens (Resting on left outer arm silhouette like user reference: X:85, Y:419)
  const [lensPos, setLensPos] = useState({ x: 85, y: 419 });
  const [isHovering, setIsHovering] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const LENS_RADIUS = 84; // 84px radius (168px diameter)

  useEffect(() => {
    // Detect touch device
    const isTouch =
      window.matchMedia("(pointer: coarse)").matches ||
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0;
    setIsTouchDevice(isTouch);

    const container = containerRef.current;
    if (!container) return;

    // Resting placement on outer left arm curve (X: ~17.7%, Y: ~58% - matches reference X:85 Y:419)
    const rect = container.getBoundingClientRect();
    const defaultX = rect.width * 0.177;
    const defaultY = rect.height * 0.58;
    setLensPos({ x: defaultX, y: defaultY });

    if (coordTextRef.current) {
      coordTextRef.current.innerText = `X:${Math.round(defaultX)} Y:${Math.round(defaultY)}`;
    }

    // If reduced motion is enabled, avoid auto-animation
    if (isReducedMotion()) return;

    // Mobile / Touch Auto-Animation: gently float across the left arm silhouette
    if (isTouch) {
      const autoAnim = gsap.timeline({ repeat: -1, yoyo: true });
      autoAnim.to(
        {},
        {
          duration: 5,
          ease: "sine.inOut",
          onUpdate: function () {
            const progress = this.progress();
            const angle = progress * Math.PI * 2;
            const curRect = container.getBoundingClientRect();
            const cx = curRect.width * 0.18;
            const cy = curRect.height * 0.58;
            const newX = cx + Math.sin(angle) * (curRect.width * 0.05);
            const newY = cy + Math.cos(angle * 1.5) * (curRect.height * 0.04);
            setLensPos({ x: newX, y: newY });
          },
        }
      );

      return () => {
        autoAnim.kill();
      };
    }
  }, []);

  // Mouse movement on desktop: constrained strictly so it NEVER covers the face
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouchDevice || isReducedMotion()) return;
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const rawX = e.clientX - rect.left;
    const rawY = e.clientY - rect.top;

    // Move freely across the figure (skull, chest, arms, torso)
    const minY = rect.height * 0.12; // Head and skull area
    const maxY = rect.height * 0.88; // Lower torso boundary
    const minX = rect.width * 0.05;  // Outer left arm boundary
    const maxX = rect.width * 0.95;  // Outer right arm boundary

    const clampedX = Math.max(minX, Math.min(maxX, rawX));
    const clampedY = Math.max(minY, Math.min(maxY, rawY));

    // Damped animation toward target coordinates
    gsap.to(lensPos, {
      x: clampedX,
      y: clampedY,
      duration: 0.22,
      ease: "power2.out",
      onUpdate: () => {
        setLensPos({ x: lensPos.x, y: lensPos.y });
      },
    });

    if (coordTextRef.current) {
      coordTextRef.current.innerText = `X:${Math.round(clampedX)} Y:${Math.round(clampedY)}`;
    }
  };

  const handleMouseEnter = () => {
    if (!isTouchDevice) setIsHovering(true);
  };

  const handleMouseLeave = () => {
    if (!isTouchDevice) {
      setIsHovering(false);
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const defaultX = rect.width * 0.177;
      const defaultY = rect.height * 0.58;

      gsap.to(lensPos, {
        x: defaultX,
        y: defaultY,
        duration: 0.8,
        ease: "power3.out",
        onUpdate: () => setLensPos({ x: lensPos.x, y: lensPos.y }),
      });
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`hero-portrait-container relative select-none cursor-crosshair overflow-visible ${className}`}
      style={{
        aspectRatio: "571 / 860",
      }}
    >
      {/* 
        LAYER 1: FINISHED MONOCHROME PORTRAIT (Base / Outside Lens)
        Editorial monochrome grading applied via CSS filter
      */}
      <div className="portrait-base-layer absolute inset-0 w-full h-full">
        <Image
          src="/images/profile/zehan-portrait.png"
          alt="Siful Islam Zehan — Portrait"
          fill
          priority
          sizes="(max-width: 768px) 90vw, (max-width: 1280px) 45vw, 520px"
          className="object-contain object-bottom filter grayscale contrast-[1.08] brightness-[0.98] drop-shadow-sm pointer-events-none"
        />
      </div>

      {/* 
        LAYER 2: SKELETON / ANATOMICAL BONE STRUCTURE (Inside Lens)
        Revealed strictly inside circular clip-path matching lens position
      */}
      <div
        ref={skeletonRef}
        aria-hidden="true"
        className="portrait-skeleton-layer absolute inset-0 w-full h-full pointer-events-none"
        style={{
          clipPath: `circle(${LENS_RADIUS}px at ${lensPos.x}px ${lensPos.y}px)`,
          WebkitClipPath: `circle(${LENS_RADIUS}px at ${lensPos.x}px ${lensPos.y}px)`,
        }}
      >
        {/* Dark contrast backdrop inside the lens */}
        <div className="absolute inset-0 w-full h-full bg-[#171717]" />

        {/* Vector Anatomy Wireframe in identical arms-crossed pose */}
        <Image
          src="/images/profile/zehan-wireframe.png"
          alt="Siful Islam Zehan anatomical wireframe structure"
          fill
          priority
          sizes="(max-width: 768px) 90vw, (max-width: 1280px) 45vw, 520px"
          className="object-contain object-bottom filter contrast-[1.12] brightness-[1.05]"
        />

        {/* Subtle Architectural Blueprint Coordinate Grid inside the lens */}
        <div
          className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255, 255, 255, 0.35) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.35) 1px, transparent 1px)
            `,
            backgroundSize: "16px 16px",
          }}
        />

        {/* Diagonal Technical Drafting Crosshairs inside lens */}
        <svg className="absolute inset-0 w-full h-full opacity-25 stroke-white" xmlns="http://www.w3.org/2000/svg">
          <line x1="0" y1="0" x2="100%" y2="100%" strokeWidth="0.75" strokeDasharray="3 3" />
          <line x1="100%" y1="0" x2="0" y2="100%" strokeWidth="0.75" strokeDasharray="3 3" />
        </svg>
      </div>

      {/* 
        LAYER 3: THE PHYSICAL LENS RETICLE RING
      */}
      <div
        ref={lensRingRef}
        aria-hidden="true"
        className="lens-reticle-ring absolute pointer-events-none transition-opacity duration-300"
        style={{
          width: `${LENS_RADIUS * 2}px`,
          height: `${LENS_RADIUS * 2}px`,
          left: `${lensPos.x - LENS_RADIUS}px`,
          top: `${lensPos.y - LENS_RADIUS}px`,
          borderRadius: "50%",
          border: "1px solid rgba(23, 23, 23, 0.8)",
          boxShadow: "0 0 0 1px rgba(243, 241, 236, 0.4), 0 8px 24px -4px rgba(0,0,0,0.25)",
        }}
      >
        {/* Reticle Crosshairs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-[1px] h-2 bg-foreground" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 w-[1px] h-2 bg-foreground" />
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 h-[1px] w-2 bg-foreground" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 h-[1px] w-2 bg-foreground" />

        {/* Micro Technical Tag */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-background border border-border px-2 py-0.5 rounded-sm type-label text-[8px] text-foreground tracking-wider flex items-center gap-1.5 shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-foreground" />
          <span>STRUCTURE // WIREFRAME</span>
          <span className="text-border">|</span>
          <span ref={coordTextRef} className="font-mono text-text-muted">
            X:{Math.round(lensPos.x)} Y:{Math.round(lensPos.y)}
          </span>
        </div>
      </div>
    </div>
  );
};
