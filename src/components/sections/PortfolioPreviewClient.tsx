"use client";

import { useEffect, useRef, useState } from "react";
import { PortfolioCard } from "@/components/ui/PortfolioCard";
import { ProjectModal, type ProjectModalDetails } from "@/components/ui/ProjectModal";
import { Icon } from "@/components/icons/Icon";

export function PortfolioPreviewClient({
  items,
}: {
  items: {
    title: string;
    categoryLabel: string;
    summary: string;
    imageUrl?: string | null;
    projectUrl?: string | null;
  }[];
}) {
  const [selectedProject, setSelectedProject] = useState<ProjectModalDetails | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-scroll loop for mobile view
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || isPaused) return;

    const interval = setInterval(() => {
      if (!el) return;
      const maxScroll = el.scrollWidth - el.clientWidth;
      const step = el.clientWidth * 0.88 + 16;
      if (el.scrollLeft >= maxScroll - 10) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: step, behavior: "smooth" });
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [isPaused, items.length]);

  return (
    <>
      {/* 📱 Mobile View: Auto-scrolling horizontal bar with device-width title-only cards */}
      <div className="mt-8 sm:hidden">
        <div className="mb-2 flex items-center justify-between text-xs font-mono text-tech-blue">
          <span className="flex items-center gap-1.5">
            <span className="inline-block size-2 rounded-full bg-tech-blue animate-pulse" />
            <span>Featured Projects</span>
          </span>
          <span>Swipe to explore →</span>
        </div>

        <div
          ref={scrollRef}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setTimeout(() => setIsPaused(false), 3000)}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scrollbar-thin -mx-4 px-4 scroll-smooth"
        >
          {items.map((item) => {
            const hasLiveUrl = !!item.projectUrl;

            const handleCardClick = () => {
              if (hasLiveUrl && item.projectUrl) {
                window.open(item.projectUrl, "_blank", "noopener,noreferrer");
              } else {
                setSelectedProject({
                  title: item.title,
                  categoryLabel: item.categoryLabel,
                  summary: item.summary,
                  imageUrl: item.imageUrl,
                  projectUrl: item.projectUrl,
                });
              }
            };

            return (
              <article
                key={item.title}
                onClick={handleCardClick}
                className="group w-[86vw] max-w-[340px] shrink-0 snap-center rounded-sm border border-line bg-surface overflow-hidden shadow-xs hover:border-tech-blue transition-all cursor-pointer flex flex-col justify-between"
              >
                {/* Thumbnail Image */}
                {item.imageUrl ? (
                  <div className="relative h-44 w-full overflow-hidden bg-surface-elevated/50 border-b border-line flex items-center justify-center p-2">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="max-h-full max-w-full object-contain p-1 transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = "none";
                      }}
                    />
                    <span className="absolute bottom-2 left-2 rounded-sm bg-base/90 px-2 py-0.5 font-mono text-[10px] font-semibold text-tech-blue uppercase tracking-wider backdrop-blur-xs border border-line/60">
                      {item.categoryLabel}
                    </span>
                  </div>
                ) : (
                  <div className="h-20 w-full bg-tech-blue/5 border-b border-line flex items-center justify-between px-3">
                    <span className="font-mono text-[11px] font-semibold text-tech-blue uppercase tracking-wider">
                      {item.categoryLabel}
                    </span>
                    <Icon name="code" size={16} className="text-tech-blue/60" />
                  </div>
                )}

                {/* Card Body: Title + Subtitle */}
                <div className="p-4 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="text-body-sm font-display font-semibold text-ink transition-colors group-hover:text-tech-blue line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-ink-muted line-clamp-2">
                      {item.summary}
                    </p>
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-line/60 pt-2.5">
                    <span className="text-xs font-semibold text-tech-blue flex items-center gap-1">
                      <span>{hasLiveUrl ? "Visit Site" : "View Details"}</span>
                      <span>{hasLiveUrl ? "↗" : "→"}</span>
                    </span>
                    <span className="shrink-0 size-6 rounded-sm border border-line flex items-center justify-center text-tech-blue group-hover:border-tech-blue group-hover:bg-tech-blue group-hover:text-white transition-all">
                      <Icon name={hasLiveUrl ? "arrow-right" : "plus"} size={11} />
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* 💻 Desktop / Tablet View: Standard multi-column grid */}
      <div className="mt-10 hidden sm:grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <PortfolioCard
            key={item.title}
            title={item.title}
            categoryLabel={item.categoryLabel}
            summary={item.summary}
            imageUrl={item.imageUrl}
            projectUrl={item.projectUrl}
            onClick={() =>
              setSelectedProject({
                title: item.title,
                categoryLabel: item.categoryLabel,
                summary: item.summary,
                imageUrl: item.imageUrl,
                projectUrl: item.projectUrl,
              })
            }
          />
        ))}
      </div>

      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </>
  );
}
