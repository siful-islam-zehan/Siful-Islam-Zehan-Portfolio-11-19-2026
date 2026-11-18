"use client";

import React, { useState } from "react";
import Image from "next/image";
import NextLink from "next/link";
import { PortfolioProject } from "@/data/projects";
import { ImageViewerModal } from "@/components/projects/ImageViewerModal";

interface ProjectDetailClientProps {
  project: PortfolioProject;
  prevProject: PortfolioProject;
  nextProject: PortfolioProject;
}

export const ProjectDetailClient: React.FC<ProjectDetailClientProps> = ({
  project,
  prevProject,
  nextProject,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);

  const openModal = (index: number) => {
    setModalIndex(index);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground pt-12 pb-32">
      {/* Top Back Navigation Bar */}
      <nav
        aria-label="Breadcrumb navigation"
        className="w-full border-b border-border py-4 mb-12 sm:mb-16"
      >
        <div className="container-editorial flex items-center justify-between">
          <NextLink
            href="/#works"
            className="type-label inline-flex items-center gap-2 text-foreground hover:opacity-60 transition-opacity"
          >
            <span>←</span>
            <span>Return to Exhibition</span>
          </NextLink>

          <div className="type-caption font-mono text-xs text-text-muted">
            CASE STUDY // {project.category}
          </div>
        </div>
      </nav>

      <div className="container-editorial">
        {/* Main 2-Column Case Study Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* 
            LEFT COLUMN (5/12): STICKY STORYTELLING SIDEBAR
          */}
          <aside className="lg:col-span-5 lg:sticky lg:top-24 space-y-8 pb-12">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="type-label text-text-muted">
                  {project.category}
                </span>
                <span className="text-border">•</span>
                <span className="type-label text-text-muted">{project.year}</span>
              </div>
              <h1 className="type-h1 text-foreground mb-4">{project.title}</h1>
              <p className="type-body-l text-text-muted leading-relaxed">
                {project.description}
              </p>
            </div>

            {/* Verification Notice */}
            <div className="p-4 border border-border bg-[#F8F7F4] rounded-sm space-y-2">
              <span className="type-label text-xs text-text-muted block font-mono">
                CONTRIBUTION STATUS
              </span>
              <p className="type-caption text-xs text-foreground font-mono">
                Role: {project.role.join(", ")}
              </p>
              <p className="type-caption text-[11px] text-text-muted">
                Note: Client ownership and exact delivery scope remain unconfirmed in this preview.
              </p>
            </div>

            {/* Metadata Taxonomy */}
            <div className="space-y-4 pt-4 border-t border-border">
              <div className="flex justify-between items-baseline py-2 border-b border-border/60">
                <span className="type-label text-text-muted">Timeline</span>
                <span className="type-caption font-mono text-xs">{project.year}</span>
              </div>
              <div className="flex justify-between items-baseline py-2 border-b border-border/60">
                <span className="type-label text-text-muted">Preview Mode</span>
                <span className="type-caption font-mono text-xs uppercase">
                  {project.previewMode}
                </span>
              </div>
              <div className="flex justify-between items-baseline py-2 border-b border-border/60">
                <span className="type-label text-text-muted">Exhibition Screens</span>
                <span className="type-caption font-mono text-xs">
                  {project.gallery.length} Screens Documented
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="type-label inline-flex items-center justify-center gap-2 px-6 py-3 border border-foreground bg-foreground text-dark-foreground rounded-sm hover:bg-transparent hover:text-foreground transition-all"
                >
                  <span>Open Live Site</span>
                  <span>↗</span>
                </a>
              )}
              <button
                onClick={() => openModal(0)}
                className="type-label inline-flex items-center justify-center gap-2 px-6 py-3 border border-border rounded-sm hover:border-foreground transition-colors bg-background"
              >
                <span>Fullscreen Inspect</span>
                <span>⛶</span>
              </button>
            </div>
          </aside>

          {/* 
            RIGHT COLUMN (7/12): FULL-SIZE SCREENS GALLERY
          */}
          <main className="lg:col-span-7 space-y-12 sm:space-y-16">
            {project.gallery.map((screen, idx) => (
              <div
                key={idx}
                className="group relative border border-border bg-[#F8F7F4] overflow-hidden cursor-zoom-in"
                onClick={() => openModal(idx)}
              >
                <div className="relative w-full aspect-[16/11]">
                  <Image
                    src={screen}
                    alt={`${project.title} detailed screen ${idx + 1}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    className="object-cover object-top transition-transform duration-700 ease-editorial group-hover:scale-[1.02]"
                    priority={idx === 0}
                  />
                </div>

                {/* Caption Bar */}
                <div className="p-3 bg-background border-t border-border flex items-center justify-between text-xs text-text-muted font-mono">
                  <span>FIGURE {String(idx + 1).padStart(2, "0")} {"//"} SCREEN VIEW</span>
                  <span className="type-label text-[10px] text-foreground group-hover:underline">
                    CLICK TO EXPAND ⛶
                  </span>
                </div>
              </div>
            ))}
          </main>
        </div>

        {/* 
          BOTTOM PAGINATION: PREVIOUS / NEXT PROJECT
        */}
        <div className="mt-24 pt-16 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-8">
          {/* Previous */}
          <NextLink
            href={`/works/${prevProject.slug}`}
            className="group p-8 border border-border bg-background hover:border-foreground transition-colors flex flex-col justify-between"
          >
            <div className="type-label text-text-muted mb-4">← PREVIOUS EXHIBITION</div>
            <div>
              <span className="type-caption font-mono text-xs block mb-1">
                {prevProject.category}
              </span>
              <h4 className="type-h2 text-foreground group-hover:opacity-70 transition-opacity">
                {prevProject.title}
              </h4>
            </div>
          </NextLink>

          {/* Next */}
          <NextLink
            href={`/works/${nextProject.slug}`}
            className="group p-8 border border-border bg-background hover:border-foreground transition-colors flex flex-col justify-between text-right"
          >
            <div className="type-label text-text-muted mb-4">NEXT EXHIBITION →</div>
            <div>
              <span className="type-caption font-mono text-xs block mb-1">
                {nextProject.category}
              </span>
              <h4 className="type-h2 text-foreground group-hover:opacity-70 transition-opacity">
                {nextProject.title}
              </h4>
            </div>
          </NextLink>
        </div>
      </div>

      {/* Fullscreen Image Viewer Modal */}
      <ImageViewerModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        images={project.gallery}
        initialIndex={modalIndex}
        projectTitle={project.title}
      />
    </div>
  );
};
