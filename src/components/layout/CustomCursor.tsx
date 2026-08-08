"use client";

import { useEffect, useRef } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

type CursorMode = "default" | "pointer" | "text" | "hidden";

function interactiveTarget(el: EventTarget | null): CursorMode {
  if (!(el instanceof Element)) return "default";

  if (el.closest("[data-cursor='hidden'], iframe")) return "hidden";

  if (
    el.closest(
      "input:not([type='button']):not([type='submit']):not([type='reset']):not([type='checkbox']):not([type='radio']), textarea, select, [contenteditable='true']"
    )
  ) {
    return "text";
  }

  if (
    el.closest(
      "a, button, [role='button'], label[for], summary, select, input[type='button'], input[type='submit'], input[type='reset'], input[type='checkbox'], input[type='radio'], .cursor-pointer"
    )
  ) {
    return "pointer";
  }

  return "default";
}

/**
 * Minimal dual-layer cursor: precise core + hairline ring.
 * Fine-pointer desktops only; off for touch / reduced motion.
 */
export function CustomCursor() {
  const enabled = useMediaQuery(
    "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)"
  );

  const rootRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });
  const mode = useRef<CursorMode>("default");
  const visible = useRef(false);
  const raf = useRef(0);

  useEffect(() => {
    const html = document.documentElement;
    if (!enabled) {
      html.classList.remove("has-custom-cursor", "is-cursor-down");
      return;
    }

    html.classList.add("has-custom-cursor");

    const applyMode = (next: CursorMode) => {
      mode.current = next;
      const el = rootRef.current;
      if (!el) return;
      el.dataset.mode = next;
      const show = visible.current && next !== "hidden" && next !== "text";
      el.dataset.visible = show ? "true" : "false";
    };

    const onMove = (e: PointerEvent) => {
      pos.current.x = e.clientX;
      pos.current.y = e.clientY;
      if (!visible.current) {
        visible.current = true;
        ring.current.x = e.clientX;
        ring.current.y = e.clientY;
      }
      applyMode(interactiveTarget(e.target));
    };

    const onLeave = () => {
      visible.current = false;
      applyMode(mode.current);
    };

    const onDown = () => html.classList.add("is-cursor-down");
    const onUp = () => html.classList.remove("is-cursor-down");

    const tick = () => {
      const { x, y } = pos.current;
      // Snappy follow — reads like UI chrome, not a floaty trail.
      ring.current.x += (x - ring.current.x) * 0.35;
      ring.current.y += (y - ring.current.y) * 0.35;

      if (coreRef.current) {
        coreRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0) translate(-50%, -50%)`;
      }
      raf.current = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    raf.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf.current);
      html.classList.remove("has-custom-cursor", "is-cursor-down");
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={rootRef}
      className="custom-cursor"
      data-mode="default"
      data-visible="false"
      aria-hidden="true"
    >
      <div ref={ringRef} className="custom-cursor-ring" />
      <div ref={coreRef} className="custom-cursor-core" />
    </div>
  );
}
