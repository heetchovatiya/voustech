"use client";

import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/icons/Icon";
import { useIsClient } from "@/hooks/useIsClient";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const t = useTranslations("nav");
  const isClient = useIsClient();

  const isDark = isClient && resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label={t("toggleTheme")}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`flex size-9 items-center justify-center rounded-sm border border-line text-ink transition-colors duration-150 hover:border-tech-blue hover:text-tech-blue ${className}`}
    >
      {isClient && <Icon name={isDark ? "sun" : "moon"} size={18} />}
    </button>
  );
}
