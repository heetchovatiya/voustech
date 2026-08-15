"use client";

import { useState } from "react";
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
  const [showAllMobile, setShowAllMobile] = useState(false);

  return (
    <>
      <ul className="mt-7 grid border-t border-line sm:grid-cols-2">
        {items.map((item, i) => {
          const index = String(i + 1).padStart(2, "0");
          const isLeft = i % 2 === 0;
          const isHiddenMobile = !showAllMobile && i >= 4;

          return (
            <li
              key={item.title}
              className={`border-b border-line ${
                isLeft ? "sm:border-r sm:pr-6 lg:pr-8" : "sm:pl-6 lg:pl-8"
              } ${isHiddenMobile ? "hidden sm:block" : ""}`}
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

      {!showAllMobile && items.length > 4 && (
        <div className="mt-4 sm:hidden">
          <button
            type="button"
            onClick={() => setShowAllMobile(true)}
            className="flex w-full items-center justify-center gap-2 rounded-sm border border-line bg-surface-elevated py-2.5 text-body-sm font-semibold text-tech-blue hover:border-tech-blue"
          >
            <span>Show All {items.length} Reasons</span>
            <span>↓</span>
          </button>
        </div>
      )}
    </>
  );
}
