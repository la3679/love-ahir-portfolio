import { useRef, type ComponentType, type RefObject } from "react";
import { vi } from "vitest";

/**
 * Shared scaffolding for the two canvas-renderer suites.
 *
 * Both renderers have the same lifecycle contract — DPR-capped backing store,
 * one rAF loop, visibility pause, debounced resize rebuild, reduced-motion
 * static frame, full teardown — so both suites drive them the same way. Only
 * the drawing assertions differ.
 */

export interface ContextCalls {
  clearRect: number;
  setTransform: number[][];
  /** Constellation only. Cubes must never produce these. */
  arc: number;
  stroke: number;
  /** Voxel only: three flat face fills per cube. */
  fill: number;
  /** Kept apart: the constellation fills dots and strokes links at different
      alphas, so a single merged list cannot assert either one. */
  fillAlphas: number[];
  strokeAlphas: number[];
}

export function createContextCalls(): ContextCalls {
  return {
    clearRect: 0,
    setTransform: [],
    arc: 0,
    stroke: 0,
    fill: 0,
    fillAlphas: [],
    strokeAlphas: [],
  };
}

/** A 2D context stub — jsdom has no canvas backend at all. */
export function stubContext(calls: ContextCalls): CanvasRenderingContext2D {
  const context = {
    globalAlpha: 1,
    fillStyle: "",
    strokeStyle: "",
    lineWidth: 1,
    clearRect: () => {
      calls.clearRect += 1;
    },
    setTransform: (...args: number[]) => {
      calls.setTransform.push(args);
    },
    beginPath: () => {},
    closePath: () => {},
    arc: () => {
      calls.arc += 1;
    },
    fill: () => {
      calls.fill += 1;
      calls.fillAlphas.push(context.globalAlpha);
    },
    moveTo: () => {},
    lineTo: () => {},
    stroke: () => {
      calls.stroke += 1;
      calls.strokeAlphas.push(context.globalAlpha);
    },
  };
  return context as unknown as CanvasRenderingContext2D;
}

export interface MediaState {
  reducedMotion: boolean;
  finePointer: boolean;
}

export function stubMatchMedia(state: MediaState) {
  window.matchMedia = ((query: string) =>
    ({
      matches: query.includes("pointer: fine")
        ? state.finePointer
        : state.reducedMotion,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }) as unknown as MediaQueryList) as typeof window.matchMedia;
}

export interface FieldProps {
  hostRef: RefObject<HTMLDivElement>;
}

/** Mounts a renderer under a `.fx` host, exactly as `FxLayer` does. */
export function createHarness(Field: ComponentType<FieldProps>) {
  return function Harness() {
    const hostRef = useRef<HTMLDivElement>(null);
    return (
      <div ref={hostRef} className="fx" data-fx-layer="true">
        <Field hostRef={hostRef} />
      </div>
    );
  };
}
