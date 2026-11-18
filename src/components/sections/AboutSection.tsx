"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import { PORTFOLIO_DATA, ExperienceItem, EducationItem } from "@/data/portfolio";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { isReducedMotion, MOTION_TOKENS } from "@/utils/animation";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface AboutSectionProps {
  experiences?: ExperienceItem[];
  education?: EducationItem[];
  tools?: string[];
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  experiences = PORTFOLIO_DATA.experiences || [],
  education = PORTFOLIO_DATA.education || [],
  tools = PORTFOLIO_DATA.tools,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || isReducedMotion()) return;

    const ctx = gsap.context(() => {
      // Architectural Section Divider Line (Draws across on scroll)
      gsap.from(".about-divider-line", {
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
      gsap.to(".about-watermark", {
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
      gsap.from(".about-header-line", {
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

      // Signature Quote kinetic word-by-word scroll reveal
      const words = section.querySelectorAll(".about-quote-word");
      if (words.length > 0) {
        gsap.to(words, {
          opacity: 1,
          stagger: 0.05,
          ease: "none",
          scrollTrigger: {
            trigger: ".about-quote-box",
            start: "top 80%",
            end: "bottom 55%",
            scrub: 0.8,
          },
        });
      }

      // Portrait clip-path reveal + subtle parallax
      if (portraitRef.current) {
        gsap.from(portraitRef.current, {
          clipPath: "inset(100% 0% 0% 0%)",
          duration: MOTION_TOKENS.durationBase,
          ease: MOTION_TOKENS.easeBase,
          scrollTrigger: {
            trigger: portraitRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });

        gsap.to(portraitRef.current, {
          yPercent: -6,
          ease: "none",
          scrollTrigger: {
            trigger: portraitRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      aria-label="About Siful Islam Zehan"
      className="relative w-full bg-background text-foreground border-b border-border py-24 sm:py-32 overflow-hidden"
    >
      {/* Architectural Top Divider Line */}
      <div className="about-divider-line absolute top-0 left-0 w-full h-[1px] bg-border pointer-events-none" />

      {/* Monumental Watermark Numeral with Scroll Parallax */}
      <div
        aria-hidden="true"
        className="about-watermark absolute -right-6 md:right-8 lg:right-16 top-12 pointer-events-none select-none font-display text-[180px] sm:text-[260px] lg:text-[340px] font-black text-[#DAD7D0]/30 leading-none -z-0 will-change-transform"
      >
        05
      </div>

      <div className="container-editorial relative z-10">
        {/* Section Header */}
        <div className="border-b border-border pb-12 mb-16 md:mb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="overflow-hidden mb-3">
                <span className="about-header-line block type-label text-text-muted tracking-widest">
                  CHAPTER 05 // ABOUT THE DESIGNER
                </span>
              </div>
              <div className="overflow-hidden">
                <h2 className="about-header-line type-h1 text-foreground">
                  Disciplined Practice &amp; Philosophy
                </h2>
              </div>
            </div>

            <div className="type-caption font-mono text-xs text-text-muted">
              EST. DHAKA, BANGLADESH • UI/UX &amp; FRONT-END
            </div>
          </div>
        </div>

        {/* 
          EDITORIAL 2-COLUMN ARCHITECTURAL SPREAD
        */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* 
            LEFT COLUMN (5/12): MONOCHROME PORTRAIT & CORE METRICS
          */}
          <div className="lg:col-span-5 space-y-8">
            <div
              ref={portraitRef}
              className="relative w-full aspect-[4/5] border border-border bg-[#F8F7F4] overflow-hidden"
            >
              <Image
                src="/images/profile/zehan-portrait.png"
                alt="Siful Islam Zehan — UI/UX Designer"
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover object-top filter grayscale contrast-[1.08] brightness-[0.98]"
              />
              <div className="absolute bottom-3 left-3 bg-background border border-border px-3 py-1 type-label text-[10px] text-foreground font-mono">
                SIFUL ISLAM ZEHAN // DESIGNER
              </div>
            </div>

            {/* Verified Location & Contact Bar */}
            <div className="border border-border p-6 bg-background space-y-3 font-mono text-xs">
              <div className="flex justify-between items-baseline border-b border-border pb-2">
                <span className="text-text-muted">LOCATION:</span>
                <span className="text-foreground">Dhaka, Bangladesh</span>
              </div>
              <div className="flex justify-between items-baseline border-b border-border pb-2">
                <span className="text-text-muted">COORDINATES:</span>
                <span className="text-foreground">23.8103° N, 90.4125° E</span>
              </div>
              <div className="flex justify-between items-baseline border-b border-border pb-2">
                <span className="text-text-muted">PRIMARY ROLE:</span>
                <span className="text-foreground">UI/UX &amp; Front-End Designer</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-text-muted">AVAILABILITY:</span>
                <span className="text-foreground">Open for Projects • 2026</span>
              </div>
            </div>
          </div>

          {/* 
            RIGHT COLUMN (7/12): PHILOSOPHY, BIOGRAPHY, AND TOOLS
          */}
          <div className="lg:col-span-7 space-y-12">
            {/* Signature Quote */}
            <div className="about-quote-box border-l-2 border-foreground pl-6 sm:pl-8 py-2">
              <blockquote className="type-display-l font-serif italic text-foreground leading-tight">
                {`"Clean design isn't just visual, it's how things work."`
                  .split(" ")
                  .map((word, wIdx) => (
                    <span
                      key={wIdx}
                      className="about-quote-word inline-block mr-2 opacity-30 will-change-[opacity]"
                    >
                      {word}
                    </span>
                  ))}
              </blockquote>
              <cite className="block type-caption font-mono text-xs text-text-muted mt-3 not-italic">
                — SIFUL ISLAM ZEHAN, DESIGN STATEMENT
              </cite>
            </div>

            {/* Natural Biography */}
            <div className="space-y-6 type-body-l text-text-muted leading-relaxed">
              <p>
                I am a designer with front-end implementation skills. I work across UI/UX design, website design, product interfaces, and front-end code to craft meaningful, high-performance digital experiences.
              </p>
              <p>
                My practice bridges visual discernment and production code. Rather than handing off disconnected static mockups, I design with an intrinsic understanding of DOM structure, semantic HTML, responsive breakpoints, and motion systems.
              </p>
              <p>
                I am deliberately positioned as a <strong className="text-foreground font-semibold">UI/UX Designer and Front-End Designer</strong>. I believe deep craftsmanship at the intersection of aesthetic discipline and client-side implementation yields superior product results.
              </p>
            </div>

            {/* Problem-Solving Approach */}
            <div className="pt-8 border-t border-border">
              <h3 className="type-label text-text-muted font-mono tracking-widest mb-6">
                PROBLEM-SOLVING METHODOLOGY
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="border border-border p-6 bg-background">
                  <span className="type-label text-xs text-text-muted block mb-2 font-mono">01 // DISCOVERY &amp; AUDIT</span>
                  <p className="type-body text-sm text-foreground">
                    Uncovering user friction, cognitive bottlenecks, and information architecture hierarchy through structural audits.
                  </p>
                </div>
                <div className="border border-border p-6 bg-background">
                  <span className="type-label text-xs text-text-muted block mb-2 font-mono">02 // ATOMIC COMPOSITION</span>
                  <p className="type-body text-sm text-foreground">
                    Constructing scalable design tokens, typographical clamp hierarchies, and modular component systems in Figma.
                  </p>
                </div>
                <div className="border border-border p-6 bg-background">
                  <span className="type-label text-xs text-text-muted block mb-2 font-mono">03 // CODE IMPLEMENTATION</span>
                  <p className="type-body text-sm text-foreground">
                    Executing pixel-perfect front-end code using semantic React / Next.js, modern CSS, and 60fps GSAP motion.
                  </p>
                </div>
                <div className="border border-border p-6 bg-background">
                  <span className="type-label text-xs text-text-muted block mb-2 font-mono">04 // RIGOROUS QA</span>
                  <p className="type-body text-sm text-foreground">
                    Testing accessibility (a11y), responsive breakpoints (1440 to 375), and Lighthouse audit benchmarks.
                  </p>
                </div>
              </div>
            </div>

            {/* Confirmed Tools & Software */}
            <div className="pt-8 border-t border-border">
              <h3 className="type-label text-text-muted font-mono tracking-widest mb-4">
                CONFIRMED TOOLING &amp; SOFTWARE STACK
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {(tools || PORTFOLIO_DATA.tools).map((tool) => (
                  <span
                    key={tool}
                    className="px-4 py-2 border border-border bg-background type-label text-xs text-foreground font-mono"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* Career Timeline / Work Experience */}
            <div className="pt-8 border-t border-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="type-label text-text-muted font-mono tracking-widest">
                  CAREER &amp; WORK EXPERIENCE
                </h3>
                <span className="type-label text-[10px] text-accent border border-accent/40 bg-accent/5 px-2.5 py-0.5 rounded-full font-mono">
                  VERIFIED HISTORY
                </span>
              </div>

              {experiences && experiences.length > 0 ? (
                <div className="space-y-4">
                  {experiences.map((exp: ExperienceItem, idx: number) => (
                    <div
                      key={exp.id || `exp-${idx}`}
                      className="border border-border p-6 bg-background hover:border-foreground/40 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                        <div>
                          <h4 className="font-serif text-lg text-foreground font-normal tracking-tight">
                            {exp.role}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="type-label text-xs text-accent font-mono font-medium">
                              @{exp.company}
                            </span>
                            {exp.location && (
                              <>
                                <span className="text-text-muted text-xs">•</span>
                                <span className="type-label text-xs text-text-muted font-mono">
                                  {exp.location}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        <span className="type-label text-xs font-mono text-text-muted bg-neutral-100 border border-border px-2.5 py-1 rounded shrink-0 self-start">
                          {exp.period}
                        </span>
                      </div>
                      {exp.description && (
                        <p className="type-body text-xs text-text-muted leading-relaxed mt-3 pt-3 border-t border-border/50">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border border-border p-6 bg-[#F8F7F4] font-mono text-xs text-text-muted">
                  No work experience entries recorded yet.
                </div>
              )}
            </div>

            {/* Academic & Education Background */}
            <div className="pt-8 border-t border-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="type-label text-text-muted font-mono tracking-widest">
                  ACADEMIC &amp; EDUCATION BACKGROUND
                </h3>
                <span className="type-label text-[10px] text-text-muted border border-border px-2.5 py-0.5 rounded-full font-mono">
                  ACCREDITED
                </span>
              </div>

              {education && education.length > 0 ? (
                <div className="space-y-4">
                  {education.map((edu: EducationItem, idx: number) => (
                    <div
                      key={edu.id || `edu-${idx}`}
                      className="border border-border p-6 bg-background hover:border-foreground/40 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                        <div>
                          <h4 className="font-serif text-lg text-foreground font-normal tracking-tight">
                            {edu.degree}
                          </h4>
                          <span className="type-label text-xs text-text-muted font-mono block mt-1">
                            {edu.institution}
                          </span>
                        </div>
                        <span className="type-label text-xs font-mono text-text-muted bg-neutral-100 border border-border px-2.5 py-1 rounded shrink-0 self-start">
                          {edu.period}
                        </span>
                      </div>
                      {edu.description && (
                        <p className="type-body text-xs text-text-muted leading-relaxed mt-3 pt-3 border-t border-border/50">
                          {edu.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border border-border p-6 bg-[#F8F7F4] font-mono text-xs text-text-muted">
                  No educational credentials recorded yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
