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
  const lockup = isDark ? "/brand/logo-lockup-dark.png" : "/brand/logo-lockup-light.png";
  const lockupOnly = variant === "lockup";

  return (
    <Link
      href="/"
      className="flex items-center opacity-100 transition-opacity duration-150 hover:opacity-80"
      aria-label="VousTech home"
    >
      <Image
        src={lockup}
        alt="VousTech"
        width={192}
        height={108}
        priority={!lockupOnly}
        className={lockupOnly ? "h-10 w-auto" : "hidden h-9 w-auto sm:block"}
      />
      {!lockupOnly && (
        <Image
          src="/brand/logo-mark.png"
          alt="VousTech"
          width={100}
          height={83}
          priority
          className="h-8 w-auto sm:hidden"
        />
      )}
    </Link>
  );
}
