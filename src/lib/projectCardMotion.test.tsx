import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  PROJECT_CARD_MAX_TILT_DEG,
  mapProjectCardMotion,
  projectCardTransform,
  useProjectCardMotion,
} from "./projectCardMotion";

const originalMatchMedia = window.matchMedia;

type MediaKey = "fine" | "reduced";
type MediaListener = (event: MediaQueryListEvent) => void;

const mediaState: Record<MediaKey, boolean> = {
  fine: true,
  reduced: false,
};
const mediaListeners: Record<MediaKey, Set<MediaListener>> = {
  fine: new Set(),
  reduced: new Set(),
};

const queryFor = (key: MediaKey) =>
  key === "fine" ? "(pointer: fine)" : "(prefers-reduced-motion: reduce)";

function installMatchMedia() {
  window.matchMedia = vi.fn().mockImplementation((query: string) => {
    const key: MediaKey = query.includes("prefers-reduced-motion")
      ? "reduced"
      : "fine";
    return {
      get matches() {
        return mediaState[key];
      },
      media: query,
      onchange: null,
      addEventListener: (type: string, listener: MediaListener) => {
        if (type === "change") mediaListeners[key].add(listener);
      },
      removeEventListener: (type: string, listener: MediaListener) => {
        if (type === "change") mediaListeners[key].delete(listener);
      },
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    } as unknown as MediaQueryList;
  }) as unknown as typeof window.matchMedia;
}

function setMedia(key: MediaKey, matches: boolean) {
  mediaState[key] = matches;
  const event = { matches, media: queryFor(key) } as MediaQueryListEvent;
  act(() => {
    for (const listener of mediaListeners[key]) listener(event);
  });
}

let nextFrame = 1;
let frames = new Map<number, FrameRequestCallback>();

function flushFrames() {
  const pending = [...frames.values()];
  frames.clear();
  act(() => pending.forEach((callback) => callback(16)));
}

function dispatchPointer(
  target: Document | HTMLElement,
  type: "pointermove" | "pointerout",
  properties: Record<string, EventTarget | string | number | null>,
) {
  const event = new Event(type, { bubbles: true });
  for (const [key, value] of Object.entries(properties)) {
    Object.defineProperty(event, key, { value, configurable: true });
  }
  fireEvent(target, event);
}

const rect = (
  left: number,
  top: number,
  width: number,
  height: number,
): DOMRect =>
  ({
    left,
    top,
    right: left + width,
    bottom: top + height,
    width,
    height,
    x: left,
    y: top,
    toJSON: () => ({}),
  }) as DOMRect;

const Harness = () => {
  useProjectCardMotion();
  return (
    <div data-testid="outside">
      <article data-testid="card-a" data-project-tilt>
        <span data-testid="child-a">A</span>
      </article>
      <article data-testid="card-b" data-project-tilt>
        <span data-testid="child-b">B</span>
      </article>
    </div>
  );
};

beforeEach(() => {
  mediaState.fine = true;
  mediaState.reduced = false;
  mediaListeners.fine.clear();
  mediaListeners.reduced.clear();
  installMatchMedia();

  nextFrame = 1;
  frames = new Map();
  vi.stubGlobal(
    "requestAnimationFrame",
    vi.fn((callback: FrameRequestCallback) => {
      const handle = nextFrame++;
      frames.set(handle, callback);
      return handle;
    }),
  );
  vi.stubGlobal(
    "cancelAnimationFrame",
    vi.fn((handle: number) => frames.delete(handle)),
  );
});

afterEach(() => {
  window.matchMedia = originalMatchMedia;
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("mapProjectCardMotion", () => {
  it("maps the card center to a neutral, centered effect", () => {
    const motion = mapProjectCardMotion(300, 150, rect(100, 50, 400, 200));

    expect(motion).toEqual({
      shineX: 50,
      shineY: 50,
      glowX: 200,
      glowY: 100,
      rotateX: 0,
      rotateY: 0,
    });
  });

  it("clamps pointer positions and both tilt axes to six degrees", () => {
    const topRight = mapProjectCardMotion(900, -500, rect(100, 50, 400, 200));
    const bottomLeft = mapProjectCardMotion(-900, 800, rect(100, 50, 400, 200));

    expect(topRight).toMatchObject({
      shineX: 100,
      shineY: 0,
      glowX: 400,
      glowY: 0,
      rotateX: PROJECT_CARD_MAX_TILT_DEG,
      rotateY: PROJECT_CARD_MAX_TILT_DEG,
    });
    expect(bottomLeft).toMatchObject({
      shineX: 0,
      shineY: 100,
      glowX: 0,
      glowY: 200,
      rotateX: -PROJECT_CARD_MAX_TILT_DEG,
      rotateY: -PROJECT_CARD_MAX_TILT_DEG,
    });
  });

  it("rejects zero-size cards and formats only transform-based motion", () => {
    expect(mapProjectCardMotion(0, 0, rect(0, 0, 0, 200))).toBeNull();
    const motion = mapProjectCardMotion(500, 50, rect(100, 50, 400, 200));

    expect(projectCardTransform(motion!)).toBe(
      "perspective(950px) rotateY(6.00deg) rotateX(6.00deg) translate3d(0, -4px, 0)",
    );
  });
});

describe("useProjectCardMotion", () => {
  it("mounts one passive delegated listener and coalesces writes into one frame", () => {
    const add = vi.spyOn(document, "addEventListener");
    render(<Harness />);
    const card = screen.getByTestId("card-a");
    const child = screen.getByTestId("child-a");
    card.getBoundingClientRect = () => rect(100, 50, 400, 200);

    const pointerAdds = add.mock.calls.filter(([type]) => type === "pointermove");
    expect(pointerAdds).toHaveLength(1);
    expect(pointerAdds[0][2]).toEqual({ passive: true });

    dispatchPointer(child, "pointermove", {
      clientX: 300,
      clientY: 150,
      pointerType: "mouse",
    });
    dispatchPointer(child, "pointermove", {
      clientX: 500,
      clientY: 50,
      pointerType: "mouse",
    });

    expect(requestAnimationFrame).toHaveBeenCalledTimes(1);
    expect(card.style.transform).toBe("");
    flushFrames();

    expect(card).toHaveAttribute("data-project-tilt-active", "true");
    expect(card.style.getPropertyValue("--shine-x")).toBe("100.00%");
    expect(card.style.getPropertyValue("--shine-y")).toBe("0.00%");
    expect(card.style.getPropertyValue("--glow-x")).toBe("400.00px");
    expect(card.style.getPropertyValue("--glow-y")).toBe("0.00px");
    expect(card.style.transform).toContain("rotateY(6.00deg)");
    expect(card.style.transform).toContain("rotateX(6.00deg)");
  });

  it("resets the previous card on switch, pointerout, outside motion, and blur", () => {
    render(<Harness />);
    const outside = screen.getByTestId("outside");
    const cardA = screen.getByTestId("card-a");
    const cardB = screen.getByTestId("card-b");
    const childA = screen.getByTestId("child-a");
    const childB = screen.getByTestId("child-b");
    cardA.getBoundingClientRect = () => rect(100, 50, 400, 200);
    cardB.getBoundingClientRect = () => rect(600, 50, 200, 200);

    dispatchPointer(childA, "pointermove", {
      clientX: 500,
      clientY: 50,
      pointerType: "mouse",
    });
    flushFrames();
    expect(cardA).toHaveAttribute("data-project-tilt-active");

    dispatchPointer(childB, "pointermove", {
      clientX: 600,
      clientY: 250,
      pointerType: "mouse",
    });
    expect(cardA.style.transform).toBe("");
    expect(cardA).not.toHaveAttribute("data-project-tilt-active");
    flushFrames();
    expect(cardB).toHaveAttribute("data-project-tilt-active");

    dispatchPointer(childB, "pointerout", {
      clientX: 800,
      clientY: 250,
      pointerType: "mouse",
      relatedTarget: outside,
    });
    expect(cardB.style.transform).toBe("");

    dispatchPointer(childA, "pointermove", {
      clientX: 300,
      clientY: 150,
      pointerType: "mouse",
    });
    flushFrames();
    dispatchPointer(outside, "pointermove", {
      clientX: 20,
      clientY: 20,
      pointerType: "mouse",
    });
    expect(cardA.style.transform).toBe("");

    dispatchPointer(childA, "pointermove", {
      clientX: 300,
      clientY: 150,
      pointerType: "mouse",
    });
    flushFrames();
    fireEvent(window, new Event("blur"));
    expect(cardA.style.transform).toBe("");
  });

  it("stays inert for touch and responds live to both capability gates", () => {
    const add = vi.spyOn(document, "addEventListener");
    const remove = vi.spyOn(document, "removeEventListener");
    const { unmount } = render(<Harness />);
    const card = screen.getByTestId("card-a");
    const child = screen.getByTestId("child-a");
    card.getBoundingClientRect = () => rect(100, 50, 400, 200);

    dispatchPointer(child, "pointermove", {
      clientX: 500,
      clientY: 50,
      pointerType: "touch",
    });
    flushFrames();
    expect(card.style.transform).toBe("");
    expect(card).not.toHaveAttribute("data-project-tilt-active");

    dispatchPointer(child, "pointermove", {
      clientX: 500,
      clientY: 50,
      pointerType: "mouse",
    });
    flushFrames();
    expect(card).toHaveAttribute("data-project-tilt-active");

    setMedia("reduced", true);
    expect(card.style.transform).toBe("");
    expect(
      remove.mock.calls.filter(([type]) => type === "pointermove"),
    ).toHaveLength(1);

    setMedia("reduced", false);
    expect(add.mock.calls.filter(([type]) => type === "pointermove")).toHaveLength(2);
    setMedia("fine", false);
    expect(
      remove.mock.calls.filter(([type]) => type === "pointermove"),
    ).toHaveLength(2);

    setMedia("fine", true);
    expect(add.mock.calls.filter(([type]) => type === "pointermove")).toHaveLength(3);
    unmount();
    expect(
      remove.mock.calls.filter(([type]) => type === "pointermove"),
    ).toHaveLength(3);
    expect(mediaListeners.fine).toHaveLength(0);
    expect(mediaListeners.reduced).toHaveLength(0);
  });
});
