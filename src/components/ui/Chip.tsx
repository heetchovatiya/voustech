import type { ReactNode } from "react";

export function Chip({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-sm border border-tech-blue/40 px-3 py-1.5 font-mono text-label text-ink-muted ${className}`}
    >
      {children}
    </span>
  );
}
