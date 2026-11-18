"use client";

import React, { useState, useEffect, useRef } from "react";
import { Link } from "@/components/ui/Link";
import { PORTFOLIO_DATA } from "@/data/portfolio";

interface PillNavProps {
  className?: string;
}

export const PillNav: React.FC<PillNavProps> = ({ className = "" }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleBtnRef = useRef<HTMLButtonElement>(null);

  // Close menu on route or anchor click
  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  // Keyboard navigation, escape key & body scroll lock
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
        if (toggleBtnRef.current) toggleBtnRef.current.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Dark Section (Chapter 06: Contact) Theme Detector
  useEffect(() => {
    const contactSec = document.getElementById("contact");
    if (!contactSec) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsDark(entry.isIntersecting);
        });
      },
      {
        rootMargin: "-80px 0px 0px 0px",
        threshold: 0,
      }
    );

    observer.observe(contactSec);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <header
        role="banner"
        className={`w-full py-5 px-4 sm:px-6 md:px-8 lg:px-12 fixed top-0 left-0 z-40 pointer-events-none transition-all ${className}`}
      >
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          {/* Brand Monogram */}
          <div className="pointer-events-auto flex items-center gap-3">
            <Link href="/" variant="plain" className="flex items-center py-1">
              <span
                className={`font-serif text-xl sm:text-2xl tracking-tight leading-none font-normal transition-colors duration-300 ${
                  isDark ? "text-[#F5F3EE]" : "text-[#171717]"
                }`}
              >
                ZEHAN
              </span>
            </Link>
          </div>

          {/* Center Pill Navigation (Desktop Only: 768px+) */}
          <nav
            aria-label="Primary Navigation"
            className={`pointer-events-auto hidden md:flex items-center gap-1 px-4 py-2 rounded-pill backdrop-blur-md transition-all duration-300 shadow-sm ${
              isDark
                ? "bg-[#171717]/90 border border-white/20 text-[#F5F3EE]"
                : "bg-[#F3F1EC]/90 border border-[#DAD7D0] text-[#171717]"
            }`}
          >
            <a
              href="#works"
              className={`px-3.5 py-1.5 type-label transition-colors ${
                isDark ? "text-[#F5F3EE] hover:text-white" : "text-[#171717] hover:opacity-60"
              }`}
            >
              Works
            </a>
            <span className={`select-none ${isDark ? "text-white/30" : "text-[#DAD7D0]"}`}>•</span>
            <a
              href="#experiences"
              className={`px-3.5 py-1.5 type-label transition-colors ${
                isDark ? "text-[#F5F3EE] hover:text-white" : "text-[#171717] hover:opacity-60"
              }`}
            >
              Experiences
            </a>
            <span className={`select-none ${isDark ? "text-white/30" : "text-[#DAD7D0]"}`}>•</span>
            <a
              href="#services"
              className={`px-3.5 py-1.5 type-label transition-colors ${
                isDark ? "text-[#F5F3EE] hover:text-white" : "text-[#171717] hover:opacity-60"
              }`}
            >
              Services
            </a>
            <span className={`select-none ${isDark ? "text-white/30" : "text-[#DAD7D0]"}`}>•</span>
            <a
              href="#about"
              className={`px-3.5 py-1.5 type-label transition-colors ${
                isDark ? "text-[#F5F3EE] hover:text-white" : "text-[#171717] hover:opacity-60"
              }`}
            >
              About
            </a>
            <span className={`select-none ${isDark ? "text-white/30" : "text-[#DAD7D0]"}`}>•</span>
            <a
              href="#contact"
              className={`px-3.5 py-1.5 type-label transition-colors ${
                isDark ? "text-[#F5F3EE] hover:text-white" : "text-[#171717] hover:opacity-60"
              }`}
            >
              Contact
            </a>
          </nav>

          {/* Right Header Area */}
          <div className="pointer-events-auto flex items-center gap-3">
            <a
              href="#contact"
              className={`hidden sm:inline-flex items-center min-h-[44px] px-5 py-2 type-label rounded-pill backdrop-blur-md transition-all duration-300 shadow-sm ${
                isDark
                  ? "bg-[#171717]/90 border border-white/20 text-[#F5F3EE] hover:border-white"
                  : "bg-[#F3F1EC]/90 border border-[#DAD7D0] text-[#171717] hover:border-[#171717]"
              }`}
            >
              Get in touch
            </a>

            {/* Mobile Menu Toggle Button (44px touch target) */}
            <button
              ref={toggleBtnRef}
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation-drawer"
              aria-label={mobileMenuOpen ? "Close menu" : "Open navigation menu"}
              className={`md:hidden pointer-events-auto min-h-[44px] min-w-[44px] px-4 py-2 rounded-pill backdrop-blur-md type-label text-xs tracking-wider flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-95 transition-all ${
                isDark
                  ? "bg-[#171717]/90 border border-white/20 text-[#F5F3EE]"
                  : "bg-[#F3F1EC]/90 border border-[#DAD7D0] text-[#171717]"
              }`}
            >
              <span className="font-mono text-[10px]">
                {mobileMenuOpen ? "✕" : "☰"}
              </span>
              <span>{mobileMenuOpen ? "CLOSE" : "MENU"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* 
        ACCESSIBLE FULL-SCREEN MOBILE NAVIGATION DRAWER
      */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-drawer"
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
          className="md:hidden fixed inset-0 z-50 bg-background text-foreground p-6 flex flex-col justify-between overflow-y-auto animate-[fadeIn_0.3s_cubic-bezier(0.16,1,0.3,1)]"
        >
          {/* Top Bar inside Drawer */}
          <div className="flex items-center justify-between pb-6 border-b border-border">
            <div className="flex flex-col">
              <span className="font-serif text-2xl text-foreground">ZEHAN</span>
              <span className="type-label text-[9px] text-text-muted font-mono tracking-widest">
                EXHIBITION DIRECTORY
              </span>
            </div>

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="min-h-[44px] min-w-[44px] p-2 border border-border rounded-pill type-label text-xs flex items-center justify-center cursor-pointer"
              aria-label="Close menu"
            >
              CLOSE ✕
            </button>
          </div>

          {/* Navigation Links (Large Editorial Stack) */}
          <nav className="py-8 flex flex-col divide-y divide-border/60">
            {[
              { num: "01", label: "Works", href: "#works" },
              { num: "02", label: "Experiences", href: "#experiences" },
              { num: "03", label: "What I Do", href: "#services" },
              { num: "04", label: "About", href: "#about" },
              { num: "05", label: "Contact", href: "#contact" },
            ].map((item) => (
              <a
                key={item.num}
                href={item.href}
                onClick={handleNavClick}
                className="min-h-[52px] py-4 flex items-center justify-between group active:opacity-60 transition-opacity"
              >
                <div className="flex items-baseline gap-4">
                  <span className="font-mono text-xs text-text-muted">
                    {item.num}
                  </span>
                  <span className="type-h2 font-serif text-foreground">
                    {item.label}
                  </span>
                </div>
                <span className="text-lg text-text-muted group-hover:text-foreground">
                  →
                </span>
              </a>
            ))}
          </nav>

          {/* Drawer Footer Information */}
          <div className="pt-6 border-t border-border space-y-4 font-mono text-xs text-text-muted">
            <div className="flex justify-between items-center">
              <span>DIRECT EMAIL:</span>
              <a
                href={`mailto:${PORTFOLIO_DATA.identity.email}`}
                className="text-foreground underline truncate max-w-[200px]"
              >
                {PORTFOLIO_DATA.identity.email}
              </a>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span>LOCATION:</span>
              <span className="text-foreground">{PORTFOLIO_DATA.identity.location}</span>
            </div>

            <div className="flex items-center gap-4 pt-2 flex-wrap">
              {PORTFOLIO_DATA.socials
                .filter((s) => !s.isPlaceholder && s.url)
                .map((s, sIdx) => (
                  <React.Fragment key={s.platform}>
                    {sIdx > 0 && <span>•</span>}
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground underline"
                    >
                      {s.platform}
                    </a>
                  </React.Fragment>
                ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
