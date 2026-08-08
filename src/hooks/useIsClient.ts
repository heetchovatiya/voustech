"use client";

import { useSyncExternalStore } from "react";

function subscribe() {
  return () => {};
}

/** Hydration-safe client detection without a setState-in-effect mount flag. */
export function useIsClient() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}
