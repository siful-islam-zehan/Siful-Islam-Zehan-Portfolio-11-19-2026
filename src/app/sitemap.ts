import { MetadataRoute } from "next";
import { PORTFOLIO_PROJECTS } from "@/data/projects";

const SITE_URL = "https://sifulislamzehan.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date().toISOString();

  // Root Homepage
  const routes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 1.0,
    },
  ];

  // Dynamic Case Studies
  const projectRoutes: MetadataRoute.Sitemap = PORTFOLIO_PROJECTS.map((project) => ({
    url: `${SITE_URL}/works/${project.slug}`,
    lastModified: currentDate,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...routes, ...projectRoutes];
}
