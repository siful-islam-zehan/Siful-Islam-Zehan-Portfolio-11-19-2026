"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { isReducedMotion } from "@/utils/animation";

export const PageTransitionBar: React.FC = () => {
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    if (isReducedMotion()) return;

    // Trigger hairline progress flash on route change
    setIsNavigating(true);
    const timer = setTimeout(() => {
      setIsNavigating(false);
    }, 450);

    return () => clearTimeout(timer);
  }, [pathname]);

  if (!isNavigating) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[2px] bg-foreground z-50 animate-[pageProgress_0.45s_cubic-bezier(0.16,1,0.3,1)_forwards]"
    />
  );
};
