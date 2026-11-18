"use client";

import React, { useEffect, useState } from "react";
import NextLink from "next/link";
import Image from "next/image";
import {
  fetchAllDesignProjects,
  fetchAllDevelopedWebsites,
  saveDesignProject,
  deleteDesignProject,
} from "@/lib/admin-data-service";
import { DbDesignProject, DbDevelopedWebsite } from "@/lib/supabase/types";
import { useToast } from "@/components/admin/Toast";
import { useAuth } from "@/lib/auth-context";

export default function AdminOverviewPage() {
  const [designProjects, setDesignProjects] = useState<DbDesignProject[]>([]);
  const [websites, setWebsites] = useState<DbDevelopedWebsite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();
  const { isConfigured } = useAuth();

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [dp, ws] = await Promise.all([
        fetchAllDesignProjects(),
        fetchAllDevelopedWebsites(),
      ]);
      setDesignProjects(dp);
      setWebsites(ws);
    } catch {
      showToast("Failed to fetch dashboard records", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalDesign = designProjects.length;
  const publishedDesign = designProjects.filter((p) => p.status === "published").length;
  const draftDesign = designProjects.filter((p) => p.status === "draft").length;
  const totalWebsites = websites.length;
  const missingImages = designProjects.filter(
    (p) => !p.cover_image || !p.gallery || p.gallery.length === 0
  ).length;

  const toggleStatus = async (project: DbDesignProject) => {
    const nextStatus = project.status === "published" ? "draft" : "published";
    try {
      const updated = await saveDesignProject({
        id: project.id,
        title: project.title,
        slug: project.slug,
        status: nextStatus,
      });
      setDesignProjects((prev) =>
        prev.map((p) => (p.id === project.id ? { ...p, status: nextStatus } : p))
      );
      showToast(`Project "${project.title}" set to ${nextStatus.toUpperCase()}`);
    } catch (err: any) {
      showToast(err.message || "Failed to update project status", "error");
    }
  };

  return (
    <div className="space-y-10">
      {/* Overview Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-6">
        <div>
          <div className="type-label text-[10px] font-mono text-text-muted tracking-widest uppercase mb-1">
            EXHIBITION OVERVIEW // REPOSITORY TELEMETRY
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-foreground">
            Portfolio Command Center
          </h1>
          <p className="type-body text-xs text-text-muted mt-1">
            Manage UI/UX case studies, interactive website mirrors, and global portfolio contact data.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <NextLink
            href="/admin/projects/new"
            className="min-h-[40px] px-5 py-2.5 bg-foreground text-background font-mono text-xs uppercase tracking-wider rounded hover:bg-neutral-800 transition-colors inline-flex items-center gap-2"
          >
            <span>+</span>
            <span>New Design Project</span>
          </NextLink>

          <NextLink
            href="/admin/websites/new"
            className="min-h-[40px] px-5 py-2.5 border border-border text-foreground font-mono text-xs uppercase tracking-wider rounded hover:border-foreground transition-colors inline-flex items-center gap-2"
          >
            <span>+</span>
            <span>New Website</span>
          </NextLink>
        </div>
      </div>

      {/* Metrics Row (4 Architectural Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Design Projects */}
        <div className="p-6 bg-background border border-border rounded space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-text-muted">
            <span>DESIGN PROJECTS</span>
            <span className="text-[10px] bg-[#F8F7F4] px-2 py-0.5 border border-border rounded">WORKS</span>
          </div>
          <div className="font-serif text-4xl text-foreground font-normal">
            {isLoading ? "–" : totalDesign}
          </div>
          <div className="text-[11px] font-mono text-text-muted flex items-center gap-3 pt-1">
            <span className="text-foreground font-semibold">{publishedDesign} Published</span>
            <span>•</span>
            <span>{draftDesign} Drafts</span>
          </div>
        </div>

        {/* Card 2: Developed Websites */}
        <div className="p-6 bg-background border border-border rounded space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-text-muted">
            <span>DEVELOPED SITES</span>
            <span className="text-[10px] bg-[#F8F7F4] px-2 py-0.5 border border-border rounded">EXPERIENCES</span>
          </div>
          <div className="font-serif text-4xl text-foreground font-normal">
            {isLoading ? "–" : totalWebsites}
          </div>
          <div className="text-[11px] font-mono text-text-muted pt-1">
            <span>Interactive sandbox &amp; live preview records</span>
          </div>
        </div>

        {/* Card 3: Draft Queue */}
        <div className="p-6 bg-background border border-border rounded space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-text-muted">
            <span>DRAFT QUEUE</span>
            <span className="text-[10px] bg-[#F8F7F4] px-2 py-0.5 border border-border rounded">PRIVATE</span>
          </div>
          <div className="font-serif text-4xl text-foreground font-normal">
            {isLoading ? "–" : draftDesign}
          </div>
          <div className="text-[11px] font-mono text-text-muted pt-1">
            <span>Hidden from public exhibition</span>
          </div>
        </div>

        {/* Card 4: Image Health Alert */}
        <div className="p-6 bg-background border border-border rounded space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-text-muted">
            <span>IMAGE HEALTH</span>
            <span
              className={`text-[10px] px-2 py-0.5 border rounded ${
                missingImages > 0
                  ? "bg-amber-100 text-amber-800 border-amber-300"
                  : "bg-green-100 text-green-800 border-green-300"
              }`}
            >
              {missingImages > 0 ? "ACTION NEEDED" : "ALL HEALTHY"}
            </span>
          </div>
          <div className="font-serif text-4xl text-foreground font-normal">
            {isLoading ? "–" : missingImages}
          </div>
          <div className="text-[11px] font-mono text-text-muted pt-1">
            <span>Projects missing gallery screens</span>
          </div>
        </div>
      </div>

      {/* Database Connection Diagnostic Notice */}
      <div className="p-5 border border-border bg-[#F8F7F4] rounded flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-bold text-foreground">
            <span
              className={`w-2 h-2 rounded-full ${
                isConfigured ? "bg-green-500" : "bg-amber-500"
              }`}
            />
            <span>
              BACKEND ENGINE: {isConfigured ? "Supabase Live Connected (PostgreSQL + RLS)" : "Local Resilient Fallback Mode"}
            </span>
          </div>
          <p className="text-text-muted text-[11px]">
            {isConfigured
              ? "All project mutations write directly to your cloud Supabase database with Row Level Security enforced."
              : "Supabase credentials not yet detected in .env.local. Dashboard is running in zero-downtime Local Storage mode so you can test all features immediately."}
          </p>
        </div>

        <NextLink
          href="/admin/settings"
          className="px-4 py-2 border border-border rounded bg-background hover:border-foreground text-foreground whitespace-nowrap text-xs"
        >
          View System Settings →
        </NextLink>
      </div>

      {/* Recent Projects Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="type-label text-sm uppercase tracking-wider text-foreground">
            Design Projects (Selected Works)
          </h2>
          <NextLink
            href="/admin/projects"
            className="text-xs font-mono text-text-muted hover:text-foreground underline"
          >
            View All ({designProjects.length}) →
          </NextLink>
        </div>

        <div className="border border-border rounded overflow-hidden bg-background">
          {isLoading ? (
            <div className="p-12 text-center text-xs font-mono text-text-muted">
              Loading projects...
            </div>
          ) : designProjects.length === 0 ? (
            <div className="p-12 text-center text-xs font-mono text-text-muted">
              No design projects found. Click &quot;+ New Design Project&quot; to create one.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-[#F8F7F4] border-b border-border text-text-muted">
                  <tr>
                    <th className="p-3 pl-4">THUMBNAIL</th>
                    <th className="p-3">TITLE / SLUG</th>
                    <th className="p-3">CATEGORY</th>
                    <th className="p-3">STATUS</th>
                    <th className="p-3">FEATURED</th>
                    <th className="p-3 text-right pr-4">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {designProjects.slice(0, 5).map((project) => (
                    <tr key={project.id} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="p-3 pl-4">
                        <div className="relative w-12 h-10 bg-neutral-200 rounded overflow-hidden border border-border">
                          {project.cover_image && (
                            <Image
                              src={project.cover_image}
                              alt={project.title}
                              fill
                              className="object-cover"
                              unoptimized={project.cover_image.startsWith("blob:")}
                            />
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="font-sans font-semibold text-foreground text-sm">
                          {project.title}
                        </div>
                        <div className="text-[11px] text-text-muted">
                          /works/{project.slug}
                        </div>
                      </td>
                      <td className="p-3 text-text-muted">{project.category}</td>
                      <td className="p-3">
                        <button
                          onClick={() => toggleStatus(project)}
                          className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase transition-colors cursor-pointer border ${
                            project.status === "published"
                              ? "bg-green-100 text-green-800 border-green-300 hover:bg-green-200"
                              : "bg-neutral-200 text-neutral-800 border-neutral-300 hover:bg-neutral-300"
                          }`}
                          title="Click to toggle status"
                        >
                          {project.status}
                        </button>
                      </td>
                      <td className="p-3">
                        {project.featured ? (
                          <span className="text-foreground">★ Yes (#{project.featured_order})</span>
                        ) : (
                          <span className="text-text-muted">No</span>
                        )}
                      </td>
                      <td className="p-3 text-right pr-4 space-x-3">
                        <NextLink
                          href={`/admin/projects/${project.id}`}
                          className="text-foreground hover:underline"
                        >
                          Edit
                        </NextLink>
                        {project.status === "published" && (
                          <NextLink
                            href={`/works/${project.slug}`}
                            target="_blank"
                            className="text-text-muted hover:text-foreground"
                          >
                            View ↗
                          </NextLink>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
