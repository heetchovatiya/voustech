"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { Link } from "@/i18n/navigation";
import { useIsClient } from "@/hooks/useIsClient";

export function Logo({
  variant = "responsive",
}: {
  /** `lockup` always shows the full wordmark (e.g. footer). */
  variant?: "responsive" | "lockup";
}) {
  const { resolvedTheme } = useTheme();
  const isClient = useIsClient();

  const isDark = isClient && resolvedTheme === "dark";

  return (
    <Link
      href="/"
      className="flex items-center opacity-100 transition-opacity duration-150 hover:opacity-85 shrink-0"
      aria-label="VousTech home"
    >
      <Image
        src={isDark ? "/brand/logo-lockup-dark.png" : "/brand/logo-lockup-light.png"}
        alt="VousTech"
        width={180}
        height={54}
        priority
        className="h-9 sm:h-10 w-auto max-w-[150px] sm:max-w-[200px] object-contain"
      />
    </Link>
  );
}
