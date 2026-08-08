"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Icon } from "@/components/icons/Icon";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { getServicesByCategory } from "@/content/services";

const grouped = getServicesByCategory();

export function ServicesDesktopNav() {
  const t = useTranslations("nav");
  const tServices = useTranslations("services");
  const categoryLabels = tServices.raw("categories") as Record<string, string>;
  const pathname = usePathname();
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const active = pathname === "/services" || pathname.startsWith("/services/");

  function clearCloseTimer() {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }

  function show() {
    clearCloseTimer();
    setOpen(true);
  }

  function hide(delay = 140) {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => setOpen(false), delay);
  }

  useEffect(() => () => clearCloseTimer(), []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <div
        className="relative"
        onMouseEnter={show}
        onMouseLeave={() => hide()}
        onFocusCapture={show}
        onBlurCapture={(e) => {
          // Keep open while focus moves into the fixed panel.
          const next = e.relatedTarget as Node | null;
          if (next && document.getElementById(panelId)?.contains(next)) return;
          hide(0);
        }}
      >
        <Link
          href="/services"
          aria-expanded={open}
          aria-controls={panelId}
          aria-haspopup="true"
          aria-current={active ? "page" : undefined}
          className={`inline-flex items-center gap-1 text-body-sm font-medium transition-colors duration-150 ${
            active || open ? "text-tech-blue" : "text-ink hover:text-tech-blue"
          }`}
        >
          {t("services")}
          <Icon
            name="chevron-down"
            size={14}
            className={`transition-transform duration-150 ${open ? "rotate-180" : ""}`}
          />
        </Link>
      </div>

      {/* Fixed full-bleed panel — outside blur header so layout stays viewport-aligned. */}
      <div
        id={panelId}
        role="region"
        aria-label={t("servicesMenu")}
        onMouseEnter={show}
        onMouseLeave={() => hide()}
        onFocusCapture={show}
        onBlurCapture={(e) => {
          const next = e.relatedTarget as Node | null;
          if (next && (e.currentTarget.contains(next) || e.relatedTarget === null)) return;
          hide(0);
        }}
        inert={!open}
        className={`fixed inset-x-0 top-16 z-50 transition-[opacity,visibility] duration-150 ${
          open
            ? "visible opacity-100"
            : "invisible pointer-events-none opacity-0"
        }`}
      >
        <div className="border-b border-line bg-base/98 shadow-xl backdrop-blur-sm">
          <Container className="py-6 lg:py-7">
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-12 xl:gap-6">
              {grouped.map((category) => {
                const wide = category.id === "infrastructure-growth";
                return (
                  <section
                    key={category.id}
                    aria-labelledby={`mega-${category.id}`}
                    className={
                      wide
                        ? "sm:col-span-2 xl:col-span-4"
                        : category.id === "design-branding"
                          ? "xl:col-span-2"
                          : "xl:col-span-3"
                    }
                  >
                    <h3
                      id={`mega-${category.id}`}
                      className="border-b border-line pb-2 font-mono text-label uppercase tracking-[0.12em] text-tech-blue"
                    >
                      {categoryLabels[category.labelKey]}
                    </h3>
                    <ul
                      className={`mt-2.5 ${
                        wide ? "grid gap-x-3 sm:grid-cols-2" : "flex flex-col"
                      }`}
                    >
                      {category.services.map((service) => {
                        const href = `/services/${service.slug}`;
                        const isCurrent = pathname === href;
                        return (
                          <li key={service.slug}>
                            <Link
                              href={href}
                              aria-current={isCurrent ? "page" : undefined}
                              className={`group flex items-center gap-2.5 rounded-sm px-1.5 py-1.5 text-body-sm transition-colors duration-150 ${
                                isCurrent
                                  ? "bg-tech-blue/10 text-tech-blue"
                                  : "text-ink hover:bg-surface hover:text-tech-blue"
                              }`}
                            >
                              <span className="flex size-6 shrink-0 items-center justify-center rounded-sm bg-tech-blue/10 text-tech-blue transition-colors duration-150 group-hover:bg-tech-blue group-hover:text-white">
                                <Icon name={service.icon} size={13} />
                              </span>
                              <span className="leading-none">
                                {tServices(`items.${service.slug}.title`)}
                              </span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                );
              })}
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
              <p className="text-body-sm text-ink-muted">{t("servicesMenuHint")}</p>
              <Button href="/services" variant="secondary" showArrow className="!py-2.5">
                {tServices("viewAll")}
              </Button>
            </div>
          </Container>
        </div>
      </div>
    </>
  );
}

export function ServicesMobileNav({ onNavigate }: { onNavigate?: () => void }) {
  const t = useTranslations("nav");
  const tServices = useTranslations("services");
  const categoryLabels = tServices.raw("categories") as Record<string, string>;
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(
    () => pathname === "/services" || pathname.startsWith("/services/")
  );
  const panelId = useId();
  const active = pathname === "/services" || pathname.startsWith("/services/");

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-1">
        <Link
          href="/services"
          onClick={onNavigate}
          aria-current={active ? "page" : undefined}
          className={`flex-1 rounded-sm px-3 py-2.5 text-body font-medium transition-colors duration-150 ${
            active
              ? "bg-tech-blue/10 text-tech-blue"
              : "text-ink hover:bg-surface hover:text-tech-blue"
          }`}
        >
          {t("services")}
        </Link>
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={panelId}
          aria-label={t("servicesMenu")}
          onClick={() => setExpanded((v) => !v)}
          className={`flex size-9 shrink-0 items-center justify-center rounded-sm border transition-colors duration-150 ${
            expanded
              ? "border-tech-blue bg-tech-blue text-white"
              : "border-line text-ink hover:border-tech-blue hover:text-tech-blue"
          }`}
        >
          <Icon
            name="chevron-down"
            size={16}
            className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      <div
        id={panelId}
        className={`grid overflow-hidden transition-[grid-template-rows] duration-200 ease-out ${
          expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0">
          <div className="mt-1 max-h-[40vh] space-y-3 overflow-y-auto overscroll-contain border-l border-tech-blue/30 py-1 pl-3">
            {grouped.map((category) => (
              <section key={category.id}>
                <h3 className="px-2 font-mono text-label uppercase tracking-[0.1em] text-tech-blue">
                  {categoryLabels[category.labelKey]}
                </h3>
                <ul className="mt-1 flex flex-col">
                  {category.services.map((service) => {
                    const href = `/services/${service.slug}`;
                    const isCurrent = pathname === href;
                    return (
                      <li key={service.slug}>
                        <Link
                          href={href}
                          onClick={onNavigate}
                          aria-current={isCurrent ? "page" : undefined}
                          className={`flex items-center gap-2 rounded-sm px-2 py-1.5 text-body-sm transition-colors duration-150 ${
                            isCurrent
                              ? "text-tech-blue"
                              : "text-ink-muted hover:text-tech-blue"
                          }`}
                        >
                          <Icon
                            name={service.icon}
                            size={14}
                            className="shrink-0 text-tech-blue"
                          />
                          {tServices(`items.${service.slug}.title`)}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
