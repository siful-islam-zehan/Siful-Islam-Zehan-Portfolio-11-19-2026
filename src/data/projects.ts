/**
 * Siful Islam Zehan (Zehan) — Portfolio Projects Data Store
 * Strictly adheres to the PortfolioProject interface.
 * All contributions are currently unconfirmed (contributionVerified: false).
 * No fictional names, clients, stats, or ownership claims.
 */

export interface PortfolioProject {
  id: string;
  slug: string;
  title: string;
  category: string;
  year: string;
  description: string;
  role: string[];
  coverImage: string;
  gallery: string[];
  galleryItems?: Array<{
    id: string;
    url: string;
    alt: string;
    caption?: string;
    isDeviceMockup?: boolean;
    order: number;
  }>;
  liveUrl?: string;
  externalUrl?: string;
  previewMode: "iframe" | "external" | "image";
  featured: boolean;
  featuredOrder: number;
  contributionVerified: boolean;
  technologies?: string[];
}

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: "grandpool",
    slug: "grandpool",
    title: "Grandpool",
    category: "Website Design / Demo",
    year: "2024",
    description:
      "Architectural digital experience created for an ultra-luxury private aquatic living and luxury resort lifestyle destination.",
    role: ["To be confirmed"],
    coverImage: "/images/projects/grandpool-cover.webp",
    gallery: [
      "/images/projects/grandpool-cover.webp",
      "/images/projects/grandpool-screen-1.webp",
      "/images/projects/grandpool-screen-2.webp",
    ],
    liveUrl: "https://siful-islam-zehan.github.io/Grandpool-design/",
    previewMode: "iframe",
    featured: true,
    featuredOrder: 1,
    contributionVerified: false,
    technologies: ["HTML5", "CSS3", "JavaScript"],
  },
  {
    id: "naijaradar",
    slug: "naijaradar",
    title: "NaijaRadar",
    category: "Website / Digital Experience",
    year: "2024",
    description:
      "A digital discovery and content publication platform engineered for rapid regional information dissemination and media aggregation.",
    role: ["To be confirmed"],
    coverImage: "/images/projects/naijaradar-cover.webp",
    gallery: ["/images/projects/naijaradar-cover.webp"],
    liveUrl: "https://naijaradar.ng/",
    previewMode: "iframe",
    featured: true,
    featuredOrder: 2,
    contributionVerified: false,
    technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
  },
  {
    id: "secure-note",
    slug: "secure-note",
    title: "Secure Note",
    category: "Mobile Application",
    year: "2024",
    description:
      "An encrypted private note-taking mobile application emphasizing clear typographic hierarchy, biometric authentication, and focused utility.",
    role: ["To be confirmed"],
    coverImage: "/images/projects/secure-note-cover.webp",
    gallery: ["/images/projects/secure-note-cover.webp"],
    liveUrl: "https://play.google.com/apps/test/com.engromjanali.securenote/2",
    previewMode: "external",
    featured: true,
    featuredOrder: 3,
    contributionVerified: false,
    technologies: ["Android", "Biometric Auth"],
  },
];

/**
 * Utility to retrieve projects
 */
export function getFeaturedProjects(): PortfolioProject[] {
  return PORTFOLIO_PROJECTS.filter((p) => p.featured).sort(
    (a, b) => a.featuredOrder - b.featuredOrder
  );
}

export function getProjectBySlug(slug: string): PortfolioProject | undefined {
  return PORTFOLIO_PROJECTS.find((p) => p.slug === slug);
}

export function getAllProjectSlugs(): string[] {
  return PORTFOLIO_PROJECTS.map((p) => p.slug);
}
