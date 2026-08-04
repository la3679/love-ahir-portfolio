import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import HeroAmbient from "./HeroAmbient";

const originalMatchMedia = window.matchMedia;
const originalGetContext = HTMLCanvasElement.prototype.getContext;
const hiddenDescriptor = Object.getOwnPropertyDescriptor(Document.prototype, "hidden");

function mockMedia({ fine = true, reduced = false } = {}) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: query.includes("prefers-reduced-motion") ? reduced : fine,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

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

beforeEach(() => {
  vi.useFakeTimers();
  mockMedia();
  vi.stubGlobal("requestAnimationFrame", vi.fn(() => 1));
  vi.stubGlobal("cancelAnimationFrame", vi.fn());
  HTMLCanvasElement.prototype.getContext = vi.fn(() =>
    fakeContext(),
  ) as unknown as typeof HTMLCanvasElement.prototype.getContext;
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  window.matchMedia = originalMatchMedia;
  HTMLCanvasElement.prototype.getContext = originalGetContext;
  Reflect.deleteProperty(
    navigator as unknown as Record<string, unknown>,
    "connection",
  );
  if (hiddenDescriptor) {
    Object.defineProperty(Document.prototype, "hidden", hiddenDescriptor);
  }
});

async function passIdleGate() {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(700);
  });
  await act(async () => {
    await vi.dynamicImportSettled();
    await Promise.resolve();
  });
}

describe("HeroAmbient", () => {
  it("renders an authored SVG synchronously with no canvas or focus target", () => {
    const { container } = render(<HeroAmbient />);
    const layer = container.querySelector("[data-hero-ambient]");

    expect(layer).toHaveAttribute("aria-hidden", "true");
    expect(layer?.querySelector("[data-ambient-fallback]")).toBeInTheDocument();
    expect(layer?.querySelector("canvas")).toBeNull();
    expect(
      layer?.querySelectorAll('a,button,input,select,textarea,[tabindex="0"]'),
    ).toHaveLength(0);
  });

  it("keeps reduced-motion visitors on the static field", async () => {
    mockMedia({ fine: true, reduced: true });
    const { container } = render(<HeroAmbient />);
    await passIdleGate();
    expect(container.querySelector("[data-ambient-fallback]")).toBeInTheDocument();
    expect(container.querySelector("canvas")).toBeNull();
  });

  it("keeps coarse or non-hover pointers on the static field", async () => {
    mockMedia({ fine: false, reduced: false });
    const { container } = render(<HeroAmbient />);
    await passIdleGate();
    expect(container.querySelector("canvas")).toBeNull();
  });

  it("honours Save-Data without requesting the live renderer", async () => {
    Object.defineProperty(navigator, "connection", {
      value: { saveData: true },
      configurable: true,
    });
    const { container } = render(<HeroAmbient />);
    await passIdleGate();
    expect(container.querySelector("canvas")).toBeNull();
  });

  it("mounts exactly one lazy 2D canvas after the delayed gate", async () => {
    const { container } = render(<HeroAmbient />);
    expect(container.querySelector("canvas")).toBeNull();
    await passIdleGate();

    const canvases = container.querySelectorAll("[data-ambient-canvas]");
    expect(canvases).toHaveLength(1);
    expect(canvases[0]).toHaveAttribute("aria-hidden", "true");
    expect(canvases[0]).toHaveAttribute("tabindex", "-1");
  });

  it("restores the authored fallback when a 2D context is unavailable", async () => {
    HTMLCanvasElement.prototype.getContext = vi.fn(() =>
      null,
    ) as unknown as typeof HTMLCanvasElement.prototype.getContext;
    const { container } = render(<HeroAmbient />);
    await passIdleGate();

    expect(container.querySelector("canvas")).toBeNull();
    expect(container.querySelector("[data-ambient-fallback]")).not.toHaveClass(
      "opacity-0",
    );
  });
});
