"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PillNav } from "@/components/navigation/PillNav";
import { SideSocials } from "@/components/navigation/SideSocials";
import { TimelineProgress } from "@/components/navigation/TimelineProgress";
import { HeroBackgroundText } from "@/components/hero/HeroBackgroundText";
import { HeroPortrait } from "@/components/hero/HeroPortrait";
import { HeroHeadline } from "@/components/hero/HeroHeadline";
import { FloatingWebsiteCard } from "@/components/hero/FloatingWebsiteCard";
import { AvailabilityPill } from "@/components/hero/AvailabilityPill";
import { ScrollCue } from "@/components/hero/ScrollCue";
import { isReducedMotion, MOTION_TOKENS } from "@/utils/animation";
import { SocialLink } from "@/data/portfolio";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface HeroSectionProps {
  socials?: SocialLink[];
  availability?: string;
  location?: string;
  email?: string;
  headlineLine1?: string;
  headlineLine2?: string;
  tagline?: string;
  bio?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  socials,
  availability,
  location,
  email,
  headlineLine1,
  headlineLine2,
  tagline,
  bio,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const portraitWrapperRef = useRef<HTMLDivElement>(null);
  const bgTextRef = useRef<HTMLDivElement>(null);
  const floatingCardRef = useRef<HTMLDivElement>(null);
  const availabilityPillRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reducedMotion = isReducedMotion();

    // Context for clean GSAP garbage collection
    const ctx = gsap.context(() => {
      if (reducedMotion) {
        // Reduced motion: Set final visual state immediately
        gsap.set(".hero-mask-line", { yPercent: 0, opacity: 1 });
        gsap.set(portraitWrapperRef.current, { clipPath: "inset(0% 0% 0% 0%)", opacity: 1 });
        gsap.set([floatingCardRef.current, availabilityPillRef.current, scrollCueRef.current], {
          opacity: 1,
          y: 0,
        });
        return;
      }

      // ======================================================================
      // 1. INITIAL ENTRANCE TIMELINE (0.9s, power4.out)
      // ======================================================================
      const entranceTl = gsap.timeline({
        defaults: {
          duration: MOTION_TOKENS.durationBase,
          ease: MOTION_TOKENS.easeBase,
        },
      });

      // Prepare initial hidden states
      gsap.set(".hero-mask-line", { yPercent: 110 });
      gsap.set(portraitWrapperRef.current, {
        clipPath: "inset(100% 0% 0% 0%)",
        opacity: 0,
        scale: 1.04,
      });
      gsap.set([floatingCardRef.current, availabilityPillRef.current, scrollCueRef.current], {
        opacity: 0,
        y: 28,
      });
      gsap.set(".hero-bg-text", { opacity: 0, scale: 0.94 });

      // Step A: Background typography soft expansion
      entranceTl.to(".hero-bg-text", {
        opacity: 0.95,
        scale: 1,
        duration: 1.2,
        ease: "power3.out",
      });

      // Step B: Text mask reveals line by line
      entranceTl.to(
        ".hero-mask-line",
        {
          yPercent: 0,
          stagger: 0.1,
        },
        "-=0.9"
      );

      // Step C: Portrait clip-path reveal from the bottom
      entranceTl.to(
        portraitWrapperRef.current,
        {
          clipPath: "inset(0% 0% 0% 0%)",
          opacity: 1,
          scale: 1,
          duration: 1.1,
          ease: "power4.out",
        },
        "-=0.7"
      );

      // Step D: Floating panels, availability pill, and scroll cue fade in
      entranceTl.to(
        [availabilityPillRef.current, floatingCardRef.current, scrollCueRef.current],
        {
          opacity: 1,
          y: 0,
          stagger: 0.12,
        },
        "-=0.6"
      );

      // ======================================================================
      // 2. SCROLL-OUT TRANSITION (Hero → Works)
      // ======================================================================
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      // Background text slides horizontally
      scrollTl.to(
        ".hero-bg-text",
        {
          xPercent: 14,
          ease: "none",
        },
        0
      );

      // Portrait scales 1 → 0.94 and drifts up with gentle fade
      scrollTl.to(
        portraitWrapperRef.current,
        {
          scale: 0.94,
          y: -40,
          opacity: 0.25,
          ease: "none",
        },
        0
      );

      // Floating card tilts slightly more and floats
      if (floatingCardRef.current) {
        scrollTl.to(
          floatingCardRef.current,
          {
            y: -90,
            rotation: -5.5,
            ease: "none",
          },
          0
        );
      }

      // Headline fades and drifts
      scrollTl.to(
        ".hero-headline-group",
        {
          y: -40,
          opacity: 0.3,
          ease: "none",
        },
        0
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      aria-label="Introduction & Art Exhibition"
      className="relative w-full min-h-screen bg-background text-foreground overflow-hidden flex flex-col justify-between pt-24 pb-20 border-b border-border"
    >
      {/* Navigation Layer */}
      <PillNav socials={socials} email={email} location={location} />
      <SideSocials socials={socials} />
      <TimelineProgress activeSection={1} />

      {/* Layer 1: Oversized "ZEHAN" Background Text */}
      <div ref={bgTextRef}>
        <HeroBackgroundText />
      </div>

      {/* 
        MAIN HERO CONTENT CONTAINER
        Desktop: 12-column architectural composition
        Mobile: Vertical stacked poster composition
      */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 flex-1 flex flex-col justify-end">
        {/* DESKTOP LAYOUT (1024px+) */}
        <div className="hidden lg:grid grid-cols-12 gap-6 items-end relative min-h-[640px]">
          {/* Left Column: Headline, Bio & CTAs (Span 6) */}
          <div ref={headlineRef} className="col-span-6 z-20 pb-4">
            <div ref={availabilityPillRef} className="mb-6">
              <AvailabilityPill text={availability} />
            </div>
            <HeroHeadline
              line1={headlineLine1}
              line2={headlineLine2}
              tagline={tagline}
              bio={bio}
            />
          </div>

          {/* Center-Right Column: Real Portrait + Interactive Lens (Span 5) */}
          <div
            ref={portraitWrapperRef}
            className="col-span-5 col-start-7 relative z-10 flex items-end justify-center will-change-transform"
          >
            <div className="w-full max-w-[480px]">
              <HeroPortrait />
            </div>
          </div>

          {/* Floating Element A: Tilted Website Card (Pinned Upper-Right, Span 4) */}
          <div
            ref={floatingCardRef}
            className="absolute right-0 top-4 z-20 will-change-transform"
          >
            <FloatingWebsiteCard />
          </div>

          {/* Rotating Scroll Cue (Pinned Bottom-Right) */}
          <div
            ref={scrollCueRef}
            className="absolute -right-2 bottom-4 z-20 hidden xl:block"
          >
            <ScrollCue />
          </div>
        </div>

        {/* MOBILE & TABLET LAYOUT (< 1024px) */}
        <div className="lg:hidden flex flex-col justify-between pt-6 pb-2 relative z-10">
          {/* Top: Availability & Headline */}
          <div className="mb-6">
            <div className="mb-4">
              <AvailabilityPill text={availability} />
            </div>
            <HeroHeadline
              isSecondary={true}
              line1={headlineLine1}
              line2={headlineLine2}
              tagline={tagline}
              bio={bio}
            />
          </div>

          {/* Center: Portrait with Cropped "ZEHAN" behind & interactive/auto-animated lens */}
          <div
            ref={portraitWrapperRef}
            className="relative w-full max-w-[340px] sm:max-w-[400px] mx-auto mt-2 mb-6 flex justify-center will-change-transform"
          >
            <HeroPortrait />
          </div>

          {/* Bottom: Single Floating Panel + Scroll Cue */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
            <div className="w-full sm:w-auto">
              <FloatingWebsiteCard className="!w-full sm:!w-[280px] !rotate-[-1.5deg]" />
            </div>
            <div className="self-end sm:self-center">
              <ScrollCue className="w-16 h-16 md:w-20 md:h-20" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
