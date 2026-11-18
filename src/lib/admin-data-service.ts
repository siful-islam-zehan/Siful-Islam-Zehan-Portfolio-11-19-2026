import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { DbDesignProject, DbDevelopedWebsite, DbSiteSettings } from "@/lib/supabase/types";
import { PORTFOLIO_DATA } from "@/data/portfolio";
import { PORTFOLIO_PROJECTS } from "@/data/projects";

const STORAGE_KEY_DESIGN = "zehan_local_design_projects";
const STORAGE_KEY_WEBSITES = "zehan_local_developed_websites";
const STORAGE_KEY_SETTINGS = "zehan_local_site_settings";

/**
 * Initial seed for local fallback
 */
function getInitialLocalDesignProjects(): DbDesignProject[] {
  return [
    {
      id: "grandpool",
      title: "Grandpool",
      slug: "grandpool",
      category: "Website Design / Demo",
      year: "2024",
      summary:
        "Architectural digital experience created for an ultra-luxury private aquatic living and luxury resort lifestyle destination.",
      role: ["To be confirmed"],
      cover_image: "/images/projects/grandpool-cover.webp",
      gallery: [
        {
          id: "1",
          url: "/images/projects/grandpool-cover.webp",
          alt: "Grandpool Editorial Cover",
          caption: "Editorial hero overview",
          isDeviceMockup: false,
          order: 1,
        },
        {
          id: "2",
          url: "/images/projects/grandpool-screen-1.webp",
          alt: "Grandpool Desktop Architecture",
          caption: "Poolside suite collection specification",
          isDeviceMockup: false,
          order: 2,
        },
        {
          id: "3",
          url: "/images/projects/grandpool-screen-2.webp",
          alt: "Grandpool Interactive Booking Detail",
          caption: "Spatial hierarchy & booking interaction",
          isDeviceMockup: false,
          order: 3,
        },
      ],
      external_url: "https://siful-islam-zehan.github.io/Grandpool-design/",
      featured: true,
      featured_order: 1,
      status: "draft",
      contribution_verified: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];
}

function getInitialLocalWebsites(): DbDevelopedWebsite[] {
  return [
    {
      id: "grandpool-web",
      title: "Grandpool",
      description:
        "Architectural digital experience created for an ultra-luxury private aquatic living and luxury resort lifestyle destination.",
      live_url: "https://siful-islam-zehan.github.io/Grandpool-design/",
      cover_image: "/images/projects/grandpool-cover.webp",
      screenshot_fallback: "",
      category: "Website Design / Demo",
      my_contribution: "To be confirmed",
      confirmed_technologies: ["HTML5", "CSS3", "JavaScript"],
      year: "2024",
      preview_mode: "iframe",
      featured: true,
      order_index: 1,
      status: "draft",
      contribution_verified: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "naijaradar-web",
      title: "NaijaRadar",
      description:
        "A digital discovery and content publication platform engineered for rapid regional information dissemination and media aggregation.",
      live_url: "https://naijaradar.ng/",
      cover_image: "/images/projects/naijaradar-cover.webp",
      screenshot_fallback: "",
      category: "Website / Digital Experience",
      my_contribution: "To be confirmed",
      confirmed_technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
      year: "2024",
      preview_mode: "iframe",
      featured: true,
      order_index: 2,
      status: "draft",
      contribution_verified: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "secure-note-web",
      title: "Secure Note",
      description:
        "An encrypted private note-taking mobile application emphasizing clear typographic hierarchy, biometric authentication, and focused utility.",
      live_url: "https://play.google.com/apps/test/com.engromjanali.securenote/2",
      cover_image: "/images/projects/secure-note-cover.webp",
      screenshot_fallback: "",
      category: "Mobile Application",
      my_contribution: "To be confirmed",
      confirmed_technologies: ["Android", "Biometric Auth"],
      year: "2024",
      preview_mode: "external",
      featured: true,
      order_index: 3,
      status: "draft",
      contribution_verified: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];
}

function getInitialLocalSettings(): DbSiteSettings {
  return {
    id: 1,
    email: "hello@sifulislamzehan.dev",
    phone: "",
    location: "Bangladesh",
    coordinates: "",
    behance: "",
    linkedin: "",
    dribbble: "",
    github: "https://github.com/siful-islam-zehan",
    instagram: "",
    availability_text: "Available for freelance work • 2026",
    availability_enabled: true,
    cv_url: "",
    hero_headline_line1: "Designing digital",
    hero_headline_line2: "experiences.",
    hero_headline_tagline: "Bringing ideas to life.",
    short_bio: "",
    about_text: "",
    services: [],
    tools: [],
    experiences: [],
    education: [],
    updated_at: new Date().toISOString(),
  };
}

// -----------------------------------------------------------------------------
// DESIGN PROJECTS API
// -----------------------------------------------------------------------------
export async function fetchAllDesignProjects(): Promise<DbDesignProject[]> {
  if (isSupabaseConfigured()) {
    const supabase = createClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("design_projects")
        .select("*")
        .order("featured_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (!error && data) return data as DbDesignProject[];
    }
  }

  // Local Storage Fallback
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem(STORAGE_KEY_DESIGN);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {}
    }
    const initial = getInitialLocalDesignProjects();
    localStorage.setItem(STORAGE_KEY_DESIGN, JSON.stringify(initial));
    return initial;
  }
  return getInitialLocalDesignProjects();
}

export async function saveDesignProject(
  project: Partial<DbDesignProject> & { title: string; slug: string }
): Promise<DbDesignProject> {
  const isUpdate = !!project.id;
  const now = new Date().toISOString();

  if (isSupabaseConfigured()) {
    const supabase = createClient();
    if (supabase) {
      if (isUpdate) {
        const { data, error } = await supabase
          .from("design_projects")
          .update({
            ...project,
            updated_at: now,
          })
          .eq("id", project.id)
          .select()
          .single();

        if (error) throw new Error(error.message);
        return data as DbDesignProject;
      } else {
        const { id, ...cleanProject } = project;
        const insertPayload: Record<string, any> = {
          ...cleanProject,
          created_at: now,
          updated_at: now,
        };
        if (id) {
          insertPayload.id = id;
        }

        const { data, error } = await supabase
          .from("design_projects")
          .insert([insertPayload])
          .select()
          .single();

        if (error) throw new Error(error.message);
        return data as DbDesignProject;
      }
    }
  }

  // Local storage save
  const current = await fetchAllDesignProjects();
  let savedItem: DbDesignProject;

  if (isUpdate) {
    const idx = current.findIndex((p) => p.id === project.id);
    if (idx === -1) throw new Error("Project not found in store");
    savedItem = { ...current[idx], ...project, updated_at: now } as DbDesignProject;
    current[idx] = savedItem;
  } else {
    savedItem = {
      id: Math.random().toString(36).substring(2, 9),
      category: "UI/UX Design",
      year: "2025",
      summary: "",
      role: ["To be confirmed"],
      cover_image: "/images/projects/placeholder-slot-4.webp",
      gallery: [],
      featured: false,
      featured_order: current.length + 1,
      status: "draft",
      contribution_verified: false,
      ...project,
      created_at: now,
      updated_at: now,
    } as DbDesignProject;
    current.push(savedItem);
  }

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY_DESIGN, JSON.stringify(current));
  }
  return savedItem;
}

export async function deleteDesignProject(id: string): Promise<void> {
  if (isSupabaseConfigured()) {
    const supabase = createClient();
    if (supabase) {
      const { error } = await supabase.from("design_projects").delete().eq("id", id);
      if (error) throw new Error(error.message);
      return;
    }
  }

  const current = await fetchAllDesignProjects();
  const updated = current.filter((p) => p.id !== id);
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY_DESIGN, JSON.stringify(updated));
  }
}

// -----------------------------------------------------------------------------
// DEVELOPED WEBSITES API
// -----------------------------------------------------------------------------
export async function fetchAllDevelopedWebsites(): Promise<DbDevelopedWebsite[]> {
  if (isSupabaseConfigured()) {
    const supabase = createClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("developed_websites")
        .select("*")
        .order("order_index", { ascending: true })
        .order("created_at", { ascending: false });

      if (!error && data) return data as DbDevelopedWebsite[];
    }
  }

  // Local Storage Fallback
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem(STORAGE_KEY_WEBSITES);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {}
    }
    const initial = getInitialLocalWebsites();
    localStorage.setItem(STORAGE_KEY_WEBSITES, JSON.stringify(initial));
    return initial;
  }
  return getInitialLocalWebsites();
}

export async function saveDevelopedWebsite(
  website: Partial<DbDevelopedWebsite> & { title: string; live_url: string }
): Promise<DbDevelopedWebsite> {
  const isUpdate = !!website.id;
  const now = new Date().toISOString();

  if (isSupabaseConfigured()) {
    const supabase = createClient();
    if (supabase) {
      if (isUpdate) {
        const { data, error } = await supabase
          .from("developed_websites")
          .update({
            ...website,
            updated_at: now,
          })
          .eq("id", website.id)
          .select()
          .single();

        if (error) throw new Error(error.message);
        return data as DbDevelopedWebsite;
      } else {
        const { id, ...cleanWebsite } = website;
        const insertPayload: Record<string, any> = {
          ...cleanWebsite,
          created_at: now,
          updated_at: now,
        };
        if (id) {
          insertPayload.id = id;
        }

        const { data, error } = await supabase
          .from("developed_websites")
          .insert([insertPayload])
          .select()
          .single();

        if (error) throw new Error(error.message);
        return data as DbDevelopedWebsite;
      }
    }
  }

  // Local storage save
  const current = await fetchAllDevelopedWebsites();
  let savedItem: DbDevelopedWebsite;

  if (isUpdate) {
    const idx = current.findIndex((w) => w.id === website.id);
    if (idx === -1) throw new Error("Website record not found in store");
    savedItem = { ...current[idx], ...website, updated_at: now } as DbDevelopedWebsite;
    current[idx] = savedItem;
  } else {
    savedItem = {
      id: Math.random().toString(36).substring(2, 9),
      description: "",
      cover_image: "/images/projects/placeholder-slot-4.webp",
      category: "Website / Digital Experience",
      my_contribution: "To be confirmed",
      confirmed_technologies: [],
      year: "2024",
      preview_mode: "iframe",
      featured: true,
      order_index: current.length + 1,
      status: "draft",
      contribution_verified: false,
      ...website,
      created_at: now,
      updated_at: now,
    } as DbDevelopedWebsite;
    current.push(savedItem);
  }

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY_WEBSITES, JSON.stringify(current));
  }
  return savedItem;
}

export async function deleteDevelopedWebsite(id: string): Promise<void> {
  if (isSupabaseConfigured()) {
    const supabase = createClient();
    if (supabase) {
      const { error } = await supabase.from("developed_websites").delete().eq("id", id);
      if (error) throw new Error(error.message);
      return;
    }
  }

  const current = await fetchAllDevelopedWebsites();
  const updated = current.filter((w) => w.id !== id);
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY_WEBSITES, JSON.stringify(updated));
  }
}

// -----------------------------------------------------------------------------
// SITE SETTINGS API
// -----------------------------------------------------------------------------
export async function fetchSiteSettings(): Promise<DbSiteSettings> {
  if (isSupabaseConfigured()) {
    const supabase = createClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("id", 1)
        .single();

      if (!error && data) {
        const raw = data as any;
        let expList = raw.experiences;
        let eduList = raw.education;

        // If not in dedicated columns, check if packed inside services JSONB
        if (
          (!Array.isArray(expList) || expList.length === 0) &&
          raw.services &&
          typeof raw.services === "object" &&
          !Array.isArray(raw.services)
        ) {
          if (Array.isArray(raw.services.experiences)) expList = raw.services.experiences;
          if (Array.isArray(raw.services.education)) eduList = raw.services.education;
        }

        return {
          ...raw,
          experiences: Array.isArray(expList) ? expList : [],
          education: Array.isArray(eduList) ? eduList : [],
        } as DbSiteSettings;
      }
    }
  }

  // Local Storage Fallback
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {}
    }
    const initial = getInitialLocalSettings();
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(initial));
    return initial;
  }
  return getInitialLocalSettings();
}

export async function saveSiteSettings(settings: Partial<DbSiteSettings>): Promise<DbSiteSettings> {
  const now = new Date().toISOString();

  // Always save locally first for resilience
  const current = await fetchSiteSettings();
  const updated = { ...current, ...settings, updated_at: now } as DbSiteSettings;
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(updated));
  }

  if (isSupabaseConfigured()) {
    const supabase = createClient();
    if (supabase) {
      let { data, error } = await supabase
        .from("site_settings")
        .upsert({
          id: 1,
          ...settings,
          updated_at: now,
        })
        .select()
        .single();

      // If dedicated column doesn't exist in Supabase yet, pack experiences & education into services JSONB column
      if (error && (error.message.includes("column") || error.code === "PGRST204" || error.code === "42703")) {
        const { experiences, education, ...safeSettings } = settings;
        const packedServices = {
          items: Array.isArray(safeSettings.services) ? safeSettings.services : [],
          experiences: experiences || [],
          education: education || [],
        };

        const retry = await supabase
          .from("site_settings")
          .upsert({
            id: 1,
            ...safeSettings,
            services: packedServices,
            updated_at: now,
          })
          .select()
          .single();

        if (retry.error) throw new Error(retry.error.message);
        return {
          ...(retry.data as DbSiteSettings),
          experiences: experiences || [],
          education: education || [],
        };
      }

      if (error) throw new Error(error.message);
      return data as DbSiteSettings;
    }
  }

  return updated;
}
