import { useEffect } from "react";

export const PROJECT_CARD_SELECTOR = "[data-project-tilt]";
export const PROJECT_CARD_MAX_TILT_DEG = 6;

export interface ProjectCardMotion {
  /** Pointer position within the card, expressed as a clamped percentage. */
  shineX: number;
  shineY: number;
  /** Pointer position within the card in pixels, used by transform-only glow CSS. */
  glowX: number;
  glowY: number;
  rotateX: number;
  rotateY: number;
}

const clamp = (value: number, minimum: number, maximum: number) =>
  Math.min(maximum, Math.max(minimum, value));

/**
 * Map a viewport pointer position into restrained project-card motion.
 *
 * The result is clamped even when a fast pointer event lands outside the last
 * measured card bounds. A zero-size card cannot produce meaningful motion, so
 * it returns null and the caller restores the settled state.
 */
export function mapProjectCardMotion(
  clientX: number,
  clientY: number,
  rect: Pick<DOMRectReadOnly, "left" | "top" | "width" | "height">,
): ProjectCardMotion | null {
  if (rect.width <= 0 || rect.height <= 0) return null;

  const x = clamp((clientX - rect.left) / rect.width, 0, 1);
  const y = clamp((clientY - rect.top) / rect.height, 0, 1);

  return {
    shineX: x * 100,
    shineY: y * 100,
    glowX: x * rect.width,
    glowY: y * rect.height,
    rotateX: clamp(
      (0.5 - y) * PROJECT_CARD_MAX_TILT_DEG * 2,
      -PROJECT_CARD_MAX_TILT_DEG,
      PROJECT_CARD_MAX_TILT_DEG,
    ),
    rotateY: clamp(
      (x - 0.5) * PROJECT_CARD_MAX_TILT_DEG * 2,
      -PROJECT_CARD_MAX_TILT_DEG,
      PROJECT_CARD_MAX_TILT_DEG,
    ),
  };
}

/** A pure formatter kept separate so bounds and transform policy stay testable. */
export function projectCardTransform(motion: ProjectCardMotion): string {
  return `perspective(950px) rotateY(${motion.rotateY.toFixed(2)}deg) rotateX(${motion.rotateX.toFixed(2)}deg) translate3d(0, -4px, 0)`;
}

function findProjectCard(target: EventTarget | null): HTMLElement | null {
  return target instanceof Element
    ? target.closest<HTMLElement>(PROJECT_CARD_SELECTOR)
    : null;
}

function writeProjectCardMotion(card: HTMLElement, motion: ProjectCardMotion) {
  card.style.setProperty("--shine-x", `${motion.shineX.toFixed(2)}%`);
  card.style.setProperty("--shine-y", `${motion.shineY.toFixed(2)}%`);
  card.style.setProperty("--glow-x", `${motion.glowX.toFixed(2)}px`);
  card.style.setProperty("--glow-y", `${motion.glowY.toFixed(2)}px`);
  card.style.transform = projectCardTransform(motion);
  card.dataset.projectTiltActive = "true";
}

function resetProjectCard(card: HTMLElement) {
  card.style.removeProperty("--shine-x");
  card.style.removeProperty("--shine-y");
  card.style.removeProperty("--glow-x");
  card.style.removeProperty("--glow-y");
  card.style.removeProperty("transform");
  delete card.dataset.projectTiltActive;
}

/**
 * One delegated project-card motion controller.
 *
 * Mount this hook once in the common owner of all `[data-project-tilt]` cards.
 * It performs no React state updates and never installs a listener per card.
 * The document pointer listener exists only while a fine pointer is active and
 * reduced motion is not requested; both gates are observed live.
 */
export function useProjectCardMotion() {
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof document === "undefined" ||
      typeof window.matchMedia !== "function"
    ) {
      return;
    }

    const finePointer = window.matchMedia("(pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let activeCard: HTMLElement | null = null;
    let pending:
      | { card: HTMLElement; clientX: number; clientY: number }
      | null = null;
    let frame = 0;
    let pointerListenersAttached = false;

    const cancelPendingFrame = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      pending = null;
    };

    const resetActiveCard = () => {
      cancelPendingFrame();
      if (activeCard) resetProjectCard(activeCard);
      activeCard = null;
    };

    const flush = () => {
      frame = 0;
      const next = pending;
      pending = null;
      if (!next || next.card !== activeCard) return;

      const motion = mapProjectCardMotion(
        next.clientX,
        next.clientY,
        next.card.getBoundingClientRect(),
      );
      if (!motion) {
        resetActiveCard();
        return;
      }
      writeProjectCardMotion(next.card, motion);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") {
        resetActiveCard();
        return;
      }

      const card = findProjectCard(event.target);
      if (!card) {
        resetActiveCard();
        return;
      }

      if (activeCard !== card) {
        resetActiveCard();
        activeCard = card;
      }

      pending = { card, clientX: event.clientX, clientY: event.clientY };
      if (!frame) frame = window.requestAnimationFrame(flush);
    };

    const onPointerOut = (event: PointerEvent) => {
      const origin = findProjectCard(event.target);
      const destination = findProjectCard(event.relatedTarget);
      if (origin && origin === activeCard && origin !== destination) {
        resetActiveCard();
      }
    };

    const attachPointerListeners = () => {
      if (pointerListenersAttached) return;
      document.addEventListener("pointermove", onPointerMove, { passive: true });
      document.addEventListener("pointerout", onPointerOut, { passive: true });
      pointerListenersAttached = true;
    };

    const detachPointerListeners = () => {
      if (!pointerListenersAttached) return;
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerout", onPointerOut);
      pointerListenersAttached = false;
    };

    const syncCapability = () => {
      if (finePointer.matches && !reducedMotion.matches) {
        attachPointerListeners();
      } else {
        detachPointerListeners();
        resetActiveCard();
      }
    };

    finePointer.addEventListener?.("change", syncCapability);
    reducedMotion.addEventListener?.("change", syncCapability);
    window.addEventListener("blur", resetActiveCard);
    syncCapability();

    return () => {
      detachPointerListeners();
      finePointer.removeEventListener?.("change", syncCapability);
      reducedMotion.removeEventListener?.("change", syncCapability);
      window.removeEventListener("blur", resetActiveCard);
      resetActiveCard();
    };
  }, []);
}
