import { useEffect, useMemo, useRef, useState } from "react";
import {
  createFxPoints,
  fxLinkDistance,
  fxParticleBudget,
  selectFxLinks,
} from "@/lib/fxField";

const RESIZE_DEBOUNCE_MS = 150;
const FALLBACK_VIEWPORT = { width: 1200, height: 760 };

function readViewport() {
  if (typeof window === "undefined") return FALLBACK_VIEWPORT;
  return {
    width: Math.max(1, window.innerWidth),
    height: Math.max(1, window.innerHeight),
  };
}

/**
 * One global, fixed decorative layer shared by every route and section.
 * Geometry is SVG-first and deterministic; no content or input depends on it.
 */
const FxLayer = () => {
  const hostRef = useRef<HTMLDivElement>(null);
  const [viewport, setViewport] = useState(readViewport);

  useEffect(() => {
    let timer = 0;
    const updateViewport = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setViewport(readViewport()), RESIZE_DEBOUNCE_MS);
    };
    window.addEventListener("resize", updateViewport);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("resize", updateViewport);
    };
  }, []);

  useEffect(() => {
    const syncVisibility = () => {
      if (hostRef.current) {
        hostRef.current.dataset.paused = String(document.hidden);
      }
    };
    syncVisibility();
    document.addEventListener("visibilitychange", syncVisibility);
    return () => document.removeEventListener("visibilitychange", syncVisibility);
  }, []);

  const composition = useMemo(() => {
    const points = createFxPoints(fxParticleBudget(viewport.width, viewport.height));
    const projected = points.map((point) => ({
      x: point.nx * viewport.width,
      y: point.ny * viewport.height,
    }));
    const links = selectFxLinks(
      projected,
      fxLinkDistance(viewport.width, viewport.height),
    );
    return { points, projected, links };
  }, [viewport]);

  return (
    <div ref={hostRef} className="fx" aria-hidden="true" data-fx-layer="true">
      <svg
        className="fx__constellation"
        viewBox={`0 0 ${viewport.width} ${viewport.height}`}
        preserveAspectRatio="xMidYMid slice"
        focusable="false"
        data-fx-constellation="true"
      >
        <g fill="none" stroke="hsl(var(--signal))" strokeWidth="1.05">
          {composition.links.map((link) => (
            <line
              key={`${link.from}-${link.to}`}
              x1={composition.projected[link.from].x}
              y1={composition.projected[link.from].y}
              x2={composition.projected[link.to].x}
              y2={composition.projected[link.to].y}
              opacity={0.11 + (1 - link.distance / 140) * 0.08}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </g>
        <g>
          {composition.points.map((point, index) => (
            <circle
              key={point.id}
              data-fx-node="true"
              cx={composition.projected[index].x}
              cy={composition.projected[index].y}
              r={point.radius}
              fill={point.accent ? "hsl(var(--primary))" : "hsl(var(--signal))"}
              opacity={point.opacity}
            />
          ))}
        </g>
      </svg>
      <div className="orb orb--1" />
      <div className="orb orb--2" />
      <div className="orb orb--3" />
    </div>
  );
};

export default FxLayer;
