import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
// Initialize i18n once for the whole suite so components that call t()
// render real strings (defaults to the en-US fallback in jsdom).
import "@/lib/i18n";

// Clean the DOM between tests.
afterEach(() => {
  cleanup();
});

// jsdom doesn't implement these; stub them so components that scroll
// or observe intersections can render in tests without throwing.
window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;

if (!("IntersectionObserver" in window)) {
  class IO {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  }
  // @ts-expect-error -- minimal polyfill for the test environment
  window.IntersectionObserver = IO;
}

if (!("ResizeObserver" in window)) {
  class RO {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  // @ts-expect-error -- minimal polyfill; Radix's popper positioner needs it
  window.ResizeObserver = RO;
}

// Radix menus call these Pointer Events APIs and scroll the active item into
// view; jsdom implements none of them.
if (!Element.prototype.hasPointerCapture) {
  Element.prototype.hasPointerCapture = () => false;
  Element.prototype.setPointerCapture = () => {};
  Element.prototype.releasePointerCapture = () => {};
}
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}

// jsdom has no canvas backend at all, and calling getContext logs a noisy
// "Not implemented" error. Returning null is also the honest answer for the
// test environment: no WebGL, so the capability gate resolves to the static
// composition unless a test explicitly stubs otherwise.
HTMLCanvasElement.prototype.getContext = (() =>
  null) as unknown as typeof HTMLCanvasElement.prototype.getContext;

if (!window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}
