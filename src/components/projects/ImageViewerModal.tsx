"use client";

import React, { useEffect, useCallback, useState, useRef } from "react";

interface ImageViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  initialIndex?: number;
  projectTitle: string;
}

export const ImageViewerModal: React.FC<ImageViewerModalProps> = ({
  isOpen,
  onClose,
  images,
  initialIndex = 0,
  projectTitle,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [viewMode, setViewMode] = useState<"website" | "fit">("website");
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  // Reset scroll to top when changing images
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [currentIndex, viewMode]);

  const handleNext = useCallback(() => {
    if (images.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const handlePrev = useCallback(() => {
    if (images.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose, handleNext, handlePrev]);

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    setTouchStart(null);
  };

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex];
  const simulatedDomain = `${projectTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "preview"}.com`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${projectTitle} - Fullscreen Website View`}
      className="fixed inset-0 z-50 flex flex-col justify-between bg-[#111111]/95 backdrop-blur-md text-[#F5F3EE] animate-[fadeIn_0.25s_cubic-bezier(0.16,1,0.3,1)] select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* 
        TOP UTILITY CONTROLS BAR
      */}
      <header className="w-full px-4 sm:px-8 py-3.5 flex items-center justify-between border-b border-white/10 bg-[#161616] z-20 flex-shrink-0">
        {/* Project Meta */}
        <div className="flex items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="type-label text-[10px] font-mono tracking-widest text-[#9E9B93] uppercase">
                EXHIBITION VIEW {"//"}
              </span>
              <span className="type-label text-xs font-semibold text-white truncate max-w-[200px] sm:max-w-xs md:max-w-md">
                {projectTitle}
              </span>
            </div>
            <span className="type-caption text-[11px] text-[#78756F] font-mono">
              Screen {String(currentIndex + 1).padStart(2, "0")} of {String(images.length).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* View Mode Toggle Switcher */}
        <div className="flex items-center gap-2 bg-[#222222] p-1 rounded-full border border-white/10">
          <button
            type="button"
            onClick={() => setViewMode("website")}
            className={`px-3 py-1 rounded-full text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === "website"
                ? "bg-white text-black font-medium shadow-sm"
                : "text-[#9E9B93] hover:text-white"
            }`}
            title="Website View: Natural scrollable full page mockup"
          >
            <span>🖥️</span>
            <span className="hidden sm:inline">Website Scroll View</span>
            <span className="sm:hidden">Website</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("fit")}
            className={`px-3 py-1 rounded-full text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === "fit"
                ? "bg-white text-black font-medium shadow-sm"
                : "text-[#9E9B93] hover:text-white"
            }`}
            title="Fit View: Scale entire layout into viewport"
          >
            <span>⛶</span>
            <span className="hidden sm:inline">Fit Screen</span>
            <span className="sm:hidden">Fit</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <span className="hidden lg:inline-block type-caption text-[10px] text-[#78756F] font-mono">
            [ESC TO CLOSE • SCROLL TO EXPLORE]
          </span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 border border-white/20 rounded-full hover:border-white hover:bg-white/10 transition-colors type-label text-xs text-white cursor-pointer flex items-center gap-1.5"
            aria-label="Close fullscreen modal"
          >
            <span>Close</span>
            <span>✕</span>
          </button>
        </div>
      </header>

      {/* 
        MAIN CONTENT VIEWPORT
      */}
      <main className="flex-1 w-full overflow-hidden flex items-center justify-center p-2 sm:p-6 md:p-8">
        {viewMode === "website" ? (
          /* ====================================================================
             1. BROWSER WINDOW MOCKUP VIEW (Natural Scrollable Website)
             ==================================================================== */
          <div className="w-full max-w-5xl h-full flex flex-col bg-[#1A1A1A] border border-white/15 rounded-xl shadow-2xl overflow-hidden animate-[fadeIn_0.3s_ease]">
            {/* macOS Browser Header */}
            <div className="px-4 py-3 bg-[#242424] border-b border-white/10 flex items-center justify-between flex-shrink-0">
              {/* Traffic Light Window Buttons */}
              <div className="flex items-center gap-2 w-20">
                <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]" />
                <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
                <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
              </div>

              {/* Simulated Browser URL Address Bar */}
              <div className="flex-1 max-w-lg mx-2 px-3 py-1 bg-[#161616] border border-white/10 rounded-md text-[11px] font-mono text-[#A8A49C] flex items-center justify-center gap-2 truncate shadow-inner">
                <span className="text-emerald-400 text-[10px]">🔒</span>
                <span className="text-white/40">https://</span>
                <span className="text-white font-sans">{simulatedDomain}</span>
              </div>

              {/* Live Scroll Hint Indicator */}
              <div className="w-20 text-right">
                <span className="type-label text-[9px] font-mono text-[#8C8880] uppercase tracking-wider hidden sm:inline">
                  ↕ Scroll Page
                </span>
              </div>
            </div>

            {/* Scrollable Website Canvas */}
            <div
              ref={scrollContainerRef}
              className="flex-1 w-full overflow-y-auto overflow-x-hidden bg-white overscroll-contain"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(0,0,0,0.3) transparent",
              }}
            >
              {/* Natural Width Full Page Mockup */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentImage}
                alt={`${projectTitle} full website design`}
                className="w-full h-auto block select-none pointer-events-auto"
                loading="eager"
              />

              {/* End of Page Archive Marker */}
              <div className="w-full py-8 bg-[#111111] text-center border-t border-white/10">
                <div className="type-label text-[10px] font-mono text-[#85827B] tracking-widest uppercase">
                  END OF WEBSITE DESIGN {"//"} {projectTitle}
                </div>
                <div className="type-caption text-[11px] text-[#605E59] font-mono mt-1">
                  Crafted by Siful Islam Zehan (Zehan)
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ====================================================================
             2. FIT-TO-SCREEN OVERVIEW (Entire Layout Zoomed Out)
             ==================================================================== */
          <div className="relative w-full h-full max-w-6xl flex items-center justify-center p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentImage}
              alt={`${projectTitle} scaled view`}
              className="max-h-[82vh] max-w-full object-contain rounded shadow-2xl"
            />
          </div>
        )}
      </main>

      {/* 
        PREV / NEXT NAVIGATION CONTROLS (Multi-Screen Projects)
      */}
      {images.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            aria-label="Previous Screen"
            className="fixed left-3 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full border border-white/20 bg-[#1A1A1A]/90 hover:bg-white hover:text-black transition-all text-white cursor-pointer z-30 shadow-lg backdrop-blur-sm"
          >
            ←
          </button>
          <button
            onClick={handleNext}
            aria-label="Next Screen"
            className="fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full border border-white/20 bg-[#1A1A1A]/90 hover:bg-white hover:text-black transition-all text-white cursor-pointer z-30 shadow-lg backdrop-blur-sm"
          >
            →
          </button>
        </>
      )}

      {/* 
        BOTTOM STATUS FOOTER
      */}
      <footer className="w-full px-6 py-2.5 bg-[#141414] border-t border-white/10 flex items-center justify-between text-[11px] text-[#7A7771] font-mono z-20 flex-shrink-0">
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>USE MOUSE WHEEL / TOUCH TO SCROLL THROUGH DESIGN</span>
        </div>
        <span className="hidden sm:inline">ZEHAN DESIGN EXHIBITION ARCHIVE</span>
      </footer>
    </div>
  );
};
