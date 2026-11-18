"use client";

import React, { useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { isReducedMotion } from "@/utils/animation";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface TimelineProgressProps {
  className?: string;
  activeSection?: number;
}

export const TimelineProgress: React.FC<TimelineProgressProps> = ({
  className = "",
  activeSection: initialActiveSection = 1,
}) => {
  const [activeSection, setActiveSection] = useState<number>(initialActiveSection);

  const sections = [
    { num: "01", label: "Overview", href: "#hero", targetId: "hero", index: 1 },
    { num: "02", label: "Works", href: "#works", targetId: "works", index: 2 },
    { num: "03", label: "Experiences", href: "#experiences", targetId: "experiences", index: 3 },
    { num: "04", label: "Contact", href: "#contact", targetId: "contact", index: 4 },
  ];

  useEffect(() => {
    if (typeof window === "undefined" || isReducedMotion()) return;

    const triggers: ScrollTrigger[] = [];

    // Observe each section with ScrollTrigger
    sections.forEach((sec) => {
      const el = document.getElementById(sec.targetId);
      if (!el) return;

      const st = ScrollTrigger.create({
        trigger: el,
        start: "top 55%",
        end: "bottom 55%",
        onEnter: () => setActiveSection(sec.index),
        onEnterBack: () => setActiveSection(sec.index),
      });

      triggers.push(st);
    });

    // Also connect #about section to chapter 4
    const aboutEl = document.getElementById("about");
    if (aboutEl) {
      const aboutSt = ScrollTrigger.create({
        trigger: aboutEl,
        start: "top 55%",
        end: "bottom 55%",
        onEnter: () => setActiveSection(4),
        onEnterBack: () => setActiveSection(4),
      });
      triggers.push(aboutSt);
    }

    return () => {
      triggers.forEach((st) => st.kill());
    };
  }, []);

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const id = href.replace("#", "");
    const target = document.getElementById(id);
    if (!target) return;

    target.scrollIntoView({ behavior: "smooth" });
  };

  const isContact = activeSection === 4;

  return (
    <nav
      aria-label="Section Timeline Progress"
      className={`w-full fixed bottom-0 left-0 z-30 transition-all duration-300 backdrop-blur-md ${
        isContact
          ? "border-t border-white/15 bg-[#171717]/95 text-[#F5F3EE]"
          : "border-t border-[#DAD7D0] bg-[#F3F1EC]/95 text-[#171717]"
      } ${className}`}
    >
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 py-3 flex items-center justify-between">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-12 w-full max-w-4xl">
          {sections.map((s) => {
            const isActive = activeSection === s.index;
            return (
              <a
                key={s.num}
                href={s.href}
                onClick={(e) => handleScrollTo(e, s.href)}
                className={`group flex items-center gap-2.5 py-1 transition-opacity cursor-pointer ${
                  isContact ? "text-[#F5F3EE]" : "text-[#171717]"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full border transition-all duration-300 ${
                    isActive
                      ? isContact
                        ? "bg-[#F5F3EE] border-[#F5F3EE] scale-125"
                        : "bg-[#171717] border-[#171717] scale-125"
                      : isContact
                      ? "bg-transparent border-white/30 group-hover:border-white"
                      : "bg-transparent border-[#DAD7D0] group-hover:border-[#171717]"
                  }`}
                />
                <span
                  className={`type-label font-mono text-[11px] transition-colors ${
                    isActive
                      ? isContact
                        ? "text-[#F5F3EE] font-bold"
                        : "text-[#171717] font-bold"
                      : isContact
                      ? "text-white/50"
                      : "text-[#85827B]"
                  }`}
                >
                  {s.num}
                </span>
                <span
                  className={`type-label text-[11px] tracking-wider transition-colors ${
                    isActive
                      ? isContact
                        ? "text-[#F5F3EE] font-semibold"
                        : "text-[#171717] font-semibold"
                      : isContact
                      ? "text-white/50 group-hover:text-[#F5F3EE]"
                      : "text-[#85827B] group-hover:text-[#171717]"
                  }`}
                >
                  {s.label}
                </span>
              </a>
            );
          })}
        </div>

        {/* Live Coordinate / Chapter Indicator (Desktop only) */}
        <div
          className={`hidden lg:flex items-center gap-2 type-caption text-[11px] font-mono ${
            isContact ? "text-white/50" : "text-[#85827B]"
          }`}
        >
          <span>CHAPTER 0{activeSection} / 04</span>
          <span>•</span>
          <span>DHAKA (UTC+6)</span>
        </div>
      </div>
    </nav>
  );
};
