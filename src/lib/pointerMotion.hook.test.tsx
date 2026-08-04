import { fireEvent, render, screen } from "@testing-library/react";
import { useRef } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { usePointerDepth, type PointerDepthSurface } from "./pointerMotion";

const originalMatchMedia = window.matchMedia;

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

const rect = {
  left: 100,
  top: 50,
  right: 500,
  bottom: 650,
  width: 400,
  height: 600,
  x: 100,
  y: 50,
  toJSON: () => ({}),
} as DOMRect;

function dispatchPointer(
  target: Window | HTMLElement,
  type: string,
  properties: Record<string, string | number>,
) {
  const event = new Event(type, { bubbles: true });
  for (const [key, value] of Object.entries(properties)) {
    Object.defineProperty(event, key, { value, configurable: true });
  }
  fireEvent(target, event);
}

const Surface = ({
  surface = "stage",
  allowCoarseDrag = false,
}: {
  surface?: PointerDepthSurface;
  allowCoarseDrag?: boolean;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  usePointerDepth(ref, surface, { allowCoarseDrag });
  return <div ref={ref} data-testid="surface" />;
};

beforeEach(() => {
  mockMedia();
  let frame = 0;
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
    callback(0);
    frame += 1;
    return frame;
  });
  vi.stubGlobal("cancelAnimationFrame", vi.fn());
});

afterEach(() => {
  window.matchMedia = originalMatchMedia;
  vi.unstubAllGlobals();
});

describe("usePointerDepth", () => {
  it("tracks a fine pointer against the surface and reliably resets outside it", () => {
    render(<Surface />);
    const surface = screen.getByTestId("surface");
    surface.getBoundingClientRect = () => rect;

    dispatchPointer(window, "pointermove", {
      clientX: 500,
      clientY: 50,
      pointerType: "mouse",
    });

    expect(surface).toHaveAttribute("data-depth-active", "true");
    expect(surface.style.getPropertyValue("--depth-ry")).toBe("2.20deg");
    expect(surface.style.getPropertyValue("--depth-x")).toBe("5.00px");

    // Bounds-aware window tracking covers fast exits that skip pointerleave.
    dispatchPointer(window, "pointermove", {
      clientX: 20,
      clientY: 20,
      pointerType: "mouse",
    });

    expect(surface).not.toHaveAttribute("data-depth-active");
    expect(surface.style.getPropertyValue("--depth-ry")).toBe("0.00deg");
    expect(surface.style.getPropertyValue("--depth-x")).toBe("0.00px");
  });

  it("keeps every surface neutral when reduced motion is requested", () => {
    mockMedia({ fine: true, reduced: true });
    render(<Surface surface="portrait" />);
    const surface = screen.getByTestId("surface");
    surface.getBoundingClientRect = () => rect;

    dispatchPointer(window, "pointermove", {
      clientX: 500,
      clientY: 50,
      pointerType: "mouse",
    });

    expect(surface).not.toHaveAttribute("data-depth-active");
    expect(surface.style.getPropertyValue("--depth-rx")).toBe("0.00deg");
    expect(surface.style.getPropertyValue("--depth-scale")).toBe("1.0000");
  });

  it("allows a smaller touch drag on the hero without making it a control", () => {
    mockMedia({ fine: false, reduced: false });
    render(<Surface allowCoarseDrag />);
    const surface = screen.getByTestId("surface");
    surface.getBoundingClientRect = () => rect;

    dispatchPointer(surface, "pointerdown", {
      clientX: 500,
      clientY: 50,
      pointerType: "touch",
      pointerId: 7,
    });

    expect(surface).toHaveAttribute("data-depth-active", "true");
    expect(surface.style.getPropertyValue("--depth-ry")).not.toBe("0.00deg");
    expect(surface).not.toHaveAttribute("role");
    expect(surface).not.toHaveAttribute("tabindex");

    dispatchPointer(surface, "pointerup", { pointerType: "touch", pointerId: 7 });
    expect(surface).not.toHaveAttribute("data-depth-active");
  });
});
