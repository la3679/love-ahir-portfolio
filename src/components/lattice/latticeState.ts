import { createContext, useCallback, useContext, useRef } from "react";
import type { SystemLayer } from "./layers";

/**
 * Shared state for the one procedural scene (IMPLEMENTATION.md §31.5).
 *
 * The scene is driven by *which section is on screen*, never by mapping scroll
 * pixels to camera movement. There is no scroll listener anywhere in the
 * lattice: a single IntersectionObserver (owned by `LatticeProvider`) watches
 * the registered sections and the most visible one wins. Native scrolling is
 * never intercepted, smoothed or modified.
 *
 * The provider lives in its own file so this module exports no components —
 * that keeps React Fast Refresh working for both.
 */

/** Section states, in page order. `calm` is the settled lower-page state. */
export type SceneSection =
  | "hero"
  | "proof"
  | "about"
  | "experience"
  | "projects"
  | "calm";

export type { SystemLayer } from "./layers";

export interface LatticeState {
  section: SceneSection;
  /** The layer currently highlighted, or null when nothing is selected. */
  activeLayer: SystemLayer | null;
  setActiveLayer: (layer: SystemLayer | null) => void;
  /**
   * A restrained, global "someone is engaging here" state, used by the proof
   * strip on hover/focus. Deliberately a single boolean: mapping a metric onto
   * a scene layer would invent an association between a metric and a project,
   * which the content rules forbid.
   */
  emphasis: boolean;
  setEmphasis: (on: boolean) => void;
  /** Registers a section element with the shared observer. */
  register: (
    element: Element | null,
    section: SceneSection,
    previous?: Element | null,
  ) => void;
}

export const LatticeContext = createContext<LatticeState | null>(null);

/**
 * Read the shared scene state.
 *
 * Returns an inert value outside a provider so every section component stays
 * renderable on its own — in a unit test, on a secondary route, or if the
 * provider is ever removed.
 */
export function useLattice(): LatticeState {
  const context = useContext(LatticeContext);
  return (
    context ?? {
      section: "hero",
      activeLayer: null,
      setActiveLayer: () => undefined,
      emphasis: false,
      setEmphasis: () => undefined,
      register: () => undefined,
    }
  );
}

/**
 * Attach the returned ref to a section to make it drive the scene state.
 * Purely additive — the section renders identically without it.
 */
export function useSceneSection(name: SceneSection) {
  const { register } = useLattice();
  const previous = useRef<HTMLElement | null>(null);
  return useCallback(
    (element: HTMLElement | null) => {
      register(element, name, previous.current);
      previous.current = element;
    },
    [register, name],
  );
}
