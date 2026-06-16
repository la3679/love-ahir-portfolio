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
