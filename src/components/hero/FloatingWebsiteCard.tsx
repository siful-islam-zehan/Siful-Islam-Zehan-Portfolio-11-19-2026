"use client";

import React from "react";
import Image from "next/image";

interface FloatingWebsiteCardProps {
  className?: string;
}

export const FloatingWebsiteCard: React.FC<FloatingWebsiteCardProps> = ({
  className = "",
}) => {
  return (
    <div
      className={`floating-website-card w-[240px] sm:w-[280px] md:w-[320px] bg-background border border-border rounded-sm shadow-sm overflow-hidden select-none pointer-events-auto transition-transform duration-300 hover:scale-[1.02] ${className}`}
      style={{
        transform: "rotate(-3.5deg)",
      }}
    >
      {/* Browser Chrome Header */}
      <div className="bg-[#EBE8E1] border-b border-border px-3 py-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full border border-border bg-[#DAD7D0]" />
          <span className="w-2.5 h-2.5 rounded-full border border-border bg-[#DAD7D0]" />
          <span className="w-2.5 h-2.5 rounded-full border border-border bg-[#DAD7D0]" />
        </div>
        <div className="flex-1 max-w-[180px] mx-2 px-2 py-0.5 bg-background border border-border rounded-sm text-[9px] font-mono text-text-muted truncate text-center">
          sifulislamzehan.dev
        </div>
        <div className="w-2 h-2 rounded-full bg-border" />
      </div>

      {/* Browser Body / Website Preview */}
      <div className="relative aspect-[16/10] bg-background border-b border-border overflow-hidden">
        {/* Editorial Preview Content */}
        <div className="p-3 h-full flex flex-col justify-between bg-[#F8F7F4]">
          <div>
            <div className="flex items-center justify-between border-b border-border pb-1.5 mb-2">
              <span className="type-label text-[8px] tracking-wider text-foreground">ZEHAN</span>
              <span className="type-label text-[7px] text-text-muted">UI/UX · 2026</span>
            </div>
            <div className="space-y-1">
              <div className="h-2 w-3/4 bg-[#E0DED7] rounded-none" />
              <div className="h-1.5 w-1/2 bg-[#EAE8E2] rounded-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-border/60">
            <div className="h-10 bg-[#E8E5DF] border border-border flex items-center justify-center">
              <span className="type-label text-[7px] text-text-muted">GRANDPOOL</span>
            </div>
            <div className="h-10 bg-[#E8E5DF] border border-border flex items-center justify-center">
              <span className="type-label text-[7px] text-text-muted">NOVAIR</span>
            </div>
          </div>
        </div>

        {/* Live Badge */}
        <div className="absolute bottom-2 right-2 bg-foreground text-dark-foreground text-[8px] font-mono px-2 py-0.5 rounded-sm">
          PORTFOLIO ARCHIVE
        </div>
      </div>

      {/* Card Footer Caption */}
      <div className="px-3 py-1.5 bg-background flex items-center justify-between text-[10px] text-text-muted font-mono">
        <span>01 // DIGITAL SYSTEM</span>
        <span className="text-foreground">2026 ED.</span>
      </div>
    </div>
  );
};
