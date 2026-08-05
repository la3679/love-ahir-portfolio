import { useEffect } from "react";
import { subscribePointer, type PointerSample } from "./pointerBus";

/**
 * Ambient parallax, cursor aura, scroll depth and the delegated card tilt.
 *
 * All four are opt-in by attribute, so no component holds a ref for a purely
 * decorative effect and nothing has to be threaded through props:
 *
 * - `[data-parallax]`      — translates with the pointer (hero visual)
 * - `[data-cursor-aura]`   — the soft light that follows the cursor
 * - `[data-scroll-depth]`  — translates with scroll, factor from the attribute
 * - `[data-tilt]`          — pointer tilt + shine, depth from `data-tilt-max`
 *
 * Between them they run one rAF loop and one pointer subscription (through
 * `pointerBus`), never one per element.
 */

export const PARALLAX_SELECTOR = "[data-parallax]";
export const CURSOR_AURA_SELECTOR = "[data-cursor-aura]";
export const SCROLL_DEPTH_SELECTOR = "[data-scroll-depth]";
export const TILT_SELECTOR = "[data-tilt]";
export const TILT_ACTIVE_CLASS = "is-tilting";

/** Total pointer travel of a parallax element, corner to corner. */
export const PARALLAX_TRAVEL_PX = 22;
/** Scroll depth is felt, not seen — hard-capped well under one line of text. */
export const SCROLL_DEPTH_MAX_PX = 40;
/** Critically damped follow: fast enough to feel attached, slow enough to lag. */
export const FOLLOW_LERP = 0.12;
/** Sub-pixel movement nobody can see; the loop parks itself here. */
const SETTLED_EPSILON = 0.05;

export const DEFAULT_TILT_MAX_DEG = 6;
export const TILT_LIFT_PX = -6;
export const TILT_SOFT_LIFT_PX = -4;
export const TILT_SCALE = 1.012;
export const TILT_SOFT_SCALE = 1.008;

const clamp = (value: number, minimum: number, maximum: number) =>
  Math.min(maximum, Math.max(minimum, value));

export interface Offset2D {
  x: number;
  y: number;
}

/** Pointer position across the viewport, mapped to a bounded pixel offset. */
export function mapParallaxOffset(
  clientX: number,
  clientY: number,
  viewportWidth: number,
  viewportHeight: number,
): Offset2D {
  if (viewportWidth <= 0 || viewportHeight <= 0) return { x: 0, y: 0 };

  return {
    x: (clamp(clientX / viewportWidth, 0, 1) - 0.5) * PARALLAX_TRAVEL_PX,
    y: (clamp(clientY / viewportHeight, 0, 1) - 0.5) * PARALLAX_TRAVEL_PX,
  };
}

export function mapScrollDepth(scrollY: number, factor: number): number {
  if (!Number.isFinite(scrollY) || !Number.isFinite(factor)) return 0;
  return clamp(scrollY * factor, -SCROLL_DEPTH_MAX_PX, SCROLL_DEPTH_MAX_PX);
}

export interface TiltMotion {
  /** Degrees, written unitless so the same value can also drive layer offsets. */
  rotateX: number;
  rotateY: number;
  lift: number;
  scale: number;
  /** Pointer position inside the card as a percentage, for the shine. */
  shineX: number;
  shineY: number;
  /** The same position in pixels, for the blurred glow. */
  glowX: number;
  glowY: number;
}

/**
 * Map a viewport pointer position into card tilt.
 *
 * Values stay clamped even when a fast pointer event lands outside the last
 * measured rect, and a zero-size card returns null so the caller can restore
 * the settled state instead of writing NaN into a transform.
 */
export function mapTilt(
  clientX: number,
  clientY: number,
  rect: Pick<DOMRectReadOnly, "left" | "top" | "width" | "height">,
  maximumDegrees: number = DEFAULT_TILT_MAX_DEG,
  soft = false,
): TiltMotion | null {
  if (rect.width <= 0 || rect.height <= 0) return null;

  const px = clamp((clientX - rect.left) / rect.width, 0, 1);
  const py = clamp((clientY - rect.top) / rect.height, 0, 1);

  return {
    rotateY: (px - 0.5) * maximumDegrees * 2,
    rotateX: -(py - 0.5) * maximumDegrees * 2,
    lift: soft ? TILT_SOFT_LIFT_PX : TILT_LIFT_PX,
    scale: soft ? TILT_SOFT_SCALE : TILT_SCALE,
    shineX: px * 100,
    shineY: py * 100,
    glowX: px * rect.width,
    glowY: py * rect.height,
  };
}

/** Both effects need the same live capability answer, so it lives in one place. */
function ambientCapability() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return null;
  }
  return {
    finePointer: window.matchMedia("(pointer: fine)"),
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)"),
  };
}

function readFactor(element: HTMLElement): number {
  const parsed = Number.parseFloat(element.dataset.scrollDepth ?? "");
  return Number.isFinite(parsed) ? parsed : 0;
}

/**
 * Pointer parallax, the cursor aura and scroll depth, in one loop.
 *
 * Mount once, in the shell that owns the FX layer. The loop starts on input
 * and parks itself as soon as everything has settled, so an idle page holds no
 * animation frame at all.
 */
export function useAmbientParallax() {
  useEffect(() => {
    const capability = ambientCapability();
    if (!capability) return;
    const { finePointer, reducedMotion } = capability;

    let parallaxElements: HTMLElement[] = [];
    let depthElements: HTMLElement[] = [];
    let aura: HTMLElement | null = null;

    let pointerX = 0;
    let pointerY = 0;
    let pointerSeen = false;
    let targetX = 0;
    let targetY = 0;
    let auraX = 0;
    let auraY = 0;
    let currentX = 0;
    let currentY = 0;
    let scrollPending = true;
    let frame = 0;
    let unsubscribe: (() => void) | null = null;

    const refreshTargets = () => {
      parallaxElements = Array.from(
        document.querySelectorAll<HTMLElement>(PARALLAX_SELECTOR),
      );
      depthElements = Array.from(
        document.querySelectorAll<HTMLElement>(SCROLL_DEPTH_SELECTOR),
      );
      aura = document.querySelector<HTMLElement>(CURSOR_AURA_SELECTOR);
    };

    const step = () => {
      frame = 0;
      let moving = false;

      const dx = targetX - currentX;
      const dy = targetY - currentY;
      if (Math.abs(dx) > SETTLED_EPSILON || Math.abs(dy) > SETTLED_EPSILON) {
        currentX += dx * FOLLOW_LERP;
        currentY += dy * FOLLOW_LERP;
        moving = true;
      } else {
        currentX = targetX;
        currentY = targetY;
      }

      for (const element of parallaxElements) {
        element.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0)`;
      }

      if (aura && pointerSeen) {
        const adx = pointerX - auraX;
        const ady = pointerY - auraY;
        if (Math.abs(adx) > SETTLED_EPSILON || Math.abs(ady) > SETTLED_EPSILON) {
          auraX += adx * FOLLOW_LERP;
          auraY += ady * FOLLOW_LERP;
          moving = true;
        } else {
          auraX = pointerX;
          auraY = pointerY;
        }
        aura.style.transform = `translate3d(${auraX.toFixed(2)}px, ${auraY.toFixed(2)}px, 0)`;
        aura.dataset.auraVisible = "true";
      }

      if (scrollPending) {
        scrollPending = false;
        const scrollY = window.scrollY;
        for (const element of depthElements) {
          const offset = mapScrollDepth(scrollY, readFactor(element));
          element.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
        }
      }

      if (moving) frame = window.requestAnimationFrame(step);
    };

    /** The `ticking` guard: at most one frame is ever queued. */
    const schedule = () => {
      if (frame) return;
      refreshTargets();
      frame = window.requestAnimationFrame(step);
    };

    const onPointer = (sample: PointerSample) => {
      if (!sample.active || sample.pointerType === "touch") return;
      pointerX = sample.clientX;
      pointerY = sample.clientY;
      if (!pointerSeen) {
        // Start the aura under the cursor rather than sliding it in from 0,0.
        pointerSeen = true;
        auraX = pointerX;
        auraY = pointerY;
      }
      const offset = mapParallaxOffset(
        sample.clientX,
        sample.clientY,
        window.innerWidth,
        window.innerHeight,
      );
      targetX = offset.x;
      targetY = offset.y;
      schedule();
    };

    const onScroll = () => {
      scrollPending = true;
      schedule();
    };

    // Clears the elements this effect actually wrote to, using the cached
    // lists rather than a fresh query — on unmount React has already detached
    // them, so re-querying the document would find nothing to clean up.
    const reset = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      targetX = 0;
      targetY = 0;
      currentX = 0;
      currentY = 0;
      pointerSeen = false;
      for (const element of [...parallaxElements, ...depthElements]) {
        element.style.removeProperty("transform");
      }
      if (aura) {
        aura.style.removeProperty("transform");
        delete aura.dataset.auraVisible;
      }
    };

    const syncCapability = () => {
      const enabled = finePointer.matches && !reducedMotion.matches;

      if (enabled && !unsubscribe) {
        unsubscribe = subscribePointer(onPointer);
        window.addEventListener("scroll", onScroll, { passive: true });
        scrollPending = true;
        schedule();
        return;
      }

      if (!enabled && unsubscribe) {
        unsubscribe();
        unsubscribe = null;
        window.removeEventListener("scroll", onScroll);
        reset();
      }
    };

    finePointer.addEventListener?.("change", syncCapability);
    reducedMotion.addEventListener?.("change", syncCapability);
    syncCapability();

    return () => {
      finePointer.removeEventListener?.("change", syncCapability);
      reducedMotion.removeEventListener?.("change", syncCapability);
      unsubscribe?.();
      unsubscribe = null;
      window.removeEventListener("scroll", onScroll);
      reset();
    };
  }, []);
}

/**
 * The same transform the `[data-tilt]` CSS rule declares.
 *
 * It is written inline as well because several tilt surfaces are Framer Motion
 * elements: their reveal leaves an inline `transform: none` behind, and an
 * inline declaration outranks the stylesheet rule. At rest the two are visually
 * identical, so clearing the inline value simply hands control back to CSS.
 */
export function tiltTransform(motion: TiltMotion): string {
  return `perspective(950px) rotateX(${motion.rotateX.toFixed(3)}deg) rotateY(${motion.rotateY.toFixed(3)}deg) translate3d(0, ${motion.lift}px, 0) scale(${motion.scale.toFixed(4)})`;
}

function writeTilt(card: HTMLElement, motion: TiltMotion) {
  // Unitless degrees: `[data-tilt]` multiplies by 1deg, and `[data-tilt-layer]`
  // multiplies the same numbers by 1px for its intra-card offset. A value
  // carrying `deg` could not do both.
  card.style.setProperty("--tilt-x", motion.rotateX.toFixed(3));
  card.style.setProperty("--tilt-y", motion.rotateY.toFixed(3));
  card.style.setProperty("--tilt-z", `${motion.lift}px`);
  card.style.setProperty("--tilt-scale", motion.scale.toFixed(4));
  card.style.setProperty("--shine-x", `${motion.shineX.toFixed(2)}%`);
  card.style.setProperty("--shine-y", `${motion.shineY.toFixed(2)}%`);
  card.style.setProperty("--glow-x", `${motion.glowX.toFixed(2)}px`);
  card.style.setProperty("--glow-y", `${motion.glowY.toFixed(2)}px`);
  card.style.transform = tiltTransform(motion);
  card.classList.add(TILT_ACTIVE_CLASS);
}

function clearTilt(card: HTMLElement) {
  // Removing the properties returns every consumer to its CSS fallback, which
  // recentres the shine at 50% 50% without writing a second set of values.
  for (const property of [
    "--tilt-x",
    "--tilt-y",
    "--tilt-z",
    "--tilt-scale",
    "--shine-x",
    "--shine-y",
    "--glow-x",
    "--glow-y",
  ]) {
    card.style.removeProperty(property);
  }
  card.style.removeProperty("transform");
  card.classList.remove(TILT_ACTIVE_CLASS);
}

function readTiltMax(card: HTMLElement): number {
  const parsed = Number.parseFloat(card.dataset.tiltMax ?? "");
  return Number.isFinite(parsed) ? parsed : DEFAULT_TILT_MAX_DEG;
}

/**
 * One delegated tilt controller for every `[data-tilt]` element on the page.
 *
 * Mount once in the shell. There is no listener per card and no React state:
 * the controller resolves the card from the shared pointer sample, batches its
 * writes into one animation frame per element, and clears them the moment the
 * pointer leaves. Both capability gates are observed live, so a mid-session
 * change to the reduced-motion preference takes effect without a reload.
 */
export function useTilt() {
  useEffect(() => {
    const capability = ambientCapability();
    if (!capability) return;
    const { finePointer, reducedMotion } = capability;

    const frames = new WeakMap<HTMLElement, number>();
    let activeCard: HTMLElement | null = null;
    let pending: { card: HTMLElement; clientX: number; clientY: number } | null =
      null;
    let unsubscribe: (() => void) | null = null;

    const cancelFrame = (card: HTMLElement) => {
      const id = frames.get(card);
      if (id) window.cancelAnimationFrame(id);
      frames.delete(card);
    };

    const resetActive = () => {
      if (!activeCard) return;
      cancelFrame(activeCard);
      clearTilt(activeCard);
      activeCard = null;
      pending = null;
    };

    const flush = (card: HTMLElement) => {
      frames.delete(card);
      const next = pending;
      pending = null;
      if (!next || next.card !== card || card !== activeCard) return;

      const motion = mapTilt(
        next.clientX,
        next.clientY,
        card.getBoundingClientRect(),
        readTiltMax(card),
        card.dataset.tiltStrength === "soft",
      );
      if (!motion) {
        resetActive();
        return;
      }
      writeTilt(card, motion);
    };

    const onPointer = (sample: PointerSample) => {
      if (!sample.active || sample.pointerType === "touch") {
        resetActive();
        return;
      }

      const card =
        sample.target instanceof Element
          ? sample.target.closest<HTMLElement>(TILT_SELECTOR)
          : null;
      if (!card) {
        resetActive();
        return;
      }

      if (activeCard !== card) {
        resetActive();
        activeCard = card;
      }

      pending = { card, clientX: sample.clientX, clientY: sample.clientY };
      if (!frames.get(card)) {
        frames.set(
          card,
          window.requestAnimationFrame(() => flush(card)),
        );
      }
    };

    const syncCapability = () => {
      const enabled = finePointer.matches && !reducedMotion.matches;

      if (enabled && !unsubscribe) {
        unsubscribe = subscribePointer(onPointer);
        return;
      }
      if (!enabled && unsubscribe) {
        unsubscribe();
        unsubscribe = null;
        resetActive();
      }
    };

    finePointer.addEventListener?.("change", syncCapability);
    reducedMotion.addEventListener?.("change", syncCapability);
    syncCapability();

    return () => {
      finePointer.removeEventListener?.("change", syncCapability);
      reducedMotion.removeEventListener?.("change", syncCapability);
      unsubscribe?.();
      unsubscribe = null;
      resetActive();
    };
  }, []);
}
