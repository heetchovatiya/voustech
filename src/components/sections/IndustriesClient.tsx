"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { Reveal } from "@/components/ui/Reveal";
import { Icon, type IconName } from "@/components/icons/Icon";

const industryIcons: IconName[] = [
  "life-buoy", // Healthcare
  "users", // Education
  "cart", // Retail
  "share", // Restaurants
  "map-pin", // Real Estate
  "wrench", // Construction
  "credit-card", // Finance
  "cpu", // Manufacturing
  "layers", // Logistics
  "users", // NGOs
  "globe", // Government
  "compass", // Travel
  "hotel", // Hospitality
  "zap", // Agriculture
  "diamond", // Mining
  "smartphone", // Telecommunications
];

export function IndustriesClient({ items }: { items: string[] }) {
  const locale = useLocale();
  const isFr = locale?.startsWith("fr");

  return (
    <>
      {/* Mobile view: Horizontal touch scrollable cards (No View More needed) */}
      <div className="mt-6 sm:hidden">
        <div className="mb-2 flex items-center justify-between text-xs text-tech-blue font-mono">
          <span>{isFr ? "Glisser pour explorer les 16 secteurs" : "Swipe to explore all 16 industries"}</span>
          <span>→</span>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scrollbar-thin -mx-4 px-4">
          {items.map((item, i) => {
            const index = String(i + 1).padStart(2, "0");

            return (
              <article
                key={item}
                className="w-[240px] shrink-0 snap-start rounded-sm border border-line bg-surface p-4 flex items-center gap-3 shadow-xs hover:border-tech-blue transition-colors"
              >
                <span className="shrink-0 font-mono text-body-sm font-medium tracking-[0.08em] text-tech-blue">
                  {index}
                </span>
                <h3 className="min-w-0 flex-1 text-body-sm font-display font-semibold text-ink">
                  {item}
                </h3>
                <span className="shrink-0 text-tech-blue">
                  <Icon
                    name={industryIcons[i % industryIcons.length]}
                    size={18}
                  />
                </span>
              </article>
            );
          })}
        </div>
      </div>

      {/* Desktop / Tablet view: Full 4-column structured grid */}
      <ul className="mt-8 hidden sm:grid border-t border-l border-line sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, i) => {
          const index = String(i + 1).padStart(2, "0");

          return (
            <li key={item} className="border-b border-r border-line">
              <Reveal delayMs={(i % 4) * 40} className="h-full">
                <article className="group flex h-full items-center gap-3 px-4 py-4 transition-colors duration-150 hover:bg-tech-blue/[0.04] sm:px-5">
                  <span className="shrink-0 font-mono text-body-sm font-medium tracking-[0.08em] text-tech-blue">
                    {index}
                  </span>
                  <h3 className="min-w-0 flex-1 text-body-sm font-display font-semibold text-ink transition-colors duration-150 group-hover:text-tech-blue">
                    {item}
                  </h3>
                  <span className="shrink-0 text-tech-blue transition-colors duration-150 group-hover:text-deep-ocean">
                    <Icon
                      name={industryIcons[i % industryIcons.length]}
                      size={18}
                    />
                  </span>
                </article>
              </Reveal>
            </li>
          );
        })}
      </ul>
    </>
  );
}
