"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useIsClient } from "@/hooks/useIsClient";

export function HeroSignalMark() {
  const { resolvedTheme } = useTheme();
  const isClient = useIsClient();
  const isDark = isClient && resolvedTheme === "dark";
  const src = isDark ? "/brand/logo-mark.png" : "/brand/voustech-mark.png";

  return (
    <Image
      key={src}
      src={src}
      alt=""
      width={160}
      height={160}
      priority
      className={`hero-signal-logo size-28 object-contain sm:size-32 ${
        // Dark asset is tighter in-frame; scale down to match light mark padding.
        isDark ? "scale-[0.72]" : ""
      }`}
    />
  );
}
