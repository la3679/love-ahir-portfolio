import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { SystemLayer } from "./layers";
import {
  LatticeContext,
  type LatticeState,
  type SceneSection,
} from "./latticeState";

/**
 * Owns the single IntersectionObserver that drives the shared scene.
 *
 * One observer for every registered section, not one per section — and it is
 * disconnected with the tree. There is deliberately no scroll listener: section
 * visibility is the input, so native scrolling is never touched.
 */
export const LatticeProvider = ({ children }: { children: ReactNode }) => {
  const [section, setSection] = useState<SceneSection>("hero");
  const [activeLayer, setActiveLayer] = useState<SystemLayer | null>(null);
  const [emphasis, setEmphasis] = useState(false);

  const sections = useRef(new Map<Element, SceneSection>());
  const ratios = useRef(new Map<Element, number>());
  const observer = useRef<IntersectionObserver | null>(null);

  // Created lazily so the observer only exists once something registers, and
  // so an environment without IntersectionObserver simply keeps the initial
  // state rather than throwing.
  const getObserver = useCallback(() => {
    if (observer.current) return observer.current;
    if (typeof IntersectionObserver === "undefined") return null;

    observer.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.current.set(
            entry.target,
            entry.isIntersecting ? entry.intersectionRatio : 0,
          );
        }

        let best: SceneSection = "calm";
        let bestRatio = 0;
        for (const [element, ratio] of ratios.current) {
          const name = sections.current.get(element);
          if (name && ratio > bestRatio) {
            best = name;
            bestRatio = ratio;
          }
        }

        // Nothing meaningfully on screen means the reader is past the spatial
        // zone, so the scene settles instead of tracking an arbitrary section.
        setSection(bestRatio > 0.08 ? best : "calm");
      },
      { threshold: [0, 0.1, 0.25, 0.5, 0.75] },
    );

    return observer.current;
  }, []);

  const register = useCallback(
    (
      element: Element | null,
      name: SceneSection,
      previous: Element | null = null,
    ) => {
      const io = getObserver();
      if (!io) return;

      if (previous && previous !== element) {
        io.unobserve(previous);
        sections.current.delete(previous);
        ratios.current.delete(previous);
      }

      if (!element) return;
      sections.current.set(element, name);
      io.observe(element);
    },
    [getObserver],
  );

  useEffect(() => {
    // Captured into locals so the cleanup releases the maps this render owned,
    // rather than reading a ref that may have been swapped by then.
    const sectionMap = sections.current;
    const ratioMap = ratios.current;
    return () => {
      observer.current?.disconnect();
      observer.current = null;
      sectionMap.clear();
      ratioMap.clear();
    };
  }, []);

  const value = useMemo<LatticeState>(
    () => ({ section, activeLayer, setActiveLayer, emphasis, setEmphasis, register }),
    [section, activeLayer, emphasis, register],
  );

  return <LatticeContext.Provider value={value}>{children}</LatticeContext.Provider>;
};

export default LatticeProvider;
