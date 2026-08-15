import type { ReactNode } from "react";

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full min-w-0 max-w-[1440px] xl:max-w-[1720px] 2xl:max-w-[2400px] px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-20 ${className}`}>
      {children}
    </div>
  );
}
