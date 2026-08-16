#!/usr/bin/env python3
"""
convert-to-webp.py

Batch-converts images (PNG/JPG/JPEG/BMP/TIFF) in a folder to WebP,
optionally resizing them down to a max dimension first.

Requirements:
    pip install Pillow

Usage:
    python scripts/convert-to-webp.py <input_folder> [options]

Examples:
    # Convert everything in ./images, quality 80, no resizing
    python scripts/convert-to-webp.py ./images

    # Also cap the longest edge at 1000px (useful if source images are huge)
    python scripts/convert-to-webp.py ./images --max-dim 1000

    # Custom output folder and quality
    python scripts/convert-to-webp.py ./images --output ./optimized --quality 75

    # Overwrite files in place / delete originals after conversion
    python scripts/convert-to-webp.py ./images --delete-original
"""

import argparse
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("Pillow is not installed. Run: pip install Pillow")
    sys.exit(1)

SUPPORTED_EXTS = {".png", ".jpg", ".jpeg", ".bmp", ".tif", ".tiff"}


def human_size(num_bytes: int) -> str:
    for unit in ["B", "KB", "MB", "GB"]:
        if num_bytes < 1024:
            return f"{num_bytes:.1f} {unit}"
        num_bytes /= 1024
    return f"{num_bytes:.1f} TB"


def convert_image(src: Path, dest_dir: Path, quality: int, max_dim: int | None) -> tuple[int, int]:
    with Image.open(src) as img:
        # Preserve transparency if present
        if img.mode in ("RGBA", "LA", "P"):
            img = img.convert("RGBA")
        else:
            img = img.convert("RGB")

        if max_dim:
            w, h = img.size
            longest = max(w, h)
            if longest > max_dim:
                scale = max_dim / longest
                new_size = (round(w * scale), round(h * scale))
                img = img.resize(new_size, Image.LANCZOS)

        dest_dir.mkdir(parents=True, exist_ok=True)
        dest = dest_dir / (src.stem + ".webp")

        original_size = src.stat().st_size
        img.save(dest, "WEBP", quality=quality, method=6)
        new_size = dest.stat().st_size

    return original_size, new_size


def main():
    parser = argparse.ArgumentParser(description="Batch-convert images to WebP.")
    parser.add_argument("input", type=str, help="Folder containing images to convert")
    parser.add_argument("--output", type=str, default=None,
                         help="Output folder (default: <input>/webp)")
    parser.add_argument("--quality", type=int, default=80,
                         help="WebP quality 1-100 (default: 80)")
    parser.add_argument("--max-dim", type=int, default=None,
                         help="Max width/height in pixels; larger images are downscaled")
    parser.add_argument("--delete-original", action="store_true",
                         help="Delete the original file after successful conversion")
    args = parser.parse_args()

    input_dir = Path(args.input)
    if not input_dir.is_dir():
        print(f"Error: '{input_dir}' is not a folder.")
        sys.exit(1)

    output_dir = Path(args.output) if args.output else input_dir / "webp"

    files = [f for f in input_dir.iterdir() if f.suffix.lower() in SUPPORTED_EXTS]
    if not files:
        print(f"No supported images found in {input_dir} (looked for {sorted(SUPPORTED_EXTS)})")
        sys.exit(0)

    total_before = 0
    total_after = 0
    print(f"Converting {len(files)} image(s) → {output_dir}\n")

    for f in files:
        try:
            before, after = convert_image(f, output_dir, args.quality, args.max_dim)
            total_before += before
            total_after += after
            saved_pct = (1 - after / before) * 100 if before else 0
            print(f"  {f.name:40s} {human_size(before):>10s} → {human_size(after):>10s}  (-{saved_pct:.0f}%)")
            if args.delete_original:
                f.unlink()
        except Exception as e:
            print(f"  {f.name:40s} FAILED: {e}")

    print(f"\nTotal: {human_size(total_before)} → {human_size(total_after)}"
          f"  (saved {human_size(total_before - total_after)}, "
          f"{(1 - total_after / total_before) * 100:.0f}% smaller)" if total_before else "")


if __name__ == "__main__":
    main()
