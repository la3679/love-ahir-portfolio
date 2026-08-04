import { SYSTEM_LAYERS, type SystemLayer } from "./layers";

/**
 * Dependency-free geometry for the dense warm voxel-mask scene.
 *
 * The resolved illustration combines an original tapered 22 x 28 occupancy
 * rule with a deterministic dust halo. No bitmap, image trace, model, copied
 * voxel matrix, or external source data is embedded here. WebGL and the
 * authored SVG consume the same IDs and poses, so they cannot drift apart.
 */

export const VOXEL_GRID = {
  columns: 22,
  rows: 28,
} as const;

export const VOXEL_CORE_COUNT = 432;
export const VOXEL_DUST_COUNT = 132;
export const VOXEL_COUNT = VOXEL_CORE_COUNT + VOXEL_DUST_COUNT;

export const VOXEL_FORMATION_IDS = ["mask", "cloud", "helix"] as const;
export type VoxelFormationId = (typeof VOXEL_FORMATION_IDS)[number];

export const DEFAULT_VOXEL_FORMATION: VoxelFormationId = "mask";
export const VOXEL_FORMATION_SEQUENCE = VOXEL_FORMATION_IDS;

export type VoxelTone = "mask" | "eye" | "web" | "dust";
export type VoxelKind = "core" | "dust";
export type VoxelVector = readonly [x: number, y: number, z: number];

export interface VoxelCell {
  id: string;
  kind: VoxelKind;
  /** Grid coordinates exist only for the 432-cell face core. */
  row: number | null;
  column: number | null;
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
  /**
   * The complete dense composition remains in the static renderer. Thinning
   * the core damages the large paired eyes, while removing the smaller halo
   * changes the dispersed silhouette the fallback is required to preserve.
   */
  staticIndices: ReadonlyArray<number>;
}

/** Exactly 432 occupied cells, centred within the 22-column source grid. */
export const VOXEL_MASK_ROW_WIDTHS = [
  6, 8, 10, 12, 14, 16, 18,
  20, 20, 20, 20, 20, 20, 20, 20, 20,
  18, 18, 18, 18, 16, 16, 14, 14, 12, 10, 8, 6,
] as const;

interface GridCoordinate {
  row: number;
  column: number;
}

const keyOf = (row: number, column: number) => `${row}:${column}`;

function occupiedCoordinates(): GridCoordinate[] {
  return VOXEL_MASK_ROW_WIDTHS.flatMap((width, row) => {
    const start = (VOXEL_GRID.columns - width) / 2;
    return Array.from({ length: width }, (_, offset) => ({
      row,
      column: start + offset,
    }));
  });
}

/**
 * Two mirrored swept eye interiors. The inequalities describe tapered shapes
 * in grid space; there is no stored pixel mask or traced reference image.
 */
function isEye(row: number, column: number): boolean {
  const x = column - (VOXEL_GRID.columns - 1) / 2;
  const y = row - (VOXEL_GRID.rows - 1) / 2;
  const distanceFromSeam = Math.abs(x);

  if (distanceFromSeam < 1.5 || distanceFromSeam > 7.2) return false;

  const inset = 7.2 - distanceFromSeam;
  const upperEdge = -5.2 + inset * 0.42;
  const lowerEdge = 0.5 + inset * 0.55;
  return y >= upperEdge && y <= lowerEdge;
}

function angularDistance(angle: number, target: number): number {
  const turn = Math.PI * 2;
  const difference = Math.abs(angle - target) % turn;
  return Math.min(difference, turn - difference);
}

/**
 * Low-detail web construction: a crisp eye frame, central seam, four diagonal
 * spoke families, and three loose rings. The mask remains the dominant tone.
 */
function isWeb(
  row: number,
  column: number,
  occupied: ReadonlySet<string>,
  eyes: ReadonlySet<string>,
): boolean {
  const x = column - (VOXEL_GRID.columns - 1) / 2;
  const y = (row - (VOXEL_GRID.rows - 1) / 2) * 0.78;

  for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
    for (let columnOffset = -1; columnOffset <= 1; columnOffset += 1) {
      if (Math.abs(rowOffset) + Math.abs(columnOffset) !== 1) continue;
      const neighbor = keyOf(row + rowOffset, column + columnOffset);
      if (occupied.has(neighbor) && eyes.has(neighbor)) return true;
    }
  }

  if (Math.abs(x) <= 0.51) return true;

  const radius = Math.hypot(x, y);
  const angle = Math.atan2(y, x);
  const onSpoke = Array.from({ length: 4 }, (_, index) => index * Math.PI / 4)
    .some((target) => angularDistance(angle, target) < 0.025);
  const onRing = [4.1, 6.5, 8.6]
    .some((ring) => Math.abs(radius - ring) < 0.05);

  return onSpoke || onRing;
}

function buildCoreCells(): VoxelCell[] {
  const coordinates = occupiedCoordinates();
  const occupied = new Set(
    coordinates.map(({ row, column }) => keyOf(row, column)),
  );
  const eyes = new Set(
    coordinates
      .filter(({ row, column }) => isEye(row, column))
      .map(({ row, column }) => keyOf(row, column)),
  );

  return coordinates.map(({ row, column }, index) => {
    const key = keyOf(row, column);
    const tone: VoxelTone = eyes.has(key)
      ? "eye"
      : isWeb(row, column, occupied, eyes)
        ? "web"
        : "mask";

    return {
      id: `voxel-r${String(row).padStart(2, "0")}-c${String(column).padStart(2, "0")}`,
      kind: "core",
      row,
      column,
      layer: SYSTEM_LAYERS[index % SYSTEM_LAYERS.length],
      tone,
    };
  });
}

function buildDustCells(offset: number): VoxelCell[] {
  return Array.from({ length: VOXEL_DUST_COUNT }, (_, dustIndex) => ({
    id: `dust-${String(dustIndex).padStart(3, "0")}`,
    kind: "dust" as const,
    row: null,
    column: null,
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

function coreMaskPose(cell: VoxelCell, index: number): VoxelPose {
  if (cell.row === null || cell.column === null) {
    throw new Error(`Core voxel ${cell.id} is missing grid coordinates`);
  }

  const x = (cell.column - (VOXEL_GRID.columns - 1) / 2) * 0.17;
  const y = ((VOXEL_GRID.rows - 1) / 2 - cell.row) * 0.14;
  const normalizedRadius = Math.min(
    1,
    Math.hypot(x / 1.72, y / 1.96),
  );
  const z = 0.02 + (1 - normalizedRadius * normalizedRadius) * 0.34;
  const toneScale = cell.tone === "web" ? 0.68 : cell.tone === "eye" ? 0.9 : 0.84;

  return {
    position: [x, y, z],
    rotation: [
      -y * 0.024,
      x * 0.038,
      ((cell.row + cell.column) % 3 - 1) * 0.014,
    ],
    scale: toneScale + (index % 5) * 0.02,
  };
}

/** Smaller cubes orbit the resolved silhouette in a deterministic loose halo. */
function dustMaskPose(dustIndex: number): VoxelPose {
  const ordinal = dustIndex + 1;
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  const angle = dustIndex * goldenAngle + (halton(ordinal, 3) - 0.5) * 0.24;
  const spread = 1.04 + Math.pow(halton(ordinal, 2), 1.45) * 0.78;
  const x = Math.cos(angle) * 1.76 * spread + (halton(ordinal, 5) - 0.5) * 0.14;
  const y = Math.sin(angle) * 2.08 * spread + (halton(ordinal, 7) - 0.5) * 0.14;
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

function maskPoses(cells: ReadonlyArray<VoxelCell>): VoxelPose[] {
  let dustIndex = 0;
  return cells.map((cell, index) => {
    if (cell.kind === "core") return coreMaskPose(cell, index);
    const pose = dustMaskPose(dustIndex);
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
      mask: maskPoses(cells),
      cloud: cloudPoses(cells),
      helix: cells.map(helixPose),
    },
    staticIndices: cells.map((_, index) => index),
  };
}

export const VOXEL_FORMATION_SPEC = createVoxelFormationSpec();
