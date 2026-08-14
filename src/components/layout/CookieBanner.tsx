"use client";

import { useState, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const STORAGE_KEY = "voustech-cookie-consent";

function subscribe() {
  return () => {};
}

export function CookieBanner() {
  const t = useTranslations("system");
  // Defer until client mount so SSR doesn't paint a banner that then vanishes
  // for returning visitors (CLS) or leave focusable UI in a mismatched tree.
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const hasConsent = useSyncExternalStore(
    subscribe,
    () => window.localStorage.getItem(STORAGE_KEY) !== null,
    () => true
  );
  const [dismissed, setDismissed] = useState(false);

  function dismiss() {
    window.localStorage.setItem(STORAGE_KEY, "accepted");
    setDismissed(true);
  }

  if (!mounted || hasConsent || dismissed) return null;

  return (
    <div
      role="status"
      className="fixed inset-x-4 bottom-4 z-50 flex flex-col gap-3 rounded-sm border border-line bg-surface p-4 shadow-lg sm:inset-x-auto sm:left-4 sm:max-w-sm sm:flex-row sm:items-center"
    >
      <p className="flex-1 text-body-sm text-ink">{t("cookieNotice")}</p>
      <div className="flex gap-3">
        <Link
          href="/legal/cookies"
          aria-label="Read our Cookie Policy"
          className="text-body-sm text-tech-blue underline underline-offset-2 transition-colors duration-150 hover:text-deep-ocean"
        >
          {t("cookieLearnMore")}
        </Link>
        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 rounded-sm bg-cta px-3 py-1.5 text-body-sm font-semibold text-cta-ink shadow-[inset_0_1px_0_0_rgba(255,255,255,0.14)] transition-[background-color,transform,box-shadow] duration-200 ease-out hover:bg-cta-hover hover:shadow-[0_6px_18px_-8px_color-mix(in_srgb,var(--color-deep-ocean)_70%,transparent)] active:translate-y-px"
        >
          {t("cookieAccept")}
        </button>
      </div>
    </div>
  );
}
