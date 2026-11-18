"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import NextLink from "next/link";
import { PortfolioProject } from "@/data/projects";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { isReducedMotion, MOTION_TOKENS } from "@/utils/animation";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ProjectCardProps {
  project: PortfolioProject;
  index: number;
  layoutVariant: "full" | "left-heavy" | "right-heavy";
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  index,
  layoutVariant,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const innerImgRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  // Custom "View" cursor tracking over image on desktop
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth < 1024) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setCursorPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  useEffect(() => {
    const card = cardRef.current;
    const imgContainer = imageContainerRef.current;
    const innerImg = innerImgRef.current;
    if (!card || !imgContainer) return;

    if (isReducedMotion()) {
      gsap.set(imgContainer, { clipPath: "inset(0% 0% 0% 0%)" });
      if (innerImg) gsap.set(innerImg, { scale: 1, yPercent: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      // 1. Initial Image Curtain Reveal (0.9s, power4.out)
      gsap.set(imgContainer, { clipPath: "inset(100% 0% 0% 0%)" });
      if (innerImg) gsap.set(innerImg, { scale: 1.15, yPercent: -4 });

      const revealTl = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });

      revealTl.to(imgContainer, {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: MOTION_TOKENS.durationBase,
        ease: MOTION_TOKENS.easeBase,
      });

      if (innerImg) {
        revealTl.to(
          innerImg,
          {
            scale: 1,
            duration: MOTION_TOKENS.durationBase * 1.1,
            ease: MOTION_TOKENS.easeBase,
          },
          "<"
        );
      }

      // Staggered reveal for text metadata on card entrance
      revealTl.from(
        card.querySelectorAll(".project-meta-stagger"),
        {
          y: 20,
          opacity: 0,
          duration: MOTION_TOKENS.durationBase * 0.8,
          ease: MOTION_TOKENS.easeBase,
          stagger: 0.06,
        },
        "-=0.6"
      );

      // 2. Subtle Scroll Parallax on Inner Image (smooth scrub momentum)
      if (innerImg) {
        const isMobile = window.innerWidth < 1024;
        const parallaxDistance = isMobile ? 4 : 9; // subtle, avoids jank

        gsap.to(innerImg, {
          yPercent: parallaxDistance,
          ease: "none",
          scrollTrigger: {
            trigger: card,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      }
    }, card);

    return () => ctx.revert();
  }, []);

  const imageAspectClass =
    layoutVariant === "full" ? "aspect-[21/10]" : "aspect-[16/11]";

  return (
    <article
      ref={cardRef}
      className="project-card border-t border-border pt-12 md:pt-20 pb-16 md:pb-24 w-full"
    >
      {/* 
        LAYOUT A: FULL-WIDTH SHOWCASE
      */}
      {layoutVariant === "full" && (
        <div className="flex flex-col gap-8">
          {/* Metadata Header */}
          <div className="project-meta-stagger flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="type-label text-text-muted">
                  {String(index + 1).padStart(2, "0")} {"//"} {project.category}
                </span>
                <span className="text-border">•</span>
                <span className="type-label text-text-muted">{project.year}</span>
              </div>
              <NextLink href={`/works/${project.slug}`}>
                <h3 className="type-h1 text-foreground hover:opacity-75 transition-opacity">
                  {project.title}
                </h3>
              </NextLink>
            </div>

            <div className="max-w-md text-right md:text-right">
              <p className="type-body text-text-muted text-left md:text-right mb-2">
                {project.description}
              </p>
              <div className="type-caption font-mono text-xs text-text-muted text-left md:text-right">
                ROLE: {project.role.join(", ")}
              </div>
            </div>
          </div>

          {/* Large Full-Width Image Container */}
          <NextLink
            href={`/works/${project.slug}`}
            className="block group relative cursor-pointer"
          >
            <div
              ref={imageContainerRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className={`relative w-full ${imageAspectClass} overflow-hidden border border-border bg-[#F8F7F4]`}
            >
              <div ref={innerImgRef} className="w-full h-full relative will-change-transform">
                <Image
                  src={project.coverImage}
                  alt={`${project.title} cover image`}
                  fill
                  sizes="100vw"
                  className="object-cover object-top transition-transform duration-700 ease-editorial group-hover:scale-[1.02]"
                />
              </div>

              {/* Custom "VIEW" Cursor Label (Desktop Hover) */}
              {isHovered && (
                <div
                  aria-hidden="true"
                  className="hidden lg:flex fixed pointer-events-none z-30 -translate-x-1/2 -translate-y-1/2 items-center justify-center w-20 h-20 rounded-full bg-foreground text-dark-foreground type-label text-xs tracking-widest shadow-lg"
                  style={{
                    left: `${cursorPos.x}px`,
                    top: `${cursorPos.y}px`,
                    position: "absolute",
                  }}
                >
                  VIEW
                </div>
              )}
            </div>
          </NextLink>
        </div>
      )}

      {/* 
        LAYOUT B: 7/12 LEFT IMAGE, 5/12 RIGHT METADATA
      */}
      {layoutVariant === "left-heavy" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column (7/12): Image */}
          <div className="lg:col-span-7">
            <NextLink
              href={`/works/${project.slug}`}
              className="block group relative cursor-pointer"
            >
              <div
                ref={imageContainerRef}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`relative w-full ${imageAspectClass} overflow-hidden border border-border bg-[#F8F7F4]`}
              >
                <div ref={innerImgRef} className="w-full h-full relative will-change-transform">
                  <Image
                    src={project.coverImage}
                    alt={`${project.title} cover image`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    className="object-cover object-top transition-transform duration-700 ease-editorial group-hover:scale-[1.02]"
                  />
                </div>

                {isHovered && (
                  <div
                    aria-hidden="true"
                    className="hidden lg:flex fixed pointer-events-none z-30 -translate-x-1/2 -translate-y-1/2 items-center justify-center w-20 h-20 rounded-full bg-foreground text-dark-foreground type-label text-xs tracking-widest shadow-lg"
                    style={{
                      left: `${cursorPos.x}px`,
                      top: `${cursorPos.y}px`,
                      position: "absolute",
                    }}
                  >
                    VIEW
                  </div>
                )}
              </div>
            </NextLink>
          </div>

          {/* Right Column (5/12): Metadata */}
          <div className="project-meta-stagger lg:col-span-5 flex flex-col justify-center space-y-6 lg:pl-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="type-label text-text-muted">
                  {String(index + 1).padStart(2, "0")} {"//"} {project.category}
                </span>
                <span className="text-border">•</span>
                <span className="type-label text-text-muted">{project.year}</span>
              </div>
              <NextLink href={`/works/${project.slug}`}>
                <h3 className="type-h1 text-foreground hover:opacity-75 transition-opacity">
                  {project.title}
                </h3>
              </NextLink>
            </div>

            <p className="type-body text-text-muted leading-relaxed">
              {project.description}
            </p>

            <div className="pt-4 border-t border-border flex flex-col gap-2">
              <span className="type-label text-text-muted text-[11px]">ROLE TAXONOMY</span>
              <span className="type-caption font-mono text-xs">
                {project.role.join(", ")}
              </span>
            </div>

            <div className="pt-2 flex items-center gap-4">
              <NextLink
                href={`/works/${project.slug}`}
                className="type-label inline-flex items-center gap-2 px-5 py-2.5 border border-foreground rounded-sm bg-foreground text-dark-foreground hover:bg-transparent hover:text-foreground transition-all"
              >
                <span>Explore Project</span>
                <span>→</span>
              </NextLink>
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="type-label inline-flex items-center gap-1.5 text-text-muted hover:text-foreground transition-colors"
                >
                  <span>Live Site</span>
                  <span className="text-[10px]">↗</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 
        LAYOUT C: 5/12 LEFT METADATA, 7/12 RIGHT IMAGE
      */}
      {layoutVariant === "right-heavy" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column (5/12): Metadata */}
          <div className="project-meta-stagger order-2 lg:order-1 lg:col-span-5 flex flex-col justify-center space-y-6 lg:pr-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="type-label text-text-muted">
                  {String(index + 1).padStart(2, "0")} {"//"} {project.category}
                </span>
                <span className="text-border">•</span>
                <span className="type-label text-text-muted">{project.year}</span>
              </div>
              <NextLink href={`/works/${project.slug}`}>
                <h3 className="type-h1 text-foreground hover:opacity-75 transition-opacity">
                  {project.title}
                </h3>
              </NextLink>
            </div>

            <p className="type-body text-text-muted leading-relaxed">
              {project.description}
            </p>

            <div className="pt-4 border-t border-border flex flex-col gap-2">
              <span className="type-label text-text-muted text-[11px]">ROLE TAXONOMY</span>
              <span className="type-caption font-mono text-xs">
                {project.role.join(", ")}
              </span>
            </div>

            <div className="pt-2 flex items-center gap-4">
              <NextLink
                href={`/works/${project.slug}`}
                className="type-label inline-flex items-center gap-2 px-5 py-2.5 border border-foreground rounded-sm bg-foreground text-dark-foreground hover:bg-transparent hover:text-foreground transition-all"
              >
                <span>Explore Project</span>
                <span>→</span>
              </NextLink>
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="type-label inline-flex items-center gap-1.5 text-text-muted hover:text-foreground transition-colors"
                >
                  <span>Live Preview</span>
                  <span className="text-[10px]">↗</span>
                </a>
              )}
            </div>
          </div>

          {/* Right Column (7/12): Image */}
          <div className="order-1 lg:order-2 lg:col-span-7">
            <NextLink
              href={`/works/${project.slug}`}
              className="block group relative cursor-pointer"
            >
              <div
                ref={imageContainerRef}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`relative w-full ${imageAspectClass} overflow-hidden border border-border bg-[#F8F7F4]`}
              >
                <div ref={innerImgRef} className="w-full h-full relative will-change-transform">
                  <Image
                    src={project.coverImage}
                    alt={`${project.title} cover image`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    className="object-cover object-top transition-transform duration-700 ease-editorial group-hover:scale-[1.02]"
                  />
                </div>

                {isHovered && (
                  <div
                    aria-hidden="true"
                    className="hidden lg:flex fixed pointer-events-none z-30 -translate-x-1/2 -translate-y-1/2 items-center justify-center w-20 h-20 rounded-full bg-foreground text-dark-foreground type-label text-xs tracking-widest shadow-lg"
                    style={{
                      left: `${cursorPos.x}px`,
                      top: `${cursorPos.y}px`,
                      position: "absolute",
                    }}
                  >
                    VIEW
                  </div>
                )}
              </div>
            </NextLink>
          </div>
        </div>
      )}
    </article>
  );
};
