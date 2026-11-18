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
                className="group relative border border-border bg-[#1C1C1C] rounded-lg overflow-hidden shadow-sm cursor-pointer transition-all duration-300 hover:shadow-xl hover:border-foreground/30"
                onClick={() => openModal(idx)}
              >
                {/* Browser Frame Header */}
                <div className="px-4 py-3 bg-[#242424] border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                  </div>
                  <div className="px-3 py-0.5 bg-[#171717] border border-white/10 rounded-full text-[10px] font-mono text-[#9E9B93] flex items-center gap-1.5 truncate max-w-[240px]">
                    <span className="text-emerald-400 text-[9px]">🔒</span>
                    <span className="text-white/40">https://</span>
                    <span className="text-white truncate">{project.title.toLowerCase().replace(/[^a-z0-9]+/g, "")}.com</span>
                  </div>
                  <span className="type-label text-[10px] font-mono text-white/70 group-hover:text-white flex items-center gap-1">
                    <span>WEBSITE VIEW</span>
                    <span>↗</span>
                  </span>
                </div>

                {/* Website Preview Canvas */}
                <div className="relative w-full max-h-[600px] overflow-hidden bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={screen}
                    alt={`${project.title} detailed screen ${idx + 1}`}
                    className="w-full h-auto block object-cover object-top transition-transform duration-700 ease-editorial group-hover:scale-[1.01]"
                  />

                  {/* Gradient Fade with Scroll Cue */}
                  <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none flex items-end justify-center pb-4">
                    <span className="type-label text-[11px] font-mono px-4 py-2 bg-white text-black font-medium rounded-full shadow-lg flex items-center gap-2 group-hover:scale-105 transition-transform">
                      <span>Click to scroll full website design</span>
                      <span>↕</span>
                    </span>
                  </div>
                </div>

                {/* Caption Bar */}
                <div className="p-3 bg-[#171717] border-t border-white/10 flex items-center justify-between text-xs text-[#8C8880] font-mono">
                  <span>FIGURE {String(idx + 1).padStart(2, "0")} {"//"} WEBSITE SCREEN VIEW</span>
                  <span className="type-label text-[10px] text-white group-hover:underline">
                    FULLSCREEN INTERACTIVE SCROLL ⛶
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
