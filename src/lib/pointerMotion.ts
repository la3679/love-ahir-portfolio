import { useEffect, type RefObject } from "react";

export type PointerDepthSurface = "stage" | "portrait";

export interface PointerDepthMotion {
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  translateX: number;
  translateY: number;
  scale: number;
}

interface PointerDepthOptions {
  /** The stage may respond to an active touch drag without loading WebGL. */
  allowCoarseDrag?: boolean;
}

const NEUTRAL: PointerDepthMotion = {
  rotateX: 0,
  rotateY: 0,
  rotateZ: 0,
  translateX: 0,
  translateY: 0,
  scale: 1,
};

const clamp = (value: number, minimum: number, maximum: number) =>
  Math.min(maximum, Math.max(minimum, value));

/**
 * Pure pointer mapping shared by the hero stage and portrait.
 *
 * The outer layout box never moves; only transforms are written. Keeping this
 * pure makes the motion limits testable without a browser or animation frame.
 */
export function mapPointerDepth(
  clientX: number,
  clientY: number,
  rect: Pick<DOMRectReadOnly, "left" | "top" | "width" | "height">,
  surface: PointerDepthSurface,
): PointerDepthMotion {
  if (rect.width <= 0 || rect.height <= 0) return NEUTRAL;

  const x = clamp(((clientX - rect.left) / rect.width) * 2 - 1, -1, 1);
  const y = clamp(((clientY - rect.top) / rect.height) * 2 - 1, -1, 1);

  if (surface === "portrait") {
    return {
      rotateX: -y * 5,
      rotateY: x * 6,
      rotateZ: x * y * 0.6,
      translateX: x * 4,
      translateY: y * 3,
      scale: 1.015,
    };
  }

  return {
    // The field supplies the primary ±4–5° movement inside the stage. Keep
    // the physical card response deliberately smaller so the two layers add
    // depth instead of doubling into a dramatic tilt.
    rotateX: -y * 1.6,
    rotateY: x * 2.2,
    rotateZ: x * y * 0.18,
    translateX: x * 5,
    translateY: y * 4,
    scale: 1.004,
  };
}

function scaleMotion(motion: PointerDepthMotion, amount: number): PointerDepthMotion {
  return {
    rotateX: motion.rotateX * amount,
    rotateY: motion.rotateY * amount,
    rotateZ: motion.rotateZ * amount,
    translateX: motion.translateX * amount,
    translateY: motion.translateY * amount,
    scale: 1 + (motion.scale - 1) * amount,
  };
}

function writeMotion(element: HTMLElement, motion: PointerDepthMotion) {
  element.style.setProperty("--depth-rx", `${motion.rotateX.toFixed(2)}deg`);
  element.style.setProperty("--depth-ry", `${motion.rotateY.toFixed(2)}deg`);
  element.style.setProperty("--depth-rz", `${motion.rotateZ.toFixed(2)}deg`);
  element.style.setProperty("--depth-x", `${motion.translateX.toFixed(2)}px`);
  element.style.setProperty("--depth-y", `${motion.translateY.toFixed(2)}px`);
  element.style.setProperty("--depth-scale", motion.scale.toFixed(4));
  element.style.setProperty(
    "--depth-inner-x",
    `${(-motion.translateX * 1.4).toFixed(2)}px`,
  );
  element.style.setProperty(
    "--depth-inner-y",
    `${(-motion.translateY * 1.25).toFixed(2)}px`,
  );
  element.style.setProperty(
    "--depth-back-x",
    `${(motion.translateX * 0.7).toFixed(2)}px`,
  );
  element.style.setProperty(
    "--depth-back-y",
    `${(motion.translateY * 0.7).toFixed(2)}px`,
  );
  element.style.setProperty(
    "--depth-caption-x",
    `${(motion.translateX * 0.35).toFixed(2)}px`,
  );
  element.style.setProperty(
    "--depth-caption-y",
    `${(motion.translateY * 0.3).toFixed(2)}px`,
  );
}

function resetMotion(element: HTMLElement) {
  writeMotion(element, NEUTRAL);
  element.removeAttribute("data-depth-active");
}

/**
 * Pointer-driven depth without React re-renders.
 *
 * Fine pointers receive the full response. The hero stage can additionally
 * receive a smaller press/drag response on coarse pointers; it never calls
 * preventDefault, captures the pointer, or changes `touch-action: pan-y`.
 */
export function usePointerDepth(
  ref: RefObject<HTMLElement>,
  surface: PointerDepthSurface,
  options: PointerDepthOptions = {},
) {
  const allowCoarseDrag = options.allowCoarseDrag ?? false;

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof window === "undefined") return;

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let touchPointer: number | null = null;
    let frame = 0;

    const enabledFor = (event: PointerEvent) => {
      if (reduceMotion.matches) return false;
      if (finePointer.matches && event.pointerType !== "touch") return true;
      return allowCoarseDrag && event.pointerType === "touch" && touchPointer !== null;
    };

    const resetIfActive = () => {
      if (!element.hasAttribute("data-depth-active")) return;
      cancelAnimationFrame(frame);
      resetMotion(element);
    };

    const update = (event: PointerEvent) => {
      if (!enabledFor(event)) return;
      const rect = element.getBoundingClientRect();
      const amount = event.pointerType === "touch" ? 0.58 : 1;
      const motion = scaleMotion(
        mapPointerDepth(event.clientX, event.clientY, rect, surface),
        amount,
      );
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        writeMotion(element, motion);
        element.setAttribute("data-depth-active", "true");
      });
    };

    const onPointerDown = (event: PointerEvent) => {
      if (!allowCoarseDrag || event.pointerType !== "touch" || reduceMotion.matches) {
        return;
      }
      touchPointer = event.pointerId;
      update(event);
    };
    const onPointerMove = (event: PointerEvent) => {
      // Fine pointers are tracked against the window below so a fast exit
      // cannot strand the surface in its last tilted state. This local path
      // exists for an active touch drag only.
      if (event.pointerType === "touch") update(event);
    };
    const onWindowPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      if (reduceMotion.matches || !finePointer.matches) {
        resetIfActive();
        return;
      }

      const rect = element.getBoundingClientRect();
      const inside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;
      if (inside) update(event);
      else resetIfActive();
    };
    const onPointerEnd = (event: PointerEvent) => {
      if (event.pointerType === "touch" && touchPointer !== event.pointerId) return;
      touchPointer = null;
      cancelAnimationFrame(frame);
      resetMotion(element);
    };
    const onPointerLeave = (event: PointerEvent) => {
      if (event.pointerType === "touch" && touchPointer !== null) return;
      onPointerEnd(event);
    };
    const onPreferenceChange = () => {
      if (reduceMotion.matches || !finePointer.matches) {
        touchPointer = null;
        cancelAnimationFrame(frame);
        resetMotion(element);
      }
    };
    const onBlur = () => {
      touchPointer = null;
      cancelAnimationFrame(frame);
      resetMotion(element);
    };

    element.addEventListener("pointerdown", onPointerDown, { passive: true });
    element.addEventListener("pointermove", onPointerMove, { passive: true });
    element.addEventListener("pointerleave", onPointerLeave, { passive: true });
    element.addEventListener("pointerup", onPointerEnd, { passive: true });
    element.addEventListener("pointercancel", onPointerEnd, { passive: true });
    window.addEventListener("pointermove", onWindowPointerMove, { passive: true });
    finePointer.addEventListener("change", onPreferenceChange);
    reduceMotion.addEventListener("change", onPreferenceChange);
    window.addEventListener("blur", onBlur);
    resetMotion(element);

    return () => {
      cancelAnimationFrame(frame);
      resetMotion(element);
      element.removeEventListener("pointerdown", onPointerDown);
      element.removeEventListener("pointermove", onPointerMove);
      element.removeEventListener("pointerleave", onPointerLeave);
      element.removeEventListener("pointerup", onPointerEnd);
      element.removeEventListener("pointercancel", onPointerEnd);
      window.removeEventListener("pointermove", onWindowPointerMove);
      finePointer.removeEventListener("change", onPreferenceChange);
      reduceMotion.removeEventListener("change", onPreferenceChange);
      window.removeEventListener("blur", onBlur);
    };
  }, [allowCoarseDrag, ref, surface]);
}
