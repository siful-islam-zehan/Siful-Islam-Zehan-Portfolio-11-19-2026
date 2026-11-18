import React from "react";
import NextLink from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — Exhibition Space Not Found | Zehan",
  description: "The requested coordinate or project does not exist in this exhibition.",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between p-6 sm:p-12 lg:p-16 border-b border-border">
      {/* Top Monogram */}
      <div className="flex items-center justify-between border-b border-border pb-6">
        <NextLink href="/" className="flex items-center group">
          <span className="font-serif text-2xl text-foreground group-hover:opacity-60 transition-opacity">
            ZEHAN
          </span>
        </NextLink>

        <span className="font-mono text-xs text-text-muted uppercase">
          ERROR STATUS // 404
        </span>
      </div>

      {/* Main Editorial 404 Area */}
      <div className="max-w-3xl py-20 sm:py-28">
        <div className="font-mono text-xs text-text-muted tracking-[0.25em] uppercase mb-4">
          COORDINATE UNRESOLVED
        </div>

        <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-normal leading-[1.05] tracking-tight mb-8">
          The requested space does not exist in this exhibition.
        </h1>

        <p className="type-body text-text-muted max-w-xl mb-12">
          The artifact, slug, or coordinate you navigated to has been relocated, 
          unmounted, or has not yet been curated into the gallery.
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <NextLink
            href="/"
            className="min-h-[48px] px-8 py-3 bg-foreground text-background font-mono text-xs uppercase tracking-wider rounded-pill hover:bg-neutral-800 transition-colors inline-flex items-center gap-2"
          >
            <span>←</span>
            <span>Return to Main Exhibition</span>
          </NextLink>

          <NextLink
            href="/#works"
            className="min-h-[48px] px-8 py-3 border border-border text-foreground font-mono text-xs uppercase tracking-wider rounded-pill hover:border-foreground transition-colors inline-flex items-center"
          >
            Explore Selected Works
          </NextLink>
        </div>
      </div>

      {/* Bottom Coordinates & Direct Inquiries */}
      <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs text-text-muted">
        <div>SIFUL ISLAM ZEHAN // CURATED DIGITAL ARCHITECTURE</div>
        <div>
          LOST? REACH OUT:{" "}
          <a
            href="mailto:sifulislamzehan@gmail.com"
            className="text-foreground underline hover:opacity-60"
          >
            sifulislamzehan@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
}
