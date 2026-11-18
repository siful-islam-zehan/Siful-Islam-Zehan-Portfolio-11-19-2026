"use client";

import React, { useEffect, useState } from "react";
import NextLink from "next/link";
import Image from "next/image";
import {
  fetchAllDevelopedWebsites,
  saveDevelopedWebsite,
  deleteDevelopedWebsite,
} from "@/lib/admin-data-service";
import { DbDevelopedWebsite } from "@/lib/supabase/types";
import { useToast } from "@/components/admin/Toast";

export default function DevelopedWebsitesListPage() {
  const [websites, setWebsites] = useState<DbDevelopedWebsite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [websiteToDelete, setWebsiteToDelete] = useState<DbDevelopedWebsite | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { showToast } = useToast();

  const loadWebsites = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAllDevelopedWebsites();
      setWebsites(data);
    } catch {
      showToast("Failed to load developed websites", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWebsites();
  }, []);

  const handleToggleStatus = async (website: DbDevelopedWebsite) => {
    const nextStatus = website.status === "published" ? "draft" : "published";
    try {
      await saveDevelopedWebsite({
        id: website.id,
        title: website.title,
        live_url: website.live_url,
        status: nextStatus,
      });
      setWebsites((prev) =>
        prev.map((w) => (w.id === website.id ? { ...w, status: nextStatus } : w))
      );
      showToast(`Website "${website.title}" set to ${nextStatus.toUpperCase()}`);
    } catch (err: any) {
      showToast(err.message || "Failed to update status", "error");
    }
  };

  const handleDuplicate = async (website: DbDevelopedWebsite) => {
    try {
      const duplicated = await saveDevelopedWebsite({
        title: `${website.title} (Copy)`,
        description: website.description,
        live_url: website.live_url,
        cover_image: website.cover_image,
        category: website.category,
        my_contribution: website.my_contribution,
        confirmed_technologies: website.confirmed_technologies,
        year: website.year,
        preview_mode: website.preview_mode,
        featured: website.featured,
        order_index: websites.length + 1,
        status: "draft",
        contribution_verified: website.contribution_verified,
      });
      setWebsites((prev) => [...prev, duplicated]);
      showToast(`Duplicated "${duplicated.title}" as draft`);
    } catch (err: any) {
      showToast(err.message || "Duplication failed", "error");
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === websites.length - 1)
    ) {
      return;
    }
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const reordered = [...websites];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    const updatedList = reordered.map((w, idx) => ({ ...w, order_index: idx + 1 }));
    setWebsites(updatedList);

    try {
      await Promise.all(
        updatedList.map((w) =>
          saveDevelopedWebsite({ id: w.id, title: w.title, live_url: w.live_url, order_index: w.order_index })
        )
      );
      showToast("Exhibition order updated");
    } catch {
      showToast("Failed to persist order", "error");
    }
  };

  const confirmDelete = async () => {
    if (!websiteToDelete) return;
    setIsDeleting(true);
    try {
      await deleteDevelopedWebsite(websiteToDelete.id);
      setWebsites((prev) => prev.filter((w) => w.id !== websiteToDelete.id));
      showToast(`Deleted "${websiteToDelete.title}"`);
      setWebsiteToDelete(null);
    } catch (err: any) {
      showToast(err.message || "Failed to delete website", "error");
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
            DIGITAL EXPERIENCES // CHAPTER 03
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-foreground">
            Developed Websites &amp; Systems
          </h1>
          <p className="type-body text-xs text-text-muted mt-1">
            Live client builds, interactive browser mirrors, and mobile applications.
          </p>
        </div>

        <NextLink
          href="/admin/websites/new"
          className="min-h-[40px] px-5 py-2.5 bg-foreground text-background font-mono text-xs uppercase tracking-wider rounded hover:bg-neutral-800 transition-colors inline-flex items-center gap-2 self-start sm:self-auto"
        >
          <span>+</span>
          <span>New Website</span>
        </NextLink>
      </div>

      {/* Websites Table */}
      <div className="border border-border rounded overflow-hidden bg-background">
        {isLoading ? (
          <div className="p-12 text-center text-xs font-mono text-text-muted">
            Loading developed websites...
          </div>
        ) : websites.length === 0 ? (
          <div className="p-12 text-center text-xs font-mono text-text-muted space-y-3">
            <p>No developed websites recorded.</p>
            <NextLink
              href="/admin/websites/new"
              className="inline-block px-4 py-2 border border-border rounded text-foreground hover:border-foreground"
            >
              + Add a website
            </NextLink>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-[#F8F7F4] border-b border-border text-text-muted">
                <tr>
                  <th className="p-3 pl-4 w-12 text-center">ORDER</th>
                  <th className="p-3">COVER</th>
                  <th className="p-3">TITLE / LIVE URL</th>
                  <th className="p-3">PREVIEW MODE</th>
                  <th className="p-3">TECHNOLOGIES</th>
                  <th className="p-3">STATUS</th>
                  <th className="p-3 text-right pr-4">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {websites.map((website, idx) => (
                  <tr key={website.id} className="hover:bg-neutral-50/50 transition-colors">
                    {/* Reorder Arrows */}
                    <td className="p-3 pl-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMove(idx, "up")}
                          className="text-[10px] p-1 border border-border rounded disabled:opacity-20 hover:bg-neutral-100"
                        >
                          ▲
                        </button>
                        <span className="text-[10px] text-text-muted font-bold">#{idx + 1}</span>
                        <button
                          type="button"
                          disabled={idx === websites.length - 1}
                          onClick={() => handleMove(idx, "down")}
                          className="text-[10px] p-1 border border-border rounded disabled:opacity-20 hover:bg-neutral-100"
                        >
                          ▼
                        </button>
                      </div>
                    </td>

                    {/* Cover Thumbnail */}
                    <td className="p-3">
                      <div className="relative w-14 h-11 bg-neutral-200 rounded overflow-hidden border border-border">
                        {website.cover_image && (
                          <Image
                            src={website.cover_image}
                            alt={website.title}
                            fill
                            className="object-cover"
                            unoptimized={website.cover_image.startsWith("blob:")}
                          />
                        )}
                      </div>
                    </td>

                    {/* Title & Live URL */}
                    <td className="p-3">
                      <div className="font-sans font-semibold text-foreground text-sm">
                        {website.title}
                      </div>
                      <a
                        href={website.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-text-muted hover:text-foreground underline truncate max-w-[200px] block"
                      >
                        {website.live_url}
                      </a>
                    </td>

                    {/* Preview Mode */}
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded border border-border bg-[#F8F7F4] text-[10px] uppercase font-bold">
                        {website.preview_mode}
                      </span>
                    </td>

                    {/* Technologies */}
                    <td className="p-3 text-text-muted text-[11px] max-w-[180px]">
                      {website.confirmed_technologies?.join(", ") || "None"}
                    </td>

                    {/* Status */}
                    <td className="p-3">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(website)}
                        className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase transition-colors cursor-pointer border ${
                          website.status === "published"
                            ? "bg-green-100 text-green-800 border-green-300 hover:bg-green-200"
                            : "bg-neutral-200 text-neutral-800 border-neutral-300 hover:bg-neutral-300"
                        }`}
                        title="Click to toggle status"
                      >
                        {website.status}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="p-3 text-right pr-4 space-x-3">
                      <NextLink
                        href={`/admin/websites/${website.id}`}
                        className="text-foreground hover:underline font-bold"
                      >
                        Edit
                      </NextLink>
                      <button
                        type="button"
                        onClick={() => handleDuplicate(website)}
                        className="text-text-muted hover:text-foreground cursor-pointer"
                        title="Duplicate record"
                      >
                        Copy
                      </button>
                      <button
                        type="button"
                        onClick={() => setWebsiteToDelete(website)}
                        className="text-red-600 hover:text-red-800 cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {websiteToDelete && (
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
              Delete &quot;{websiteToDelete.title}&quot;?
            </h3>
            <p className="type-body text-xs text-text-muted">
              Are you sure you want to remove this developed website record?
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setWebsiteToDelete(null)}
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
                {isDeleting ? "Deleting..." : "Yes, Delete Record"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
