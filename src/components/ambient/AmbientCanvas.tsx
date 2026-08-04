import { useEffect, useRef, type RefObject } from "react";
import {
  ambientDpr,
  ambientLinkDistance,
  ambientParticleBudget,
  ambientRepulsion,
  ambientRepulsionRadius,
  createAmbientPoints,
  mapAmbientPointer,
  selectAmbientLinks,
  type AmbientPoint2D,
  type AmbientPointSpec,
  type AmbientPointer,
} from "./ambientFieldSpec";

const FRAME_INTERVAL = 1000 / 30;
const POINTER_REPULSION_MAX = 30;

interface RuntimePoint extends AmbientPointSpec {
  x: number;
  y: number;
  offsetX: number;
  offsetY: number;
}

interface Palette {
  point: string;
  accent: string;
  line: string;
}

interface Props {
  hostRef: RefObject<HTMLElement>;
  excludeRef?: RefObject<HTMLElement>;
  onReady: () => void;
  onFail: () => void;
  onUnavailable: () => void;
}

function media(query: string) {
  try {
    return window.matchMedia(query);
  } catch {
    return null;
  }
}

function token(name: string): string {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return value ? `hsl(${value})` : "transparent";
}

function readPalette(): Palette {
  return {
    point: token("--signal"),
    accent: token("--primary"),
    line: token("--signal"),
  };
}

const inactivePointer = (): AmbientPointer => ({
  active: false,
  x: 0,
  y: 0,
  parallaxX: 0,
  parallaxY: 0,
});

/**
 * Live, hero-local 2D enhancement. It owns no layout or semantics and never
 * receives pointer events itself; the authored SVG remains the first paint.
 */
const AmbientCanvas = ({
  hostRef,
  excludeRef,
  onReady,
  onFail,
  onUnavailable,
}: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas || typeof window === "undefined") return;

    const context = canvas.getContext("2d", { alpha: true });
    if (!context) {
      onFail();
      return;
    }

    const reduceMotion = media("(prefers-reduced-motion: reduce)");
    const finePointer = media("(any-hover: hover) and (any-pointer: fine)");
    if (reduceMotion?.matches || finePointer?.matches === false) {
      onUnavailable();
      return;
    }

    let disposed = false;
    let failed = false;
    let frame = 0;
    let lastPaint = 0;
    let lastTime = 0;
    let frameCount = 0;
    let width = 0;
    let height = 0;
    let intersecting = true;
    let ready = false;
    let palette = readPalette();
    let pointer = inactivePointer();
    let parallaxX = 0;
    let parallaxY = 0;
    let points: RuntimePoint[] = [];
    let drawPositions: AmbientPoint2D[] = [];
    let links = selectAmbientLinks([], 0);

    const canRun = () =>
      !disposed &&
      !failed &&
      intersecting &&
      !document.hidden &&
      !reduceMotion?.matches &&
      finePointer?.matches !== false;

    const stop = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      lastTime = 0;
    };

    const fail = () => {
      if (failed || disposed) return;
      failed = true;
      stop();
      onFail();
    };

    const schedule = () => {
      if (!canRun() || frame) return;
      frame = window.requestAnimationFrame(renderFrame);
    };

    const rebuild = (nextWidth: number, nextHeight: number) => {
      const count = ambientParticleBudget(nextWidth);
      const specs = createAmbientPoints(count);
      points = specs.map((spec) => ({
        ...spec,
        x: spec.nx * nextWidth,
        y: spec.ny * nextHeight,
        offsetX: 0,
        offsetY: 0,
      }));
      drawPositions = specs.map((spec) => ({
        x: spec.nx * nextWidth,
        y: spec.ny * nextHeight,
      }));
      links = [];
      frameCount = 0;
    };

    const resize = () => {
      const rect = host.getBoundingClientRect();
      const nextWidth = Math.max(0, rect.width || host.clientWidth);
      const nextHeight = Math.max(0, rect.height || host.clientHeight);
      if (!nextWidth || !nextHeight) return;

      const nextDpr = ambientDpr(nextWidth, window.devicePixelRatio || 1);
      const dimensionsChanged = nextWidth !== width || nextHeight !== height;
      width = nextWidth;
      height = nextHeight;
      canvas.width = Math.max(1, Math.round(width * nextDpr));
      canvas.height = Math.max(1, Math.round(height * nextDpr));
      context.setTransform(nextDpr, 0, 0, nextDpr, 0, 0);

      if (dimensionsChanged || points.length === 0) rebuild(width, height);
      schedule();
    };

    function renderFrame(now: number) {
      frame = 0;
      if (!canRun()) return;
      if (lastPaint && now - lastPaint < FRAME_INTERVAL) {
        schedule();
        return;
      }

      try {
        const elapsed = lastTime ? Math.min(0.05, (now - lastTime) / 1000) : 0;
        lastTime = now;
        lastPaint = now;
        frameCount += 1;

        const parallaxEase = 1 - Math.exp(-elapsed * 6.5);
        parallaxX += (pointer.parallaxX - parallaxX) * parallaxEase;
        parallaxY += (pointer.parallaxY - parallaxY) * parallaxEase;
        const repelRadius = ambientRepulsionRadius(width, height);
        const repelEase = 1 - Math.exp(-elapsed * (pointer.active ? 10 : 5));

        const driftPhase = now * 0.00028;
        for (let index = 0; index < points.length; index += 1) {
          const point = points[index];
          // Keep the authored streams intact. Each point drifts around its
          // deterministic anchor instead of eventually dissolving into noise.
          point.x =
            point.nx * width +
            Math.cos(driftPhase + point.phase) * point.vx * 1.6;
          point.y =
            point.ny * height +
            Math.sin(driftPhase * 0.82 + point.phase) * point.vy * 1.45;

          const displacement = ambientRepulsion(
            point.x,
            point.y,
            pointer,
            repelRadius,
            POINTER_REPULSION_MAX,
            point.phase,
          );
          point.offsetX += (displacement.x - point.offsetX) * repelEase;
          point.offsetY += (displacement.y - point.offsetY) * repelEase;
          drawPositions[index].x = point.x + point.offsetX + parallaxX;
          drawPositions[index].y = point.y + point.offsetY + parallaxY;
        }

        const linkDistance = ambientLinkDistance(width);
        if (frameCount === 1 || frameCount % 8 === 0) {
          links = selectAmbientLinks(
            drawPositions,
            linkDistance,
            Math.min(68, Math.floor(points.length * 0.92)),
          );
        }

        context.clearRect(0, 0, width, height);
        context.strokeStyle = palette.line;
        context.lineWidth = 1.15;
        for (const link of links) {
          const from = drawPositions[link.from];
          const to = drawPositions[link.to];
          context.globalAlpha =
            0.14 + (1 - Math.min(1, link.distance / linkDistance)) * 0.14;
          context.beginPath();
          context.moveTo(from.x, from.y);
          context.lineTo(to.x, to.y);
          context.stroke();
        }

        for (let index = 0; index < points.length; index += 1) {
          const point = points[index];
          const draw = drawPositions[index];
          context.fillStyle = point.accent ? palette.accent : palette.point;
          if (point.accent) {
            context.globalAlpha = 0.11;
            context.beginPath();
            context.arc(draw.x, draw.y, point.radius * 3.2, 0, Math.PI * 2);
            context.fill();
          }
          context.globalAlpha = point.accent ? 0.78 : 0.46;
          context.beginPath();
          context.arc(draw.x, draw.y, point.radius, 0, Math.PI * 2);
          context.fill();
        }
        context.globalAlpha = 1;

        if (!ready) {
          ready = true;
          onReady();
        }
      } catch {
        fail();
        return;
      }

      schedule();
    }

    const resetPointer = () => {
      pointer = inactivePointer();
      schedule();
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!intersecting || document.hidden) return;
      const hostRect = host.getBoundingClientRect();
      const excluded = excludeRef?.current?.getBoundingClientRect() ?? null;
      pointer = mapAmbientPointer(event.clientX, event.clientY, hostRect, excluded);
      schedule();
    };

    const onPointerOut = (event: PointerEvent) => {
      if (!event.relatedTarget) resetPointer();
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else schedule();
    };

    const onPreferenceChange = () => {
      if (reduceMotion?.matches || finePointer?.matches === false) {
        stop();
        onUnavailable();
      } else {
        schedule();
      }
    };

    const resizeObserver =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(() => resize());
    resizeObserver?.observe(host);

    const intersectionObserver =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver(
            (entries) => {
              const entry = entries[0];
              intersecting = Boolean(
                entry?.isIntersecting && entry.intersectionRatio > 0.04,
              );
              if (intersecting) schedule();
              else stop();
            },
            { threshold: [0, 0.05] },
          );
    intersectionObserver?.observe(host);

    const themeObserver =
      typeof MutationObserver === "undefined"
        ? null
        : new MutationObserver(() => {
            palette = readPalette();
            schedule();
          });
    themeObserver?.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerout", onPointerOut, { passive: true });
    window.addEventListener("blur", resetPointer);
    window.addEventListener("resize", resize, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    reduceMotion?.addEventListener("change", onPreferenceChange);
    finePointer?.addEventListener("change", onPreferenceChange);

    resize();
    schedule();

    return () => {
      disposed = true;
      stop();
      resizeObserver?.disconnect();
      intersectionObserver?.disconnect();
      themeObserver?.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerout", onPointerOut);
      window.removeEventListener("blur", resetPointer);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      reduceMotion?.removeEventListener("change", onPreferenceChange);
      finePointer?.removeEventListener("change", onPreferenceChange);
    };
  }, [excludeRef, hostRef, onFail, onReady, onUnavailable]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 block h-full w-full"
      aria-hidden="true"
      tabIndex={-1}
      data-ambient-canvas="true"
    />
  );
};

export default AmbientCanvas;
