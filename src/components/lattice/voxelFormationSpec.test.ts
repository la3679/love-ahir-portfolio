import { describe, expect, it } from "vitest";
import {
  LA_GLYPH,
  LA_GLYPH_EXTRUSION_DEPTH,
  LA_GLYPH_VOXEL_COUNT,
} from "@/scenes/glyphs/la";
import { SYSTEM_LAYERS } from "./layers";
import {
  DEFAULT_VOXEL_FORMATION,
  VOXEL_CORE_COUNT,
  VOXEL_COUNT,
  VOXEL_DUST_COUNT,
  VOXEL_FORMATION_IDS,
  VOXEL_FORMATION_SPEC,
  VOXEL_GRID,
  VOXEL_IDENTITY_ORIENTATION,
  createVoxelFormationSpec,
  type VoxelFormationTarget,
} from "./voxelFormationSpec";

/*
  Formation targets are struct-of-arrays typed buffers, not an array of pose
  objects: `position` and `rotation` hold three floats per voxel and `scale`
  holds one. These helpers keep the intent of each assertion readable without
  rebuilding that layout into objects on every access.
*/
const positionAt = (target: VoxelFormationTarget, index: number) =>
  [
    target.position[index * 3],
    target.position[index * 3 + 1],
    target.position[index * 3 + 2],
  ] as const;

const positions = (target: VoxelFormationTarget) =>
  Array.from({ length: VOXEL_COUNT }, (_, index) => positionAt(target, index));

const axisSpan = (target: VoxelFormationTarget, axis: 0 | 1 | 2) => {
  const values = positions(target).map((position) => position[axis]);
  return Math.max(...values) - Math.min(...values);
};

const centroid = (target: VoxelFormationTarget) =>
  ([0, 1, 2] as const).map((axis) => {
    const values = positions(target).map((position) => position[axis]);
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  });

describe("voxel LA-monogram formation specification", () => {
  it("extrudes the 32 x 24 glyph through four layers and preserves the pool", () => {
    expect(VOXEL_GRID).toEqual({ columns: 32, rows: 24 });
    expect(VOXEL_CORE_COUNT).toBe(
      LA_GLYPH_VOXEL_COUNT * LA_GLYPH_EXTRUSION_DEPTH,
    );
    expect(VOXEL_CORE_COUNT).toBe(432);
    expect(VOXEL_DUST_COUNT).toBe(968);
    expect(VOXEL_COUNT).toBe(1400);
    expect(VOXEL_CORE_COUNT + VOXEL_DUST_COUNT).toBe(VOXEL_COUNT);

    const core = VOXEL_FORMATION_SPEC.cells.filter((cell) => cell.kind === "core");
    const dust = VOXEL_FORMATION_SPEC.cells.filter((cell) => cell.kind === "dust");
    expect(core).toHaveLength(VOXEL_CORE_COUNT);
    expect(dust).toHaveLength(VOXEL_DUST_COUNT);
    expect(dust.every((cell) => cell.tone === "dust")).toBe(true);
  });

  it("uses stable unique IDs and is completely deterministic", () => {
    const ids = VOXEL_FORMATION_SPEC.cells.map((cell) => cell.id);
    expect(new Set(ids).size).toBe(VOXEL_COUNT);
    expect(createVoxelFormationSpec()).toEqual(VOXEL_FORMATION_SPEC);
  });

  it("keeps identical cube ordering through all three formations", () => {
    expect(DEFAULT_VOXEL_FORMATION).toBe("identity");
    expect(VOXEL_FORMATION_IDS).toEqual([
      "identity",
      "architecture",
      "throughput",
    ]);

    for (const formation of VOXEL_FORMATION_IDS) {
      const target = VOXEL_FORMATION_SPEC.formations[formation];
      expect(target.position).toHaveLength(VOXEL_COUNT * 3);
      expect(target.rotation).toHaveLength(VOXEL_COUNT * 3);
      expect(target.scale).toHaveLength(VOXEL_COUNT);
    }
  });

  it("maps each occupied glyph cell to four ordered depth voxels", () => {
    const core = VOXEL_FORMATION_SPEC.cells.filter((cell) => cell.kind === "core");
    const occupied = LA_GLYPH.flatMap((line, row) =>
      Array.from(line).flatMap((cell, column) =>
        cell === "#" ? [`${row}:${column}`] : [],
      ),
    );

    expect(new Set(core.map((cell) => `${cell.row}:${cell.column}`))).toEqual(
      new Set(occupied),
    );
    occupied.forEach((coordinate) => {
      expect(
        core
          .filter((cell) => `${cell.row}:${cell.column}` === coordinate)
          .map((cell) => cell.depth),
      ).toEqual([0, 1, 2, 3]);
    });

    expect(core.filter((cell) => cell.tone === "front")).toHaveLength(108);
    expect(core.filter((cell) => cell.tone === "side")).toHaveLength(324);
  });

  it("gives the monogram four-voxel depth and the requested resting angle", () => {
    const identity = VOXEL_FORMATION_SPEC.formations.identity;
    const firstCell = VOXEL_FORMATION_SPEC.cells[0];
    const stack = VOXEL_FORMATION_SPEC.cells
      .map((cell, index) => ({ cell, position: positionAt(identity, index) }))
      .filter(
        ({ cell }) =>
          cell.row === firstCell.row && cell.column === firstCell.column,
      );

    expect(stack.map(({ cell }) => cell.depth)).toEqual([0, 1, 2, 3]);
    // Positions live in a Float32Array, so 10-decimal tolerance is unreachable.
    expect(stack[0].position[2] - stack[3].position[2]).toBeCloseTo(0.42, 6);

    // The rest pose the bounded idle drift oscillates around (see sceneMotion).
    expect((VOXEL_IDENTITY_ORIENTATION.yaw * 180) / Math.PI).toBeCloseTo(8, 10);
    expect((VOXEL_IDENTITY_ORIENTATION.pitch * 180) / Math.PI).toBeCloseTo(-4, 10);
  });

  it("balances the existing four system-layer identities", () => {
    for (const layer of SYSTEM_LAYERS) {
      expect(
        VOXEL_FORMATION_SPEC.cells.filter((cell) => cell.layer === layer),
      ).toHaveLength(VOXEL_COUNT / SYSTEM_LAYERS.length);
    }
  });

  it("emits finite positions, rotations and positive scales for every pose", () => {
    for (const formation of VOXEL_FORMATION_IDS) {
      const target = VOXEL_FORMATION_SPEC.formations[formation];
      expect([...target.position].every(Number.isFinite)).toBe(true);
      expect([...target.rotation].every(Number.isFinite)).toBe(true);
      expect([...target.scale].every((scale) => Number.isFinite(scale) && scale > 0)).toBe(true);
    }
  });

  it("surrounds the identity with visibly smaller dispersed halo cubes", () => {
    const identity = VOXEL_FORMATION_SPEC.formations.identity;
    const coreScales = [...identity.scale].slice(0, VOXEL_CORE_COUNT);
    const dustScales = [...identity.scale].slice(VOXEL_CORE_COUNT);
    const dustDepth = positions(identity)
      .slice(VOXEL_CORE_COUNT)
      .map(([, , z]) => Math.abs(z));

    expect(Math.max(...dustScales)).toBeLessThan(Math.min(...coreScales));
    expect(Math.max(...dustDepth)).toBeGreaterThan(0.75);
  });

  /*
    Deliberately shape-agnostic. Asserting the exact silhouette of architecture
    and throughput would pin down geometry this test cannot independently
    justify; what must hold for any usable formation is that it stays centred
    on the origin and occupies real volume rather than collapsing to a plane or
    a line.
  */
  it("centres every formation and gives it real volume on all three axes", () => {
    for (const formation of VOXEL_FORMATION_IDS) {
      const target = VOXEL_FORMATION_SPEC.formations[formation];

      for (const value of centroid(target)) {
        expect(Math.abs(value)).toBeLessThan(0.5);
      }
      expect(axisSpan(target, 0)).toBeGreaterThan(1);
      expect(axisSpan(target, 1)).toBeGreaterThan(1);
      expect(axisSpan(target, 2)).toBeGreaterThan(0.5);
    }
  });

  it("keeps the entire monogram and halo in the static composition", () => {
    expect(VOXEL_FORMATION_SPEC.staticIndices).toHaveLength(VOXEL_COUNT);
    expect(VOXEL_FORMATION_SPEC.staticIndices).toEqual(
      Array.from({ length: VOXEL_COUNT }, (_, index) => index),
    );
  });
});
