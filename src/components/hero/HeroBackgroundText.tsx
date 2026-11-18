"use client";

import React from "react";

interface HeroBackgroundTextProps {
  className?: string;
}

export const HeroBackgroundText: React.FC<HeroBackgroundTextProps> = ({
  className = "",
}) => {
  return (
    <div
      aria-hidden="true"
      className={`hero-bg-text-wrapper absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none z-0 ${className}`}
    >
      <div className="hero-bg-text type-display-xxl text-[#DAD7D0] tracking-[-0.04em] whitespace-nowrap will-change-transform opacity-95">
        ZEHAN
      </div>
    </div>
  );
};
