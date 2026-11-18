"use client";

import React from "react";
import { Button } from "@/components/ui/Button";

interface HeroHeadlineProps {
  className?: string;
  isSecondary?: boolean;
}

export const HeroHeadline: React.FC<HeroHeadlineProps> = ({ className = "", isSecondary = false }) => {
  return (
    <div className={`hero-headline-group flex flex-col items-start ${className}`} aria-hidden={isSecondary ? "true" : undefined}>
      {/* Editorial Headline with Overflow-Hidden Mask Wrappers */}
      {isSecondary ? (
        <div className="hero-text-mask-container space-y-1 sm:space-y-2 mb-6 sm:mb-8 font-serif font-normal select-none">
          <span className="block overflow-hidden">
            <span className="hero-mask-line block type-display-l text-foreground font-serif">
              Designing digital
            </span>
          </span>
          <span className="block overflow-hidden">
            <span className="hero-mask-line block type-display-l text-foreground font-serif">
              experiences.
            </span>
          </span>
          <span className="block overflow-hidden pt-1">
            <span className="hero-mask-line block type-display-l text-foreground font-serif italic">
              Bringing ideas to life.
            </span>
          </span>
        </div>
      ) : (
        <h1 className="hero-text-mask-container space-y-1 sm:space-y-2 mb-6 sm:mb-8 font-serif font-normal select-none">
          <span className="block overflow-hidden">
            <span className="hero-mask-line block type-display-l text-foreground font-serif">
              Designing digital
            </span>
          </span>
          <span className="block overflow-hidden">
            <span className="hero-mask-line block type-display-l text-foreground font-serif">
              experiences.
            </span>
          </span>
          <span className="block overflow-hidden pt-1">
            <span className="hero-mask-line block type-display-l text-foreground font-serif italic">
              Bringing ideas to life.
            </span>
          </span>
        </h1>
      )}

      {/* Subline Bio Snippet */}
      <div className="overflow-hidden mb-8 max-w-md">
        <p className="hero-subline type-body text-text-muted">
          I work across UI/UX design, website design, product interfaces, and front-end implementation to create meaningful digital experiences.
        </p>
      </div>

      {/* CTAs with minimum 44px touch targets */}
      <div className="hero-cta-group flex flex-wrap items-center gap-4">
        <a href="#works" className="min-h-[44px] inline-flex items-center">
          <Button variant="primary" size="md" className="min-h-[44px] px-7">
            View Projects
          </Button>
        </a>
        <a href="#contact" className="min-h-[44px] inline-flex items-center">
          <Button variant="secondary" size="md" className="min-h-[44px] px-7">
            Contact
          </Button>
        </a>
      </div>
    </div>
  );
};
