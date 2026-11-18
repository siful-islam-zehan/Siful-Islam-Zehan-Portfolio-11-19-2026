"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import NextLink from "next/link";
import { DbDesignProject, GalleryItem } from "@/lib/supabase/types";
import { saveDesignProject, deleteDesignProject } from "@/lib/admin-data-service";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { useToast } from "@/components/admin/Toast";

interface ProjectFormProps {
  initialData?: DbDesignProject | null;
  isNew?: boolean;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({
  initialData,
  isNew = false,
}) => {
  const router = useRouter();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<"form" | "preview">("form");
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Form State
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [category, setCategory] = useState(initialData?.category || "UI/UX Design");
  const [year, setYear] = useState(initialData?.year || "2025");
  const [summary, setSummary] = useState(initialData?.summary || "");
  const [roleInput, setRoleInput] = useState(
    initialData?.role ? initialData.role.join(", ") : "To be confirmed"
  );
  const [externalUrl, setExternalUrl] = useState(initialData?.external_url || "");
  const [featured, setFeatured] = useState(initialData?.featured ?? true);
  const [featuredOrder, setFeaturedOrder] = useState(initialData?.featured_order || 1);
  const [status, setStatus] = useState<"draft" | "published">(
    initialData?.status || "draft"
  );
  const [contributionVerified, setContributionVerified] = useState(
    initialData?.contribution_verified || false
  );

  // Cover image item
  const [coverItems, setCoverItems] = useState<GalleryItem[]>(
    initialData?.cover_image
      ? [
          {
            id: "cover",
            url: initialData.cover_image,
            alt: `${initialData.title} Cover`,
            order: 1,
          },
        ]
      : []
  );

  // Gallery items
  const [gallery, setGallery] = useState<GalleryItem[]>(initialData?.gallery || []);

  // Auto-generate slug from title if new or slug is empty
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (isNew || !slug || slug === title.toLowerCase().replace(/[^a-z0-9]+/g, "-")) {
      const generated = val
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setSlug(generated);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast("Title is required", "error");
      return;
    }
    if (!slug.trim()) {
      showToast("Slug is required", "error");
      return;
    }
    if (coverItems.length === 0 || !coverItems[0].url) {
      showToast("Cover image is required", "error");
      return;
    }

    // Verify all gallery images have alt text
    const missingAlt = gallery.some((img) => !img.alt || img.alt.trim().length === 0);
    if (missingAlt) {
      showToast("Every gallery image must have descriptive Alt text for accessibility", "error");
      return;
    }

    setIsSaving(true);

    try {
      const roleArray = roleInput
        .split(",")
        .map((r) => r.trim())
        .filter(Boolean);

      const payload = {
        id: initialData?.id,
        title: title.trim(),
        slug: slug.trim(),
        category: category.trim(),
        year: year.trim(),
        summary: summary.trim(),
        role: roleArray.length > 0 ? roleArray : ["To be confirmed"],
        cover_image: coverItems[0].url,
        gallery,
        external_url: externalUrl.trim(),
        featured,
        featured_order: Number(featuredOrder) || 1,
        status,
        contribution_verified: contributionVerified,
      };

      const saved = await saveDesignProject(payload);
      showToast(`Project "${saved.title}" saved successfully!`);
      router.push("/admin/projects");
    } catch (err: any) {
      showToast(err.message || "Failed to save project", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!initialData?.id) return;
    try {
      await deleteDesignProject(initialData.id);
      showToast(`Deleted project "${initialData.title}"`);
      router.push("/admin/projects");
    } catch (err: any) {
      showToast(err.message || "Failed to delete project", "error");
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="type-label text-[10px] font-mono text-text-muted tracking-widest uppercase mb-1">
            {isNew ? "CREATE ARTIFACT" : `EDIT ARTIFACT // ${initialData?.slug}`}
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-foreground">
            {isNew ? "New Design Project" : title || "Edit Project"}
          </h1>
        </div>

        {/* Tab Toggle: Form vs Preview */}
        <div className="flex items-center gap-2 border border-border p-1 rounded bg-[#F8F7F4] font-mono text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("form")}
            className={`px-3 py-1.5 rounded transition-colors ${
              activeTab === "form" ? "bg-background text-foreground font-bold shadow-xs" : "text-text-muted hover:text-foreground"
            }`}
          >
            Editor Form
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={`px-3 py-1.5 rounded transition-colors ${
              activeTab === "preview" ? "bg-background text-foreground font-bold shadow-xs" : "text-text-muted hover:text-foreground"
            }`}
          >
            Live Card Preview
          </button>
        </div>
      </div>

      {/* VIEW A: EDITOR FORM */}
      {activeTab === "form" && (
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Main Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-background border border-border p-6 rounded">
            {/* Title */}
            <div className="space-y-1">
              <label className="type-label text-xs font-mono text-foreground">
                PROJECT TITLE *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Grandpool"
                className="w-full text-xs font-mono p-3 border border-border rounded bg-background focus:outline-none focus:ring-1 focus:ring-foreground"
              />
            </div>

            {/* Slug */}
            <div className="space-y-1">
              <label className="type-label text-xs font-mono text-foreground">
                URL SLUG * (/works/[slug])
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="grandpool"
                className="w-full text-xs font-mono p-3 border border-border rounded bg-background focus:outline-none focus:ring-1 focus:ring-foreground"
              />
            </div>

            {/* Category */}
            <div className="space-y-1">
              <label className="type-label text-xs font-mono text-foreground">
                CATEGORY
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="UI/UX Design, SaaS Dashboard, Product Design"
                className="w-full text-xs font-mono p-3 border border-border rounded bg-background focus:outline-none focus:ring-1 focus:ring-foreground"
              />
            </div>

            {/* Year */}
            <div className="space-y-1">
              <label className="type-label text-xs font-mono text-foreground">
                YEAR
              </label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="2025"
                className="w-full text-xs font-mono p-3 border border-border rounded bg-background focus:outline-none focus:ring-1 focus:ring-foreground"
              />
            </div>

            {/* Role Tags */}
            <div className="space-y-1 md:col-span-2">
              <label className="type-label text-xs font-mono text-foreground">
                ROLE / DISCIPLINES (Comma-separated)
              </label>
              <input
                type="text"
                value={roleInput}
                onChange={(e) => setRoleInput(e.target.value)}
                placeholder="UI/UX Design, Figma System, Interaction Architecture"
                className="w-full text-xs font-mono p-3 border border-border rounded bg-background focus:outline-none focus:ring-1 focus:ring-foreground"
              />
            </div>

            {/* Summary */}
            <div className="space-y-1 md:col-span-2">
              <label className="type-label text-xs font-mono text-foreground">
                EDITORIAL SUMMARY / DESCRIPTION
              </label>
              <textarea
                rows={3}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Architectural digital experience created for..."
                className="w-full text-xs font-mono p-3 border border-border rounded bg-background focus:outline-none focus:ring-1 focus:ring-foreground"
              />
            </div>

            {/* External URL */}
            <div className="space-y-1 md:col-span-2">
              <label className="type-label text-xs font-mono text-foreground">
                EXTERNAL LINK (Optional Behance, Figma or Demo URL)
              </label>
              <input
                type="url"
                value={externalUrl}
                onChange={(e) => setExternalUrl(e.target.value)}
                placeholder="https://behance.net/gallery/..."
                className="w-full text-xs font-mono p-3 border border-border rounded bg-background focus:outline-none focus:ring-1 focus:ring-foreground"
              />
            </div>
          </div>

          {/* Visibility & Settings Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-[#F8F7F4] border border-border p-6 rounded">
            {/* Status */}
            <div className="space-y-2">
              <label className="type-label text-xs font-mono text-foreground block">
                PUBLISHING STATUS
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "draft" | "published")}
                className="w-full text-xs font-mono p-2.5 border border-border rounded bg-background"
              >
                <option value="draft">Draft (Private)</option>
                <option value="published">Published (Public)</option>
              </select>
            </div>

            {/* Featured Order */}
            <div className="space-y-2">
              <label className="type-label text-xs font-mono text-foreground block">
                FEATURED ORDER
              </label>
              <input
                type="number"
                min={1}
                value={featuredOrder}
                onChange={(e) => setFeaturedOrder(parseInt(e.target.value) || 1)}
                className="w-full text-xs font-mono p-2 border border-border rounded bg-background"
              >
              </input>
            </div>

            {/* Featured Toggle */}
            <div className="flex items-center gap-2 pt-6">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-mono select-none">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded border-border accent-foreground"
                />
                Feature in Selected Works
              </label>
            </div>

            {/* Contribution Verified */}
            <div className="flex items-center gap-2 pt-6">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-mono select-none">
                <input
                  type="checkbox"
                  checked={contributionVerified}
                  onChange={(e) => setContributionVerified(e.target.checked)}
                  className="rounded border-border accent-foreground"
                />
                Contribution Verified
              </label>
            </div>
          </div>

          {/* Cover Image Uploader */}
          <div className="bg-background border border-border p-6 rounded space-y-4">
            <ImageUploader
              images={coverItems}
              onChange={setCoverItems}
              isCoverOnly={true}
              maxImages={1}
              label="Primary Cover Image *"
            />
          </div>

          {/* Gallery Images Uploader */}
          <div className="bg-background border border-border p-6 rounded space-y-4">
            <ImageUploader
              images={gallery}
              onChange={setGallery}
              maxImages={12}
              label="Case Study Gallery Screens (Orderable)"
            />
          </div>

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {!isNew && (
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(true)}
                  className="px-4 py-2.5 border border-red-300 text-red-600 hover:bg-red-50 rounded text-xs font-mono w-full sm:w-auto"
                >
                  Delete Project
                </button>
              )}
            </div>

            <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
              <NextLink
                href="/admin/projects"
                className="px-5 py-2.5 border border-border rounded text-xs font-mono hover:border-foreground"
              >
                Cancel
              </NextLink>

              <button
                type="submit"
                disabled={isSaving}
                className="px-8 py-2.5 bg-foreground text-background font-mono text-xs uppercase tracking-wider rounded hover:bg-neutral-800 disabled:opacity-50 cursor-pointer"
              >
                {isSaving ? "Saving..." : isNew ? "Create Project →" : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* VIEW B: LIVE CARD PREVIEW */}
      {activeTab === "preview" && (
        <div className="space-y-6">
          <div className="p-4 bg-[#F8F7F4] border border-border rounded font-mono text-xs text-text-muted flex justify-between items-center">
            <span>LIVE EXHIBITION CARD SIMULATION</span>
            <span>STATUS: {status.toUpperCase()}</span>
          </div>

          {/* Render Card exactly as it appears in SelectedWorks */}
          <div className="max-w-3xl mx-auto border border-border bg-background p-6 sm:p-10 rounded">
            <div className="space-y-6">
              <div className="relative aspect-[16/10] bg-neutral-200 rounded overflow-hidden border border-border">
                {coverItems[0]?.url ? (
                  <Image
                    src={coverItems[0].url}
                    alt={title || "Project preview"}
                    fill
                    className="object-cover"
                    unoptimized={coverItems[0].url.startsWith("blob:")}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-mono text-xs text-text-muted">
                    [No Cover Image Uploaded]
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-mono text-text-muted mb-2">
                  <span>01 // {category.toUpperCase()}</span>
                  <span>{year}</span>
                </div>
                <h3 className="font-serif text-3xl sm:text-4xl text-foreground font-normal">
                  {title || "Untitled Project"}
                </h3>
                <p className="type-body text-xs text-text-muted mt-2">
                  {summary || "No description entered."}
                </p>
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-between font-mono text-xs text-text-muted">
                <div>
                  ROLES: {roleInput || "To be confirmed"}
                </div>
                <div>
                  {contributionVerified ? "✓ Verified" : "Unverified"}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
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
              Delete &quot;{title}&quot;?
            </h3>
            <p className="type-body text-xs text-text-muted">
              Are you sure you want to permanently delete this project?
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-border rounded font-mono text-xs hover:border-foreground"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded font-mono text-xs hover:bg-red-700"
              >
                Yes, Delete Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
