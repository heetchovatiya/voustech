"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Icon, type IconName } from "@/components/icons/Icon";
import { technologyCategories } from "@/content/technologies";

const categoryIcons: Record<string, IconName> = {
  frontend: "code",
  backend: "server",
  mobile: "smartphone",
  database: "layers",
  cloud: "cloud",
  devops: "terminal",
  ui: "palette",
  cms: "pen-tool",
  ecommerce: "cart",
  ai: "cpu",
};

export function TechnologiesPanel() {
  const t = useTranslations("technologies");
  const [activeKey, setActiveKey] = useState(technologyCategories[0].key);
  const active =
    technologyCategories.find((c) => c.key === activeKey) ?? technologyCategories[0];

  return (
    <div className="mt-8 grid min-w-0 items-start gap-6 lg:grid-cols-[minmax(0,220px)_minmax(0,1fr)] lg:gap-10">
      {/* Category index */}
      <nav aria-label={t("categoriesLabel")} className="min-w-0 lg:sticky lg:top-24">
        <p className="mb-3 hidden font-mono text-label uppercase tracking-[0.12em] text-tech-blue lg:block">
          {t("categoriesLabel")}
        </p>

        {/* Mobile / tablet: wrapping domain chips (no page-wide horizontal scroll) */}
        <div
          role="group"
          aria-label={t("categoriesLabel")}
          className="flex flex-wrap gap-2 lg:hidden"
        >
          {technologyCategories.map((cat) => {
            const current = cat.key === activeKey;
            return (
              <button
                key={cat.key}
                type="button"
                aria-pressed={current}
                onClick={() => setActiveKey(cat.key)}
                className={`inline-flex max-w-full items-center gap-1.5 border px-2.5 py-1.5 text-body-sm font-medium transition-colors duration-150 ${
                  current
                    ? "border-tech-blue bg-tech-blue/10 text-tech-blue"
                    : "border-line text-ink-muted hover:border-tech-blue hover:text-tech-blue"
                }`}
              >
                <Icon name={categoryIcons[cat.key] ?? "code"} size={14} className="shrink-0" />
                <span className="truncate">{t(`categories.${cat.key}`)}</span>
              </button>
            );
          })}
        </div>

        {/* Desktop: vertical sticky list */}
        <ul className="hidden border-l border-line lg:flex lg:flex-col">
          {technologyCategories.map((cat) => {
            const current = cat.key === activeKey;
            return (
              <li key={cat.key} className="min-w-0">
                <button
                  type="button"
                  onClick={() => setActiveKey(cat.key)}
                  aria-current={current ? "true" : undefined}
                  className={`-ml-px flex w-full min-w-0 items-center gap-2.5 border-l-2 px-3 py-2.5 text-left text-body-sm transition-colors duration-150 ${
                    current
                      ? "border-tech-blue font-semibold text-tech-blue"
                      : "border-transparent text-ink-muted hover:border-tech-blue/40 hover:text-tech-blue"
                  }`}
                >
                  <Icon
                    name={categoryIcons[cat.key] ?? "code"}
                    size={15}
                    className={`shrink-0 ${current ? "text-tech-blue" : "text-ink-muted"}`}
                  />
                  <span className="min-w-0 flex-1 truncate">
                    {t(`categories.${cat.key}`)}
                  </span>
                  <span className="shrink-0 font-mono text-label text-ink-muted">
                    {String(cat.items.length).padStart(2, "0")}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Active category tools */}
      <div role="region" aria-label={t(`categories.${active.key}`)} className="min-w-0">
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2 border-b border-line pb-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <Icon
              name={categoryIcons[active.key] ?? "code"}
              size={20}
              className="shrink-0 text-tech-blue"
            />
            <h3 className="min-w-0 font-display text-body-lg font-semibold text-ink">
              {t(`categories.${active.key}`)}
            </h3>
          </div>
          <p className="shrink-0 font-mono text-label uppercase tracking-[0.1em] text-ink-muted">
            {t("stackCount", { count: active.items.length })}
          </p>
        </div>

        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {active.items.map((item) => (
            <li key={item} className="min-w-0">
              <div className="group flex h-full min-w-0 items-center gap-3 border border-line px-3 py-3 transition-[border-color,background-color,color] duration-150 hover:border-tech-blue hover:bg-tech-blue/[0.06] sm:px-3.5">
                <span className="size-1.5 shrink-0 rounded-sm bg-tech-blue/50 transition-colors duration-150 group-hover:bg-tech-blue" />
                <span className="min-w-0 break-words text-body-sm font-medium text-ink transition-colors duration-150 group-hover:text-tech-blue">
                  {item}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
