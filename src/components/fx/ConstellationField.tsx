import { useEffect, useRef, type RefObject } from "react";
import {
  createFxParticles,
  fxLinkAlpha,
  fxLinkDistance,
  seededRandom,
  stepFxParticle,
  type FxParticle,
  type FxPointer,
} from "@/lib/fxParticles";
import { subscribePointer, type PointerSample } from "@/lib/pointerBus";

const RESIZE_DEBOUNCE_MS = 150;
/** Two is the point past which extra device pixels stop being visible here. */
const MAX_DEVICE_PIXEL_RATIO = 2;
/** Fixed seed for the reduced-motion frame, so it is identical every load. */
const STATIC_SEED = 0x4c41_2026;

interface FxColors {
  particle: string;
  line: string;
}

const FALLBACK_COLORS: FxColors = {
  particle: "hsl(0 0% 100% / 0.7)",
  line: "hsl(28 100% 62% / 0.28)",
};

function readColors(): FxColors {
  if (typeof window === "undefined") return FALLBACK_COLORS;
  const styles = window.getComputedStyle(document.documentElement);
  const particle = styles.getPropertyValue("--particle").trim();
  const line = styles.getPropertyValue("--particle-line").trim();

  return {
    particle: particle || FALLBACK_COLORS.particle,
    line: line || FALLBACK_COLORS.line,
  };
}

interface ConstellationFieldProps {
  /** The `.fx` host, which carries the pause and static-mode dataset flags. */
  hostRef: RefObject<HTMLDivElement>;
}

/**
 * The dot-and-line constellation renderer.
 *
 * Extracted verbatim from `FxLayer` when the voxel renderer was added; the
 * simulation, the palette handling, the reduced-motion path and the loop are
 * unchanged, so flipping `FX_MODE` back to "constellation" restores exactly
 * this behaviour with no other edit anywhere in the repository.
 */
const ConstellationField = ({ hostRef }: ConstellationFieldProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = hostRef.current;
    if (!canvas || !host || typeof window === "undefined") return;

    const context = canvas.getContext("2d");
    // jsdom and any browser that refuses a 2D context land here. The CSS
    // planes still render; only the constellation is skipped.
    if (!context) return;

    const reducedMotion =
      typeof window.matchMedia === "function"
        ? window.matchMedia("(prefers-reduced-motion: reduce)")
        : null;
    const finePointer =
      typeof window.matchMedia === "function"
        ? window.matchMedia("(pointer: fine)")
        : null;

    let particles: FxParticle[] = [];
    let width = 0;
    let height = 0;
    let linkDistance = 0;
    let maximumDistanceSquared = 0;
    let colors = readColors();
    const pointer: FxPointer = { x: -9999, y: -9999, active: false };

    let frame = 0;
    let resizeTimer = 0;
    let unsubscribePointer: (() => void) | null = null;

    const measure = () => {
      const ratio = Math.min(
        window.devicePixelRatio || 1,
        MAX_DEVICE_PIXEL_RATIO,
      );
      width = Math.max(1, canvas.clientWidth);
      height = Math.max(1, canvas.clientHeight);
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      // Resizing the backing store resets the context, so the DPR transform is
      // re-applied here and every later calculation stays in CSS pixels.
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      linkDistance = fxLinkDistance(width);
      maximumDistanceSquared = linkDistance * linkDistance;
    };

    const rebuild = (random?: () => number) => {
      measure();
      particles = createFxParticles(width, height, random);
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i += 1) {
        const particle = particles[i];

        context.fillStyle = colors.particle;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
        context.fill();

        // Only forward pairs, so each link is considered exactly once.
        for (let j = i + 1; j < particles.length; j += 1) {
          const other = particles[j];
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distanceSquared = dx * dx + dy * dy;
          if (distanceSquared >= maximumDistanceSquared) continue;

          context.globalAlpha = fxLinkAlpha(
            distanceSquared,
            maximumDistanceSquared,
          );
          context.strokeStyle = colors.line;
          context.lineWidth = 1;
          context.beginPath();
          context.moveTo(particle.x, particle.y);
          context.lineTo(other.x, other.y);
          context.stroke();
          context.globalAlpha = 1;
        }
      }
    };

    const step = () => {
      for (const particle of particles) {
        stepFxParticle(particle, width, height, pointer);
      }
      draw();
      frame = window.requestAnimationFrame(step);
    };

    const stop = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
    };

    const start = () => {
      if (frame || document.hidden) return;
      frame = window.requestAnimationFrame(step);
    };

    const onPointer = (sample: PointerSample) => {
      if (!sample.active || sample.pointerType === "touch") {
        pointer.active = false;
        return;
      }
      pointer.x = sample.clientX;
      pointer.y = sample.clientY;
      pointer.active = true;
    };

    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        if (reducedMotion?.matches) {
          rebuild(seededRandom(STATIC_SEED));
          draw();
          return;
        }
        rebuild();
      }, RESIZE_DEBOUNCE_MS);
    };

    const onVisibilityChange = () => {
      host.dataset.paused = String(document.hidden);
      if (document.hidden) stop();
      else start();
    };

    /**
     * Theme changes swap the token values behind `--particle`, so the cached
     * colours are re-read here instead of inside the frame loop — a
     * `getComputedStyle` call per frame would force style recalculation 60
     * times a second for a value that changes twice a session.
     */
    const refreshColors = () => {
      colors = readColors();
      if (reducedMotion?.matches) draw();
    };

    const themeObserver = new MutationObserver(refreshColors);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style"],
    });

    const enterStaticMode = () => {
      stop();
      unsubscribePointer?.();
      unsubscribePointer = null;
      pointer.active = false;
      document.removeEventListener("visibilitychange", onVisibilityChange);
      host.dataset.fxStatic = "true";
      rebuild(seededRandom(STATIC_SEED));
      draw();
    };

    const enterLiveMode = () => {
      delete host.dataset.fxStatic;
      rebuild();
      if (finePointer?.matches !== false && !unsubscribePointer) {
        unsubscribePointer = subscribePointer(onPointer);
      }
      document.addEventListener("visibilitychange", onVisibilityChange, {
        passive: true,
      });
      host.dataset.paused = String(document.hidden);
      start();
    };

    const syncMotionPreference = () => {
      // Reduced motion gets a single static frame and no listeners beyond the
      // resize rebuild, which keeps the layer correctly sized rather than
      // stretched — resizing is not motion.
      if (reducedMotion?.matches) enterStaticMode();
      else enterLiveMode();
    };

    const syncPointerCapability = () => {
      if (reducedMotion?.matches) return;
      if (finePointer?.matches === false) {
        unsubscribePointer?.();
        unsubscribePointer = null;
        pointer.active = false;
      } else if (!unsubscribePointer) {
        unsubscribePointer = subscribePointer(onPointer);
      }
    };

    window.addEventListener("resize", onResize, { passive: true });
    reducedMotion?.addEventListener?.("change", syncMotionPreference);
    finePointer?.addEventListener?.("change", syncPointerCapability);
    syncMotionPreference();

    return () => {
      stop();
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      reducedMotion?.removeEventListener?.("change", syncMotionPreference);
      finePointer?.removeEventListener?.("change", syncPointerCapability);
      themeObserver.disconnect();
      unsubscribePointer?.();
      unsubscribePointer = null;
    };
  }, [hostRef]);

  return <canvas ref={canvasRef} className="fx__canvas" data-fx-canvas="true" />;
};

export default ConstellationField;
