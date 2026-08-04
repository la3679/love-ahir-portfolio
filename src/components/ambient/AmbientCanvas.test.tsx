import { act, render } from "@testing-library/react";
import { useRef } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AmbientCanvas from "./AmbientCanvas";

const originalMatchMedia = window.matchMedia;
const originalGetContext = HTMLCanvasElement.prototype.getContext;
const originalResizeObserver = window.ResizeObserver;
const originalIntersectionObserver = window.IntersectionObserver;

const disconnectResize = vi.fn();
const disconnectIntersection = vi.fn();
let frameCallbacks: FrameRequestCallback[] = [];

function fakeContext() {
  return {
    setTransform: vi.fn(),
    clearRect: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    globalAlpha: 1,
    strokeStyle: "",
    fillStyle: "",
    lineWidth: 1,
  } as unknown as CanvasRenderingContext2D;
}

const rect = {
  left: 0,
  top: 0,
  right: 1200,
  bottom: 760,
  width: 1200,
  height: 760,
  x: 0,
  y: 0,
  toJSON: () => ({}),
} as DOMRect;

function mockMedia() {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: query.includes("prefers-reduced-motion") ? false : true,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

const Harness = ({
  onReady,
  onFail,
  onUnavailable,
}: {
  onReady: () => void;
  onFail: () => void;
  onUnavailable: () => void;
}) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const excludeRef = useRef<HTMLDivElement>(null);
  return (
    <div ref={hostRef} data-testid="host">
      <div ref={excludeRef} data-testid="excluded" />
      <AmbientCanvas
        hostRef={hostRef}
        excludeRef={excludeRef}
        onReady={onReady}
        onFail={onFail}
        onUnavailable={onUnavailable}
      />
    </div>
  );
};

beforeEach(() => {
  frameCallbacks = [];
  disconnectResize.mockClear();
  disconnectIntersection.mockClear();
  mockMedia();
  HTMLCanvasElement.prototype.getContext = vi.fn(() =>
    fakeContext(),
  ) as unknown as typeof HTMLCanvasElement.prototype.getContext;
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue(rect);
  vi.stubGlobal(
    "requestAnimationFrame",
    vi.fn((callback: FrameRequestCallback) => {
      frameCallbacks.push(callback);
      return frameCallbacks.length;
    }),
  );
  vi.stubGlobal("cancelAnimationFrame", vi.fn());

  window.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {
      disconnectResize();
    }
  } as unknown as typeof ResizeObserver;
  window.IntersectionObserver = class {
    root = null;
    rootMargin = "";
    thresholds = [];
    observe() {}
    unobserve() {}
    takeRecords() {
      return [];
    }
    disconnect() {
      disconnectIntersection();
    }
  } as unknown as typeof IntersectionObserver;
});
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  window.matchMedia = originalMatchMedia;
  HTMLCanvasElement.prototype.getContext = originalGetContext;
  window.ResizeObserver = originalResizeObserver;
  window.IntersectionObserver = originalIntersectionObserver;
});

describe("AmbientCanvas lifecycle", () => {
  it("draws once, announces readiness, and cleans up every observer and frame", () => {
    const onReady = vi.fn();
    const onFail = vi.fn();
    const onUnavailable = vi.fn();
    const { unmount } = render(
      <Harness
        onReady={onReady}
        onFail={onFail}
        onUnavailable={onUnavailable}
      />,
    );

    expect(frameCallbacks.length).toBeGreaterThan(0);
    const first = frameCallbacks.shift();
    act(() => first?.(100));
    expect(onReady).toHaveBeenCalledTimes(1);
    expect(onFail).not.toHaveBeenCalled();
    expect(onUnavailable).not.toHaveBeenCalled();

    unmount();
    expect(disconnectResize).toHaveBeenCalledTimes(1);
    expect(disconnectIntersection).toHaveBeenCalledTimes(1);
    expect(cancelAnimationFrame).toHaveBeenCalled();
  });

  it("cancels while hidden and schedules a fresh frame when visible again", () => {
    const descriptor = Object.getOwnPropertyDescriptor(Document.prototype, "hidden");
    const { unmount } = render(
      <Harness onReady={vi.fn()} onFail={vi.fn()} onUnavailable={vi.fn()} />,
    );
    const before = frameCallbacks.length;

    Object.defineProperty(document, "hidden", {
      value: true,
      configurable: true,
    });
    act(() => document.dispatchEvent(new Event("visibilitychange")));
    expect(cancelAnimationFrame).toHaveBeenCalled();

    Object.defineProperty(document, "hidden", {
      value: false,
      configurable: true,
    });
    act(() => document.dispatchEvent(new Event("visibilitychange")));
    expect(frameCallbacks.length).toBeGreaterThan(before);

    unmount();
    if (descriptor) Object.defineProperty(Document.prototype, "hidden", descriptor);
    else Reflect.deleteProperty(document as unknown as Record<string, unknown>, "hidden");
  });
});
