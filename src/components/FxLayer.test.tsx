import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import FxLayer from "./FxLayer";
import { fxParticleBudget } from "@/lib/fxField";

const originalWidth = window.innerWidth;
const originalHeight = window.innerHeight;

function setViewport(width: number, height: number) {
  Object.defineProperty(window, "innerWidth", { configurable: true, value: width });
  Object.defineProperty(window, "innerHeight", { configurable: true, value: height });
}

beforeEach(() => {
  vi.useFakeTimers();
  setViewport(1200, 760);
});

afterEach(() => {
  vi.useRealTimers();
  setViewport(originalWidth, originalHeight);
});

describe("FxLayer", () => {
  it("renders one inert fixed-layer structure with three orbs", () => {
    const { container } = render(<FxLayer />);
    const layer = container.querySelector("[data-fx-layer]");
    expect(layer).toHaveClass("fx");
    expect(layer).toHaveAttribute("aria-hidden", "true");
    expect(layer?.querySelector(".fx__constellation")).toBeInTheDocument();
    expect(layer?.querySelectorAll(".orb")).toHaveLength(3);
    expect(layer?.querySelectorAll("[data-fx-node]")).toHaveLength(
      fxParticleBudget(1200, 760),
    );
    expect(
      layer?.querySelectorAll('a,button,input,select,textarea,[tabindex="0"]'),
    ).toHaveLength(0);
  });

  it("regenerates its area-based budget after a 150ms resize debounce", () => {
    const { container } = render(<FxLayer />);
    setViewport(390, 844);
    act(() => window.dispatchEvent(new Event("resize")));

    act(() => vi.advanceTimersByTime(149));
    expect(container.querySelectorAll("[data-fx-node]")).toHaveLength(
      fxParticleBudget(1200, 760),
    );

    act(() => vi.advanceTimersByTime(1));
    expect(container.querySelectorAll("[data-fx-node]")).toHaveLength(
      fxParticleBudget(390, 844),
    );
  });
});
