/**
 * Client-side helper to convert any image file (PNG/JPG/JPEG/BMP) to WebP format
 * with dimension scaling and quality compression before upload.
 */
export async function convertImageToWebP(
  file: File,
  options: { quality?: number; maxDim?: number } = {}
): Promise<File> {
  const { quality = 0.8, maxDim = 1600 } = options;

  // If already svg, don't convert vector graphics
  if (file.type === "image/svg+xml" || file.name.endsWith(".svg")) {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;

        if (maxDim && Math.max(width, height) > maxDim) {
          const scale = maxDim / Math.max(width, height);
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }
            const cleanBase = file.name.replace(/\.[^/.]+$/, "");
            const webpFile = new File([blob], `${cleanBase}.webp`, {
              type: "image/webp",
              lastModified: Date.now(),
            });
            resolve(webpFile);
          },
          "image/webp",
          quality
        );
      };
      img.onerror = () => resolve(file);
      img.src = reader.result as string;
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}
