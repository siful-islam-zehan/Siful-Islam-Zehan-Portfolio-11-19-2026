"use client";

import React from "react";

export const AvailabilityPill: React.FC<{ className?: string; text?: string }> = ({
  className = "",
  text = "Available for freelance work • 2026",
}) => {
  return (
    <div
      className={`inline-flex items-center gap-2.5 px-3.5 py-1.5 border border-border rounded-pill bg-background/90 text-foreground type-label text-[11px] select-none ${className}`}
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#171717] opacity-40"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#171717]"></span>
      </span>
      <span>{text || "Available for freelance work • 2026"}</span>
    </div>
  );
};
