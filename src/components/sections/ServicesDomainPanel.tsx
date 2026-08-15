"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Icon, type IconName } from "@/components/icons/Icon";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { getServicesByCategory, type ServiceCategory } from "@/content/services";

const grouped = getServicesByCategory();

type DomainMeta = {
  id: ServiceCategory;
  labelKey: string;
  icon: IconName;
  count: number;
};

const domainIcons: Record<ServiceCategory, IconName> = {
  "web-apps": "globe",
  "design-branding": "palette",
  "business-systems": "layers",
  "infrastructure-growth": "cloud",
};

const domains: DomainMeta[] = grouped.map((g) => ({
  id: g.id,
  labelKey: g.labelKey,
  icon: domainIcons[g.id],
  count: g.services.length,
}));

function ServiceRow({
  slug,
  icon,
  title,
  hook,
}: {
  slug: string;
  icon: IconName;
  title: string;
  hook: string;
}) {
  return (
    <li>
      <Link
        href={`/services/${slug}`}
        className="group grid grid-cols-[auto_1fr_auto] items-start gap-3 border-b border-line/70 py-4 transition-colors duration-150 last:border-b-0 hover:border-tech-blue/30"
      >
        <span className="mt-0.5 text-tech-blue">
          <Icon name={icon} size={18} />
        </span>
        <span className="min-w-0">
          <span className="block text-body-sm font-semibold text-ink transition-colors duration-150 group-hover:text-tech-blue">
            {title}
          </span>
          <span className="mt-1 block text-body-sm text-ink-muted">{hook}</span>
        </span>
        <Icon
          name="arrow-right"
          size={14}
          className="mt-1 shrink-0 text-tech-blue transition-transform duration-150 group-hover:translate-x-0.5"
        />
      </Link>
    </li>
  );
}

/**
 * Sticky domain index (left) + scrolling service lists (right).
 * Click a domain to jump; scrollspy keeps the left nav in sync.
 */
export function ServicesDomainPanel() {
  const t = useTranslations("services");
  const categoryLabels = t.raw("categories") as Record<string, string>;
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [activeId, setActiveId] = useState<ServiceCategory>(domains[0].id);
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());
  const scrollingTo = useRef<string | null>(null);

  useEffect(() => {
    if (!isDesktop) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (scrollingTo.current) return;
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const top = visible[0]?.target.getAttribute("data-domain");
        if (top) setActiveId(top as ServiceCategory);
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0.1, 0.25, 0.5] }
    );

    sectionRefs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [isDesktop]);

  function selectDomain(id: ServiceCategory) {
    setActiveId(id);
    const el = sectionRefs.current.get(id);
    if (!el) return;

    scrollingTo.current = id;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => {
      scrollingTo.current = null;
    }, 700);
  }

  const [showAllMobile, setShowAllMobile] = useState(false);

  return (
    <div className="mt-10 min-w-0">
      {/* Desktop: sticky domains + scrolling lists */}
      <div className="hidden min-w-0 lg:grid lg:grid-cols-[minmax(0,240px)_minmax(0,1fr)] lg:items-start lg:gap-12 xl:gap-16">
        <nav aria-label={t("label")} className="sticky top-24 self-start">
          <p className="mb-3 font-mono text-label uppercase tracking-[0.12em] text-tech-blue">
            {t("domainsLabel")}
          </p>
          <ul className="flex flex-col border-l border-line">
            {domains.map((domain) => {
              const current = domain.id === activeId;
              return (
                <li key={domain.id}>
                  <button
                    type="button"
                    onClick={() => selectDomain(domain.id)}
                    aria-current={current ? "true" : undefined}
                    className={`-ml-px flex w-full items-start gap-3 border-l-2 px-4 py-3.5 text-left transition-colors duration-150 ${
                      current
                        ? "border-tech-blue text-ink"
                        : "border-transparent text-ink-muted hover:border-tech-blue/40 hover:text-ink"
                    }`}
                  >
                    <Icon
                      name={domain.icon}
                      size={16}
                      className={`mt-0.5 shrink-0 ${current ? "text-tech-blue" : "text-ink-muted"}`}
                    />
                    <span className="min-w-0">
                      <span
                        className={`block text-body-sm leading-snug ${
                          current ? "font-semibold text-tech-blue" : "font-medium"
                        }`}
                      >
                        {categoryLabels[domain.labelKey]}
                      </span>
                      <span className="mt-0.5 block font-mono text-label text-ink-muted">
                        {t("domainCount", { count: domain.count })}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex min-w-0 flex-col gap-12">
          {grouped.map((category) => (
            <section
              key={category.id}
              id={`domain-${category.id}`}
              data-domain={category.id}
              ref={(el) => {
                if (el) sectionRefs.current.set(category.id, el);
                else sectionRefs.current.delete(category.id);
              }}
              aria-labelledby={`domain-heading-${category.id}`}
              className="scroll-mt-28"
            >
              <header className="mb-1 flex items-baseline justify-between gap-3">
                <h3
                  id={`domain-heading-${category.id}`}
                  className="font-display text-heading-sm font-semibold text-ink"
                >
                  {categoryLabels[category.labelKey]}
                </h3>
                <p className="shrink-0 font-mono text-label uppercase tracking-[0.1em] text-ink-muted">
                  {t("domainCount", { count: category.services.length })}
                </p>
              </header>
              <div className="mb-4 h-px bg-gradient-to-r from-tech-blue/50 via-line to-transparent" />

              <ul>
                {category.services.map((service) => (
                  <ServiceRow
                    key={service.slug}
                    slug={service.slug}
                    icon={service.icon}
                    title={t(`items.${service.slug}.title`)}
                    hook={t(`items.${service.slug}.hook`)}
                  />
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>

      {/* Mobile / tablet: domain chips + list for the active domain */}
      <div className="min-w-0 lg:hidden">
        <div
          role="group"
          aria-label={t("domainsLabel")}
          className="flex flex-wrap gap-2"
        >
          {domains.map((domain) => {
            const current = domain.id === activeId;
            return (
              <button
                key={domain.id}
                type="button"
                aria-pressed={current}
                onClick={() => {
                  setActiveId(domain.id);
                  setShowAllMobile(false);
                }}
                className={`inline-flex max-w-full items-center gap-2 border px-2.5 py-1.5 text-body-sm font-medium transition-colors duration-150 ${
                  current
                    ? "border-tech-blue bg-tech-blue/10 text-tech-blue"
                    : "border-line text-ink-muted hover:border-tech-blue hover:text-tech-blue"
                }`}
              >
                <Icon name={domain.icon} size={14} className="shrink-0" />
                <span className="truncate">{categoryLabels[domain.labelKey]}</span>
              </button>
            );
          })}
        </div>

        {grouped.map((category) => {
          if (category.id !== activeId) return null;
          const displayServices = showAllMobile ? category.services : category.services.slice(0, 3);
          const hasMore = category.services.length > 3;

          return (
            <div
              key={category.id}
              className="mt-5"
              role="region"
              aria-label={categoryLabels[category.labelKey]}
            >
              <ul>
                {displayServices.map((service) => (
                  <ServiceRow
                    key={service.slug}
                    slug={service.slug}
                    icon={service.icon}
                    title={t(`items.${service.slug}.title`)}
                    hook={t(`items.${service.slug}.hook`)}
                  />
                ))}
              </ul>

              {hasMore && !showAllMobile && (
                <button
                  type="button"
                  onClick={() => setShowAllMobile(true)}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-sm border border-line bg-surface-elevated py-2.5 text-body-sm font-semibold text-tech-blue hover:border-tech-blue"
                >
                  <span>Show All {category.services.length} Services</span>
                  <span>↓</span>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
