"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { PORTFOLIO_PROJECTS, PortfolioProject } from "@/data/projects";
import { LivePreviewModal } from "@/components/preview/LivePreviewModal";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { isReducedMotion, MOTION_TOKENS } from "@/utils/animation";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface DigitalExperiencesProps {
  projects?: PortfolioProject[];
}

export const DigitalExperiences: React.FC<DigitalExperiencesProps> = ({ projects }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [clickOrigin, setClickOrigin] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Filter projects with live URLs
  const developedProjects =
    projects && projects.length > 0
      ? projects
      : PORTFOLIO_PROJECTS.filter((p) => p.liveUrl);

  const handleOpenPreview = (e: React.MouseEvent<HTMLButtonElement>, project: PortfolioProject) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setClickOrigin({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });
    setSelectedProject(project);
    setModalOpen(true);
  };

  useEffect(() => {
    // Support direct preview opening via URL query for testing and external links (?preview=grandpool)
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const previewSlug = params.get("preview");
      if (previewSlug) {
        const found = developedProjects.find(
          (p) => p.id === previewSlug || p.slug === previewSlug
        );
        if (found) {
          setSelectedProject(found);
          setModalOpen(true);
        }
      }
    }

    const section = sectionRef.current;
    if (!section || isReducedMotion()) return;

    const ctx = gsap.context(() => {
      // Architectural Section Divider Line (Draws across on scroll)
      gsap.from(".exp-divider-line", {
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
      gsap.to(".exp-watermark", {
        yPercent: -25,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      // Header entrance mask reveal
      gsap.from(".exp-header-line", {
        yPercent: 110,
        duration: MOTION_TOKENS.durationBase,
        ease: MOTION_TOKENS.easeBase,
        stagger: 0.1,
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });

      // Browser Card tactile perspective lift on scroll
      const cards = section.querySelectorAll(".exp-project-card");
      cards.forEach((card) => {
        gsap.fromTo(
          card,
          {
            y: 40,
            opacity: 0.88,
            rotateX: 3,
            transformPerspective: 1000,
          },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: MOTION_TOKENS.durationBase,
            ease: MOTION_TOKENS.easeBase,
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
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
      id="experiences"
      aria-label="Digital Experiences and Developed Websites"
      className="relative w-full bg-background text-foreground border-b border-border py-24 sm:py-32 overflow-hidden"
    >
      {/* Architectural Top Divider Line */}
      <div className="exp-divider-line absolute top-0 left-0 w-full h-[1px] bg-border pointer-events-none" />

      {/* Monumental Watermark Numeral with Scroll Parallax */}
      <div
        aria-hidden="true"
        className="exp-watermark absolute -right-6 md:right-8 lg:right-16 top-12 pointer-events-none select-none font-display text-[180px] sm:text-[260px] lg:text-[340px] font-black text-[#DAD7D0]/30 leading-none -z-0 will-change-transform"
      >
        03
      </div>

      <div className="container-editorial relative z-10">
        {/* Section 03 Header */}
        <div className="border-b border-border pb-12 mb-16 md:mb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="overflow-hidden mb-3">
                <span className="exp-header-line block type-label text-text-muted tracking-widest">
                  CHAPTER 03 // DIGITAL EXPERIENCES
                </span>
              </div>
              <div className="overflow-hidden">
                <h2 className="exp-header-line type-h1 text-foreground">
                  Developed Websites &amp; Live Systems
                </h2>
              </div>
            </div>

            <div className="type-caption font-mono text-xs text-text-muted">
              INTERACTIVE MIRROR // ON-DEMAND LIVE SANDBOX
            </div>
          </div>
        </div>

        {/* Project Cards (Large Editorial Presentation) */}
        {developedProjects.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-border p-12 my-8">
            <p className="type-body text-text-muted font-mono text-xs tracking-widest uppercase">
              [ No Published Digital Experiences at Present • Case Studies in Staging ]
            </p>
          </div>
        ) : (
          <div className="space-y-16 md:space-y-24">
            {developedProjects.map((project, idx) => (
              <article
                key={project.id}
                className="exp-project-card group border border-border bg-background p-6 sm:p-10 lg:p-12 rounded-sm transition-all duration-500 hover:border-foreground will-change-transform"
              >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                {/* 
                  LEFT (5/12): METADATA, TECHNOLOGIES, ACTIONS
                */}
                <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="type-label text-text-muted">
                        0{idx + 1} {"//"} {project.category}
                      </span>
                      <span className="text-border">•</span>
                      <span className="type-label text-text-muted">{project.year}</span>
                    </div>

                    <h3 className="type-h1 text-foreground mb-4">
                      {project.title}
                    </h3>

                    <p className="type-body text-text-muted leading-relaxed mb-6">
                      {project.description}
                    </p>

                    {/* URL Link */}
                    <div className="flex items-center gap-2 mb-6">
                      <span className="type-caption font-mono text-xs text-text-muted">DOMAIN:</span>
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="type-caption font-mono text-xs text-foreground underline hover:opacity-70 transition-opacity truncate max-w-xs"
                      >
                        {project.liveUrl}
                      </a>
                    </div>

                    {/* Contribution Notice */}
                    <div className="p-3 border border-border bg-[#F8F7F4] rounded-sm mb-6">
                      <div className="type-label text-[10px] text-text-muted font-mono mb-1">
                        CONTRIBUTION SPECIFICATION
                      </div>
                      <p className="type-caption text-xs font-mono text-foreground">
                        Role: {project.role.join(", ")}
                      </p>
                      <p className="type-caption text-[11px] text-text-muted mt-1">
                        Scope and deliverables subject to client confirmation.
                      </p>
                    </div>

                    {/* Confirmed Technologies (Only if confirmed) */}
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="space-y-2 mb-6">
                        <span className="type-label text-[11px] text-text-muted block font-mono">
                          CONFIRMED TECHNOLOGIES
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="px-2.5 py-1 border border-border rounded-none bg-background text-[11px] font-mono text-foreground"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions: Preview Website & Open Live Website */}
                  <div className="pt-6 border-t border-border flex flex-wrap items-center gap-4">
                    <button
                      onClick={(e) => handleOpenPreview(e, project)}
                      className="type-label inline-flex items-center gap-2 px-6 py-3.5 border border-foreground bg-foreground text-dark-foreground rounded-sm hover:bg-transparent hover:text-foreground transition-all cursor-pointer shadow-xs"
                    >
                      <span>Preview Website</span>
                      <span>⛶</span>
                    </button>

                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="type-label inline-flex items-center gap-2 px-6 py-3.5 border border-border bg-background text-foreground rounded-sm hover:border-foreground transition-colors"
                    >
                      <span>Open Live Website</span>
                      <span>↗</span>
                    </a>
                  </div>
                </div>

                {/* 
                  RIGHT (7/12): EDITORIAL BROWSER-FRAME CARD (Slides screenshot on hover)
                */}
                <div className="lg:col-span-7">
                  <div className="relative w-full border border-border bg-[#EBE8E1] rounded-sm overflow-hidden shadow-sm transition-transform duration-500 group-hover:scale-[1.01]">
                    {/* Browser Bar */}
                    <div className="px-3 py-2 border-b border-border bg-[#EBE8E1] flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full border border-border bg-[#DAD7D0]" />
                        <span className="w-2.5 h-2.5 rounded-full border border-border bg-[#DAD7D0]" />
                        <span className="w-2.5 h-2.5 rounded-full border border-border bg-[#DAD7D0]" />
                      </div>
                      <span className="text-[10px] font-mono text-text-muted truncate max-w-[200px]">
                        {project.liveUrl ? new URL(project.liveUrl).hostname : ""}
                      </span>
                      <span className="type-label text-[9px] text-text-muted font-mono">
                        {project.previewMode.toUpperCase()}
                      </span>
                    </div>

                    {/* Screenshot Container with hover slide interaction */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-[#F8F7F4]">
                      <Image
                        src={project.coverImage}
                        alt={`${project.title} live interface preview`}
                        fill
                        sizes="(max-width: 1024px) 100vw, 58vw"
                        className="object-cover object-top transition-transform duration-700 ease-editorial group-hover:scale-105"
                      />

                      {/* Hover Overlay Button */}
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                        <span className="type-label text-xs tracking-wider bg-background text-foreground px-5 py-2.5 rounded-pill border border-border shadow-md">
                          Click &quot;Preview Website&quot; to Launch
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
        )}
      </div>

      {/* 
        LIVE PREVIEW MODAL MOUNT
        Iframe is mounted on-demand only when open, and destroyed when closed.
      */}
      <LivePreviewModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        project={selectedProject}
        originPos={clickOrigin}
      />
    </section>
  );
};
