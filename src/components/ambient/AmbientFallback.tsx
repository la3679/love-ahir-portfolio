import {
  AMBIENT_VIEWBOX,
  ambientLinkDistance,
  createAmbientPoints,
  selectAmbientLinks,
} from "./ambientFieldSpec";

const POINTS = createAmbientPoints(48);
const PROJECTED = POINTS.map((point) => ({
  x: point.nx * AMBIENT_VIEWBOX.width,
  y: point.ny * AMBIENT_VIEWBOX.height,
}));
const LINKS = selectAmbientLinks(
  PROJECTED,
  ambientLinkDistance(AMBIENT_VIEWBOX.width),
  44,
);

interface Props {
  live?: boolean;
}

/** Authored, motionless first paint and permanent constrained-device result. */
const AmbientFallback = ({ live = false }: Props) => (
  <svg
    viewBox={`0 0 ${AMBIENT_VIEWBOX.width} ${AMBIENT_VIEWBOX.height}`}
    preserveAspectRatio="xMidYMid slice"
    className={`absolute inset-0 block h-full w-full transition-opacity duration-300 ${
      live ? "opacity-0" : "opacity-100"
    }`}
    focusable="false"
    aria-hidden="true"
    data-ambient-fallback="true"
    shapeRendering="geometricPrecision"
  >
    <g fill="none" stroke="hsl(var(--signal))" strokeWidth="1.1">
      {LINKS.map((link) => (
        <line
          key={`${link.from}-${link.to}`}
          x1={PROJECTED[link.from].x}
          y1={PROJECTED[link.from].y}
          x2={PROJECTED[link.to].x}
          y2={PROJECTED[link.to].y}
          opacity={0.14 + (1 - link.distance / 134) * 0.14}
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </g>
    <g>
      {POINTS.map((point, index) => (
        <g key={point.id}>
          {point.accent ? (
            <circle
              cx={PROJECTED[index].x}
              cy={PROJECTED[index].y}
              r={point.radius * 2.7}
              fill="hsl(var(--primary))"
              opacity={0.1}
            />
          ) : null}
          <circle
            cx={PROJECTED[index].x}
            cy={PROJECTED[index].y}
            r={point.radius}
            fill={point.accent ? "hsl(var(--primary))" : "hsl(var(--signal))"}
            opacity={point.accent ? 0.66 : 0.4}
          />
        </g>
      ))}
    </g>
  </svg>
);

export default AmbientFallback;
