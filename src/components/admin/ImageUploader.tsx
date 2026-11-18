"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { processAndConvertToWebp, validateImageFile } from "@/lib/image-processing";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { GalleryItem } from "@/lib/supabase/types";

interface ImageUploaderProps {
  images: GalleryItem[];
  onChange: (images: GalleryItem[]) => void;
  maxImages?: number;
  label?: string;
  isCoverOnly?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  images,
  onChange,
  maxImages = 12,
  label = "Project Gallery Images",
  isCoverOnly = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressMsg, setProgressMsg] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isConfigured = isSupabaseConfigured();

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setErrorMessage(null);
    setIsProcessing(true);

    const newItems: GalleryItem[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const validation = validateImageFile(file);
      if (!validation.valid) {
        setErrorMessage(validation.error || "Invalid file format");
        continue;
      }

      try {
        setProgressMsg(`Optimizing & converting ${file.name} to WebP...`);
        const processed = await processAndConvertToWebp(file);

        let finalUrl = "";

        if (isConfigured) {
          // Upload to Supabase Storage bucket: portfolio-images
          const supabase = createClient();
          if (supabase) {
            setProgressMsg(`Uploading ${processed.fileName} to Supabase Storage...`);
            const filePath = `projects/${Date.now()}-${processed.fileName}`;
            const { error: uploadError } = await supabase.storage
              .from("portfolio-images")
              .upload(filePath, processed.fullBlob, {
                contentType: "image/webp",
                cacheControl: "31536000",
                upsert: false,
              });

            if (uploadError) {
              throw new Error(`Storage upload error: ${uploadError.message}`);
            }

            const { data: publicUrlData } = supabase.storage
              .from("portfolio-images")
              .getPublicUrl(filePath);

            finalUrl = publicUrlData.publicUrl;
          }
        } else {
          // Offline / Local preview fallback: Convert blob to object URL
          finalUrl = URL.createObjectURL(processed.fullBlob);
        }

        const id = Math.random().toString(36).substring(2, 9);
        newItems.push({
          id,
          url: finalUrl,
          alt: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
          caption: "",
          isDeviceMockup: false,
          order: images.length + newItems.length + 1,
        });
      } catch (err: any) {
        setErrorMessage(err.message || "Failed to process image");
      }
    }

    if (newItems.length > 0) {
      if (isCoverOnly) {
        onChange([newItems[0]]);
      } else {
        onChange([...images, ...newItems].slice(0, maxImages));
      }
    }

    setIsProcessing(false);
    setProgressMsg(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const updateItem = (index: number, updates: Partial<GalleryItem>) => {
    const updated = [...images];
    updated[index] = { ...updated[index], ...updates };
    onChange(updated);
  };

  const removeItem = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated.map((item, idx) => ({ ...item, order: idx + 1 })));
  };

  const moveItem = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === images.length - 1)
    ) {
      return;
    }
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const updated = [...images];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    onChange(updated.map((item, idx) => ({ ...item, order: idx + 1 })));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="type-label text-xs uppercase tracking-wider text-foreground">
          {label} ({images.length}/{maxImages})
        </label>
        <span className="font-mono text-[11px] text-text-muted">
          JPG / PNG / WebP • Max 10MB • Auto-resized to 2400px WebP
        </span>
      </div>

      {/* Drag & Drop Dropzone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded p-6 sm:p-8 text-center cursor-pointer transition-colors ${
          isDragging
            ? "border-foreground bg-neutral-200/40"
            : "border-border hover:border-foreground/50 bg-[#F8F7F4]"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple={!isCoverOnly}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-2">
          <span className="font-mono text-2xl text-text-muted">↑</span>
          <p className="type-label text-xs text-foreground">
            {isProcessing ? progressMsg : "DRAG & DROP IMAGES HERE, OR CLICK TO BROWSE"}
          </p>
          <p className="font-mono text-[10px] text-text-muted">
            All images are converted to WebP on your device before transfer. SVG/HTML rejected.
          </p>
        </div>
      </div>

      {/* Error Feedback */}
      {errorMessage && (
        <div className="p-3 bg-red-100 border border-red-300 text-red-800 text-xs font-mono rounded">
          ✕ {errorMessage}
        </div>
      )}

      {/* Uploaded Images List with Reordering & Alt Text */}
      {images.length > 0 && (
        <div className="space-y-3 pt-2">
          {images.map((item, idx) => (
            <div
              key={item.id || idx}
              className="p-3 sm:p-4 bg-background border border-border rounded flex flex-col sm:flex-row items-start sm:items-center gap-4"
            >
              {/* Thumbnail */}
              <div className="relative w-20 h-16 sm:w-24 sm:h-20 bg-neutral-200 rounded overflow-hidden flex-shrink-0 border border-border">
                <Image
                  src={item.url}
                  alt={item.alt || "Uploaded preview"}
                  fill
                  className="object-cover"
                  unoptimized={item.url.startsWith("blob:")}
                />
              </div>

              {/* Alt Text & Caption Form */}
              <div className="flex-1 w-full space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-text-muted">#{idx + 1}</span>
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Required Alt Text (e.g. Dashboard navigation workflow screen)"
                      value={item.alt || ""}
                      onChange={(e) => updateItem(idx, { alt: e.target.value })}
                      required
                      className={`w-full text-xs font-mono p-2 border rounded bg-background focus:outline-none focus:ring-1 ${
                        !item.alt || item.alt.trim().length === 0
                          ? "border-red-400 focus:ring-red-500"
                          : "border-border focus:ring-foreground"
                      }`}
                    />
                  </div>
                </div>

                {!isCoverOnly && (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <input
                      type="text"
                      placeholder="Optional caption / storytelling context"
                      value={item.caption || ""}
                      onChange={(e) => updateItem(idx, { caption: e.target.value })}
                      className="flex-1 text-xs font-mono p-2 border border-border rounded bg-background focus:outline-none focus:ring-1 focus:ring-foreground"
                    />

                    <label className="flex items-center gap-2 cursor-pointer select-none text-[11px] font-mono text-text-muted">
                      <input
                        type="checkbox"
                        checked={item.isDeviceMockup || false}
                        onChange={(e) => updateItem(idx, { isDeviceMockup: e.target.checked })}
                        className="rounded border-border accent-foreground"
                      />
                      Device Mockup Frame
                    </label>
                  </div>
                )}
              </div>

              {/* Reordering & Delete Controls */}
              <div className="flex sm:flex-col items-center gap-1 self-end sm:self-center">
                {!isCoverOnly && (
                  <div className="flex sm:flex-col gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveItem(idx, "up")}
                      className="px-2 py-1 text-xs font-mono border border-border rounded disabled:opacity-30 hover:bg-neutral-100"
                      title="Move Image Up"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      disabled={idx === images.length - 1}
                      onClick={() => moveItem(idx, "down")}
                      className="px-2 py-1 text-xs font-mono border border-border rounded disabled:opacity-30 hover:bg-neutral-100"
                      title="Move Image Down"
                    >
                      ▼
                    </button>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => removeItem(idx)}
                  className="px-2 py-1 text-xs font-mono text-red-600 hover:text-red-800 border border-red-200 hover:border-red-400 rounded"
                  title="Remove Image"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
