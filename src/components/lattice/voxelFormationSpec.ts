import {
  LA_GLYPH,
  LA_GLYPH_COLUMNS,
  LA_GLYPH_EXTRUSION_DEPTH,
  LA_GLYPH_ROWS,
  LA_GLYPH_VOXEL_COUNT,
} from "@/scenes/glyphs/la";
import { SYSTEM_LAYERS, type SystemLayer } from "./layers";

/** Packed, dependency-free targets for the three-beat voxel systems story. */

export const VOXEL_GRID = {
  columns: LA_GLYPH_COLUMNS,
  rows: LA_GLYPH_ROWS,
} as const;

export const VOXEL_COUNT = 1400;
export const VOXEL_CORE_COUNT =
  LA_GLYPH_VOXEL_COUNT * LA_GLYPH_EXTRUSION_DEPTH;
export const VOXEL_DUST_COUNT = VOXEL_COUNT - VOXEL_CORE_COUNT;
export const IDENTITY_VISIBLE_DUST_COUNT = 156;

export const VOXEL_FORMATION_IDS = [
  "identity",
  "architecture",
  "throughput",
] as const;
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

const TONE_CODE = {
  front: 0,
  side: 1,
  dust: 2,
} as const satisfies Record<VoxelTone, number>;
const TONES = ["front", "side", "dust"] as const satisfies readonly VoxelTone[];

export interface VoxelCell {
  id: string;
  kind: VoxelKind;
  /** Grid coordinates and depth exist only for the extruded monogram core. */
  row: number | null;
  column: number | null;
  depth: number | null;
  layer: SystemLayer;
  /** Identity's authored tone. Other formations carry their own tone arrays. */
  tone: VoxelTone;
}

export interface VoxelFormationTarget {
  position: Float32Array;
  rotation: Float32Array;
  scale: Float32Array;
  tone: Uint8Array;
}

export interface VoxelFormationSpec {
  cells: ReadonlyArray<VoxelCell>;
  formations: Readonly<Record<VoxelFormationId, VoxelFormationTarget>>;
  architecturePulseIndices: readonly [
    ReadonlyArray<number>,
    ReadonlyArray<number>,
  ];
  staticIndices: ReadonlyArray<number>;
}

export const ARCHITECTURE_LAYOUT = {
  nodeCount: 8,
  voxelsPerNode: 64,
  edgeCount: 10,
  voxelsPerEdge: 70,
  loopCount: 2,
  voxelsPerLoop: 94,
} as const;

export const THROUGHPUT_LAYOUT = {
  columns: 20,
  lanes: 14,
  levels: 5,
} as const;

export const ARCHITECTURE_NODE_CENTRES: ReadonlyArray<VoxelVector> = [
  [0, 1.35, 0],
  [-1.5, 0.35, 0.22],
  [-0.5, 0.35, -0.12],
  [0.5, 0.35, 0.12],
  [1.5, 0.35, -0.22],
  [-1, -1.05, 0.18],
  [0, -1.05, -0.18],
  [1, -1.05, 0.18],
] as const;

interface GridCoordinate {
  row: number;
  column: number;
}

interface PoseInput {
  position: VoxelVector;
  rotation?: VoxelVector;
  scale: number;
  tone: VoxelTone;
}

function occupiedCoordinates(): GridCoordinate[] {
  return LA_GLYPH.flatMap((line, row) =>
    Array.from(line).flatMap((cell, column) =>
      cell === "#" ? [{ row, column }] : [],
    ),
  );
}

function buildCells(): VoxelCell[] {
  let index = 0;
  const core = occupiedCoordinates().flatMap(({ row, column }) =>
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

  const dust = Array.from({ length: VOXEL_DUST_COUNT }, (_, dustIndex) => ({
    id: `particle-${String(dustIndex).padStart(4, "0")}`,
    kind: "dust" as const,
    row: null,
    column: null,
    depth: null,
    layer: SYSTEM_LAYERS[(core.length + dustIndex) % SYSTEM_LAYERS.length],
    tone: "dust" as const,
  }));

  return [...core, ...dust];
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

function createTarget(): VoxelFormationTarget {
  return {
    position: new Float32Array(VOXEL_COUNT * 3),
    rotation: new Float32Array(VOXEL_COUNT * 3),
    scale: new Float32Array(VOXEL_COUNT),
    tone: new Uint8Array(VOXEL_COUNT),
  };
}

function writePose(
  target: VoxelFormationTarget,
  index: number,
  pose: PoseInput,
): void {
  const offset = index * 3;
  target.position[offset] = pose.position[0];
  target.position[offset + 1] = pose.position[1];
  target.position[offset + 2] = pose.position[2];
  target.rotation[offset] = pose.rotation?.[0] ?? 0;
  target.rotation[offset + 1] = pose.rotation?.[1] ?? 0;
  target.rotation[offset + 2] = pose.rotation?.[2] ?? 0;
  target.scale[index] = pose.scale;
  target.tone[index] = TONE_CODE[pose.tone];
}

export function voxelToneAt(
  target: VoxelFormationTarget,
  index: number,
): VoxelTone {
  return TONES[target.tone[index]] ?? "dust";
}

function buildIdentityTarget(cells: ReadonlyArray<VoxelCell>): VoxelFormationTarget {
  const target = createTarget();
  let dustIndex = 0;

  cells.forEach((cell, index) => {
    if (cell.row !== null && cell.column !== null && cell.depth !== null) {
      writePose(target, index, {
        position: [
          (cell.column - 15) * 0.16,
          (11.5 - cell.row) * 0.16,
          0.28 - cell.depth * 0.14,
        ],
        scale: 0.82,
        tone: cell.tone,
      });
      return;
    }

    const ordinal = dustIndex + 1;
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    const angle = dustIndex * goldenAngle + (halton(ordinal, 3) - 0.5) * 0.2;
    const spread = 1.02 + Math.pow(halton(ordinal, 2), 1.55) * 0.43;
    writePose(target, index, {
      position: [
        Math.cos(angle) * 1.64 * spread + (halton(ordinal, 5) - 0.5) * 0.1,
        Math.sin(angle) * 1.46 * spread + (halton(ordinal, 7) - 0.5) * 0.1,
        (halton(ordinal, 11) - 0.5) * 1.65,
      ],
      rotation: [
        halton(ordinal + 17, 7) * Math.PI * 2,
        halton(ordinal + 23, 11) * Math.PI * 2,
        halton(ordinal + 31, 13) * Math.PI * 2,
      ],
      scale: dustIndex < IDENTITY_VISIBLE_DUST_COUNT
        ? 0.2 + Math.pow(halton(ordinal + 37, 17), 1.7) * 0.27
        : 0.001,
      tone: "dust",
    });
    dustIndex += 1;
  });

  return target;
}

const interpolateVector = (
  from: VoxelVector,
  to: VoxelVector,
  progress: number,
): VoxelVector => [
  from[0] + (to[0] - from[0]) * progress,
  from[1] + (to[1] - from[1]) * progress,
  from[2] + (to[2] - from[2]) * progress,
];

function buildArchitectureTarget(): {
  target: VoxelFormationTarget;
  pulseIndices: [number[], number[]];
} {
  const target = createTarget();
  let index = 0;

  ARCHITECTURE_NODE_CENTRES.forEach((centre, nodeIndex) => {
    for (let x = 0; x < 4; x += 1) {
      for (let y = 0; y < 4; y += 1) {
        for (let z = 0; z < 4; z += 1) {
          writePose(target, index, {
            position: [
              centre[0] + (x - 1.5) * 0.075,
              centre[1] + (y - 1.5) * 0.075,
              centre[2] + (z - 1.5) * 0.075,
            ],
            scale: nodeIndex === 0 ? 0.66 : 0.6,
            tone: "front",
          });
          index += 1;
        }
      }
    }
  });

  const node = ARCHITECTURE_NODE_CENTRES;
  const edges: ReadonlyArray<readonly [VoxelVector, VoxelVector]> = [
    [node[0], node[1]],
    [node[0], node[2]],
    [node[0], node[3]],
    [node[0], node[4]],
    [node[1], node[5]],
    [node[2], node[6]],
    [node[3], node[6]],
    [node[4], node[7]],
    [node[5], node[6]],
    [node[6], node[7]],
  ];
  const edgeRanges: number[][] = [];

  edges.forEach(([from, to]) => {
    const range: number[] = [];
    for (let point = 0; point < ARCHITECTURE_LAYOUT.voxelsPerEdge; point += 1) {
      const lane = point % 2;
      const progress = Math.floor(point / 2) / 34;
      const position = interpolateVector(from, to, progress);
      writePose(target, index, {
        position: [
          position[0],
          position[1] + (lane === 0 ? -0.028 : 0.028),
          position[2] + (lane === 0 ? -0.035 : 0.035),
        ],
        scale: 0.38,
        tone: "side",
      });
      range.push(index);
      index += 1;
    }
    edgeRanges.push(range);
  });

  const loops: ReadonlyArray<readonly [
    VoxelVector,
    VoxelVector,
    VoxelVector,
    VoxelVector,
  ]> = [
    [node[4], [2.08, -0.2, 0.48], [-0.1, -0.5, 0.48], node[2]],
    [node[3], [0.9, -0.72, -0.48], [-1.82, -0.72, -0.48], node[1]],
  ];

  loops.forEach(([from, controlA, controlB, to], loopIndex) => {
    for (let point = 0; point < ARCHITECTURE_LAYOUT.voxelsPerLoop; point += 1) {
      const lane = point % 2;
      const t = Math.floor(point / 2) / 46;
      const inverse = 1 - t;
      const position: VoxelVector = [
        inverse ** 3 * from[0] + 3 * inverse ** 2 * t * controlA[0] +
          3 * inverse * t ** 2 * controlB[0] + t ** 3 * to[0],
        inverse ** 3 * from[1] + 3 * inverse ** 2 * t * controlA[1] +
          3 * inverse * t ** 2 * controlB[1] + t ** 3 * to[1],
        inverse ** 3 * from[2] + 3 * inverse ** 2 * t * controlA[2] +
          3 * inverse * t ** 2 * controlB[2] + t ** 3 * to[2],
      ];
      writePose(target, index, {
        position: [position[0], position[1], position[2] + (lane ? 0.03 : -0.03)],
        rotation: [0, 0, (loopIndex === 0 ? 1 : -1) * 0.12],
        scale: 0.34,
        tone: "dust",
      });
      index += 1;
    }
  });

  if (index !== VOXEL_COUNT) {
    throw new Error(`Architecture target wrote ${index} of ${VOXEL_COUNT} voxels`);
  }

  return {
    target,
    pulseIndices: [edgeRanges[0], edgeRanges[6]],
  };
}

function buildThroughputTarget(): VoxelFormationTarget {
  const target = createTarget();
  let index = 0;

  for (let column = 0; column < THROUGHPUT_LAYOUT.columns; column += 1) {
    const x = -2.15 + (column / (THROUGHPUT_LAYOUT.columns - 1)) * 4.3;
    for (let lane = 0; lane < THROUGHPUT_LAYOUT.lanes; lane += 1) {
      const z = -0.85 + (lane / (THROUGHPUT_LAYOUT.lanes - 1)) * 1.7;
      const wave = Math.min(
        0.96,
        Math.max(
          0.14,
          0.52 + Math.sin(column * 0.66) * 0.25 +
            Math.cos(lane * 0.52 + column * 0.18) * 0.18,
        ),
      );
      const rise = 0.18 + wave * 0.36;

      for (let level = 0; level < THROUGHPUT_LAYOUT.levels; level += 1) {
        writePose(target, index, {
          position: [x, -1.02 + level * rise, z],
          rotation: [0, (lane - 6.5) * 0.006, 0],
          scale: 0.52 + wave * 0.16,
          tone: level === THROUGHPUT_LAYOUT.levels - 1 ? "front" : "side",
        });
        index += 1;
      }
    }
  }

  if (index !== VOXEL_COUNT) {
    throw new Error(`Throughput target wrote ${index} of ${VOXEL_COUNT} voxels`);
  }
  return target;
}

export function createVoxelFormationSpec(): VoxelFormationSpec {
  const cells = buildCells();
  if (cells.length !== VOXEL_COUNT) {
    throw new Error(`Expected ${VOXEL_COUNT} voxels; received ${cells.length}`);
  }

  const architecture = buildArchitectureTarget();
  return {
    cells,
    formations: {
      identity: buildIdentityTarget(cells),
      architecture: architecture.target,
      throughput: buildThroughputTarget(),
    },
    architecturePulseIndices: architecture.pulseIndices,
    staticIndices: cells.map((_, index) => index),
  };
}

export const VOXEL_FORMATION_SPEC = createVoxelFormationSpec();
export const VOXEL_FORMATION_TARGETS = VOXEL_FORMATION_SPEC.formations;
