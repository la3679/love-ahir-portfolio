import { useId, useMemo } from "react";
import type { SystemLayer } from "./layers";
import type { SceneSection } from "./latticeState";
import {
  DEFAULT_VOXEL_FORMATION,
  VOXEL_FORMATION_SPEC,
  type VoxelFormationId,
  type VoxelTone,
  type VoxelVector,
} from "./voxelFormationSpec";

/**
 * Complete SVG-first counterpart to the lazy voxel scene.
 *
 * The face is independently plotted by `voxelFormationSpec.ts`; no bitmap,
 * logo, texture or copied CodePen voxel array is embedded here. This remains
 * the finished experience for reduced motion, Save-Data, coarse pointers,
 * unavailable WebGL, import failure and context loss.
 */

interface Props {
  section?: SceneSection;
  activeLayer?: SystemLayer | null;
  coarse?: boolean;
  formation?: VoxelFormationId;
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
  if (tone === "eye") return "hsl(var(--voxel-eye))";
  if (tone === "web") return "hsl(var(--voxel-web))";
  if (tone === "dust") return "hsl(var(--voxel-dust))";
  return "hsl(var(--voxel-mask))";
}

const LatticeFallback = ({
  section = "hero",
  activeLayer = null,
  coarse = false,
  formation = DEFAULT_VOXEL_FORMATION,
}: Props) => {
  const glowId = `voxel-mask-glow-${useId().replace(/:/g, "")}`;
  const calm = section === "calm" || section === "experience";
  const pose = VOXEL_FORMATION_SPEC.formations[formation];

  const ordered = useMemo(
    () =>
      [...VOXEL_FORMATION_SPEC.staticIndices].sort(
        (left, right) => pose[left].position[2] - pose[right].position[2],
      ),
    [pose],
  );

  return (
    <svg
      viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`}
      preserveAspectRatio="xMidYMid meet"
      className="h-full w-full"
      style={{ opacity: calm ? 0.56 : 1 }}
      focusable="false"
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

      <g data-voxel-composition="dense-fan-art-mask">
        {ordered.map((index) => {
          const cell = VOXEL_FORMATION_SPEC.cells[index];
          const voxelPose = pose[index];
          const projected = projectVoxelPoint(voxelPose.position);
          const selected = activeLayer === cell.layer;
          const size = 38 * voxelPose.scale * (selected ? 1.2 : 1);
          const rotation = (voxelPose.rotation[2] * 180) / Math.PI;

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
              data-voxel-tone={cell.tone}
              data-voxel-layer={cell.layer}
              fill={toneFill(cell.tone)}
              stroke={
                selected
                  ? "hsl(var(--signal))"
                  : "hsl(var(--stage-foreground) / 0.2)"
              }
              strokeWidth={selected ? 2.4 : 0.75}
              opacity={selected ? 1 : cell.tone === "web" ? 0.9 : 0.96}
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
      </g>
    </svg>
  );
};

export default LatticeFallback;
