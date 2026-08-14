"use client";

import { useState } from "react";
import { PortfolioCard } from "@/components/ui/PortfolioCard";
import { ProjectModal, type ProjectModalDetails } from "@/components/ui/ProjectModal";

interface PortfolioItem {
  title: string;
  category: string;
  summary: string;
}

export function PortfolioFilterGrid({
  items,
  filters,
  filtersLabel,
  noResultsLabel,
  placeholderNote,
}: {
  items: PortfolioItem[];
  filters: { id: string; label: string }[];
  filtersLabel: string;
  noResultsLabel: string;
  placeholderNote: string;
}) {
  const [active, setActive] = useState("all");
  const [selectedProject, setSelectedProject] = useState<ProjectModalDetails | null>(null);

  const filtered = active === "all" ? items : items.filter((i) => i.category === active);
  const labelFor = (id: string) => filters.find((f) => f.id === id)?.label ?? id;

  return (
    <div>
      <div role="group" aria-label={filtersLabel} className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            aria-pressed={active === f.id}
            onClick={() => setActive(f.id)}
            className={`rounded-sm border px-4 py-2 text-body-sm font-medium transition-colors duration-150 ${
              active === f.id
                ? "border-tech-blue bg-tech-blue text-white"
                : "border-line text-ink-muted hover:border-tech-blue hover:text-tech-blue"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 text-body text-ink-muted">{noResultsLabel}</p>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <PortfolioCard
              key={item.title}
              title={item.title}
              categoryLabel={labelFor(item.category)}
              summary={item.summary}
              note={placeholderNote}
              onClick={() =>
                setSelectedProject({
                  title: item.title,
                  categoryLabel: labelFor(item.category),
                  summary: item.summary,
                })
              }
            />
          ))}
        </div>
      )}

      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </div>
  );
}
