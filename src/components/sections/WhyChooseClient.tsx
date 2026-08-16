"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { Reveal } from "@/components/ui/Reveal";
import { Icon, type IconName } from "@/components/icons/Icon";

const icons: IconName[] = [
  "users",
  "cpu",
  "life-buoy",
  "lock",
  "compass",
  "credit-card",
  "gauge",
  "layers",
  "share",
  "mail",
];

export function WhyChooseClient({
  items,
}: {
  items: { title: string; body: string }[];
}) {
  const locale = useLocale();
  const isFr = locale?.startsWith("fr");

  return (
    <>
      {/* Mobile view: Horizontal touch scroll cards (No View More needed) */}
      <div className="mt-6 sm:hidden">
        <div className="mb-2 flex items-center justify-between text-xs text-tech-blue font-mono">
          <span>{isFr ? "Glisser pour explorer les 10 raisons" : "Swipe to explore all 10 reasons"}</span>
          <span>→</span>
        </div>
        <div className="flex gap-3.5 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scrollbar-thin -mx-4 px-4">
          {items.map((item, i) => {
            const index = String(i + 1).padStart(2, "0");

            return (
              <article
                key={item.title}
                className="w-[280px] shrink-0 snap-start rounded-sm border border-line bg-surface p-4 flex flex-col justify-between shadow-xs hover:border-tech-blue transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-body font-bold tracking-[0.08em] text-tech-blue">
                      {index}
                    </span>
                    <span className="text-tech-blue">
                      <Icon name={icons[i % icons.length]} size={20} />
                    </span>
                  </div>
                  <h3 className="text-body font-display font-semibold text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-body-sm leading-relaxed text-ink-muted">
                    {item.body}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Desktop / Tablet view: Full 2-column grid */}
      <ul className="mt-7 hidden sm:grid border-t border-line sm:grid-cols-2">
        {items.map((item, i) => {
          const index = String(i + 1).padStart(2, "0");
          const isLeft = i % 2 === 0;

          return (
            <li
              key={item.title}
              className={`border-b border-line ${
                isLeft ? "sm:border-r sm:pr-6 lg:pr-8" : "sm:pl-6 lg:pl-8"
              }`}
            >
              <Reveal delayMs={(i % 2) * 60}>
                <article className="group flex gap-3 py-4 sm:gap-4 sm:py-5">
                  <span className="shrink-0 font-mono text-body-lg font-medium tracking-[0.08em] text-tech-blue">
                    {index}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-body font-display font-semibold text-ink transition-colors duration-150 group-hover:text-tech-blue">
                        {item.title}
                      </h3>
                      <span className="mt-0.5 shrink-0 text-tech-blue transition-colors duration-150 group-hover:text-deep-ocean">
                        <Icon name={icons[i % icons.length]} size={22} />
                      </span>
                    </div>
                    <p className="mt-1.5 max-w-sm text-body-sm leading-relaxed text-ink-muted">
                      {item.body}
                    </p>
                  </div>
                </article>
              </Reveal>
            </li>
          );
        })}
      </ul>
    </>
  );
}
