import type { ReactNode } from "react";
import { Container } from "./Container";

export function PageIntro({
  label,
  heading,
  body,
  media,
  children,
}: {
  label?: string;
  heading: ReactNode;
  body?: ReactNode;
  /** Optional visual (icon, date, mark) shown beside the copy on large screens. */
  media?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden border-b border-line bg-surface">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -right-[8%] top-[-30%] hidden h-[85%] w-[38%] rotate-[-28deg] bg-tech-blue/[0.05] lg:block" />
        <div className="absolute -right-[2%] bottom-[-40%] hidden h-[70%] w-[22%] rotate-[-28deg] bg-deep-ocean/[0.06] lg:block" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-tech-blue/35 to-transparent" />
      </div>

      <Container className="relative py-14 sm:py-16 lg:py-20">
        <div
          className={`grid min-w-0 items-end gap-10 ${
            media ? "lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16" : ""
          }`}
        >
          <div className="min-w-0 max-w-3xl">
            {label && (
              <div className="mb-4 flex items-center gap-3">
                <span className="h-px w-8 bg-tech-blue" aria-hidden="true" />
                <p className="font-mono text-label uppercase tracking-[0.14em] text-tech-blue">
                  {label}
                </p>
              </div>
            )}

            <h1 className="text-heading-lg font-semibold leading-[1.08] tracking-tight sm:text-display">
              {heading}
            </h1>

            {body && (
              <p className="mt-5 max-w-2xl text-body-lg leading-relaxed text-ink-muted">{body}</p>
            )}

            {children && <div className="mt-8 flex flex-wrap items-center gap-3">{children}</div>}
          </div>

          {media && (
            <div className="page-intro-media flex shrink-0 justify-start lg:justify-end">
              {media}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
