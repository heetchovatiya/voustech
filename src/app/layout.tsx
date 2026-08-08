import type { ReactNode } from "react";

/**
 * Root shell required by the App Router. The real <html>/<body> live in
 * `[locale]/layout.tsx` so `lang` can follow the active locale.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
