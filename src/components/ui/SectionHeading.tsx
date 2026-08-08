import type { ReactNode } from "react";

export function SectionHeading({
  label,
  heading,
  headingId,
  body,
  align = "left",
  level = 2,
}: {
  label?: string;
  heading: ReactNode;
  headingId: string;
  body?: ReactNode;
  align?: "left" | "center";
  level?: 2 | 3;
}) {
  const Heading = level === 2 ? "h2" : "h3";
  return (
    <div
      className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}
    >
      {label && (
        <p className="mb-3 font-mono text-label uppercase tracking-[0.14em] text-tech-blue">
          {label}
        </p>
      )}
      <Heading
        id={headingId}
        className="text-heading-sm sm:text-heading-lg font-semibold"
      >
        {heading}
      </Heading>
      {body && <p className="mt-4 text-body text-ink-muted">{body}</p>}
    </div>
  );
}
