import { useId, useMemo } from "react";
import type { SystemLayer } from "./layers";
import type { SceneSection } from "./latticeState";
import {
  DEFAULT_VOXEL_FORMATION,
  VOXEL_FORMATION_SPEC,
  voxelToneAt,
  type VoxelFormationId,
  type VoxelTone,
  type VoxelVector,
} from "./voxelFormationSpec";

/**
 * Complete SVG-first counterpart to the lazy voxel scene.
 *
 * The LA glyph is independently authored in `src/scenes/glyphs/la.ts`; no
 * external bitmap, texture, model or copied voxel array is embedded here.
 * This remains the finished experience for reduced motion, Save-Data, coarse
 * pointers, unavailable WebGL, import failure and context loss.
 */

interface Props {
  section?: SceneSection;
  activeLayer?: SystemLayer | null;
  coarse?: boolean;
  formation?: VoxelFormationId;
  accessibleName?: string;
}

const VIEWBOX = { width: 1200, height: 900 } as const;

function projectVoxelPoint([x, y, z]: VoxelVector): {
  x: number;
  y: number;
} {
  return {
    x: VIEWBOX.width / 2 + x * 200 + z * 34,
    y: VIEWBOX.height / 2 - y * 200 + z * 18,
  };
}

function toneFill(tone: VoxelTone): string {
  if (tone === "side") return "hsl(var(--muted-foreground))";
  if (tone === "dust") return "hsl(var(--voxel-dust))";
  return "hsl(var(--signal))";
}

const LatticeFallback = ({
  section = "hero",
  activeLayer = null,
  coarse = false,
  formation = DEFAULT_VOXEL_FORMATION,
  accessibleName = "Love Ahir monogram",
}: Props) => {
  const glowId = `voxel-monogram-glow-${useId().replace(/:/g, "")}`;
  const calm = section === "calm" || section === "experience";
  const target = VOXEL_FORMATION_SPEC.formations[formation];

  const ordered = useMemo(
    () =>
      [...VOXEL_FORMATION_SPEC.staticIndices].sort(
        (left, right) =>
          target.position[left * 3 + 2] - target.position[right * 3 + 2],
      ),
    [target],
  );

  return (
    <svg
      viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`}
      preserveAspectRatio="xMidYMid meet"
      className="h-full w-full"
      style={{ opacity: calm ? 0.56 : 1 }}
      focusable="false"
      role="img"
      aria-label={accessibleName}
      data-voxel-density={coarse ? "coarse" : "desktop"}
      data-voxel-formation={formation}
      shapeRendering="geometricPrecision"
    >
      <defs>
        <radialGradient id={glowId}>
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
          <stop offset="58%" stopColor="hsl(var(--signal))" stopOpacity="0.07" />
          <stop offset="100%" stopColor="hsl(var(--signal))" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse
        cx="600"
        cy="450"
        rx="430"
        ry="390"
        fill={`url(#${glowId})`}
      />

      <g data-voxel-composition={`${formation}-system`}>
        {ordered.map((index) => {
          const cell = VOXEL_FORMATION_SPEC.cells[index];
          const offset = index * 3;
          const position: VoxelVector = [
            target.position[offset],
            target.position[offset + 1],
            target.position[offset + 2],
          ];
          const projected = projectVoxelPoint(position);
          const selected = activeLayer === cell.layer;
          const tone = voxelToneAt(target, index);
          const size = 38 * target.scale[index] * (selected ? 1.2 : 1);
          const rotation = (target.rotation[offset + 2] * 180) / Math.PI;
          const restingOpacity = tone === "dust" ? 0.72 : tone === "side" ? 0.84 : 0.98;

          return (
            <rect
              key={cell.id}
              x={(projected.x - size / 2).toFixed(2)}
              y={(projected.y - size / 2).toFixed(2)}
              width={size.toFixed(2)}
              height={size.toFixed(2)}
              rx="3"
              transform={`rotate(${rotation.toFixed(2)} ${projected.x.toFixed(2)} ${projected.y.toFixed(2)})`}
              data-voxel-id={cell.id}
              data-voxel-tone={tone}
              data-voxel-layer={cell.layer}
              fill={toneFill(tone)}
              stroke={
                selected
                  ? "hsl(var(--signal))"
                  : "hsl(var(--stage-foreground) / 0.2)"
              }
              strokeWidth={selected ? 2.4 : 0.75}
              opacity={selected ? 1 : restingOpacity}
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
      </g>
    </svg>
  );
};

export default LatticeFallback;
