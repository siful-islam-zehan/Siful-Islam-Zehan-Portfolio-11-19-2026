import React from "react";
import { notFound } from "next/navigation";
import {
  getPublishedProjectBySlug,
  getPublishedDesignProjects,
} from "@/lib/content";
import { getAllProjectSlugs } from "@/data/projects";
import { ProjectDetailClient } from "./ProjectDetailClient";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateStaticParams() {
  return getAllProjectSlugs().map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const project = await getPublishedProjectBySlug(params.slug);
  if (!project) return { title: "Project Not Found — Zehan" };

  return {
    title: `${project.title} — Zehan Exhibition Case Study`,
    description: project.description,
    openGraph: {
      title: `${project.title} — Zehan Portfolio`,
      description: project.description,
      images: [project.coverImage],
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = await getPublishedProjectBySlug(params.slug);
  if (!project) {
    notFound();
  }

  // Retrieve published projects list to compute prev/next navigation
  const allPublished = await getPublishedDesignProjects();
  const currentIndex = allPublished.findIndex((p) => p.slug === params.slug);

  const prevProject =
    currentIndex > 0
      ? allPublished[currentIndex - 1]
      : allPublished[allPublished.length - 1] || project;

  const nextProject =
    currentIndex < allPublished.length - 1
      ? allPublished[currentIndex + 1]
      : allPublished[0] || project;

  return (
    <ProjectDetailClient
      project={project}
      prevProject={prevProject}
      nextProject={nextProject}
    />
  );
}
