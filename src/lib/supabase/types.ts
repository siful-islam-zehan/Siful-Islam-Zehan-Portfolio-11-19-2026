/**
 * Supabase Database Record Types for Siful Islam Zehan Portfolio
 */

export interface GalleryItem {
  id: string;
  url: string;
  alt: string;
  caption?: string;
  isDeviceMockup?: boolean;
  order: number;
}

export interface DbDesignProject {
  id: string;
  title: string;
  slug: string;
  category: string;
  year: string;
  summary: string;
  role: string[];
  cover_image: string;
  gallery: GalleryItem[];
  external_url?: string;
  featured: boolean;
  featured_order: number;
  status: "draft" | "published";
  contribution_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbDevelopedWebsite {
  id: string;
  title: string;
  description: string;
  live_url: string;
  cover_image: string;
  screenshot_fallback?: string;
  category: string;
  my_contribution: string;
  confirmed_technologies: string[];
  year: string;
  preview_mode: "iframe" | "external" | "image";
  featured: boolean;
  order_index: number;
  status: "draft" | "published";
  contribution_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbSiteSettings {
  id: number;
  email: string;
  phone?: string;
  location: string;
  coordinates?: string;
  behance?: string;
  linkedin?: string;
  dribbble?: string;
  github?: string;
  instagram?: string;
  availability_text: string;
  availability_enabled: boolean;
  cv_url?: string;
  hero_headline_line1: string;
  hero_headline_line2: string;
  hero_headline_tagline: string;
  short_bio: string;
  about_text: string;
  services: Array<{
    id: string;
    number: string;
    title: string;
    description: string;
    deliverables: string[];
  }>;
  tools: string[];
  updated_at: string;
}
