"use client";

import type { ReactNode } from "react";
import { useInView } from "@/hooks/useInView";

export function Reveal({
  children,
  delayMs = 0,
  className = "",
}: {
  children: ReactNode;
  delayMs?: number;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      style={{ transitionDelay: inView ? `${delayMs}ms` : "0ms" }}
      className={`transition-[opacity,transform] duration-500 ease-out ${
        inView ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}
