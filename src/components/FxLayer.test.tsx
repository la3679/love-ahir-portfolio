import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import FxLayer from "./FxLayer";
import { fxParticleCount } from "@/lib/fxParticles";

const VIEWPORT = { width: 1440, height: 900 };

interface ContextCalls {
  clearRect: number;
  arc: number;
  stroke: number;
  setTransform: number[][];
  alphas: number[];
}

let calls: ContextCalls;
let rafQueue: FrameRequestCallback[] = [];
let reducedMotion = false;
let finePointer = true;

/** A 2D context stub — jsdom has no canvas backend at all. */
function stubContext(): CanvasRenderingContext2D {
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
    arc: () => {
      calls.arc += 1;
    },
    fill: () => {},
    moveTo: () => {},
    lineTo: () => {},
    stroke: () => {
      calls.stroke += 1;
      calls.alphas.push(context.globalAlpha);
    },
  };
  return context as unknown as CanvasRenderingContext2D;
}

const originalGetContext = HTMLCanvasElement.prototype.getContext;
const originalMatchMedia = window.matchMedia;
const originalRaf = window.requestAnimationFrame;
const originalCancelRaf = window.cancelAnimationFrame;

/** Advance the canvas loop by exactly `count` frames. */
function advanceFrames(count: number) {
  act(() => {
    for (let i = 0; i < count; i += 1) {
      const queued = rafQueue;
      rafQueue = [];
      for (const callback of queued) callback(performance.now());
    }
  });
}

beforeEach(() => {
  calls = { clearRect: 0, arc: 0, stroke: 0, setTransform: [], alphas: [] };
  rafQueue = [];
  reducedMotion = false;
  finePointer = true;

  vi.useFakeTimers();
  HTMLCanvasElement.prototype.getContext = (() =>
    stubContext()) as unknown as typeof HTMLCanvasElement.prototype.getContext;
  // jsdom reports 0 for every layout box; the FX canvas fills the viewport.
  Object.defineProperty(HTMLCanvasElement.prototype, "clientWidth", {
    configurable: true,
    value: VIEWPORT.width,
  });
  Object.defineProperty(HTMLCanvasElement.prototype, "clientHeight", {
    configurable: true,
    value: VIEWPORT.height,
  });
  Object.defineProperty(window, "devicePixelRatio", {
    configurable: true,
    value: 3,
  });
  window.matchMedia = ((query: string) =>
    ({
      matches: query.includes("pointer: fine") ? finePointer : reducedMotion,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }) as unknown as MediaQueryList) as typeof window.matchMedia;
  window.requestAnimationFrame = ((callback: FrameRequestCallback) =>
    rafQueue.push(callback)) as unknown as typeof window.requestAnimationFrame;
  window.cancelAnimationFrame = (() => {
    rafQueue = [];
  }) as unknown as typeof window.cancelAnimationFrame;
});

afterEach(() => {
  vi.useRealTimers();
  HTMLCanvasElement.prototype.getContext = originalGetContext;
  window.matchMedia = originalMatchMedia;
  window.requestAnimationFrame = originalRaf;
  window.cancelAnimationFrame = originalCancelRaf;
});

describe("FxLayer", () => {
  it("renders the five inert depth planes", () => {
    const { container } = render(<FxLayer />);
    const layer = container.querySelector("[data-fx-layer]");

    expect(layer).toHaveClass("fx");
    expect(layer).toHaveAttribute("aria-hidden", "true");
    expect(layer?.querySelector(".fx__canvas")).toBeInTheDocument();
    expect(layer?.querySelector(".fx__mesh")).toBeInTheDocument();
    expect(layer?.querySelector(".fx__grid")).toBeInTheDocument();
    expect(layer?.querySelector(".fx__noise")).toBeInTheDocument();
    expect(layer?.querySelectorAll(".orb")).toHaveLength(3);
    expect(
      layer?.querySelectorAll('a,button,input,select,textarea,[tabindex="0"]'),
    ).toHaveLength(0);
  });

  it("gives the mesh and the orb group their own scroll-depth factors", () => {
    const { container } = render(<FxLayer />);
    expect(container.querySelector(".fx__mesh")).toHaveAttribute(
      "data-scroll-depth",
      "-0.04",
    );
    expect(container.querySelector(".fx__orbs")).toHaveAttribute(
      "data-scroll-depth",
      "-0.02",
    );
  });

  it("caps the backing store at 2x device pixels and keeps the maths in CSS pixels", () => {
    const { container } = render(<FxLayer />);
    const canvas = container.querySelector("canvas") as HTMLCanvasElement;

    // devicePixelRatio is 3 in this environment; the cap is 2.
    expect(canvas.width).toBe(VIEWPORT.width * 2);
    expect(canvas.height).toBe(VIEWPORT.height * 2);
    expect(calls.setTransform.at(-1)).toEqual([2, 0, 0, 2, 0, 0]);
  });

  it("clears and redraws every frame", () => {
    render(<FxLayer />);
    advanceFrames(1);
    const afterFirst = calls.arc;

    expect(calls.clearRect).toBe(1);
    expect(afterFirst).toBe(fxParticleCount(VIEWPORT.width, VIEWPORT.height));

    advanceFrames(2);
    expect(calls.clearRect).toBe(3);
    expect(calls.arc).toBe(afterFirst * 3);
  });

  it("fades every link by distance rather than stroking at full alpha", () => {
    render(<FxLayer />);
    advanceFrames(1);

    expect(calls.stroke).toBeGreaterThan(0);
    for (const alpha of calls.alphas) {
      expect(alpha).toBeGreaterThan(0);
      expect(alpha).toBeLessThan(1);
    }
  });

  it("pauses in a background tab and resumes on return", () => {
    render(<FxLayer />);
    advanceFrames(1);
    const drawn = calls.clearRect;

    Object.defineProperty(document, "hidden", { configurable: true, value: true });
    act(() => document.dispatchEvent(new Event("visibilitychange")));
    advanceFrames(3);
    expect(calls.clearRect).toBe(drawn);

    Object.defineProperty(document, "hidden", { configurable: true, value: false });
    act(() => document.dispatchEvent(new Event("visibilitychange")));
    advanceFrames(1);
    expect(calls.clearRect).toBe(drawn + 1);
  });

  it("rebuilds after a 150ms resize debounce", () => {
    render(<FxLayer />);
    calls.setTransform.length = 0;

    act(() => window.dispatchEvent(new Event("resize")));
    act(() => vi.advanceTimersByTime(149));
    expect(calls.setTransform).toHaveLength(0);

    act(() => vi.advanceTimersByTime(1));
    expect(calls.setTransform).toHaveLength(1);
  });

  it("paints one static frame and starts no loop under reduced motion", () => {
    reducedMotion = true;
    const { container } = render(<FxLayer />);

    expect(container.querySelector("[data-fx-layer]")).toHaveAttribute(
      "data-fx-static",
      "true",
    );
    expect(calls.clearRect).toBe(1);
    expect(rafQueue).toHaveLength(0);
  });

  it("stops the loop and detaches everything on unmount", () => {
    const removeSpy = vi.spyOn(window, "removeEventListener");
    const { unmount } = render(<FxLayer />);
    advanceFrames(1);

    unmount();
    const drawn = calls.clearRect;
    advanceFrames(3);

    expect(calls.clearRect).toBe(drawn);
    expect(removeSpy).toHaveBeenCalledWith("resize", expect.any(Function));
    removeSpy.mockRestore();
  });

  it("renders the static planes when no 2D context is available", () => {
    HTMLCanvasElement.prototype.getContext = (() =>
      null) as unknown as typeof HTMLCanvasElement.prototype.getContext;

    const { container } = render(<FxLayer />);

    expect(container.querySelector(".fx__canvas")).toBeInTheDocument();
    expect(container.querySelectorAll(".orb")).toHaveLength(3);
    expect(rafQueue).toHaveLength(0);
  });
});
