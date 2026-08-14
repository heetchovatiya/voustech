"use client";

import { useState } from "react";
import { Icon } from "@/components/icons/Icon";

export function FaqAccordion({
  items,
}: {
  items: { question: string; answer: string }[];
}) {
  const [openId, setOpenId] = useState<number | null>(0);

  return (
    <div className="mt-8 space-y-4">
      {items.map((item, i) => {
        const open = openId === i;
        const index = String(i + 1).padStart(2, "0");

        return (
          <details
            key={item.question}
            open={open}
            onToggle={(e) => {
              const target = e.currentTarget as HTMLDetailsElement;
              if (target.open) setOpenId(i);
              else if (openId === i) setOpenId(null);
            }}
            className="group rounded-sm border border-line bg-surface p-4 transition-colors duration-150 sm:p-5"
          >
            <summary className="flex cursor-pointer items-start gap-3 font-display font-semibold text-ink transition-colors duration-150 group-hover:text-tech-blue sm:gap-5">
              <span className="shrink-0 font-mono text-body-sm font-medium tracking-[0.08em] text-tech-blue sm:text-body-lg">
                {index}
              </span>
              <span className="flex-1 text-body-sm sm:text-body font-semibold">
                {item.question}
              </span>
              <span className="shrink-0 text-tech-blue transition-transform duration-150 group-open:rotate-45">
                <Icon name="plus" size={18} />
              </span>
            </summary>
            <div className="mt-3 pl-8 sm:pl-[2.75rem]">
              <p className="max-w-2xl text-body-sm leading-relaxed text-ink-muted">
                {item.answer}
              </p>
            </div>
          </details>
        );
      })}
    </div>
  );
}
