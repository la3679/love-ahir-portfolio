import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import VoxelField from "./VoxelField";
import {
  createContextCalls,
  createHarness,
  stubContext,
  stubMatchMedia,
  type ContextCalls,
  type MediaState,
} from "./fxTestHarness";
import { voxelCount } from "@/lib/fxVoxels";

const VIEWPORT = { width: 1440, height: 900 };
const FACES_PER_CUBE = 3;
const Harness = createHarness(VoxelField);

let calls: ContextCalls;
let rafQueue: FrameRequestCallback[] = [];
let media: MediaState;

const originalGetContext = HTMLCanvasElement.prototype.getContext;
const originalMatchMedia = window.matchMedia;
const originalRaf = window.requestAnimationFrame;
const originalCancelRaf = window.cancelAnimationFrame;

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
  calls = createContextCalls();
  rafQueue = [];
  media = { reducedMotion: false, finePointer: true };

  vi.useFakeTimers();
  HTMLCanvasElement.prototype.getContext = (() =>
    stubContext(calls)) as unknown as typeof HTMLCanvasElement.prototype.getContext;
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
  stubMatchMedia(media);
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

describe("VoxelField", () => {
  it("marks its canvas so the additive voxel CSS can target it", () => {
    const { container } = render(<Harness />);
    const canvas = container.querySelector("canvas");

    expect(canvas).toHaveClass("fx__canvas", "fx__canvas--voxel");
    expect(canvas).toHaveAttribute("data-fx-voxel", "true");
  });

  it("draws zero connecting lines and zero round dots", () => {
    render(<Harness />);
    advanceFrames(3);

    // The whole point of the swap: no link pass, no arcs, anywhere, ever.
    expect(calls.stroke).toBe(0);
    expect(calls.arc).toBe(0);
  });

  it("draws three flat faces per cube", () => {
    render(<Harness />);
    advanceFrames(1);

    expect(calls.fill).toBe(
      voxelCount(VIEWPORT.width, VIEWPORT.height) * FACES_PER_CUBE,
    );
  });

  it("shades the three faces at descending alpha", () => {
    render(<Harness />);
    advanceFrames(1);

    // Faces are emitted top, right, left per cube.
    const [top, right, left] = calls.fillAlphas;
    expect(top).toBeGreaterThan(right);
    expect(right).toBeGreaterThan(left);
    expect(left).toBeGreaterThan(0);
    // The field must stay behind the copy, never in front of it.
    expect(top).toBeLessThan(0.4);
  });

  it("caps the backing store at 2x device pixels", () => {
    const { container } = render(<Harness />);
    const canvas = container.querySelector("canvas") as HTMLCanvasElement;

    expect(canvas.width).toBe(VIEWPORT.width * 2);
    expect(canvas.height).toBe(VIEWPORT.height * 2);
    expect(calls.setTransform.at(-1)).toEqual([2, 0, 0, 2, 0, 0]);
  });

  it("clears and redraws every frame", () => {
    render(<Harness />);
    advanceFrames(1);
    expect(calls.clearRect).toBe(1);

    advanceFrames(2);
    expect(calls.clearRect).toBe(3);
  });

  it("pauses in a background tab and resumes on return", () => {
    render(<Harness />);
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
    render(<Harness />);
    calls.setTransform.length = 0;

    act(() => window.dispatchEvent(new Event("resize")));
    act(() => vi.advanceTimersByTime(149));
    expect(calls.setTransform).toHaveLength(0);

    act(() => vi.advanceTimersByTime(1));
    expect(calls.setTransform).toHaveLength(1);
  });

  it("paints one static frame and starts no loop under reduced motion", () => {
    media.reducedMotion = true;
    stubMatchMedia(media);
    const { container } = render(<Harness />);

    expect(container.querySelector("[data-fx-layer]")).toHaveAttribute(
      "data-fx-static",
      "true",
    );
    expect(calls.clearRect).toBe(1);
    expect(calls.fill).toBeGreaterThan(0);
    expect(rafQueue).toHaveLength(0);
  });

  it("stops the loop and detaches everything on unmount", () => {
    const removeSpy = vi.spyOn(window, "removeEventListener");
    const { unmount } = render(<Harness />);
    advanceFrames(1);

    unmount();
    const drawn = calls.clearRect;
    advanceFrames(3);

    expect(calls.clearRect).toBe(drawn);
    expect(removeSpy).toHaveBeenCalledWith("resize", expect.any(Function));
    removeSpy.mockRestore();
  });

  it("renders nothing when no 2D context is available", () => {
    HTMLCanvasElement.prototype.getContext = (() =>
      null) as unknown as typeof HTMLCanvasElement.prototype.getContext;

    const { container } = render(<Harness />);

    expect(container.querySelector(".fx__canvas--voxel")).toBeInTheDocument();
    expect(rafQueue).toHaveLength(0);
  });
});
