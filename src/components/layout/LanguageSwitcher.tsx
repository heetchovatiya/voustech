"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type AppLocale } from "@/i18n/routing";
import { Icon } from "@/components/icons/Icon";

/** Native names — add an entry when you add a locale to routing. */
const localeLabels: Record<string, string> = {
  en: "English",
  fr: "Français",
};

function labelFor(locale: string) {
  return localeLabels[locale] ?? locale.toUpperCase();
}

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;

    function onPointerDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function selectLocale(next: AppLocale) {
    setOpen(false);
    if (next === locale) return;
    router.replace(pathname, { locale: next });
  }

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        aria-label={t("language")}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex h-9 items-center gap-1.5 rounded-sm border px-2.5 font-mono text-label uppercase tracking-[0.06em] transition-colors duration-150 ${
          open
            ? "border-tech-blue bg-tech-blue/10 text-tech-blue"
            : "border-line text-ink hover:border-tech-blue hover:text-tech-blue"
        }`}
      >
        <Icon name="language" size={15} className="shrink-0 opacity-80" />
        <span>{locale}</span>
        <Icon
          name="chevron-down"
          size={14}
          className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <div
        id={listId}
        role="menu"
        aria-label={t("language")}
        hidden={!open}
        className={`absolute right-0 top-[calc(100%+0.35rem)] z-50 min-w-[10.5rem] overflow-hidden rounded-sm border border-line bg-base py-1 shadow-lg ${
          open ? "block" : "hidden"
        }`}
      >
        {routing.locales.map((loc) => {
          const active = loc === locale;
          return (
            <button
              key={loc}
              type="button"
              role="menuitem"
              aria-current={active ? "true" : undefined}
              onClick={() => selectLocale(loc)}
              className={`flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-body-sm transition-colors duration-150 ${
                active
                  ? "bg-tech-blue/10 text-tech-blue"
                  : "text-ink hover:bg-surface hover:text-tech-blue"
              }`}
            >
              <span className="font-medium normal-case">{labelFor(loc)}</span>
              <span className="font-mono text-label uppercase tracking-[0.08em] text-ink-muted">
                {loc}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
