"use client";

import { useState } from "react";
import { Icon } from "@/components/icons/Icon";

export function FaqAccordion({
  items,
}: {
  items: { question: string; answer: string }[];
}) {
  const [openId, setOpenId] = useState<number | null>(0);
  const [showAllMobile, setShowAllMobile] = useState(false);

  return (
    <>
      <ul className="mt-8 border-t border-line">
        {items.map((item, i) => {
          const open = openId === i;
          const index = String(i + 1).padStart(2, "0");
          const panelId = `faq-panel-${i}`;
          const buttonId = `faq-button-${i}`;
          const isHiddenMobile = !showAllMobile && i >= 5;

          return (
            <li
              key={item.question}
              className={`border-b border-line ${isHiddenMobile ? "hidden sm:block" : ""}`}
            >
              <h3>
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setOpenId(open ? null : i)}
                  className="group flex w-full items-start gap-3 py-4 text-left transition-colors duration-150 sm:gap-5 sm:py-5"
                >
                  <span className="mt-0.5 shrink-0 font-mono text-body-sm font-medium tracking-[0.08em] text-tech-blue sm:text-body-lg">
                    {index}
                  </span>
                  <span
                    className={`min-w-0 flex-1 text-body-sm font-display font-semibold transition-colors duration-150 sm:text-body ${
                      open ? "text-tech-blue" : "text-ink group-hover:text-tech-blue"
                    }`}
                  >
                    {item.question}
                  </span>
                  <span
                    className={`mt-0.5 shrink-0 text-tech-blue transition-transform duration-150 ${
                      open ? "rotate-45" : ""
                    }`}
                  >
                    <Icon name="plus" size={18} />
                  </span>
                </button>
              </h3>

              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                hidden={!open}
                className="pb-5 pl-10 sm:pb-6 sm:pl-[3.25rem]"
              >
                <p className="max-w-2xl text-body-sm leading-relaxed text-ink-muted">
                  {item.answer}
                </p>
              </div>
            </li>
          );
        })}
      </ul>

      {!showAllMobile && items.length > 5 && (
        <div className="mt-4 sm:hidden">
          <button
            type="button"
            onClick={() => setShowAllMobile(true)}
            className="flex w-full items-center justify-center gap-2 rounded-sm border border-line bg-surface-elevated py-2.5 text-body-sm font-semibold text-tech-blue hover:border-tech-blue"
          >
            <span>Show All {items.length} FAQs</span>
            <span>↓</span>
          </button>
        </div>
      )}
    </>
  );
}
