import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  DEFAULT_TILT_MAX_DEG,
  PARALLAX_TRAVEL_PX,
  SCROLL_DEPTH_MAX_PX,
  TILT_LIFT_PX,
  TILT_SCALE,
  TILT_SOFT_LIFT_PX,
  TILT_SOFT_SCALE,
  mapParallaxOffset,
  mapScrollDepth,
  mapTilt,
  tiltTransform,
  useAmbientParallax,
  useTilt,
} from "./useAmbientParallax";

const RECT = { left: 100, top: 200, width: 400, height: 300 };

describe("mapParallaxOffset", () => {
  it("is centred at the middle of the viewport", () => {
    expect(mapParallaxOffset(640, 400, 1280, 800)).toEqual({ x: 0, y: 0 });
  });

  it("reaches half the travel budget at each edge", () => {
    expect(mapParallaxOffset(0, 0, 1280, 800)).toEqual({
      x: -PARALLAX_TRAVEL_PX / 2,
      y: -PARALLAX_TRAVEL_PX / 2,
    });
    expect(mapParallaxOffset(1280, 800, 1280, 800)).toEqual({
      x: PARALLAX_TRAVEL_PX / 2,
      y: PARALLAX_TRAVEL_PX / 2,
    });
  });

  it("clamps a pointer outside the viewport and a zero-size viewport", () => {
    expect(mapParallaxOffset(9999, -9999, 1280, 800)).toEqual({
      x: PARALLAX_TRAVEL_PX / 2,
      y: -PARALLAX_TRAVEL_PX / 2,
    });
    expect(mapParallaxOffset(100, 100, 0, 0)).toEqual({ x: 0, y: 0 });
  });
});

describe("mapScrollDepth", () => {
  it("scales with scroll position", () => {
    expect(mapScrollDepth(500, -0.04)).toBeCloseTo(-20, 5);
    expect(mapScrollDepth(500, -0.02)).toBeCloseTo(-10, 5);
  });

  it("never exceeds the travel cap", () => {
    expect(mapScrollDepth(100_000, -0.04)).toBe(-SCROLL_DEPTH_MAX_PX);
    expect(mapScrollDepth(100_000, 0.04)).toBe(SCROLL_DEPTH_MAX_PX);
  });

  it("returns zero for a missing factor", () => {
    expect(mapScrollDepth(500, Number.NaN)).toBe(0);
  });
});

describe("mapTilt", () => {
  it("is neutral at the centre of the element", () => {
    const motion = mapTilt(300, 350, RECT);
    expect(motion?.rotateX).toBeCloseTo(0, 5);
    expect(motion?.rotateY).toBeCloseTo(0, 5);
    expect(motion?.shineX).toBeCloseTo(50, 5);
    expect(motion?.shineY).toBeCloseTo(50, 5);
  });

  it("inverts rotateX so the card leans toward the pointer", () => {
    const top = mapTilt(300, 200, RECT);
    const bottom = mapTilt(300, 500, RECT);
    expect(top?.rotateX).toBeCloseTo(DEFAULT_TILT_MAX_DEG, 5);
    expect(bottom?.rotateX).toBeCloseTo(-DEFAULT_TILT_MAX_DEG, 5);
  });

  it("honours data-tilt-max and never exceeds it", () => {
    const motion = mapTilt(500, 200, RECT, 9);
    expect(motion?.rotateY).toBeCloseTo(9, 5);
    expect(motion?.rotateX).toBeCloseTo(9, 5);
  });

  it("clamps a pointer that lands outside the last measured rect", () => {
    const motion = mapTilt(99_999, -99_999, RECT, 9);
    expect(motion?.rotateY).toBeCloseTo(9, 5);
    expect(motion?.shineX).toBe(100);
    expect(motion?.shineY).toBe(0);
  });

  it("selects the soft lift and scale", () => {
    expect(mapTilt(300, 350, RECT, 4, true)?.lift).toBe(TILT_SOFT_LIFT_PX);
    expect(mapTilt(300, 350, RECT, 4, true)?.scale).toBe(TILT_SOFT_SCALE);
    expect(mapTilt(300, 350, RECT, 6, false)?.lift).toBe(TILT_LIFT_PX);
    expect(mapTilt(300, 350, RECT, 6, false)?.scale).toBe(TILT_SCALE);
  });

  it("returns null for a zero-size element", () => {
    expect(mapTilt(0, 0, { left: 0, top: 0, width: 0, height: 0 })).toBeNull();
  });
});

describe("tiltTransform", () => {
  it("matches the transform declared by the [data-tilt] rule", () => {
    const motion = mapTilt(500, 200, RECT, 9);
    expect(motion && tiltTransform(motion)).toBe(
      "perspective(950px) rotateX(9.000deg) rotateY(9.000deg) translate3d(0, -6px, 0) scale(1.0120)",
    );
  });
});

// --- delegated controllers -------------------------------------------------

type MediaState = { fine: boolean; reduced: boolean };

const media: MediaState = { fine: true, reduced: false };
const listeners = new Set<() => void>();
let rafQueue: FrameRequestCallback[] = [];

function stubMatchMedia() {
  window.matchMedia = ((query: string) => {
    const matches = () =>
      query.includes("pointer: fine") ? media.fine : media.reduced;
    return {
      get matches() {
        return matches();
      },
      media: query,
      onchange: null,
      addEventListener: (_: string, handler: () => void) => listeners.add(handler),
      removeEventListener: (_: string, handler: () => void) =>
        listeners.delete(handler),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    } as unknown as MediaQueryList;
  }) as typeof window.matchMedia;
}

/** Run every frame the controllers queued, the way a browser would. */
function flushFrames() {
  for (let pass = 0; pass < 4 && rafQueue.length > 0; pass += 1) {
    const queued = rafQueue;
    rafQueue = [];
    for (const callback of queued) callback(performance.now());
  }
}

/** jsdom has no PointerEvent constructor; a MouseEvent carries all we read. */
function pointerEvent(clientX: number, clientY: number, pointerType = "mouse") {
  const event = new MouseEvent("pointermove", { bubbles: true, clientX, clientY });
  Object.defineProperty(event, "pointerType", { value: pointerType });
  return event;
}

function movePointer(target: Element, clientX: number, clientY: number) {
  act(() => {
    target.dispatchEvent(pointerEvent(clientX, clientY));
    flushFrames();
  });
}

function stubRect(element: Element, rect: typeof RECT) {
  element.getBoundingClientRect = () =>
    ({ ...rect, right: rect.left + rect.width, bottom: rect.top + rect.height, x: rect.left, y: rect.top, toJSON: () => "" }) as DOMRect;
}

const originalMatchMedia = window.matchMedia;
const originalRaf = window.requestAnimationFrame;
const originalCancelRaf = window.cancelAnimationFrame;

beforeEach(() => {
  media.fine = true;
  media.reduced = false;
  listeners.clear();
  rafQueue = [];
  stubMatchMedia();
  window.requestAnimationFrame = ((callback: FrameRequestCallback) =>
    rafQueue.push(callback)) as unknown as typeof window.requestAnimationFrame;
  window.cancelAnimationFrame = (() => {
    rafQueue = [];
  }) as unknown as typeof window.cancelAnimationFrame;
});

afterEach(() => {
  window.matchMedia = originalMatchMedia;
  window.requestAnimationFrame = originalRaf;
  window.cancelAnimationFrame = originalCancelRaf;
});

const TiltHost = () => {
  useTilt();
  return (
    <div>
      <article data-testid="card-a" data-tilt data-tilt-max="9">
        <span data-testid="inner-a">inner</span>
      </article>
      <article data-testid="card-b" data-tilt data-tilt-strength="soft" />
      <p data-testid="outside">outside every card</p>
    </div>
  );
};

describe("useTilt", () => {
  it("writes tilt, shine and glow for the hovered card only", () => {
    const { getByTestId } = render(<TiltHost />);
    const card = getByTestId("card-a");
    stubRect(card, RECT);

    movePointer(getByTestId("inner-a"), 500, 200);

    expect(card).toHaveClass("is-tilting");
    expect(card.style.getPropertyValue("--tilt-y")).toBe("9.000");
    expect(card.style.getPropertyValue("--tilt-x")).toBe("9.000");
    expect(card.style.getPropertyValue("--shine-x")).toBe("100.00%");
    expect(card.style.getPropertyValue("--glow-x")).toBe("400.00px");
    expect(card.style.transform).toContain("perspective(950px)");
    expect(getByTestId("card-b")).not.toHaveClass("is-tilting");
  });

  it("reads data-tilt-max and data-tilt-strength per element", () => {
    const { getByTestId } = render(<TiltHost />);
    const soft = getByTestId("card-b");
    stubRect(soft, RECT);

    movePointer(soft, 500, 200);

    // No data-tilt-max, so the default applies; "soft" selects the small lift.
    expect(soft.style.getPropertyValue("--tilt-y")).toBe(
      DEFAULT_TILT_MAX_DEG.toFixed(3),
    );
    expect(soft.style.getPropertyValue("--tilt-z")).toBe(`${TILT_SOFT_LIFT_PX}px`);
    expect(soft.style.getPropertyValue("--tilt-scale")).toBe(
      TILT_SOFT_SCALE.toFixed(4),
    );
  });

  it("clears every custom property when the pointer leaves the card", () => {
    const { getByTestId } = render(<TiltHost />);
    const card = getByTestId("card-a");
    stubRect(card, RECT);

    movePointer(getByTestId("inner-a"), 500, 200);
    expect(card).toHaveClass("is-tilting");

    movePointer(getByTestId("outside"), 10, 10);

    expect(card).not.toHaveClass("is-tilting");
    expect(card.style.getPropertyValue("--tilt-x")).toBe("");
    expect(card.style.getPropertyValue("--shine-x")).toBe("");
    expect(card.style.transform).toBe("");
  });

  it("hands off cleanly between two cards", () => {
    const { getByTestId } = render(<TiltHost />);
    const first = getByTestId("card-a");
    const second = getByTestId("card-b");
    stubRect(first, RECT);
    stubRect(second, RECT);

    movePointer(first, 500, 200);
    movePointer(second, 500, 200);

    expect(first).not.toHaveClass("is-tilting");
    expect(second).toHaveClass("is-tilting");
  });

  it("ignores touch pointers", () => {
    const { getByTestId } = render(<TiltHost />);
    const card = getByTestId("card-a");
    stubRect(card, RECT);

    act(() => {
      card.dispatchEvent(pointerEvent(500, 200, "touch"));
      flushFrames();
    });

    expect(card).not.toHaveClass("is-tilting");
  });

  it("attaches nothing under reduced motion or a coarse pointer", () => {
    media.reduced = true;
    const { getByTestId } = render(<TiltHost />);
    const card = getByTestId("card-a");
    stubRect(card, RECT);

    movePointer(card, 500, 200);
    expect(card).not.toHaveClass("is-tilting");

    media.reduced = false;
    media.fine = false;
    act(() => listeners.forEach((notify) => notify()));
    movePointer(card, 500, 200);
    expect(card).not.toHaveClass("is-tilting");
  });

  it("resets the active card when reduced motion is turned on mid-session", () => {
    const { getByTestId } = render(<TiltHost />);
    const card = getByTestId("card-a");
    stubRect(card, RECT);

    movePointer(card, 500, 200);
    expect(card).toHaveClass("is-tilting");

    media.reduced = true;
    act(() => listeners.forEach((notify) => notify()));

    expect(card).not.toHaveClass("is-tilting");
    expect(card.style.transform).toBe("");
  });

  it("removes its pointer subscription on unmount", () => {
    const { getByTestId, unmount } = render(<TiltHost />);
    const card = getByTestId("card-a");
    stubRect(card, RECT);
    const removeSpy = vi.spyOn(window, "removeEventListener");

    unmount();

    expect(removeSpy).toHaveBeenCalledWith("pointermove", expect.any(Function));
    removeSpy.mockRestore();
  });
});

const ParallaxHost = () => {
  useAmbientParallax();
  return (
    <div>
      <div data-testid="hero" data-parallax="true" />
      <div data-testid="mesh" data-scroll-depth="-0.04" />
      <div data-testid="orbs" data-scroll-depth="-0.02" />
      <div data-testid="aura" data-cursor-aura="true" />
    </div>
  );
};

describe("useAmbientParallax", () => {
  it("lags behind the pointer instead of snapping to it", () => {
    const { getByTestId } = render(<ParallaxHost />);
    const hero = getByTestId("hero");

    movePointer(document.body, window.innerWidth, window.innerHeight);

    // One frame of a 0.12 lerp toward +11px is ~1.3px, not the full travel.
    const match = /translate3d\((-?[\d.]+)px/.exec(hero.style.transform);
    const x = Number(match?.[1]);
    expect(x).toBeGreaterThan(0);
    expect(x).toBeLessThan(PARALLAX_TRAVEL_PX / 2);
  });

  it("reveals the aura only after the first pointer move", () => {
    const { getByTestId } = render(<ParallaxHost />);
    const aura = getByTestId("aura");
    expect(aura.dataset.auraVisible).toBeUndefined();

    movePointer(document.body, 400, 300);

    expect(aura.dataset.auraVisible).toBe("true");
    expect(aura.style.transform).toContain("translate3d(400.00px, 300.00px");
  });

  it("applies each element's own scroll-depth factor", () => {
    const { getByTestId } = render(<ParallaxHost />);
    Object.defineProperty(window, "scrollY", { configurable: true, value: 500 });

    act(() => {
      window.dispatchEvent(new Event("scroll"));
      flushFrames();
    });

    expect(getByTestId("mesh").style.transform).toBe("translate3d(0, -20.00px, 0)");
    expect(getByTestId("orbs").style.transform).toBe("translate3d(0, -10.00px, 0)");
  });

  it("writes nothing under reduced motion", () => {
    media.reduced = true;
    const { getByTestId } = render(<ParallaxHost />);

    movePointer(document.body, 400, 300);
    act(() => {
      window.dispatchEvent(new Event("scroll"));
      flushFrames();
    });

    expect(getByTestId("hero").style.transform).toBe("");
    expect(getByTestId("aura").dataset.auraVisible).toBeUndefined();
  });

  it("clears its transforms on unmount", () => {
    const { getByTestId, unmount } = render(<ParallaxHost />);
    const hero = getByTestId("hero");
    movePointer(document.body, 400, 300);
    expect(hero.style.transform).not.toBe("");

    unmount();

    expect(hero.style.transform).toBe("");
  });
});
