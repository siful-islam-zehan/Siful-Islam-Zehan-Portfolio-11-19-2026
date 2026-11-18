"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import NextLink from "next/link";
import { DbDevelopedWebsite, GalleryItem } from "@/lib/supabase/types";
import { saveDevelopedWebsite, deleteDevelopedWebsite } from "@/lib/admin-data-service";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { useToast } from "@/components/admin/Toast";

interface WebsiteFormProps {
  initialData?: DbDevelopedWebsite | null;
  isNew?: boolean;
}

export const WebsiteForm: React.FC<WebsiteFormProps> = ({
  initialData,
  isNew = false,
}) => {
  const router = useRouter();
  const { showToast } = useToast();

  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Form State
  const [title, setTitle] = useState(initialData?.title || "");
  const [liveUrl, setLiveUrl] = useState(initialData?.live_url || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [category, setCategory] = useState(
    initialData?.category || "Website / Digital Experience"
  );
  const [year, setYear] = useState(initialData?.year || "2024");
  const [myContribution, setMyContribution] = useState(
    initialData?.my_contribution || "To be confirmed"
  );
  const [techInput, setTechInput] = useState(
    initialData?.confirmed_technologies
      ? initialData.confirmed_technologies.join(", ")
      : ""
  );
  const [previewMode, setPreviewMode] = useState<"iframe" | "external" | "image">(
    initialData?.preview_mode || "iframe"
  );
  const [featured, setFeatured] = useState(initialData?.featured ?? true);
  const [orderIndex, setOrderIndex] = useState(initialData?.order_index || 1);
  const [status, setStatus] = useState<"draft" | "published">(
    initialData?.status || "draft"
  );
  const [contributionVerified, setContributionVerified] = useState(
    initialData?.contribution_verified || false
  );

  // Cover Image
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast("Title is required", "error");
      return;
    }
    if (!liveUrl.trim()) {
      showToast("Live URL is required", "error");
      return;
    }
    if (coverItems.length === 0 || !coverItems[0].url) {
      showToast("Cover image is required", "error");
      return;
    }

    setIsSaving(true);

    try {
      const techArray = techInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        id: initialData?.id,
        title: title.trim(),
        live_url: liveUrl.trim(),
        description: description.trim(),
        category: category.trim(),
        year: year.trim(),
        my_contribution: myContribution.trim(),
        confirmed_technologies: techArray,
        preview_mode: previewMode,
        featured,
        order_index: Number(orderIndex) || 1,
        status,
        contribution_verified: contributionVerified,
        cover_image: coverItems[0].url,
        screenshot_fallback: coverItems[0].url,
      };

      const saved = await saveDevelopedWebsite(payload);
      showToast(`Website "${saved.title}" saved successfully!`);
      router.push("/admin/websites");
    } catch (err: any) {
      showToast(err.message || "Failed to save website", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!initialData?.id) return;
    try {
      await deleteDevelopedWebsite(initialData.id);
      showToast(`Deleted website "${initialData.title}"`);
      router.push("/admin/websites");
    } catch (err: any) {
      showToast(err.message || "Failed to delete website", "error");
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="type-label text-[10px] font-mono text-text-muted tracking-widest uppercase mb-1">
            DIGITAL EXPERIENCES // CHAPTER 03
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-foreground">
            {isNew ? "New Developed Website" : title || "Edit Website"}
          </h1>
        </div>

        <NextLink
          href="/admin/websites"
          className="text-xs font-mono text-text-muted hover:text-foreground"
        >
          ← Back to Websites List
        </NextLink>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-background border border-border p-6 rounded">
          {/* Title */}
          <div className="space-y-1">
            <label className="type-label text-xs font-mono text-foreground">
              WEBSITE TITLE *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. NaijaRadar"
              className="w-full text-xs font-mono p-3 border border-border rounded bg-background focus:outline-none focus:ring-1 focus:ring-foreground"
            />
          </div>

          {/* Live URL */}
          <div className="space-y-1">
            <label className="type-label text-xs font-mono text-foreground">
              LIVE URL *
            </label>
            <input
              type="url"
              required
              value={liveUrl}
              onChange={(e) => setLiveUrl(e.target.value)}
              placeholder="https://..."
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
              placeholder="Website / Digital Experience, Mobile Application"
              className="w-full text-xs font-mono p-3 border border-border rounded bg-background focus:outline-none focus:ring-1 focus:ring-foreground"
            />
          </div>

          {/* Year */}
          <div className="space-y-1">
            <label className="type-label text-xs font-mono text-foreground">
              LAUNCH YEAR
            </label>
            <input
              type="text"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="2024"
              className="w-full text-xs font-mono p-3 border border-border rounded bg-background focus:outline-none focus:ring-1 focus:ring-foreground"
            />
          </div>

          {/* My Contribution */}
          <div className="space-y-1 md:col-span-2">
            <label className="type-label text-xs font-mono text-foreground">
              MY CONTRIBUTION (&quot;To be confirmed&quot; until verified)
            </label>
            <input
              type="text"
              value={myContribution}
              onChange={(e) => setMyContribution(e.target.value)}
              placeholder="To be confirmed"
              className="w-full text-xs font-mono p-3 border border-border rounded bg-background focus:outline-none focus:ring-1 focus:ring-foreground"
            />
          </div>

          {/* Technologies Tag Input */}
          <div className="space-y-1 md:col-span-2">
            <label className="type-label text-xs font-mono text-foreground">
              CONFIRMED TECHNOLOGIES (Comma-separated, only what you explicitly used)
            </label>
            <input
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              placeholder="HTML5, CSS3, JavaScript, Next.js, Tailwind CSS"
              className="w-full text-xs font-mono p-3 border border-border rounded bg-background focus:outline-none focus:ring-1 focus:ring-foreground"
            />
          </div>

          {/* Description */}
          <div className="space-y-1 md:col-span-2">
            <label className="type-label text-xs font-mono text-foreground">
              SYSTEM DESCRIPTION
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A digital discovery and content publication platform engineered for..."
              className="w-full text-xs font-mono p-3 border border-border rounded bg-background focus:outline-none focus:ring-1 focus:ring-foreground"
            />
          </div>
        </div>

        {/* Visibility & Preview Settings Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-[#F8F7F4] border border-border p-6 rounded">
          {/* Preview Mode */}
          <div className="space-y-2">
            <label className="type-label text-xs font-mono text-foreground block">
              PREVIEW MODE
            </label>
            <select
              value={previewMode}
              onChange={(e) =>
                setPreviewMode(e.target.value as "iframe" | "external" | "image")
              }
              className="w-full text-xs font-mono p-2.5 border border-border rounded bg-background"
            >
              <option value="iframe">Iframe (Sandboxed Mirror)</option>
              <option value="external">External (Direct Link / Store App)</option>
              <option value="image">Image Only (Static Fallback)</option>
            </select>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label className="type-label text-xs font-mono text-foreground block">
              STATUS
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

          {/* Order Index */}
          <div className="space-y-2">
            <label className="type-label text-xs font-mono text-foreground block">
              EXHIBITION ORDER
            </label>
            <input
              type="number"
              min={1}
              value={orderIndex}
              onChange={(e) => setOrderIndex(parseInt(e.target.value) || 1)}
              className="w-full text-xs font-mono p-2 border border-border rounded bg-background"
            />
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
            label="Live Interface Screenshot Cover *"
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border">
          <div>
            {!isNew && (
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="px-4 py-2.5 border border-red-300 text-red-600 hover:bg-red-50 rounded text-xs font-mono w-full sm:w-auto"
              >
                Delete Website
              </button>
            )}
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
            <NextLink
              href="/admin/websites"
              className="px-5 py-2.5 border border-border rounded text-xs font-mono hover:border-foreground"
            >
              Cancel
            </NextLink>

            <button
              type="submit"
              disabled={isSaving}
              className="px-8 py-2.5 bg-foreground text-background font-mono text-xs uppercase tracking-wider rounded hover:bg-neutral-800 disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? "Saving..." : isNew ? "Create Website Record →" : "Save Changes"}
            </button>
          </div>
        </div>
      </form>

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
              Are you sure you want to delete this developed website record?
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
                Yes, Delete Website
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
