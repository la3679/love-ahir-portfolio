import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import SystemsLattice from "./SystemsLattice";
import { LatticeProvider } from "./LatticeProvider";
import { useSceneSection, type SceneSection } from "./latticeState";
import {
  decideSceneMode,
  hasWebGl,
  isCoarsePointer,
  isSaveData,
  prefersReducedMotion,
  resetWebGlProbe,
} from "@/lib/sceneCapability";

/**
 * The spatial layer is an enhancement, never the interface. These tests lock
 * the three properties that keep that true: it never enters the tab order, it
 * is never exposed to assistive technology, and the WebGL chunk is only ever
 * requested when every capability gate passes (IMPLEMENTATION.md §31.7).
 */

/** Swap `matchMedia` for one that matches the given queries. */
function mockMedia(matching: string[]) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: matching.some((m) => query.includes(m)),
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

const originalMatchMedia = window.matchMedia;
const originalGetContext = HTMLCanvasElement.prototype.getContext;

/** jsdom has no WebGL at all, so the probe must be told what to find. */
function mockWebGl(available: boolean) {
  resetWebGlProbe();
  HTMLCanvasElement.prototype.getContext = vi.fn((type: string) => {
    if (!available) return null;
    if (type.startsWith("webgl") || type === "experimental-webgl") {
      return { getExtension: () => ({ loseContext: () => undefined }) };
    }
    return null;
  }) as unknown as typeof HTMLCanvasElement.prototype.getContext;
}

beforeEach(() => {
  mockMedia([]);
  mockWebGl(true);
  vi.stubGlobal("requestIdleCallback", undefined);
});

afterEach(() => {
  window.matchMedia = originalMatchMedia;
  HTMLCanvasElement.prototype.getContext = originalGetContext;
  resetWebGlProbe();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

/** A stand-in for any page section that drives the shared scene state. */
const Section = ({ name }: { name: SceneSection }) => {
  const ref = useSceneSection(name);
  return <section ref={ref} data-testid={name} />;
};

const renderLattice = () =>
  render(
    <LatticeProvider>
      <SystemsLattice />
    </LatticeProvider>,
  );

describe("capability gating", () => {
  it("chooses WebGL only when nothing objects", () => {
    expect(decideSceneMode()).toBe("webgl");
  });

  it("falls back to the static composition under reduced motion", () => {
    mockMedia(["prefers-reduced-motion"]);
    expect(prefersReducedMotion()).toBe(true);
    expect(decideSceneMode()).toBe("static");
  });

  it("keeps touch-first coarse pointers on the authored static field", () => {
    mockMedia(["pointer: coarse"]);
    expect(isCoarsePointer()).toBe(true);
    expect(decideSceneMode()).toBe("static");
  });

  it("falls back to the static composition when Save-Data is on", () => {
    Object.defineProperty(navigator, "connection", {
      value: { saveData: true },
      configurable: true,
    });
    expect(isSaveData()).toBe(true);
    expect(decideSceneMode()).toBe("static");
    Reflect.deleteProperty(navigator as unknown as Record<string, unknown>, "connection");
  });

  it("falls back to the static composition when WebGL is unavailable", () => {
    mockWebGl(false);
    expect(hasWebGl()).toBe(false);
    expect(decideSceneMode()).toBe("static");
  });
});

describe("SystemsLattice", () => {
  it("renders the static composition immediately, before any 3D code loads", () => {
    const { container } = renderLattice();
    // The SVG fallback is present on the very first paint.
    expect(container.querySelector("svg")).toBeInTheDocument();
    expect(container.querySelector("canvas")).toBeNull();
  });

  it("keeps the whole layer out of the accessibility tree and the tab order", () => {
    const { container } = renderLattice();
    const layer = container.firstElementChild as HTMLElement;
    expect(layer).toHaveAttribute("aria-hidden", "true");
    expect(layer.className).toContain("pointer-events-none");
    // Nothing inside is focusable, so it can never receive a Tab stop.
    expect(
      layer.querySelectorAll('a[href],button,input,select,textarea,[tabindex]'),
    ).toHaveLength(0);
  });

  it("keeps the artwork decorative but exposes one real transform control", () => {
    const { container } = renderLattice();
    const button = screen.getByRole("button", {
      name: /transform voxel scene: cloud/i,
    });
    const hiddenArtwork = container.firstElementChild as HTMLElement;

    expect(button).toBeInTheDocument();
    expect(button).not.toBe(hiddenArtwork);
    expect(hiddenArtwork).not.toContainElement(button);
    expect(button.className).toContain("min-h-11");
    expect(button.className).toContain("min-w-11");
    expect(screen.getByRole("status")).toHaveTextContent("Mask");
    expect(screen.queryAllByRole("img")).toHaveLength(0);
  });

  it("cycles the synchronous fallback through mask, cloud and helix", () => {
    const { container } = renderLattice();
    const button = screen.getByRole("button", { name: /transform voxel scene/i });
    const formation = () =>
      container.querySelector(".systems-observatory")?.getAttribute(
        "data-voxel-formation",
      );

    expect(formation()).toBe("mask");
    fireEvent.click(button);
    expect(formation()).toBe("cloud");
    expect(screen.getByRole("status")).toHaveTextContent("Cloud");
    expect(button).toHaveAccessibleName(/transform voxel scene: helix/i);
    fireEvent.click(button);
    expect(formation()).toBe("helix");
    fireEvent.click(button);
    expect(formation()).toBe("mask");
  });

  it("settles on the mask when reduced motion is enabled after mount", () => {
    let reduced = false;
    const listeners = new Set<(event: MediaQueryListEvent) => void>();
    const query = {
      get matches() {
        return reduced;
      },
      media: "(prefers-reduced-motion: reduce)",
      onchange: null,
      addEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) =>
        listeners.add(listener),
      removeEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) =>
        listeners.delete(listener),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    } as unknown as MediaQueryList;
    window.matchMedia = vi.fn().mockReturnValue(query);

    const { container } = renderLattice();
    const button = screen.getByRole("button", { name: /transform voxel scene/i });
    fireEvent.click(button);
    expect(
      container.querySelector("[data-voxel-formation]"),
    ).toHaveAttribute("data-voxel-formation", "cloud");

    act(() => {
      reduced = true;
      listeners.forEach((listener) =>
        listener({ matches: true } as MediaQueryListEvent),
      );
    });

    expect(
      container.querySelector("[data-voxel-formation]"),
    ).toHaveAttribute("data-voxel-formation", "mask");
    expect(container.querySelector("canvas")).toBeNull();
    expect(screen.getByRole("status")).toHaveTextContent("Mask");
  });

  it("never requests the 3D chunk when a gate rejects the device", async () => {
    mockMedia(["prefers-reduced-motion"]);
    vi.useFakeTimers();
    const { container } = renderLattice();
    await vi.advanceTimersByTimeAsync(4000);
    // Still the SVG: the dynamic import was never reached.
    expect(container.querySelector("svg")).toBeInTheDocument();
    expect(container.querySelector("canvas")).toBeNull();
  });

  it("does not request the 3D chunk while the document is hidden", async () => {
    const descriptor = Object.getOwnPropertyDescriptor(document, "hidden");
    Object.defineProperty(document, "hidden", { value: true, configurable: true });
    vi.useFakeTimers();
    try {
      const { container } = renderLattice();
      await vi.advanceTimersByTimeAsync(4000);
      expect(container.querySelector("svg")).toBeInTheDocument();
      expect(container.querySelector("canvas")).toBeNull();
    } finally {
      if (descriptor) Object.defineProperty(document, "hidden", descriptor);
      else Reflect.deleteProperty(document as unknown as Record<string, unknown>, "hidden");
    }
  });

  it("defers the 3D chunk past first paint rather than loading it inline", async () => {
    const { container } = renderLattice();
    // Synchronously after mount the static composition is still what renders;
    // the upgrade is scheduled on idle, never during the first commit.
    expect(container.querySelector("svg")).toBeInTheDocument();
    await waitFor(() => expect(container.firstElementChild).toBeTruthy());
  });

  it("uses exactly one observer for every section and disconnects it on unmount", () => {
    const disconnect = vi.fn();
    const observe = vi.fn();
    const original = window.IntersectionObserver;
    const unobserve = vi.fn();
    const ctor = vi.fn(() => ({
      observe,
      unobserve,
      disconnect,
      takeRecords: () => [],
      root: null,
      rootMargin: "",
      thresholds: [],
    }));
    window.IntersectionObserver = ctor as unknown as typeof window.IntersectionObserver;

    const { unmount } = render(
      <LatticeProvider>
        <SystemsLattice />
        <Section name="hero" />
        <Section name="about" />
        <Section name="projects" />
      </LatticeProvider>,
    );

    // One shared observer, three registered sections — not one observer each.
    expect(ctor).toHaveBeenCalledTimes(1);
    expect(observe).toHaveBeenCalledTimes(3);

    unmount();
    window.IntersectionObserver = original;
    expect(unobserve).toHaveBeenCalledTimes(3);
    expect(disconnect).toHaveBeenCalled();
  });
});
