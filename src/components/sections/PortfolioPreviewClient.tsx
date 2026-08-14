"use client";

import { useState } from "react";
import { PortfolioCard } from "@/components/ui/PortfolioCard";
import { ProjectModal, type ProjectModalDetails } from "@/components/ui/ProjectModal";

export function PortfolioPreviewClient({
  items,
}: {
  items: { title: string; categoryLabel: string; summary: string; imageUrl?: string | null; projectUrl?: string | null }[];
}) {
  const [selectedProject, setSelectedProject] = useState<ProjectModalDetails | null>(null);

  return (
    <>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
