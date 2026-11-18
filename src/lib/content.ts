import { isSupabaseConfigured } from "@/lib/supabase/client";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { PORTFOLIO_DATA } from "@/data/portfolio";
import { PORTFOLIO_PROJECTS, PortfolioProject } from "@/data/projects";
import { DbDesignProject, DbDevelopedWebsite, DbSiteSettings, GalleryItem } from "@/lib/supabase/types";

export interface SiteSettingsData {
  identity: {
    fullName: string;
    displayName: string;
    role: string;
    positioning: string;
    bio: string;
    location: string;
    coordinates?: string;
    email: string;
    availability: string;
  };
  navigation: typeof PORTFOLIO_DATA.navigation;
  socials: typeof PORTFOLIO_DATA.socials;
  tools: readonly string[] | string[];
  services: typeof PORTFOLIO_DATA.services;
  experiences: typeof PORTFOLIO_DATA.experiences;
  education: typeof PORTFOLIO_DATA.education;
  phone?: string;
  cvUrl?: string;
  heroLine1: string;
  heroLine2: string;
  heroTagline: string;
  aboutText: string;
}

/**
 * Transforms a database design project record into a PortfolioProject
 */
function mapDesignProject(db: DbDesignProject): PortfolioProject {
  const galleryUrls = Array.isArray(db.gallery)
    ? db.gallery.map((g) => g.url)
    : [db.cover_image];

  return {
    id: db.id,
    slug: db.slug,
    title: db.title,
    category: db.category,
    year: db.year,
    description: db.summary,
    role: db.role || ["To be confirmed"],
    coverImage: db.cover_image,
    gallery: galleryUrls.length > 0 ? galleryUrls : [db.cover_image],
    galleryItems: Array.isArray(db.gallery) ? db.gallery : [],
    externalUrl: db.external_url || undefined,
    previewMode: "image",
    featured: db.featured,
    featuredOrder: db.featured_order,
    contributionVerified: db.contribution_verified,
  };
}

/**
 * Transforms a database developed website record into a PortfolioProject
 */
function mapDevelopedWebsite(db: DbDevelopedWebsite): PortfolioProject {
  return {
    id: db.id,
    slug: `dev-${db.id}`,
    title: db.title,
    category: db.category,
    year: db.year,
    description: db.description,
    role: [db.my_contribution || "To be confirmed"],
    coverImage: db.cover_image,
    gallery: [db.cover_image],
    liveUrl: db.live_url,
    previewMode: db.preview_mode,
    featured: db.featured,
    featuredOrder: db.order_index,
    contributionVerified: db.contribution_verified,
    technologies: db.confirmed_technologies || [],
  };
}

/**
 * Get Published Design Projects (Feeds "Selected Works")
 * Public query: only returns status = 'published'
 * Fallback: returns static PORTFOLIO_PROJECTS if database is unreachable or empty
 */
export async function getPublishedDesignProjects(): Promise<PortfolioProject[]> {
  try {
    if (!isSupabaseConfigured()) {
      return PORTFOLIO_PROJECTS;
    }

    const supabase = createServerSupabaseClient();
    if (!supabase) return PORTFOLIO_PROJECTS;

    const { data, error } = await supabase
      .from("design_projects")
      .select("*")
      .eq("status", "published")
      .order("featured_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return PORTFOLIO_PROJECTS;
    }

    return (data as DbDesignProject[]).map(mapDesignProject);
  } catch {
    return PORTFOLIO_PROJECTS;
  }
}

/**
 * Get Published Project by Slug (Feeds /works/[slug])
 */
export async function getPublishedProjectBySlug(slug: string): Promise<PortfolioProject | null> {
  try {
    if (!isSupabaseConfigured()) {
      return PORTFOLIO_PROJECTS.find((p) => p.slug === slug) || null;
    }

    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return PORTFOLIO_PROJECTS.find((p) => p.slug === slug) || null;
    }

    const { data, error } = await supabase
      .from("design_projects")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .single();

    if (error || !data) {
      // Fallback check static data
      return PORTFOLIO_PROJECTS.find((p) => p.slug === slug) || null;
    }

    return mapDesignProject(data as DbDesignProject);
  } catch {
    return PORTFOLIO_PROJECTS.find((p) => p.slug === slug) || null;
  }
}

/**
 * Get Published Developed Websites (Feeds "Digital Experiences")
 * Fallback: returns static developed projects from PORTFOLIO_PROJECTS
 */
export async function getPublishedDevelopedWebsites(): Promise<PortfolioProject[]> {
  const staticFallback = PORTFOLIO_PROJECTS.filter((p) => p.liveUrl);

  try {
    if (!isSupabaseConfigured()) {
      return staticFallback;
    }

    const supabase = createServerSupabaseClient();
    if (!supabase) return staticFallback;

    const { data, error } = await supabase
      .from("developed_websites")
      .select("*")
      .eq("status", "published")
      .order("order_index", { ascending: true })
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return staticFallback;
    }

    return (data as DbDevelopedWebsite[]).map(mapDevelopedWebsite);
  } catch {
    return staticFallback;
  }
}

/**
 * Get Site Settings
 * Fallback: returns PORTFOLIO_DATA if database is unreachable or empty
 */
export async function getSiteSettings(): Promise<SiteSettingsData> {
  const defaultSettings: SiteSettingsData = {
    ...PORTFOLIO_DATA,
    experiences: [],
    education: [],
    phone: undefined,
    cvUrl: undefined,
    heroLine1: "Designing digital",
    heroLine2: "experiences.",
    heroTagline: "Bringing ideas to life.",
    aboutText: "Clean design isn't just visual, it's how things work.",
  };

  try {
    if (!isSupabaseConfigured()) {
      return defaultSettings;
    }

    const supabase = createServerSupabaseClient();
    if (!supabase) return defaultSettings;

    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .single();

    if (error || !data) {
      return defaultSettings;
    }

    const db = data as DbSiteSettings;

    // Helper to extract clean display handles from platform URLs
    const extractHandle = (platform: string, url: string): string => {
      if (!url) return "";
      try {
        const clean = url.trim().replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
        const parts = clean.split("/").filter(Boolean);
        if (parts.length > 1) {
          const last = parts[parts.length - 1];
          const user = last.split("?")[0].split("#")[0];
          return platform === "LinkedIn" ? `in/${user}` : `@${user}`;
        }
        return `@${clean}`;
      } catch {
        return platform;
      }
    };

    // Construct dynamic socials from verified admin settings
    const dynamicSocials: typeof PORTFOLIO_DATA.socials = [];
    if (db.linkedin && db.linkedin.trim()) {
      dynamicSocials.push({
        platform: "LinkedIn",
        url: db.linkedin.trim(),
        handle: extractHandle("LinkedIn", db.linkedin),
        isPlaceholder: false,
      });
    }
    if (db.behance && db.behance.trim()) {
      dynamicSocials.push({
        platform: "Behance",
        url: db.behance.trim(),
        handle: extractHandle("Behance", db.behance),
        isPlaceholder: false,
      });
    }
    if (db.dribbble && db.dribbble.trim()) {
      dynamicSocials.push({
        platform: "Dribbble",
        url: db.dribbble.trim(),
        handle: extractHandle("Dribbble", db.dribbble),
        isPlaceholder: false,
      });
    }
    if (db.github && db.github.trim()) {
      dynamicSocials.push({
        platform: "GitHub",
        url: db.github.trim(),
        handle: extractHandle("GitHub", db.github),
        isPlaceholder: false,
      });
    }
    if (db.instagram && db.instagram.trim()) {
      dynamicSocials.push({
        platform: "Instagram",
        url: db.instagram.trim(),
        handle: extractHandle("Instagram", db.instagram),
        isPlaceholder: false,
      });
    }

    const socials = dynamicSocials.length > 0 ? dynamicSocials : PORTFOLIO_DATA.socials;

    // Resolve experiences: 1st check direct column, 2nd check JSONB packed inside services
    let experiences: typeof PORTFOLIO_DATA.experiences = [];
    if (Array.isArray(db.experiences) && db.experiences.length > 0) {
      experiences = db.experiences as any;
    } else if (
      db.services &&
      typeof db.services === "object" &&
      !Array.isArray(db.services) &&
      Array.isArray((db.services as any).experiences)
    ) {
      experiences = (db.services as any).experiences;
    }

    // Resolve education: 1st check direct column, 2nd check JSONB packed inside services
    let education: typeof PORTFOLIO_DATA.education = [];
    if (Array.isArray(db.education) && db.education.length > 0) {
      education = db.education as any;
    } else if (
      db.services &&
      typeof db.services === "object" &&
      !Array.isArray(db.services) &&
      Array.isArray((db.services as any).education)
    ) {
      education = (db.services as any).education;
    }

    // Resolve services items
    let services = PORTFOLIO_DATA.services;
    if (Array.isArray(db.services) && db.services.length > 0) {
      services = db.services as any;
    } else if (
      db.services &&
      typeof db.services === "object" &&
      Array.isArray((db.services as any).items) &&
      (db.services as any).items.length > 0
    ) {
      services = (db.services as any).items;
    }

    return {
      identity: {
        fullName: PORTFOLIO_DATA.identity.fullName,
        displayName: PORTFOLIO_DATA.identity.displayName,
        role: PORTFOLIO_DATA.identity.role,
        positioning: db.hero_headline_tagline || PORTFOLIO_DATA.identity.positioning,
        bio: db.short_bio || PORTFOLIO_DATA.identity.bio,
        location: db.location || PORTFOLIO_DATA.identity.location,
        coordinates: db.coordinates || PORTFOLIO_DATA.identity.coordinates,
        email: db.email || PORTFOLIO_DATA.identity.email,
        availability: db.availability_enabled
          ? db.availability_text || PORTFOLIO_DATA.identity.availability
          : "",
      },
      navigation: PORTFOLIO_DATA.navigation,
      socials: socials.length > 0 ? socials : PORTFOLIO_DATA.socials,
      tools: db.tools && db.tools.length > 0 ? db.tools : PORTFOLIO_DATA.tools,
      services,
      experiences,
      education,
      phone: db.phone || undefined,
      cvUrl: db.cv_url || undefined,
      heroLine1: db.hero_headline_line1 || "Designing digital",
      heroLine2: db.hero_headline_line2 || "experiences.",
      heroTagline: db.hero_headline_tagline || "Bringing ideas to life.",
      aboutText: db.about_text || "Clean design isn't just visual, it's how things work.",
    };
  } catch {
    return defaultSettings;
  }
}
