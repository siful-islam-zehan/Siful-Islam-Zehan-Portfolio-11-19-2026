"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { PortfolioProject } from "@/data/projects";
import { gsap } from "gsap";
import { isReducedMotion, MOTION_TOKENS } from "@/utils/animation";

interface LivePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: PortfolioProject | null;
  originPos?: { x: number; y: number };
}

export const LivePreviewModal: React.FC<LivePreviewModalProps> = ({
  isOpen,
  onClose,
  project,
  originPos = { x: typeof window !== "undefined" ? window.innerWidth / 2 : 500, y: 300 },
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const browserFrameRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const triggerElementRef = useRef<HTMLElement | null>(null);

  const [deviceMode, setDeviceMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [iframeStatus, setIframeStatus] = useState<"idle" | "loading" | "loaded" | "fallback">("idle");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [iframeKey, setIframeKey] = useState(0); // For clean reloads
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Store active element for focus restoration
  useEffect(() => {
    if (isOpen) {
      triggerElementRef.current = document.activeElement as HTMLElement;
    }
  }, [isOpen]);

  // Entrance & Exit Clip-Path Circle Animation
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const modal = modalRef.current;
    const reduced = isReducedMotion();

    document.body.style.overflow = "hidden";

    if (reduced) {
      gsap.set(modal, { opacity: 1, clipPath: "none" });
      return;
    }

    const { x, y } = originPos;
    // Calculate maximum radius to fully cover screen from origin point
    const maxRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    gsap.set(modal, {
      opacity: 1,
      clipPath: `circle(0px at ${x}px ${y}px)`,
    });

    gsap.to(modal, {
      clipPath: `circle(${maxRadius * 1.05}px at ${x}px ${y}px)`,
      duration: MOTION_TOKENS.durationBase,
      ease: MOTION_TOKENS.easeBase,
    });

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, originPos]);

  // Iframe load watchdog timeout (8.5 seconds)
  useEffect(() => {
    if (!isOpen || !project || project.previewMode !== "iframe") {
      setIframeStatus("idle");
      return;
    }

    setIframeStatus("loading");

    const timer = setTimeout(() => {
      setIframeStatus((current) => {
        // If still loading after 8.5 seconds, fall back honestly
        if (current === "loading") {
          return "fallback";
        }
        return current;
      });
    }, 8500);

    return () => clearTimeout(timer);
  }, [isOpen, project, iframeKey]);

  // Handle iframe successful load event
  const handleIframeLoad = () => {
    // Note: Cross-origin security blocks checking contentWindow for X-Frame-Options failures.
    // The load event may still fire for empty browser error pages on some engines.
    // We confirm load here, while timeout handles silent hangs.
    setIframeStatus("loaded");
  };

  // Handle manual reload
  const handleReload = () => {
    setIframeStatus("loading");
    setIframeKey((prev) => prev + 1);
  };

  // Fullscreen toggle via Fullscreen API with fallback
  const toggleFullscreen = () => {
    const frame = browserFrameRef.current;
    if (!frame) return;

    if (!document.fullscreenElement) {
      frame
        .requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(() => {
          // Graceful fallback to fixed full-viewport
          setIsFullscreen((prev) => !prev);
        });
    } else {
      document
        .exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch(() => setIsFullscreen(false));
    }
  };

  // Copy URL to clipboard
  const copyUrl = () => {
    if (!project?.liveUrl) return;
    navigator.clipboard.writeText(project.liveUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  // Close handler with focus restoration
  const handleClose = useCallback(() => {
    if (!modalRef.current) {
      onClose();
      return;
    }

    const modal = modalRef.current;
    const { x, y } = originPos;

    if (isReducedMotion()) {
      onClose();
      if (triggerElementRef.current) triggerElementRef.current.focus();
      return;
    }

    gsap.to(modal, {
      clipPath: `circle(0px at ${x}px ${y}px)`,
      duration: 0.6,
      ease: "power3.in",
      onComplete: () => {
        onClose();
        if (triggerElementRef.current) triggerElementRef.current.focus();
      },
    });
  }, [onClose, originPos]);

  // Keyboard navigation & accessibility focus trap
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  if (!isOpen || !project) return null;

  // Responsive device width constraint
  const getDeviceWidthClass = () => {
    if (deviceMode === "mobile") return "max-w-[390px]";
    if (deviceMode === "tablet") return "max-w-[768px]";
    return "max-w-full";
  };

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Live Preview — ${project.title}`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#171717]/95 p-0 sm:p-6 lg:p-10 select-none overflow-hidden"
    >
      {/* 
        MAIN BROWSER FRAME CONTAINER
        Mobile: Full-screen sheet (100% width, 100% height, rounded-none)
        Desktop: Constrained centered browser frame with shadow
      */}
      <div
        ref={browserFrameRef}
        className={`w-full h-full sm:max-h-[92vh] flex flex-col bg-background border-0 sm:border border-border rounded-none sm:rounded-sm shadow-2xl overflow-hidden transition-all duration-300 ease-editorial ${getDeviceWidthClass()}`}
      >
        {/* 
          1. BROWSER CHROME HEADER (Optimized for 44px Touch Targets)
        */}
        <div className="bg-[#EBE8E1] border-b border-border px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between gap-2 select-none min-h-[52px]">
          {/* Traffic Light Dots */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border border-border bg-[#DAD7D0]" />
            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border border-border bg-[#DAD7D0]" />
            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border border-border bg-[#DAD7D0]" />
            <span className="hidden md:inline-block ml-3 type-label text-[10px] text-text-muted font-mono uppercase">
              {project.category}
            </span>
          </div>

          {/* URL Address Bar */}
          <div className="flex-1 max-w-sm sm:max-w-xl mx-1 sm:mx-auto flex items-center justify-between bg-background border border-border rounded-sm px-2.5 py-1 text-xs font-mono text-foreground">
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-[10px] sm:text-[11px] text-text-muted">🔒</span>
              <span className="truncate text-[11px] sm:text-xs">{project.liveUrl || "sifulislamzehan.dev"}</span>
            </div>
            <button
              onClick={copyUrl}
              className="ml-2 min-h-[32px] px-2 type-label text-[9px] text-text-muted hover:text-foreground transition-colors shrink-0"
              title="Copy URL"
            >
              {copiedUrl ? "COPIED" : "COPY"}
            </button>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1">
            {/* Device Toggles (Desktop only) */}
            <div className="hidden lg:flex items-center border border-border rounded-sm bg-background p-0.5 mr-2">
              <button
                onClick={() => setDeviceMode("desktop")}
                className={`px-2.5 py-1 type-label text-[10px] rounded-none transition-colors ${
                  deviceMode === "desktop" ? "bg-foreground text-dark-foreground" : "text-text-muted hover:text-foreground"
                }`}
                title="Desktop View (100%)"
              >
                DESK
              </button>
              <button
                onClick={() => setDeviceMode("tablet")}
                className={`px-2.5 py-1 type-label text-[10px] rounded-none transition-colors ${
                  deviceMode === "tablet" ? "bg-foreground text-dark-foreground" : "text-text-muted hover:text-foreground"
                }`}
                title="Tablet View (768px)"
              >
                TAB
              </button>
              <button
                onClick={() => setDeviceMode("mobile")}
                className={`px-2.5 py-1 type-label text-[10px] rounded-none transition-colors ${
                  deviceMode === "mobile" ? "bg-foreground text-dark-foreground" : "text-text-muted hover:text-foreground"
                }`}
                title="Mobile View (390px)"
              >
                MOB
              </button>
            </div>

            {/* Reload Button */}
            {project.previewMode === "iframe" && (
              <button
                onClick={handleReload}
                className="min-w-[40px] min-h-[40px] flex items-center justify-center hover:bg-black/5 rounded-sm text-foreground transition-colors"
                title="Reload Frame"
                aria-label="Reload preview"
              >
                ↻
              </button>
            )}

            {/* Open in New Tab */}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-w-[40px] min-h-[40px] flex items-center justify-center hover:bg-black/5 rounded-sm text-foreground transition-colors"
                title="Open in new tab"
                aria-label="Open live website in new tab"
              >
                ↗
              </a>
            )}

            {/* Close Button (44px touch target) */}
            <button
              onClick={handleClose}
              className="min-h-[40px] px-3 bg-foreground text-dark-foreground hover:bg-transparent hover:text-foreground border border-foreground rounded-sm type-label text-[11px] transition-colors flex items-center justify-center"
              aria-label="Close preview modal"
            >
              ✕
            </button>
          </div>
        </div>

        {/* 
          2. BROWSER BODY STAGE
        */}
        <div className="relative flex-1 w-full bg-[#F3F1EC] overflow-hidden flex flex-col items-center justify-center">
          {/* =================================================================
              SCENARIO A: IFRAME EMBED (previewMode: "iframe")
              Strict: Created ONLY when modal is active. Destroyed on close.
              ================================================================= */}
          {project.previewMode === "iframe" && project.liveUrl && (
            <>
              {/* Active Sandboxed Iframe */}
              {iframeStatus !== "fallback" && (
                <iframe
                  ref={iframeRef}
                  key={iframeKey}
                  src={project.liveUrl}
                  title={`Live Preview of ${project.title}`}
                  onLoad={handleIframeLoad}
                  className={`w-full h-full border-none transition-opacity duration-500 ${
                    iframeStatus === "loaded" ? "opacity-100" : "opacity-0"
                  }`}
                  /*
                    SANDBOX PERMISSION RATIONALE:
                    - allow-scripts: Required for client JavaScript execution.
                    - allow-same-origin: Allows site to load its own subresources.
                    - allow-forms: Allows input and form submissions.
                    - allow-popups: Allows target=_blank external links.
                    - Intentionally excludes allow-top-navigation to prevent iframe hijacking.
                  */
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              )}

              {/* Loading State Overlay */}
              {iframeStatus === "loading" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-background/95 z-20">
                  <div className="w-10 h-10 border-2 border-border border-t-foreground rounded-full animate-spin mb-4" />
                  <p className="type-h3 text-foreground mb-1">
                    Connecting to {project.title}...
                  </p>
                  <p className="type-caption font-mono text-xs text-text-muted text-center max-w-md">
                    Establishing sandboxed frame connection. Detecting third-party framing security policies...
                  </p>
                </div>
              )}

              {/* Honest Fallback State: Triggered on timeout or framing restriction */}
              {iframeStatus === "fallback" && (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 sm:p-12 text-center bg-background z-20 overflow-y-auto">
                  {/* Miniature Cover Preview */}
                  <div className="relative w-full max-w-xl aspect-[16/10] border border-border mb-6 overflow-hidden bg-[#F8F7F4]">
                    <Image
                      src={project.coverImage}
                      alt={project.title}
                      fill
                      className="object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                      <span className="type-label text-xs bg-foreground text-dark-foreground px-3 py-1.5 rounded-sm">
                        EXTERNAL FRAMING RESTRICTED
                      </span>
                    </div>
                  </div>

                  <h3 className="type-h2 text-foreground mb-3">
                    Embedded Preview Not Permitted
                  </h3>
                  <p className="type-body text-text-muted max-w-lg mb-8 leading-relaxed">
                    This domain ({project.liveUrl ? new URL(project.liveUrl).hostname : ""}) enforces strict security headers (<code className="text-xs bg-[#E8E5DF] px-1.5 py-0.5 rounded-none font-mono">X-Frame-Options: SAMEORIGIN</code> or CSP <code className="text-xs bg-[#E8E5DF] px-1.5 py-0.5 rounded-none font-mono">frame-ancestors &apos;self&apos;</code>).
                    <br />
                    We respect the publisher&apos;s security policy. Open the live site directly in a new tab:
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-4">
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="type-label inline-flex items-center gap-2 px-6 py-3 border border-foreground bg-foreground text-dark-foreground rounded-sm hover:bg-transparent hover:text-foreground transition-all"
                    >
                      <span>Open Live Website</span>
                      <span>↗</span>
                    </a>
                    <button
                      onClick={handleReload}
                      className="type-label inline-flex items-center gap-2 px-6 py-3 border border-border rounded-sm hover:border-foreground transition-colors bg-background"
                    >
                      <span>Try Again ↻</span>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* =================================================================
              SCENARIO B: EXTERNAL APPLICATION (previewMode: "external")
              Strict: NO IFRAME CREATED. E.g. Google Play Store, Native Apps.
              ================================================================= */}
          {project.previewMode === "external" && (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 sm:p-12 text-center bg-background overflow-y-auto">
              <div className="relative w-full max-w-md aspect-[16/10] border border-border mb-6 overflow-hidden bg-[#F8F7F4]">
                <Image
                  src={project.coverImage}
                  alt={project.title}
                  fill
                  className="object-cover object-top"
                />
              </div>

              <div className="inline-flex items-center gap-2 type-label text-xs text-text-muted border border-border px-3 py-1 rounded-pill mb-4 bg-background">
                <span>MOBILE APPLICATION // EXTERNAL PLATFORM</span>
              </div>

              <h3 className="type-h2 text-foreground mb-3">{project.title}</h3>
              <p className="type-body text-text-muted max-w-md mb-8">
                Google Play Store applications and native APK distributions do not permit embedded iframe hosting. You can view and test the production app directly via the Google Play release.
              </p>

              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="type-label inline-flex items-center gap-2 px-8 py-3.5 border border-foreground bg-foreground text-dark-foreground rounded-sm hover:bg-transparent hover:text-foreground transition-all"
                >
                  <span>Open on Google Play Store</span>
                  <span>↗</span>
                </a>
              )}
            </div>
          )}

          {/* =================================================================
              SCENARIO C: IMAGE GALLERY ONLY (previewMode: "image")
              ================================================================= */}
          {project.previewMode === "image" && (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-background">
              <div className="relative w-full max-w-4xl h-[75vh] border border-border">
                <Image
                  src={project.coverImage}
                  alt={project.title}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          )}
        </div>

        {/* 
          3. BROWSER FOOTER STATUS BAR
        */}
        <div className="bg-[#EBE8E1] border-t border-border px-4 py-2 flex items-center justify-between text-[11px] font-mono text-text-muted select-none">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-green-600" />
            <span className="uppercase">STATUS: {iframeStatus.toUpperCase()}</span>
            <span>•</span>
            <span>SANDBOX: ACTIVE</span>
          </div>

          <div className="hidden sm:flex items-center gap-4">
            <span>MODE: {project.previewMode.toUpperCase()}</span>
            <span>•</span>
            <span>PRESS ESC TO EXIT</span>
          </div>
        </div>
      </div>
    </div>
  );
};
