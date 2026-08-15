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
  const [showAll, setShowAll] = useState(false);
  const displayItems = showAll ? items : items.slice(0, 8);

  return (
    <>
      <ul className="mt-8 grid border-t border-l border-line sm:grid-cols-2 lg:grid-cols-4">
        {displayItems.map((item, i) => {
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

      {!showAll && items.length > 8 && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="flex items-center gap-2 rounded-sm border border-line bg-surface-elevated px-6 py-2.5 text-body-sm font-semibold text-tech-blue hover:border-tech-blue transition"
          >
            <span>{isFr ? `Afficher les ${items.length} secteurs` : `Show All ${items.length} Industries`}</span>
            <span>↓</span>
          </button>
        </div>
      )}
    </>
  );
}
