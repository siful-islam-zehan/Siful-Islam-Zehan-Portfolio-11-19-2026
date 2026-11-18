"use client";

import React from "react";

export const ScrollCue: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div
      className={`relative w-20 h-20 md:w-24 md:h-24 flex items-center justify-center select-none pointer-events-auto ${className}`}
      aria-hidden="true"
    >
      {/* Rotating Circular Text */}
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full animate-[spin_12s_linear_infinite]"
      >
        <path
          id="circlePath"
          d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
          fill="none"
        />
        <text className="text-[9.5px] uppercase tracking-[0.22em] fill-foreground font-sans font-medium">
          <textPath href="#circlePath" startOffset="0%">
            • SCROLL • EXPLORE • SCROLL • EXPLORE
          </textPath>
        </text>
      </svg>

      {/* Center Arrow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-foreground text-xs transform translate-y-[1px]">↓</span>
      </div>
    </div>
  );
};
