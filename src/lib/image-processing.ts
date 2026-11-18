/**
 * Client-Side Image Processing & WebP Conversion Utility
 * Performs validation, dimension scaling, and canvas WebP conversion before uploading.
 */

export interface ProcessedImageResult {
  fullBlob: Blob;
  thumbBlob: Blob;
  width: number;
  height: number;
  fileName: string;
}

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_RAW_BYTES = 10 * 1024 * 1024; // 10 MB
const MAX_FULL_WIDTH = 2400;
const MAX_THUMB_WIDTH = 800;

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // Reject SVG / HTML / scripts explicitly
  if (
    file.type === "image/svg+xml" ||
    file.type === "text/html" ||
    file.name.toLowerCase().endsWith(".svg") ||
    file.name.toLowerCase().endsWith(".html") ||
    file.name.toLowerCase().endsWith(".htm")
  ) {
    return {
      valid: false,
      error: "SVG and HTML files are strictly prohibited for security. Please upload JPG, PNG, or WebP.",
    };
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Unsupported image format (${file.type || "unknown"}). Allowed formats: JPG, PNG, WebP.`,
    };
  }

  if (file.size > MAX_RAW_BYTES) {
    return {
      valid: false,
      error: `File is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). Maximum allowed size is 10 MB.`,
    };
  }

  return { valid: true };
}

/**
 * Resizes an image file and converts it to WebP in the browser
 */
export async function processAndConvertToWebp(file: File): Promise<ProcessedImageResult> {
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read image file."));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Failed to decode image data."));
      img.onload = () => {
        try {
          const origWidth = img.naturalWidth || img.width;
          const origHeight = img.naturalHeight || img.height;

          // 1. Calculate Full Size Dimensions (Max 2400px width)
          let fullWidth = origWidth;
          let fullHeight = origHeight;
          if (fullWidth > MAX_FULL_WIDTH) {
            fullHeight = Math.round((fullHeight * MAX_FULL_WIDTH) / fullWidth);
            fullWidth = MAX_FULL_WIDTH;
          }

          const fullCanvas = document.createElement("canvas");
          fullCanvas.width = fullWidth;
          fullCanvas.height = fullHeight;
          const fullCtx = fullCanvas.getContext("2d");
          if (!fullCtx) throw new Error("Could not initialize canvas context");
          fullCtx.imageSmoothingEnabled = true;
          fullCtx.imageSmoothingQuality = "high";
          fullCtx.drawImage(img, 0, 0, fullWidth, fullHeight);

          // 2. Calculate Thumbnail Dimensions (Max 800px width)
          let thumbWidth = origWidth;
          let thumbHeight = origHeight;
          if (thumbWidth > MAX_THUMB_WIDTH) {
            thumbHeight = Math.round((thumbHeight * MAX_THUMB_WIDTH) / thumbWidth);
            thumbWidth = MAX_THUMB_WIDTH;
          }

          const thumbCanvas = document.createElement("canvas");
          thumbCanvas.width = thumbWidth;
          thumbCanvas.height = thumbHeight;
          const thumbCtx = thumbCanvas.getContext("2d");
          if (!thumbCtx) throw new Error("Could not initialize thumbnail canvas context");
          thumbCtx.imageSmoothingEnabled = true;
          thumbCtx.imageSmoothingQuality = "high";
          thumbCtx.drawImage(img, 0, 0, thumbWidth, thumbHeight);

          // 3. Export to WebP Blobs
          fullCanvas.toBlob(
            (fullBlob) => {
              if (!fullBlob) return reject(new Error("WebP conversion failed for full image"));

              thumbCanvas.toBlob(
                (thumbBlob) => {
                  if (!thumbBlob) return reject(new Error("WebP conversion failed for thumbnail"));

                  const baseName = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
                  const cleanName = baseName.toLowerCase().replace(/[^a-z0-9_-]/g, "-");
                  const webpFileName = `${cleanName}-${Date.now()}.webp`;

                  resolve({
                    fullBlob,
                    thumbBlob,
                    width: fullWidth,
                    height: fullHeight,
                    fileName: webpFileName,
                  });
                },
                "image/webp",
                0.85
              );
            },
            "image/webp",
            0.9
          );
        } catch (err: any) {
          reject(new Error(err.message || "Canvas processing error"));
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
