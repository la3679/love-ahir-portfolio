import { useEffect, useRef, type RefObject } from "react";
import {
  createCornerBuffer,
  createVoxelCubes,
  projectCube,
  seededRandomVoxel,
  stepVoxelCube,
  visibleSideFaces,
  voxelPulse,
  voxelRenderValues,
  VOXEL_LEFT_FACE_ALPHA,
  VOXEL_RIGHT_FACE_ALPHA,
  VOXEL_TOP_FACE_ALPHA,
  type VoxelCube,
  type VoxelPointer,
  type VoxelRenderValues,
} from "@/lib/fxVoxels";
import { subscribePointer, type PointerSample } from "@/lib/pointerBus";

const RESIZE_DEBOUNCE_MS = 150;
/** Two is the point past which extra device pixels stop being visible here. */
const MAX_DEVICE_PIXEL_RATIO = 2;
/** Fixed seed for the reduced-motion frame, so it is identical every load. */
const STATIC_SEED = 0x4c41_2026;

interface VoxelColors {
  graphite: string;
  accent: string;
}

const FALLBACK_COLORS: VoxelColors = {
  graphite: "hsl(40 12% 82%)",
  accent: "hsl(24 95% 56%)",
};

/**
 * The voxel tokens are HSL triples, not complete colours.
 *
 * Alpha is applied with `globalAlpha` rather than baked into the string, so
 * the frame loop performs no string concatenation at all.
 */
function readColors(): VoxelColors {
  if (typeof window === "undefined") return FALLBACK_COLORS;
  const styles = window.getComputedStyle(document.documentElement);
  const graphite = styles.getPropertyValue("--voxel-graphite").trim();
  const accent = styles.getPropertyValue("--voxel-accent").trim();

  return {
    graphite: graphite ? `hsl(${graphite})` : FALLBACK_COLORS.graphite,
    accent: accent ? `hsl(${accent})` : FALLBACK_COLORS.accent,
  };
}

interface VoxelFieldProps {
  /** The `.fx` host, which carries the pause and static-mode dataset flags. */
  hostRef: RefObject<HTMLDivElement>;
}

/**
 * The isometric Voxel Drift Field.
 *
 * Small axis-aligned cubes drift as one coherent current, at depths that drive
 * their size, brightness and speed. There are no connecting lines: the link
 * pass is absent rather than tuned down. The cursor does not push cubes away —
 * it presses a soft depression into the field that heals when it leaves.
 *
 * Initial placement is biased toward the LA monogram's occupancy grid, reusing
 * the same `LA_GLYPH` bitmap that assembles the hero lattice, so the mark, the
 * hero scene and this background all derive from one source of truth.
 */
const VoxelField = ({ hostRef }: VoxelFieldProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = hostRef.current;
    if (!canvas || !host || typeof window === "undefined") return;

    const context = canvas.getContext("2d");
    // jsdom and any browser that refuses a 2D context land here. The CSS
    // planes still render; only the cube field is skipped.
    if (!context) return;

    const reducedMotion =
      typeof window.matchMedia === "function"
        ? window.matchMedia("(prefers-reduced-motion: reduce)")
        : null;
    const finePointer =
      typeof window.matchMedia === "function"
        ? window.matchMedia("(pointer: fine)")
        : null;

    let cubes: VoxelCube[] = [];
    let order: number[] = [];
    let width = 0;
    let height = 0;
    let colors = readColors();
    let startedAt = 0;

    const pointer: VoxelPointer = { x: -9999, y: -9999, active: false };

    // Every buffer the loop touches is allocated once, here.
    const corners = createCornerBuffer();
    const faces = { right: 1, left: 2 };
    const wrapGrid = { gx: 0, gy: 0 };
    const render: VoxelRenderValues = {
      sx: 0,
      sy: 0,
      depth: 0,
      edge: 0,
      alpha: 0,
    };
    const sortKeys: number[] = [];

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
    };

    const rebuild = (random?: () => number) => {
      measure();
      cubes = createVoxelCubes(width, height, random);
      order = cubes.map((_, index) => index);
      sortKeys.length = cubes.length;
    };

    /** One closed 4-point face. `a`..`d` are corner indices into `corners`. */
    const fillFace = (a: number, b: number, c: number, d: number) => {
      context.beginPath();
      context.moveTo(corners[a * 2], corners[a * 2 + 1]);
      context.lineTo(corners[b * 2], corners[b * 2 + 1]);
      context.lineTo(corners[c * 2], corners[c * 2 + 1]);
      context.lineTo(corners[d * 2], corners[d * 2 + 1]);
      context.closePath();
      context.fill();
    };

    const draw = (pulse: number) => {
      context.clearRect(0, 0, width, height);

      // Painter's algorithm: resolve every cube's screen depth, then walk the
      // index array back to front. With <= 54 cubes the sort is free.
      for (let i = 0; i < cubes.length; i += 1) {
        voxelRenderValues(cubes[i], pulse, render);
        sortKeys[i] = render.sy;
      }
      order.sort((a, b) => sortKeys[a] - sortKeys[b]);

      for (const index of order) {
        const cube = cubes[index];
        voxelRenderValues(cube, pulse, render);
        if (render.alpha <= 0.002 || render.edge <= 0) continue;

        projectCube(
          cube.gx,
          cube.gy,
          render.depth,
          render.edge,
          cube.yaw,
          corners,
        );
        visibleSideFaces(cube.yaw, faces);

        context.fillStyle = cube.accent ? colors.accent : colors.graphite;

        // Three flat fills, brightest on top. No gradients and no shadowBlur:
        // both are disproportionately expensive for a background layer.
        context.globalAlpha = render.alpha * VOXEL_TOP_FACE_ALPHA;
        fillFace(4, 5, 6, 7);

        const right = faces.right;
        context.globalAlpha = render.alpha * VOXEL_RIGHT_FACE_ALPHA;
        fillFace(right, (right + 1) % 4, 4 + ((right + 1) % 4), 4 + right);

        const left = faces.left;
        context.globalAlpha = render.alpha * VOXEL_LEFT_FACE_ALPHA;
        fillFace(left, (left + 1) % 4, 4 + ((left + 1) % 4), 4 + left);
      }

      context.globalAlpha = 1;
    };

    const step = (timestamp: number) => {
      if (startedAt === 0) startedAt = timestamp;
      const pulse = voxelPulse(timestamp - startedAt);

      for (const cube of cubes) {
        stepVoxelCube(cube, width, height, pointer, pulse, wrapGrid);
      }
      draw(pulse);
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
          rebuild(seededRandomVoxel(STATIC_SEED));
          draw(1);
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
     * Theme changes swap the token values behind `--voxel-graphite`, so the
     * cached colours are re-read here instead of inside the frame loop — a
     * `getComputedStyle` call per frame would force style recalculation 60
     * times a second for a value that changes twice a session.
     */
    const refreshColors = () => {
      colors = readColors();
      if (reducedMotion?.matches) draw(1);
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
      rebuild(seededRandomVoxel(STATIC_SEED));
      draw(1);
    };

    const enterLiveMode = () => {
      delete host.dataset.fxStatic;
      startedAt = 0;
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

  return (
    <canvas
      ref={canvasRef}
      className="fx__canvas fx__canvas--voxel"
      data-fx-canvas="true"
      data-fx-voxel="true"
    />
  );
};

export default VoxelField;
