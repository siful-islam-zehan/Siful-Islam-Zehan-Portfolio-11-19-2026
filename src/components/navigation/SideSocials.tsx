"use client";

import React from "react";
import { PORTFOLIO_DATA, SocialLink } from "@/data/portfolio";

interface SideSocialsProps {
  socials?: SocialLink[];
}

export const SideSocials: React.FC<SideSocialsProps> = ({ socials }) => {
  const list = socials && socials.length > 0 ? socials : PORTFOLIO_DATA.socials;
  const activeSocials = list.filter((s) => !s.isPlaceholder && s.url);

  if (activeSocials.length === 0) return null;

  return (
    <aside
      aria-label="Social Profiles"
      className="hidden min-[1680px]:flex fixed left-6 bottom-24 z-30 flex-col items-center gap-6 pointer-events-auto"
    >
      <div className="flex flex-col gap-6 items-center text-[11px] font-sans font-medium tracking-widest text-text-muted [writing-mode:vertical-rl] rotate-180">
        {activeSocials.map((s, idx) => (
          <React.Fragment key={s.platform}>
            {idx > 0 && <span className="w-1.5 h-1.5 rounded-full bg-border" />}
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors uppercase"
              title={`${s.platform} Profile`}
            >
              {s.platform}
            </a>
          </React.Fragment>
        ))}
      </div>
      <div className="w-[1px] h-16 bg-border mt-2" />
    </aside>
  );
};
