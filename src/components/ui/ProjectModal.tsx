"use client";

import { useEffect } from "react";
import { Icon } from "@/components/icons/Icon";
import { Button } from "@/components/ui/Button";

export interface ProjectModalDetails {
  title: string;
  categoryLabel: string;
  summary: string;
  technologies?: string[];
  features?: string[];
  liveUrl?: string;
}

export function ProjectModal({
  project,
  onClose,
}: {
  project: ProjectModalDetails | null;
  onClose: () => void;
}) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (project) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  const defaultTech = ["Next.js 16", "TypeScript", "Tailwind CSS", "PostgreSQL", "Vercel Edge"];
  const techStack = project.technologies && project.technologies.length > 0 ? project.technologies : defaultTech;

  const defaultFeatures = [
    "Sub-second page loading speed with optimized asset pipeline",
    "Responsive, accessible UI/UX designed for mobile and desktop",
    "Enterprise-grade security, HTTP-Only JWT, and 2FA protection",
    "Dynamic CMS database integration with automated workflow triggers",
  ];
  const features = project.features && project.features.length > 0 ? project.features : defaultFeatures;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-sm border border-line bg-surface p-6 shadow-2xl sm:p-8"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close project modal"
          className="absolute right-4 top-4 rounded-sm p-1.5 text-ink-muted transition-colors hover:bg-surface-elevated hover:text-ink"
        >
          <Icon name="close" size={20} />
        </button>

        {/* Header Badge */}
        <span className="inline-block font-mono text-label uppercase tracking-[0.14em] text-tech-blue">
          {project.categoryLabel}
        </span>

        {/* Title */}
        <h2 id="project-modal-title" className="mt-2 text-heading-sm font-display font-semibold sm:text-heading-md">
          {project.title}
        </h2>

        {/* Summary */}
        <p className="mt-3 text-body-sm leading-relaxed text-ink-muted">
          {project.summary}
        </p>

        {/* Key Features */}
        <div className="mt-6 border-t border-line pt-5">
          <h3 className="font-mono text-label uppercase tracking-[0.12em] text-ink">
            Key Features &amp; Architecture
          </h3>
          <ul className="mt-3 space-y-2 text-body-sm text-ink-muted">
            {features.map((feat, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="mt-1 shrink-0 text-tech-blue">✓</span>
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Tech Stack Tags */}
        <div className="mt-6 border-t border-line pt-5">
          <h3 className="font-mono text-label uppercase tracking-[0.12em] text-ink">
            Technologies Used
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="rounded bg-surface-elevated px-2.5 py-1 font-mono text-xs text-tech-blue border border-line"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Button href="/contact" variant="primary" showArrow className="w-full sm:w-auto">
            Request Similar Solution
          </Button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-sm border border-line px-4 py-2.5 text-body-sm font-medium text-ink transition-colors hover:bg-surface-elevated"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
}
