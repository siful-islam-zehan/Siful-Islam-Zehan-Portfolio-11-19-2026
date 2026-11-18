"use client";

import React, { useEffect, useCallback, useState } from "react";
import Image from "next/image";

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
  const [touchStart, setTouchStart] = useState<number | null>(null);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  const handleNext = useCallback(() => {
    if (images.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const handlePrev = useCallback(() => {
    if (images.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Keyboard navigation & accessibility trap
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
    // Prevent background scrolling while open
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose, handleNext, handlePrev]);

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (diff > 50) {
      handleNext(); // Swiped left -> next
    } else if (diff < -50) {
      handlePrev(); // Swiped right -> prev
    }
    setTouchStart(null);
  };

  if (!isOpen || images.length === 0) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${projectTitle} - Fullscreen Inspection Viewer`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#171717]/95 backdrop-blur-none text-dark-foreground animate-[fadeIn_0.3s_cubic-bezier(0.16,1,0.3,1)]"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top Bar Controls */}
      <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between z-20 border-b border-white/10">
        <div>
          <span className="type-label text-xs text-[#85827B] block mb-1">
            FULLSCREEN INSPECTION // {projectTitle}
          </span>
          <span className="type-caption text-xs text-dark-foreground font-mono">
            {String(currentIndex + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden sm:inline-block type-caption text-xs text-[#85827B] font-mono">
            [ESC TO CLOSE • ← → TO NAVIGATE]
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-white/20 rounded-pill hover:border-white transition-colors type-label text-xs text-dark-foreground cursor-pointer"
            aria-label="Close fullscreen modal"
          >
            Close ✕
          </button>
        </div>
      </div>

      {/* Main Image Stage */}
      <div className="relative w-full h-full max-w-6xl max-h-[85vh] p-4 sm:p-12 flex items-center justify-center">
        <div className="relative w-full h-full">
          <Image
            src={images[currentIndex]}
            alt={`${projectTitle} fullscreen screen view ${currentIndex + 1}`}
            fill
            sizes="100vw"
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Prev / Next Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            aria-label="Previous Image"
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full border border-white/20 bg-[#171717] hover:border-white transition-colors text-dark-foreground cursor-pointer z-20"
          >
            ←
          </button>
          <button
            onClick={handleNext}
            aria-label="Next Image"
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full border border-white/20 bg-[#171717] hover:border-white transition-colors text-dark-foreground cursor-pointer z-20"
          >
            →
          </button>
        </>
      )}

      {/* Bottom Information */}
      <div className="absolute bottom-4 left-6 right-6 flex justify-between items-center text-xs text-[#85827B] font-mono z-20">
        <span>SWIPE OR ARROW KEYS TO NAVIGATE</span>
        <span>ZEHAN DIGITAL ARCHIVE</span>
      </div>
    </div>
  );
};
