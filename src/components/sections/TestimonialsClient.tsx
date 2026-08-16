"use client";

import { useRef, useState, useEffect } from "react";
import { Icon } from "@/components/icons/Icon";
import { siteConfig } from "@/lib/site.config";

export interface TestimonialItem {
  id: string;
  clientName: string;
  clientRole: string;
  company: string;
  avatarUrl?: string | null;
  content: string;
  rating: number;
}

export function TestimonialsClient({
  items,
}: {
  items: TestimonialItem[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Track scroll position to update active index indicator
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleScroll = () => {
      const scrollLeft = el.scrollLeft;
      const cardWidth = el.offsetWidth * 0.88;
      const index = Math.round(scrollLeft / cardWidth);
      setActiveIndex(Math.min(index, items.length - 1));
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [items.length]);

  const scrollPrev = () => {
    if (!containerRef.current) return;
    const cardWidth = containerRef.current.offsetWidth * 0.88 + 16;
    containerRef.current.scrollBy({ left: -cardWidth, behavior: "smooth" });
  };

  const scrollNext = () => {
    if (!containerRef.current) return;
    const cardWidth = containerRef.current.offsetWidth * 0.88 + 16;
    containerRef.current.scrollBy({ left: cardWidth, behavior: "smooth" });
  };

  return (
    <>
      {/* 📱 Mobile View: Full-device-width horizontal scroll with Navigation Buttons */}
      <div className="sm:hidden">
        {/* Navigation & Counter Header */}
        <div className="mb-4 flex items-center justify-between">
          <span className="font-mono text-xs text-tech-blue">
            <span>{String(activeIndex + 1).padStart(2, "0")}</span>
            <span className="text-ink-muted"> / {String(items.length).padStart(2, "0")}</span>
          </span>

          {/* Left / Right Scroll Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={scrollPrev}
              disabled={activeIndex === 0}
              aria-label="Previous testimonial"
              className="flex size-8 items-center justify-center rounded-sm border border-line bg-surface text-ink transition-colors hover:border-tech-blue hover:text-tech-blue disabled:opacity-30 disabled:pointer-events-none"
            >
              <Icon name="arrow-left" size={14} />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              disabled={activeIndex >= items.length - 1}
              aria-label="Next testimonial"
              className="flex size-8 items-center justify-center rounded-sm border border-line bg-surface text-ink transition-colors hover:border-tech-blue hover:text-tech-blue disabled:opacity-30 disabled:pointer-events-none"
            >
              <Icon name="arrow-right" size={14} />
            </button>
          </div>
        </div>

        {/* Full-width Horizontal Scroll Cards */}
        <div
          ref={containerRef}
          className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scrollbar-none -mx-4 px-4 scroll-smooth"
        >
          {items.map((item) => (
            <figure
              key={item.id}
              className="w-[86vw] max-w-[340px] shrink-0 snap-center flex flex-col justify-between rounded-sm border border-line bg-base p-5 shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1 text-tech-blue" aria-hidden="true">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Icon key={i} name="star" size={14} />
                    ))}
                  </div>
                  {item.avatarUrl && (
                    <img
                      src={item.avatarUrl}
                      alt={item.clientName}
                      className="size-8 rounded-full object-cover border border-line"
                    />
                  )}
                </div>

                <blockquote
                  cite={`${siteConfig.url}/portfolio`}
                  className="mt-3 text-body-sm leading-relaxed text-ink"
                >
                  &ldquo;{item.content}&rdquo;
                </blockquote>
              </div>

              <figcaption className="mt-4 border-t border-line/60 pt-3 text-body-sm">
                <span className="font-semibold text-ink">{item.clientName}</span>
                <span className="text-ink-muted block text-xs mt-0.5">
                  {item.clientRole}, {item.company}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>

        {/* Progress dots on mobile */}
        <div className="mt-3 flex justify-center gap-1.5">
          {items.map((_, i) => (
            <span
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${
                activeIndex === i ? "w-6 bg-tech-blue" : "w-1.5 bg-line"
              }`}
            />
          ))}
        </div>
      </div>

      {/* 💻 Desktop / Tablet View: Standard 2-column grid */}
      <div className="hidden sm:grid gap-5 sm:grid-cols-2">
        {items.map((item) => (
          <figure
            key={item.id}
            className="flex flex-col rounded-sm border border-line bg-base p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex gap-1 text-tech-blue" aria-hidden="true">
                {Array.from({ length: item.rating }).map((_, i) => (
                  <Icon key={i} name="star" size={14} />
                ))}
              </div>
              {item.avatarUrl && (
                <img
                  src={item.avatarUrl}
                  alt={item.clientName}
                  className="h-8 w-8 rounded-full object-cover border border-line"
                />
              )}
            </div>
            <blockquote
              cite={`${siteConfig.url}/portfolio`}
              className="mt-3 flex-1 text-body-sm text-ink"
            >
              &ldquo;{item.content}&rdquo;
            </blockquote>
            <figcaption className="mt-4 text-body-sm">
              <span className="font-semibold text-ink">{item.clientName}</span>
              <span className="text-ink-muted">
                , {item.clientRole}, {item.company}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </>
  );
}
