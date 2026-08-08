"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Icon } from "@/components/icons/Icon";

export interface StickyItem {
  id: string;
  label: ReactNode;
  sublabel?: ReactNode;
  detail: ReactNode;
}

export function StickyIndexDetail({
  items,
  ariaLabel,
}: {
  items: StickyItem[];
  ariaLabel: string;
}) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [activeId, setActiveId] = useState(items[0]?.id);
  const [openMobileId, setOpenMobileId] = useState<string | null>(items[0]?.id ?? null);
  const itemRefs = useRef<Map<string, HTMLLIElement>>(new Map());

  useEffect(() => {
    if (!isDesktop) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.getAttribute("data-id") ?? activeId);
        }
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
    );

    itemRefs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDesktop, items.length]);

  const activeItem = items.find((i) => i.id === activeId) ?? items[0];
  const activeIndex = Math.max(
    0,
    items.findIndex((i) => i.id === activeItem?.id)
  );

  return (
    <div>
      <div className="hidden min-w-0 lg:grid lg:grid-cols-[minmax(0,17.5rem)_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[minmax(0,19rem)_minmax(0,1fr)] xl:gap-16">
        <nav aria-label={ariaLabel} className="min-w-0 self-start lg:sticky lg:top-24">
          <p className="mb-4 font-mono text-label uppercase tracking-[0.14em] text-ink-muted">
            {ariaLabel}
          </p>
          <ul className="flex max-h-[min(70vh,40rem)] flex-col gap-0.5 overflow-y-auto pr-1">
            {items.map((item, index) => {
              const current = item.id === activeId;
              return (
                <li
                  key={item.id}
                  data-id={item.id}
                  ref={(el) => {
                    if (el) itemRefs.current.set(item.id, el);
                    else itemRefs.current.delete(item.id);
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setActiveId(item.id)}
                    aria-current={current ? "true" : undefined}
                    className={`group flex w-full items-start gap-3 rounded-sm px-3 py-2.5 text-left transition-colors duration-150 ${
                      current
                        ? "bg-tech-blue/10 text-tech-blue"
                        : "text-ink-muted hover:bg-surface hover:text-ink"
                    }`}
                  >
                    <span
                      className={`mt-0.5 font-mono text-label tracking-[0.08em] ${
                        current ? "text-tech-blue" : "text-ink-muted/70 group-hover:text-tech-blue"
                      }`}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`min-w-0 text-body-sm leading-snug ${
                        current ? "font-semibold" : "font-medium"
                      }`}
                    >
                      {item.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="min-w-0 self-start lg:sticky lg:top-24">
          <div
            key={activeItem?.id}
            className="animate-[cross-fade_180ms_ease-out] border-l border-tech-blue/40 pl-8 xl:pl-10"
          >
            <p className="font-mono text-label uppercase tracking-[0.14em] text-tech-blue">
              {String(activeIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
            </p>
            <div className="mt-5">{activeItem?.detail}</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:hidden">
        {items.map((item, index) => {
          const isOpen = openMobileId === item.id;
          return (
            <div key={item.id} className="border-b border-line">
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpenMobileId(isOpen ? null : item.id)}
                className={`flex w-full items-center gap-3 py-4 text-left transition-colors duration-150 ${
                  isOpen ? "text-tech-blue" : "text-ink hover:text-tech-blue"
                }`}
              >
                <span className="font-mono text-label tracking-[0.08em] text-ink-muted">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1 text-body-sm font-semibold">{item.label}</span>
                <Icon
                  name={isOpen ? "minus" : "plus"}
                  size={16}
                  className="shrink-0 text-tech-blue"
                />
              </button>
              {isOpen && (
                <div className="animate-[cross-fade_180ms_ease-out] border-l border-tech-blue/40 pb-5 pl-4">
                  {item.detail}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
