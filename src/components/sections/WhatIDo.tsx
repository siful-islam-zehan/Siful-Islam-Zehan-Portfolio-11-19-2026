"use client";

import React, { useState, useRef, useEffect } from "react";
import { PORTFOLIO_DATA, ServiceItem } from "@/data/portfolio";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { isReducedMotion, MOTION_TOKENS } from "@/utils/animation";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const WhatIDo: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const intro = PORTFOLIO_DATA.servicesIntro || {
    eyebrow: "02 — WHAT I DO",
    chapterLabel: "CHAPTER 04 // CAPABILITIES & DISCIPLINES",
    heading: "Beyond pixels. Into experiences.",
    description:
      "From the first idea to the final interface, I combine design thinking, visual creativity, and technical understanding to create meaningful digital experiences.",
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || isReducedMotion()) return;

    const ctx = gsap.context(() => {
      // Architectural Section Divider Line (Draws across on scroll)
      gsap.from(".services-divider-line", {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 90%",
          toggleActions: "play none none none",
        },
      });

      // Background Watermark Numeral Parallax Scrub (Deep architectural museum feel)
      gsap.to(".services-watermark", {
        yPercent: -25,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      // Header entrance animation
      gsap.fromTo(
        ".services-header-line",
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: MOTION_TOKENS.durationBase,
          ease: MOTION_TOKENS.easeBase,
          stagger: 0.1,
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      // Rows entrance: animate each row individually as it enters the viewport
      const rows = section.querySelectorAll(".service-row");
      rows.forEach((row) => {
        gsap.fromTo(
          row,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: "power3.out",
            scrollTrigger: {
              trigger: row,
              start: "top 92%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services"
      aria-label="What I Do — Capabilities & Disciplines"
      className="relative w-full bg-background text-foreground border-b border-border py-24 sm:py-32 overflow-hidden"
    >
      {/* Architectural Top Divider Line */}
      <div className="services-divider-line absolute top-0 left-0 w-full h-[1px] bg-border pointer-events-none" />

      {/* Monumental Watermark Numeral with Scroll Parallax */}
      <div
        aria-hidden="true"
        className="services-watermark absolute -right-6 md:right-8 lg:right-16 top-12 pointer-events-none select-none font-display text-[180px] sm:text-[260px] lg:text-[340px] font-black text-[#DAD7D0]/30 leading-none -z-0 will-change-transform"
      >
        04
      </div>

      <div className="container-editorial relative z-10">
        {/* Section Header */}
        <div className="border-b border-border pb-12 mb-12 md:mb-16">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <div className="overflow-hidden mb-3">
                <span className="services-header-line block type-label text-text-muted tracking-widest">
                  {intro.eyebrow} {"//"} {intro.chapterLabel}
                </span>
              </div>
              <div className="overflow-hidden mb-4">
                <h2 className="services-header-line type-h1 font-serif text-foreground">
                  {intro.heading}
                </h2>
              </div>
              <div className="overflow-hidden">
                <p className="services-header-line type-body text-text-muted leading-relaxed">
                  {intro.description}
                </p>
              </div>
            </div>

            <div className="type-caption font-mono text-xs text-text-muted shrink-0 pb-1">
              [ 06 DISCIPLINES // CURATED ]
            </div>
          </div>
        </div>

        {/* 
          EDITORIAL NUMBERED SERVICES LIST (STRICTLY NO CARDS)
          Hover dims siblings and slides in arrow.
        */}
        <ol
          className="services-list divide-y divide-border border-b border-border"
          onMouseLeave={() => setHoveredId(null)}
        >
          {PORTFOLIO_DATA.services.map((service: ServiceItem) => {
            const isHovered = hoveredId === service.id;
            const isAnyHovered = hoveredId !== null;
            const isDimmed = isAnyHovered && !isHovered;

            return (
              <li
                key={service.id}
                onMouseEnter={() => setHoveredId(service.id)}
                className={`service-row group py-10 sm:py-14 transition-all duration-500 ease-editorial select-none ${
                  isDimmed ? "opacity-25" : "opacity-100"
                }`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
                  {/* Left Column (5/12): Number + Prominent Title */}
                  <div className="lg:col-span-5 flex items-baseline gap-4 sm:gap-6">
                    <span className="font-mono text-2xl sm:text-3xl lg:text-4xl text-text-muted transition-colors duration-300 group-hover:text-foreground shrink-0 font-light">
                      {service.number}
                    </span>
                    <h3 className="type-display-l font-serif text-foreground font-normal transition-transform duration-500 ease-editorial group-hover:translate-x-2">
                      {service.title}
                    </h3>
                  </div>

                  {/* Right Column (7/12): Description + Deliverable Tags + Arrow */}
                  <div className="lg:col-span-7 flex flex-col justify-between space-y-5">
                    <div className="flex items-start justify-between gap-6">
                      <p className="type-body text-text-muted leading-relaxed group-hover:text-foreground transition-colors duration-300 max-w-xl">
                        {service.description}
                      </p>

                      {/* Sliding Monochromatic Arrow Indicator */}
                      <span
                        aria-hidden="true"
                        className="w-10 h-10 rounded-full border border-border shrink-0 flex items-center justify-center text-base text-foreground transition-all duration-300 ease-editorial group-hover:border-foreground group-hover:translate-x-1.5 group-hover:bg-foreground group-hover:text-dark-foreground"
                      >
                        →
                      </span>
                    </div>

                    {/* Subtle Monochromatic Deliverable Tags */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="type-caption text-[10px] text-text-muted font-mono tracking-wider mr-1">
                        DELIVERABLES:
                      </span>
                      {service.deliverables.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2.5 py-1 text-[11px] font-mono border border-border bg-[#F8F7F4] text-text-muted rounded-none group-hover:border-foreground/40 group-hover:text-foreground transition-colors duration-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        {/* Section Footer Callout */}
        <div className="mt-12 pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="type-caption font-mono text-xs text-text-muted">
            DESIGNER WITH FRONT-END IMPLEMENTATION CAPABILITIES • NO FULL-STACK CLAIM
          </p>
          <a
            href="#contact"
            className="type-label inline-flex items-center gap-2 text-foreground hover:opacity-70 transition-opacity"
          >
            <span>Have a project requirement? Inquire below</span>
            <span>↓</span>
          </a>
        </div>
      </div>
    </section>
  );
};
