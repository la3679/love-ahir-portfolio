import {
  LA_GLYPH,
  LA_GLYPH_COLUMNS,
  LA_GLYPH_EXTRUSION_DEPTH,
  LA_GLYPH_ROWS,
  LA_GLYPH_VOXEL_COUNT,
} from "@/scenes/glyphs/la";
import { SYSTEM_LAYERS, type SystemLayer } from "./layers";

/**
 * Dependency-free geometry for the warm voxel monogram scene.
 *
 * The resolved identity formation consumes an original 32 x 24 bitmap and
 * extrudes every occupied cell through four Z layers. WebGL and the authored
 * SVG consume the same stable IDs and poses, so the two renderers cannot drift
 * into different silhouettes.
 */

export const VOXEL_GRID = {
  columns: LA_GLYPH_COLUMNS,
  rows: LA_GLYPH_ROWS,
} as const;

export const VOXEL_CORE_COUNT =
  LA_GLYPH_VOXEL_COUNT * LA_GLYPH_EXTRUSION_DEPTH;
export const VOXEL_DUST_COUNT = 132;
export const VOXEL_COUNT = VOXEL_CORE_COUNT + VOXEL_DUST_COUNT;

export const VOXEL_FORMATION_IDS = ["identity", "cloud", "helix"] as const;
export type VoxelFormationId = (typeof VOXEL_FORMATION_IDS)[number];

export const DEFAULT_VOXEL_FORMATION: VoxelFormationId = "identity";
export const VOXEL_FORMATION_SEQUENCE = VOXEL_FORMATION_IDS;

export const VOXEL_IDENTITY_ORIENTATION = {
  pitch: (-4 * Math.PI) / 180,
  yaw: (8 * Math.PI) / 180,
} as const;

export type VoxelTone = "front" | "side" | "dust";
export type VoxelKind = "core" | "dust";
export type VoxelVector = readonly [x: number, y: number, z: number];

export interface VoxelCell {
  id: string;
  kind: VoxelKind;
  /** Grid coordinates and depth exist only for the extruded monogram core. */
  row: number | null;
  column: number | null;
  depth: number | null;
  layer: SystemLayer;
  tone: VoxelTone;
}

export interface VoxelPose {
  position: VoxelVector;
  rotation: VoxelVector;
  scale: number;
}

export interface VoxelFormationSpec {
  cells: ReadonlyArray<VoxelCell>;
  formations: Readonly<Record<VoxelFormationId, ReadonlyArray<VoxelPose>>>;
  /** The complete monogram and dust field remain in the static renderer. */
  staticIndices: ReadonlyArray<number>;
}

interface GridCoordinate {
  row: number;
  column: number;
}

function occupiedCoordinates(): GridCoordinate[] {
  return LA_GLYPH.flatMap((line, row) =>
    Array.from(line).flatMap((cell, column) =>
      cell === "#" ? [{ row, column }] : [],
    ),
  );
}

function buildCoreCells(): VoxelCell[] {
  let index = 0;
  return occupiedCoordinates().flatMap(({ row, column }) =>
    Array.from({ length: LA_GLYPH_EXTRUSION_DEPTH }, (_, depth) => {
      const cell: VoxelCell = {
        id: `monogram-r${String(row).padStart(2, "0")}-c${String(column).padStart(2, "0")}-z${depth}`,
        kind: "core",
        row,
        column,
        depth,
        layer: SYSTEM_LAYERS[index % SYSTEM_LAYERS.length],
        tone: depth === 0 ? "front" : "side",
      };
      index += 1;
      return cell;
    }),
  );
}

function buildDustCells(offset: number): VoxelCell[] {
  return Array.from({ length: VOXEL_DUST_COUNT }, (_, dustIndex) => ({
    id: `dust-${String(dustIndex).padStart(3, "0")}`,
    kind: "dust" as const,
    row: null,
    column: null,
    depth: null,
    layer: SYSTEM_LAYERS[(offset + dustIndex) % SYSTEM_LAYERS.length],
    tone: "dust" as const,
  }));
}

function halton(index: number, base: number): number {
  let fraction = 1;
  let result = 0;
  let value = index;

  while (value > 0) {
    fraction /= base;
    result += fraction * (value % base);
    value = Math.floor(value / base);
  }
  return result;
}

function coreIdentityPose(cell: VoxelCell): VoxelPose {
  if (cell.row === null || cell.column === null || cell.depth === null) {
    throw new Error(`Core voxel ${cell.id} is missing glyph coordinates`);
  }

  const x = (cell.column - 15) * 0.16;
  const y = (11.5 - cell.row) * 0.16;
  const z = 0.28 - cell.depth * 0.14;

  return {
    position: [x, y, z],
    rotation: [0, 0, 0],
    scale: 0.82,
  };
}

/** Smaller cubes orbit the resolved monogram in a deterministic loose halo. */
function dustIdentityPose(dustIndex: number): VoxelPose {
  const ordinal = dustIndex + 1;
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  const angle = dustIndex * goldenAngle + (halton(ordinal, 3) - 0.5) * 0.24;
  const spread = 1.04 + Math.pow(halton(ordinal, 2), 1.45) * 0.78;
  const x = Math.cos(angle) * 1.8 * spread + (halton(ordinal, 5) - 0.5) * 0.14;
  const y = Math.sin(angle) * 1.9 * spread + (halton(ordinal, 7) - 0.5) * 0.14;
  const z = (halton(ordinal, 11) - 0.5) * 1.7;

  return {
    position: [x, y, z],
    rotation: [
      halton(ordinal + 17, 7) * Math.PI * 2,
      halton(ordinal + 23, 11) * Math.PI * 2,
      halton(ordinal + 31, 13) * Math.PI * 2,
    ],
    scale: 0.28 + halton(ordinal + 37, 17) * 0.31,
  };
}

function identityPoses(cells: ReadonlyArray<VoxelCell>): VoxelPose[] {
  let dustIndex = 0;
  return cells.map((cell) => {
    if (cell.kind === "core") return coreIdentityPose(cell);
    const pose = dustIdentityPose(dustIndex);
    dustIndex += 1;
    return pose;
  });
}

function cloudPoses(cells: ReadonlyArray<VoxelCell>): VoxelPose[] {
  const raw = cells.map((_, index) => {
    const ordinal = index + 1;
    const x = (halton(ordinal, 2) - 0.5) * 5.25;
    const y = (halton(ordinal, 3) - 0.5) * 4.05;
    const z = (halton(ordinal, 5) - 0.5) * 3.15;
    return [
      x + Math.sin(y * 1.55 + z * 0.4) * 0.14,
      y + Math.sin(z * 1.2 - x * 0.22) * 0.11,
      z + Math.cos(x + y * 0.28) * 0.13,
    ] as const;
  });

  const centroid: VoxelVector = [
    raw.reduce((sum, position) => sum + position[0], 0) / raw.length,
    raw.reduce((sum, position) => sum + position[1], 0) / raw.length,
    raw.reduce((sum, position) => sum + position[2], 0) / raw.length,
  ];

  return raw.map(([x, y, z], index) => ({
    position: [x - centroid[0], y - centroid[1], z - centroid[2]],
    rotation: [
      halton(index + 11, 7) * Math.PI * 2,
      halton(index + 17, 11) * Math.PI * 2,
      halton(index + 23, 13) * Math.PI * 2,
    ],
    scale: 0.48 + halton(index + 29, 17) * 0.68,
  }));
}

function helixPose(cell: VoxelCell, index: number): VoxelPose {
  const strand = SYSTEM_LAYERS.indexOf(cell.layer);
  const step = Math.floor(index / SYSTEM_LAYERS.length);
  const stepsPerStrand = VOXEL_COUNT / SYSTEM_LAYERS.length;
  const progress = step / (stepsPerStrand - 1);
  const theta = progress * Math.PI * 6 + strand * Math.PI / 2;
  const radius = 1.22 + Math.sin(progress * Math.PI * 6 + strand * 0.42) * 0.14;

  return {
    position: [
      Math.cos(theta) * radius,
      (0.5 - progress) * 4.15,
      Math.sin(theta) * radius * 0.8,
    ],
    rotation: [
      (theta * 0.22) % (Math.PI * 2),
      theta % (Math.PI * 2),
      (-theta * 0.14) % (Math.PI * 2),
    ],
    scale: cell.kind === "dust"
      ? 0.5 + (step % 4) * 0.045
      : 0.72 + ((step + strand) % 5) * 0.045,
  };
}

export function createVoxelFormationSpec(): VoxelFormationSpec {
  const core = buildCoreCells();
  if (core.length !== VOXEL_CORE_COUNT) {
    throw new Error(
      `Expected ${VOXEL_CORE_COUNT} core voxels; received ${core.length}`,
    );
  }

  const cells = [...core, ...buildDustCells(core.length)];
  if (cells.length !== VOXEL_COUNT) {
    throw new Error(`Expected ${VOXEL_COUNT} voxels; received ${cells.length}`);
  }

  return {
    cells,
    formations: {
      identity: identityPoses(cells),
      cloud: cloudPoses(cells),
      helix: cells.map(helixPose),
    },
    staticIndices: cells.map((_, index) => index),
  };
}

export const VOXEL_FORMATION_SPEC = createVoxelFormationSpec();
