"use client";

import React, { useRef, useEffect } from "react";
import { PORTFOLIO_PROJECTS, PortfolioProject } from "@/data/projects";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { isReducedMotion, MOTION_TOKENS } from "@/utils/animation";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface SelectedWorksProps {
  projects?: PortfolioProject[];
}

export const SelectedWorks: React.FC<SelectedWorksProps> = ({ projects }) => {
  const displayProjects = projects && projects.length > 0 ? projects : PORTFOLIO_PROJECTS;
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || isReducedMotion()) return;

    const ctx = gsap.context(() => {
      // Architectural Section Divider Line (Draws across on scroll)
      gsap.from(".works-divider-line", {
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
      gsap.to(".works-watermark", {
        yPercent: -25,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      // Section Entrance subtle lift
      gsap.from(".works-header-container", {
        y: 40,
        opacity: 0.85,
        duration: MOTION_TOKENS.durationBase,
        ease: MOTION_TOKENS.easeBase,
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top 88%",
          toggleActions: "play none none none",
        },
      });

      // Header entrance mask reveal
      gsap.from(".works-header-line", {
        yPercent: 110,
        duration: MOTION_TOKENS.durationBase,
        ease: MOTION_TOKENS.easeBase,
        stagger: 0.1,
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="works"
      aria-label="Selected Works & Case Studies"
      className="relative w-full bg-background text-foreground border-b border-border py-24 sm:py-32 overflow-hidden"
    >
      {/* Architectural Top Divider Line */}
      <div className="works-divider-line absolute top-0 left-0 w-full h-[1px] bg-border pointer-events-none" />

      {/* Monumental Watermark Numeral with Scroll Parallax */}
      <div
        aria-hidden="true"
        className="works-watermark absolute -right-6 md:right-8 lg:right-16 top-12 pointer-events-none select-none font-display text-[180px] sm:text-[260px] lg:text-[340px] font-black text-[#DAD7D0]/30 leading-none -z-0 will-change-transform"
      >
        02
      </div>

      <div className="container-editorial relative z-10">
        {/* Section Header */}
        <div ref={headerRef} className="works-header-container border-b border-border pb-12 mb-16 md:mb-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="overflow-hidden mb-3">
                <span className="works-header-line block type-label text-text-muted tracking-widest">
                  CHAPTER 02 // SELECTED WORKS
                </span>
              </div>
              <div className="overflow-hidden">
                <h2 className="works-header-line type-h1 text-foreground">
                  Digital Experiences &amp; Visual Systems
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-text-muted">
              <span>EXHIBITION ARCHIVE</span>
              <span>•</span>
              <span>{displayProjects.length} PROJECTS CURATED</span>
            </div>
          </div>
        </div>

        {/* Project List with Alternating Asymmetric Layouts */}
        {displayProjects.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-border p-12 my-8">
            <p className="type-body text-text-muted font-mono text-xs tracking-widest uppercase">
              [ No Published Selected Works at Present • Case Studies in Staging ]
            </p>
          </div>
        ) : (
          <div className="flex flex-col">
            {displayProjects.map((project, idx) => {
              // Alternating pattern: Full -> Left-heavy (7/5) -> Right-heavy (5/7) -> Left-heavy -> Right-heavy -> Full
              let variant: "full" | "left-heavy" | "right-heavy" = "full";
              if (idx === 0) variant = "full";
              else if (idx === 1) variant = "left-heavy";
              else if (idx === 2) variant = "right-heavy";
              else if (idx === 3) variant = "left-heavy";
              else if (idx === 4) variant = "right-heavy";
              else if (idx === 5) variant = "full";
              else variant = "left-heavy";

              return (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={idx}
                  layoutVariant={variant}
                />
              );
            })}
          </div>
        )}

        {/* Section Footer Callout */}
        <div className="mt-16 pt-12 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <p className="type-caption font-mono text-xs text-text-muted">
            All project contributions currently recorded as &quot;To be confirmed&quot;. Detailed case studies and live interactive mirrors available per project.
          </p>
          <a
            href="#contact"
            className="type-label inline-flex items-center gap-2 border border-border px-5 py-2.5 rounded-pill hover:border-foreground transition-colors bg-background"
          >
            <span>Inquire for collaboration</span>
            <span>→</span>
          </a>
        </div>
      </div>
    </section>
  );
};
