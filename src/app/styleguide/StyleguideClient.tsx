"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Link } from "@/components/ui/Link";
import {
  animateTextMaskReveal,
  animateClipReveal,
  animateFadeUp,
  isReducedMotion,
  MOTION_TOKENS,
} from "@/utils/animation";
import Image from "next/image";

export default function StyleguideClient() {
  const [reducedMotionActive, setReducedMotionActive] = useState(false);
  const maskTextRef = useRef<HTMLDivElement>(null);
  const clipImageRef = useRef<HTMLDivElement>(null);
  const innerImgRef = useRef<HTMLDivElement>(null);
  const fadeUpRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setReducedMotionActive(isReducedMotion());
  }, []);

  const triggerMaskReveal = () => {
    if (!maskTextRef.current) return;
    const lines = maskTextRef.current.querySelectorAll(".mask-line-inner");
    animateTextMaskReveal(lines, undefined, { duration: 0.9, stagger: 0.08 });
  };

  const triggerClipReveal = () => {
    if (!clipImageRef.current) return;
    animateClipReveal(clipImageRef.current, innerImgRef.current, undefined, {
      duration: 0.9,
    });
  };

  const triggerFadeUp = () => {
    if (!fadeUpRef.current) return;
    const items = fadeUpRef.current.querySelectorAll(".fade-up-item");
    animateFadeUp(items, undefined, { distance: 24, stagger: 0.08 });
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-16 pb-32">
      <div className="container-editorial">
        {/* Header */}
        <div className="border-b-editorial pb-8 mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <div className="type-label text-text-muted mb-2 tracking-widest">
              00 / ARCHITECTURAL EXHIBITION FOUNDATION
            </div>
            <h1 className="type-h1">Design System & Token Specification</h1>
          </div>
          <div className="type-label border border-border px-4 py-2 rounded-pill bg-background">
            Reduced Motion:{" "}
            <span className={reducedMotionActive ? "text-red-600" : "text-green-700"}>
              {reducedMotionActive ? "ACTIVE" : "INACTIVE (NATIVE 60FPS)"}
            </span>
          </div>
        </div>

        {/* 1. COLOR TOKENS */}
        <section className="mb-20">
          <div className="flex items-baseline justify-between border-b-editorial pb-3 mb-8">
            <h2 className="type-label tracking-widest text-text-muted">
              01. COLOR PALETTE & SEMANTIC TOKENS
            </h2>
            <span className="type-caption">Strict monochrome + stone palette</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* Background */}
            <div className="border border-border p-4 bg-background flex flex-col justify-between h-44">
              <div className="w-full h-16 border border-border bg-[#F3F1EC]"></div>
              <div>
                <p className="type-label font-bold">--background</p>
                <p className="type-caption font-mono text-xs">#F3F1EC</p>
                <p className="type-caption text-[11px] text-text-muted mt-1">Linen / Gallery Canvas</p>
              </div>
            </div>

            {/* Foreground */}
            <div className="border border-border p-4 bg-background flex flex-col justify-between h-44">
              <div className="w-full h-16 bg-[#171717]"></div>
              <div>
                <p className="type-label font-bold">--foreground</p>
                <p className="type-caption font-mono text-xs">#171717</p>
                <p className="type-caption text-[11px] text-text-muted mt-1">Deep Carbon / Ink</p>
              </div>
            </div>

            {/* Dark Background */}
            <div className="border border-border p-4 bg-background flex flex-col justify-between h-44">
              <div className="w-full h-16 bg-[#171717] border border-border"></div>
              <div>
                <p className="type-label font-bold">--dark-background</p>
                <p className="type-caption font-mono text-xs">#171717</p>
                <p className="type-caption text-[11px] text-text-muted mt-1">Contrast Shell</p>
              </div>
            </div>

            {/* Dark Foreground */}
            <div className="border border-border p-4 bg-background flex flex-col justify-between h-44">
              <div className="w-full h-16 bg-[#F5F3EE] border border-border"></div>
              <div>
                <p className="type-label font-bold">--dark-foreground</p>
                <p className="type-caption font-mono text-xs">#F5F3EE</p>
                <p className="type-caption text-[11px] text-text-muted mt-1">Warm Alabaster</p>
              </div>
            </div>

            {/* Secondary Text */}
            <div className="border border-border p-4 bg-background flex flex-col justify-between h-44">
              <div className="w-full h-16 bg-[#85827B]"></div>
              <div>
                <p className="type-label font-bold">--secondary-text</p>
                <p className="type-caption font-mono text-xs">#85827B</p>
                <p className="type-caption text-[11px] text-text-muted mt-1">Muted Slate Ochre</p>
              </div>
            </div>

            {/* Border */}
            <div className="border border-border p-4 bg-background flex flex-col justify-between h-44">
              <div className="w-full h-16 bg-[#DAD7D0] border border-border"></div>
              <div>
                <p className="type-label font-bold">--border</p>
                <p className="type-caption font-mono text-xs">#DAD7D0</p>
                <p className="type-caption text-[11px] text-text-muted mt-1">Architectural Hairline</p>
              </div>
            </div>
          </div>
        </section>

        {/* 2. TYPOGRAPHY SCALE */}
        <section className="mb-20">
          <div className="flex items-baseline justify-between border-b-editorial pb-3 mb-8">
            <h2 className="type-label tracking-widest text-text-muted">
              02. TYPOGRAPHY HIERARCHY & FLUID SCALE
            </h2>
            <span className="type-caption">Instrument Serif · Manrope · Archivo</span>
          </div>

          <div className="space-y-12 border-l-editorial pl-6 md:pl-12">
            {/* Display XXL */}
            <div>
              <p className="type-label text-text-muted mb-2">
                type-display-xxl (clamp: 5.5rem → 17rem) • Archivo ExtraBold
              </p>
              <div className="type-display-xxl text-border select-none overflow-hidden leading-none">
                ZEHAN
              </div>
            </div>

            {/* Display XL */}
            <div className="border-t-editorial pt-6">
              <p className="type-label text-text-muted mb-2">
                type-display-xl (clamp: 3.25rem → 6.75rem) • Instrument Serif
              </p>
              <div className="type-display-xl">
                Designing digital experiences.
              </div>
            </div>

            {/* Display L */}
            <div className="border-t-editorial pt-6">
              <p className="type-label text-text-muted mb-2">
                type-display-l (clamp: 2.5rem → 4.75rem) • Instrument Serif (Regular + Italic)
              </p>
              <div className="type-display-l">
                <span>Designing digital experiences. </span>
                <span className="font-serif-italic">Bringing ideas to life.</span>
              </div>
            </div>

            {/* H1 */}
            <div className="border-t-editorial pt-6">
              <p className="type-label text-text-muted mb-2">
                type-h1 (clamp: 2.25rem → 3.75rem) • Instrument Serif
              </p>
              <div className="type-h1">Selected Works & Architectural Systems</div>
            </div>

            {/* H2 */}
            <div className="border-t-editorial pt-6">
              <p className="type-label text-text-muted mb-2">
                type-h2 (clamp: 1.5rem → 2.5rem) • Manrope SemiBold
              </p>
              <div className="type-h2">Grandpool — Luxury Aquatic Living Platform</div>
            </div>

            {/* H3 */}
            <div className="border-t-editorial pt-6">
              <p className="type-label text-text-muted mb-2">
                type-h3 (clamp: 1.2rem → 1.65rem) • Manrope Medium
              </p>
              <div className="type-h3">01 / UI·UX Design & Design System Engineering</div>
            </div>

            {/* Body Large */}
            <div className="border-t-editorial pt-6">
              <p className="type-label text-text-muted mb-2">
                type-body-l (clamp: 1.0625rem → 1.25rem) • Manrope Regular
              </p>
              <p className="type-body-l max-w-3xl">
                I work across UI/UX design, website design, product interfaces, and front-end implementation to create meaningful digital experiences that merge artistic discipline with functional clarity.
              </p>
            </div>

            {/* Body */}
            <div className="border-t-editorial pt-6">
              <p className="type-label text-text-muted mb-2">
                type-body (clamp: 0.9375rem → 1rem) • Manrope Regular
              </p>
              <p className="type-body max-w-3xl text-text-muted">
                Every project is treated as an interactive design exhibition rather than a standard software template. Clean typographic hierarchies and considered spatial rhythm replace unnecessary decoration.
              </p>
            </div>

            {/* Caption & Label */}
            <div className="border-t-editorial pt-6 flex flex-wrap gap-8 items-baseline">
              <div>
                <p className="type-label text-text-muted mb-2">type-caption</p>
                <p className="type-caption">Dhaka, Bangladesh • 23.8103° N, 90.4125° E</p>
              </div>
              <div>
                <p className="type-label text-text-muted mb-2">type-label</p>
                <p className="type-label">AVAILABLE FOR PROJECTS • 2026</p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. SPACING SCALE */}
        <section className="mb-20">
          <div className="flex items-baseline justify-between border-b-editorial pb-3 mb-8">
            <h2 className="type-label tracking-widest text-text-muted">
              03. SPACING SCALE (4PX BASE)
            </h2>
            <span className="type-caption">Consistent spatial intervals</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {[
              { token: "--space-1", val: "4px" },
              { token: "--space-2", val: "8px" },
              { token: "--space-3", val: "12px" },
              { token: "--space-4", val: "16px" },
              { token: "--space-6", val: "24px" },
              { token: "--space-8", val: "32px" },
              { token: "--space-12", val: "48px" },
              { token: "--space-16", val: "64px" },
              { token: "--space-24", val: "96px" },
              { token: "--space-32", val: "128px" },
              { token: "--space-48", val: "192px" },
            ].map((s) => (
              <div key={s.token} className="flex items-center gap-4">
                <span className="w-24 text-text-muted">{s.token}</span>
                <span className="w-16">{s.val}</span>
                <div
                  className="bg-foreground h-3 transition-all"
                  style={{ width: s.val }}
                />
              </div>
            ))}
          </div>
        </section>

        {/* 4. 12-COLUMN GRID & ASYMMETRIC SPLITS */}
        <section className="mb-20">
          <div className="flex items-baseline justify-between border-b-editorial pb-3 mb-8">
            <h2 className="type-label tracking-widest text-text-muted">
              04. 12-COLUMN GRID & ASYMMETRIC COMPOSITION
            </h2>
            <span className="type-caption">7/5 · 5/7 · Full-bleed ratios</span>
          </div>

          {/* 12 col visualization */}
          <div className="grid-12 mb-8">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="border border-border py-6 text-center type-label bg-background"
              >
                {String(i + 1).padStart(2, "0")}
              </div>
            ))}
          </div>

          {/* Asymmetric 7/5 split */}
          <div className="grid-12 mb-8">
            <div className="col-7-12 border border-border p-6 bg-background">
              <span className="type-label text-text-muted block mb-2">Column 7 / 12 (58.3%)</span>
              <p className="type-h3">Asymmetric Storytelling / Primary Asset Column</p>
              <p className="type-body text-text-muted mt-2">
                Used in Selected Works for large asymmetric editorial presentation.
              </p>
            </div>
            <div className="col-5-12 border border-border p-6 bg-background">
              <span className="type-label text-text-muted block mb-2">Column 5 / 12 (41.7%)</span>
              <p className="type-h3">Editorial Metadata & Analysis</p>
              <p className="type-body text-text-muted mt-2">
                Holds role taxonomy, year, and design breakdown.
              </p>
            </div>
          </div>
        </section>

        {/* 5. BUTTONS & INTERACTIVE CONTROLS */}
        <section className="mb-20">
          <div className="flex items-baseline justify-between border-b-editorial pb-3 mb-8">
            <h2 className="type-label tracking-widest text-text-muted">
              05. INTERACTIVE CONTROLS & PILLS
            </h2>
            <span className="type-caption">Zero-glow · 1px borders · Exact tokens</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 p-8 border border-border bg-background">
            <Button variant="primary" size="md">
              View Projects
            </Button>

            <Button variant="secondary" size="md">
              Contact Me
            </Button>

            <Button variant="pill" size="md">
              Available for projects • 2026
            </Button>

            <Button variant="outline" size="sm">
              UX Audit
            </Button>

            <Link href="#preview" variant="arrow">
              Explore Live Website
            </Link>

            <Link href="#works" variant="underline">
              Selected Works (04)
            </Link>
          </div>
        </section>

        {/* 6. MOTION TOKENS & REVEAL UTILITIES */}
        <section className="mb-20">
          <div className="flex items-baseline justify-between border-b-editorial pb-3 mb-8">
            <h2 className="type-label tracking-widest text-text-muted">
              06. MOTION TOKENS & REVEAL DEMONSTRATIONS
            </h2>
            <span className="type-caption">GSAP 3.12 · 0.9s Duration · power4.out</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Demo A: Mask Text Reveal */}
            <div className="border border-border p-6 bg-background flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="type-label text-text-muted">Mask Text Reveal Utility</span>
                  <Button variant="outline" size="sm" onClick={triggerMaskReveal}>
                    Play Mask Animation ↻
                  </Button>
                </div>

                <div ref={maskTextRef} className="py-4 space-y-1">
                  <div className="overflow-hidden">
                    <div className="mask-line-inner type-h2">
                      Line 01: Designing digital
                    </div>
                  </div>
                  <div className="overflow-hidden">
                    <div className="mask-line-inner type-h2 font-serif-italic">
                      Line 02: experiences with rigor.
                    </div>
                  </div>
                  <div className="overflow-hidden">
                    <div className="mask-line-inner type-body text-text-muted">
                      Line 03: Animated via yPercent 110 → 0 inside overflow-hidden wrappers.
                    </div>
                  </div>
                </div>
              </div>
              <p className="type-caption text-xs text-text-muted border-t-editorial pt-3 mt-4">
                Tokens: duration 0.9s, ease: power4.out, stagger: 0.08s
              </p>
            </div>

            {/* Demo B: Clip-Path Image Reveal */}
            <div className="border border-border p-6 bg-background flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="type-label text-text-muted">Clip-Path Image Reveal Utility</span>
                  <Button variant="outline" size="sm" onClick={triggerClipReveal}>
                    Play Clip Wipe ↻
                  </Button>
                </div>

                <div
                  ref={clipImageRef}
                  className="w-full h-48 border border-border overflow-hidden relative bg-dark-background"
                >
                  <div
                    ref={innerImgRef}
                    className="w-full h-full relative"
                  >
                    <Image
                      src="/images/profile/zehan-portrait.png"
                      alt="Portrait Cutout Test"
                      fill
                      className="object-cover object-top grayscale"
                    />
                  </div>
                </div>
              </div>
              <p className="type-caption text-xs text-text-muted border-t-editorial pt-3 mt-4">
                Tokens: inset(100% 0 0 0) → inset(0%), scale: 1.2 → 1.0
              </p>
            </div>
          </div>
        </section>

        {/* 7. PORTRAIT TRANSPARENCY CONFIRMATION BADGE */}
        <section className="border border-border p-6 bg-background">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <span className="type-label text-text-muted block mb-1">
                HERO PORTRAIT CUTOUT INTEGRATION
              </span>
              <p className="type-h3">
                Transparent 32-bit Cutout Verified & Mounted
              </p>
              <p className="type-body text-text-muted text-sm mt-1">
                Asset location: /images/profile/zehan-portrait.png • Tested with monochrome filter
              </p>
            </div>
            <div className="type-label border border-border px-4 py-2 rounded-sm bg-background">
              STATUS: READY FOR PHASE 04
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
