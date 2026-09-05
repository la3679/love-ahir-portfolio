import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render } from "@testing-library/react";
import HeroSystemsVideo from "./HeroSystemsVideo";

/**
 * The plate replaced a WebGL scene, so these lock the four properties that
 * made the swap worth making: it is silent, it is decorative, it never enters
 * the tab order, and a visitor who asked for reduced motion neither sees the
 * animation nor pays for it.
 */

/** Listeners the component registered, so a test can move the preference. */
let motionListeners: ((event: MediaQueryListEvent) => void)[] = [];

/** Swap `matchMedia` for one that matches the given queries. */
function mockMedia(matching: string[]) {
  motionListeners = [];
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: matching.some((m) => query.includes(m)),
    media: query,
    onchange: null,
    addEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) =>
      motionListeners.push(listener),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

/** Fire the `change` the OS would send when the preference is toggled. */
function setReducedMotion(matches: boolean) {
  act(() => {
    for (const listener of motionListeners) {
      listener({ matches } as MediaQueryListEvent);
    }
  });
}

const originalMatchMedia = window.matchMedia;

/** jsdom implements neither, and both are called on every preference change. */
beforeEach(() => {
  mockMedia([]);
  vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue(undefined);
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => undefined);
});

afterEach(() => {
  window.matchMedia = originalMatchMedia;
  vi.restoreAllMocks();
});

const renderPlate = () => {
  const { container } = render(<HeroSystemsVideo />);
  const video = container.querySelector("video") as HTMLVideoElement;
  return { container, video };
};

describe("<HeroSystemsVideo />", () => {
  it("plays the local clip muted, looping and inline, with no controls", () => {
    const { video } = renderPlate();

    expect(video).toHaveAttribute("src", "/media/hero-systems-loop.mp4");
    expect(video).toHaveAttribute("poster", "/media/hero-systems-loop-poster.jpg");
    expect(video.autoplay).toBe(true);
    expect(video.loop).toBe(true);
    expect(video.playsInline).toBe(true);
    expect(video.controls).toBe(false);
    expect(video).not.toHaveAttribute("controls");
    // Both, deliberately: `muted` covers this element, `defaultMuted` survives
    // a remount or a source swap. Audio must never be possible.
    expect(video.muted).toBe(true);
    expect(video.defaultMuted).toBe(true);
  });

  it("is decorative: hidden from assistive tech and out of the tab order", () => {
    const { container, video } = renderPlate();

    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
    expect(video).toHaveAttribute("tabindex", "-1");
    // No accessible name: the plate makes no claim the hero copy does not.
    expect(video).not.toHaveAttribute("aria-label");
    expect(video).not.toHaveAttribute("title");
  });

  it("asks for metadata only, so the clip never blocks first paint", () => {
    expect(renderPlate().video).toHaveAttribute("preload", "metadata");
  });

  it("dissolves across the loop seam, then fades back in", () => {
    const { video } = renderPlate();
    Object.defineProperty(video, "duration", { value: 10, configurable: true });

    expect(video).toHaveAttribute("data-seam", "false");

    video.currentTime = 9.6;
    fireEvent.timeUpdate(video);
    expect(video).toHaveAttribute("data-seam", "true");

    video.currentTime = 0.2;
    fireEvent.timeUpdate(video);
    expect(video).toHaveAttribute("data-seam", "false");
  });

  it("survives a video whose duration is not known yet", () => {
    const { video } = renderPlate();
    Object.defineProperty(video, "duration", { value: NaN, configurable: true });

    fireEvent.timeUpdate(video);
    expect(video).toHaveAttribute("data-seam", "false");
  });

  describe("reduced motion", () => {
    beforeEach(() => mockMedia(["prefers-reduced-motion"]));

    it("holds the poster instead of autoplaying, and downloads no video", () => {
      const { video } = renderPlate();

      expect(video.autoplay).toBe(false);
      expect(video).toHaveAttribute("preload", "none");
      expect(video).toHaveAttribute("poster", "/media/hero-systems-loop-poster.jpg");
      // Never blank: the poster is the LA identity state, so the stage still
      // shows a finished picture rather than an empty frame.
      expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();
    });

    it("starts the clip if the visitor turns the preference back off", () => {
      const { video } = renderPlate();
      expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();

      setReducedMotion(false);

      expect(video).toHaveAttribute("preload", "metadata");
      expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
    });
  });

  it("stops the clip if the visitor asks for reduced motion mid-session", () => {
    const { video } = renderPlate();
    Object.defineProperty(video, "paused", { value: false, configurable: true });
    video.currentTime = 4;

    setReducedMotion(true);

    expect(video.autoplay).toBe(false);
    expect(video).toHaveAttribute("preload", "none");
    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled();
    // Back on the frame the poster shows, so the stage still reads as the LA.
    expect(video.currentTime).toBe(0);
  });
});
