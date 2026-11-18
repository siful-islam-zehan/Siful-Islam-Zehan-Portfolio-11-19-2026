import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Ensure ScrollTrigger is registered only once in the client environment
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Editorial Motion Tokens
 * Strict adherence to: 0.9s duration, power4.out easing, consistent everywhere.
 */
export const MOTION_TOKENS = {
  durationBase: 0.9,
  durationFast: 0.45,
  durationSlow: 1.4,
  easeBase: "power4.out",
  easeSmooth: "power2.out",
  staggerDefault: 0.08,
  revealDistance: 24,
  mobileParallaxMultiplier: 0.35, // Reduced parallax intensity on touch/mobile
} as const;

/**
 * Checks if prefers-reduced-motion is active.
 */
export function isReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Executes an animation block with automatic prefers-reduced-motion handling.
 * If reduced motion is requested, instantly applies the final state with zero duration.
 */
export function withMotionGuard(
  setup: (mm: gsap.MatchMedia) => void,
  targetFallback?: () => void
): gsap.MatchMedia {
  const mm = gsap.matchMedia();

  mm.add(
    {
      isNormal: "(prefers-reduced-motion: no-preference)",
      isReduced: "(prefers-reduced-motion: reduce)",
      isDesktop: "(min-width: 1024px)",
      isMobile: "(max-width: 1023px)",
    },
    (context) => {
      const { isReduced } = context.conditions as {
        isNormal: boolean;
        isReduced: boolean;
        isDesktop: boolean;
        isMobile: boolean;
      };

      if (isReduced) {
        if (targetFallback) {
          targetFallback();
        }
        return;
      }

      setup(mm);
    }
  );

  return mm;
}

/**
 * Mask Text Reveal Utility (Line-by-line reveal)
 * Elements must be wrapped in an overflow-hidden container.
 * Animates yPercent from 110 to 0.
 */
export function animateTextMaskReveal(
  elements: gsap.DOMTarget,
  trigger?: gsap.DOMTarget,
  options?: {
    stagger?: number;
    delay?: number;
    duration?: number;
  }
) {
  if (isReducedMotion()) {
    gsap.set(elements, { yPercent: 0, opacity: 1 });
    return;
  }

  const duration = options?.duration ?? MOTION_TOKENS.durationBase;
  const stagger = options?.stagger ?? MOTION_TOKENS.staggerDefault;
  const delay = options?.delay ?? 0;

  gsap.set(elements, { yPercent: 110 });

  return gsap.to(elements, {
    yPercent: 0,
    duration,
    ease: MOTION_TOKENS.easeBase,
    stagger,
    delay,
    scrollTrigger: trigger
      ? {
          trigger,
          start: "top 85%",
          toggleActions: "play none none none",
        }
      : undefined,
  });
}

/**
 * Clip-path Image Reveal Utility
 * Animates from inset(100% 0 0 0) to inset(0% 0 0 0) with an inner scale 1.2 to 1.
 */
export function animateClipReveal(
  container: gsap.DOMTarget,
  innerImage?: gsap.DOMTarget,
  trigger?: gsap.DOMTarget,
  options?: {
    delay?: number;
    duration?: number;
  }
) {
  if (isReducedMotion()) {
    gsap.set(container, { clipPath: "inset(0% 0% 0% 0%)" });
    if (innerImage) gsap.set(innerImage, { scale: 1 });
    return;
  }

  const duration = options?.duration ?? MOTION_TOKENS.durationBase;
  const delay = options?.delay ?? 0;

  gsap.set(container, { clipPath: "inset(100% 0% 0% 0%)" });
  if (innerImage) {
    gsap.set(innerImage, { scale: 1.2 });
  }

  const tl = gsap.timeline({
    delay,
    scrollTrigger: trigger
      ? {
          trigger,
          start: "top 85%",
          toggleActions: "play none none none",
        }
      : undefined,
  });

  tl.to(container, {
    clipPath: "inset(0% 0% 0% 0%)",
    duration,
    ease: MOTION_TOKENS.easeBase,
  });

  if (innerImage) {
    tl.to(
      innerImage,
      {
        scale: 1,
        duration: duration * 1.1,
        ease: MOTION_TOKENS.easeBase,
      },
      "<"
    );
  }

  return tl;
}

/**
 * Fade-Up Utility
 */
export function animateFadeUp(
  elements: gsap.DOMTarget,
  trigger?: gsap.DOMTarget,
  options?: {
    distance?: number;
    delay?: number;
    stagger?: number;
  }
) {
  if (isReducedMotion()) {
    gsap.set(elements, { opacity: 1, y: 0 });
    return;
  }

  const distance = options?.distance ?? MOTION_TOKENS.revealDistance;
  const delay = options?.delay ?? 0;
  const stagger = options?.stagger ?? MOTION_TOKENS.staggerDefault;

  gsap.set(elements, { opacity: 0, y: distance });

  return gsap.to(elements, {
    opacity: 1,
    y: 0,
    duration: MOTION_TOKENS.durationBase,
    ease: MOTION_TOKENS.easeBase,
    stagger,
    delay,
    scrollTrigger: trigger
      ? {
          trigger,
          start: "top 85%",
          toggleActions: "play none none none",
        }
      : undefined,
  });
}

/**
 * Parallax Scroll Utility with Mobile Multiplier
 */
export function setupParallax(
  element: gsap.DOMTarget,
  trigger: gsap.DOMTarget,
  yDistance: number = 80
) {
  if (isReducedMotion()) return;

  const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;
  const effectiveDistance = isMobile
    ? yDistance * MOTION_TOKENS.mobileParallaxMultiplier
    : yDistance;

  return gsap.to(element, {
    y: -effectiveDistance,
    ease: "none",
    scrollTrigger: {
      trigger,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
  });
}
