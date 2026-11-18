"use client";

import React, { useEffect, useState } from "react";
import NextLink from "next/link";
import Image from "next/image";
import {
  fetchAllDesignProjects,
  saveDesignProject,
  deleteDesignProject,
} from "@/lib/admin-data-service";
import { DbDesignProject } from "@/lib/supabase/types";
import { useToast } from "@/components/admin/Toast";

export default function DesignProjectsListPage() {
  const [projects, setProjects] = useState<DbDesignProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [projectToDelete, setProjectToDelete] = useState<DbDesignProject | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { showToast } = useToast();

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAllDesignProjects();
      setProjects(data);
    } catch {
      showToast("Failed to load design projects", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleToggleStatus = async (project: DbDesignProject) => {
    const nextStatus = project.status === "published" ? "draft" : "published";
    try {
      await saveDesignProject({
        id: project.id,
        title: project.title,
        slug: project.slug,
        status: nextStatus,
      });
      setProjects((prev) =>
        prev.map((p) => (p.id === project.id ? { ...p, status: nextStatus } : p))
      );
      showToast(`Project "${project.title}" changed to ${nextStatus.toUpperCase()}`);
    } catch (err: any) {
      showToast(err.message || "Status update failed", "error");
    }
  };

  const handleDuplicate = async (project: DbDesignProject) => {
    try {
      const duplicateSlug = `${project.slug}-copy-${Date.now().toString().slice(-4)}`;
      const duplicated = await saveDesignProject({
        title: `${project.title} (Copy)`,
        slug: duplicateSlug,
        category: project.category,
        year: project.year,
        summary: project.summary,
        role: project.role,
        cover_image: project.cover_image,
        gallery: project.gallery,
        external_url: project.external_url,
        featured: false,
        featured_order: projects.length + 1,
        status: "draft",
        contribution_verified: project.contribution_verified,
      });

      setProjects((prev) => [...prev, duplicated]);
      showToast(`Duplicated as "${duplicated.title}" (saved as draft)`);
    } catch (err: any) {
      showToast(err.message || "Duplication failed", "error");
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === projects.length - 1)
    ) {
      return;
    }

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const reordered = [...projects];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    // Update orders
    const updatedList = reordered.map((p, idx) => ({ ...p, featured_order: idx + 1 }));
    setProjects(updatedList);

    try {
      await Promise.all(
        updatedList.map((p) =>
          saveDesignProject({ id: p.id, title: p.title, slug: p.slug, featured_order: p.featured_order })
        )
      );
      showToast("Project exhibition order updated");
    } catch {
      showToast("Failed to persist order", "error");
    }
  };

  const confirmDelete = async () => {
    if (!projectToDelete) return;
    setIsDeleting(true);
    try {
      await deleteDesignProject(projectToDelete.id);
      setProjects((prev) => prev.filter((p) => p.id !== projectToDelete.id));
      showToast(`Deleted "${projectToDelete.title}"`);
      setProjectToDelete(null);
    } catch (err: any) {
      showToast(err.message || "Failed to delete project", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="type-label text-[10px] font-mono text-text-muted tracking-widest uppercase mb-1">
            EXHIBITION REPOSITORY // CHAPTER 02
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-foreground">
            Design Projects (Selected Works)
          </h1>
          <p className="type-body text-xs text-text-muted mt-1">
            Manage UI/UX design case studies, gallery spreads, and device mockups.
          </p>
        </div>

        <NextLink
          href="/admin/projects/new"
          className="min-h-[40px] px-5 py-2.5 bg-foreground text-background font-mono text-xs uppercase tracking-wider rounded hover:bg-neutral-800 transition-colors inline-flex items-center gap-2 self-start sm:self-auto"
        >
          <span>+</span>
          <span>New Design Project</span>
        </NextLink>
      </div>

      {/* Projects List Table */}
      <div className="border border-border rounded overflow-hidden bg-background">
        {isLoading ? (
          <div className="p-12 text-center text-xs font-mono text-text-muted">
            Loading design projects...
          </div>
        ) : projects.length === 0 ? (
          <div className="p-12 text-center text-xs font-mono text-text-muted space-y-3">
            <p>No design projects in database.</p>
            <NextLink
              href="/admin/projects/new"
              className="inline-block px-4 py-2 border border-border rounded text-foreground hover:border-foreground"
            >
              + Create your first project
            </NextLink>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-[#F8F7F4] border-b border-border text-text-muted">
                <tr>
                  <th className="p-3 pl-4 w-12 text-center">ORDER</th>
                  <th className="p-3">COVER</th>
                  <th className="p-3">TITLE / SLUG</th>
                  <th className="p-3">CATEGORY</th>
                  <th className="p-3">GALLERY</th>
                  <th className="p-3">STATUS</th>
                  <th className="p-3">VERIFIED</th>
                  <th className="p-3 text-right pr-4">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {projects.map((project, idx) => (
                  <tr key={project.id} className="hover:bg-neutral-50/50 transition-colors">
                    {/* Reorder Arrows */}
                    <td className="p-3 pl-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMove(idx, "up")}
                          className="text-[10px] p-1 border border-border rounded disabled:opacity-20 hover:bg-neutral-100"
                          title="Move project up"
                        >
                          ▲
                        </button>
                        <span className="text-[10px] text-text-muted font-bold">#{idx + 1}</span>
                        <button
                          type="button"
                          disabled={idx === projects.length - 1}
                          onClick={() => handleMove(idx, "down")}
                          className="text-[10px] p-1 border border-border rounded disabled:opacity-20 hover:bg-neutral-100"
                          title="Move project down"
                        >
                          ▼
                        </button>
                      </div>
                    </td>

                    {/* Cover Thumbnail */}
                    <td className="p-3">
                      <div className="relative w-14 h-11 bg-neutral-200 rounded overflow-hidden border border-border">
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

                    {/* Title & Slug */}
                    <td className="p-3">
                      <div className="font-sans font-semibold text-foreground text-sm">
                        {project.title}
                      </div>
                      <div className="text-[11px] text-text-muted">
                        /works/{project.slug}
                      </div>
                    </td>

                    {/* Category & Year */}
                    <td className="p-3 text-text-muted">
                      <div>{project.category}</div>
                      <div className="text-[10px]">{project.year}</div>
                    </td>

                    {/* Gallery Images Count */}
                    <td className="p-3 font-mono text-[11px]">
                      {project.gallery?.length || 0} screens
                    </td>

                    {/* Status Toggle */}
                    <td className="p-3">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(project)}
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

                    {/* Contribution Verified */}
                    <td className="p-3">
                      {project.contribution_verified ? (
                        <span className="text-green-700 font-bold">✓ Verified</span>
                      ) : (
                        <span className="text-text-muted">Unverified</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="p-3 text-right pr-4 space-x-3">
                      <NextLink
                        href={`/admin/projects/${project.id}`}
                        className="text-foreground hover:underline font-bold"
                      >
                        Edit
                      </NextLink>
                      <button
                        type="button"
                        onClick={() => handleDuplicate(project)}
                        className="text-text-muted hover:text-foreground cursor-pointer"
                        title="Duplicate this project"
                      >
                        Copy
                      </button>
                      <button
                        type="button"
                        onClick={() => setProjectToDelete(project)}
                        className="text-red-600 hover:text-red-800 cursor-pointer"
                        title="Delete project"
                      >
                        Delete
                      </button>
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

      {/* Delete Confirmation Modal */}
      {projectToDelete && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-background border border-border max-w-md w-full p-6 rounded shadow-xl space-y-4">
            <div className="type-label text-xs font-mono text-red-600 tracking-wider">
              CONFIRM PERMANENT DELETION
            </div>
            <h3 className="font-serif text-2xl text-foreground">
              Delete &quot;{projectToDelete.title}&quot;?
            </h3>
            <p className="type-body text-xs text-text-muted">
              Are you sure you want to remove this project? This will permanently delete the record and remove its public case study page.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setProjectToDelete(null)}
                className="px-4 py-2 border border-border rounded font-mono text-xs hover:border-foreground"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded font-mono text-xs hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete Project"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
