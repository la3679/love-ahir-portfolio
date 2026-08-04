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
  type VoxelPose,
} from "./voxelFormationSpec";

const everyNumber = (pose: VoxelPose) => [
  ...pose.position,
  ...pose.rotation,
  pose.scale,
];

describe("voxel LA-monogram formation specification", () => {
  it("extrudes the 32 x 24 glyph through four layers and preserves the pool", () => {
    expect(VOXEL_GRID).toEqual({ columns: 32, rows: 24 });
    expect(VOXEL_CORE_COUNT).toBe(
      LA_GLYPH_VOXEL_COUNT * LA_GLYPH_EXTRUSION_DEPTH,
    );
    expect(VOXEL_CORE_COUNT).toBe(432);
    expect(VOXEL_DUST_COUNT).toBe(132);
    expect(VOXEL_COUNT).toBe(564);

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

  it("keeps identical cube ordering through identity, cloud and helix", () => {
    expect(DEFAULT_VOXEL_FORMATION).toBe("identity");
    expect(VOXEL_FORMATION_IDS).toEqual(["identity", "cloud", "helix"]);

    for (const formation of VOXEL_FORMATION_IDS) {
      expect(VOXEL_FORMATION_SPEC.formations[formation]).toHaveLength(
        VOXEL_COUNT,
      );
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
      .map((cell, index) => ({ cell, pose: identity[index] }))
      .filter(({ cell }) =>
        cell.row === firstCell.row && cell.column === firstCell.column,
      );

    expect(stack.map(({ cell }) => cell.depth)).toEqual([0, 1, 2, 3]);
    expect(stack[0].pose.position[2] - stack[3].pose.position[2]).toBeCloseTo(
      0.42,
      10,
    );
    expect((VOXEL_IDENTITY_ORIENTATION.yaw * 180) / Math.PI).toBeCloseTo(8, 10);
    expect((VOXEL_IDENTITY_ORIENTATION.pitch * 180) / Math.PI).toBeCloseTo(-4, 10);
  });

  it("balances the existing four system-layer identities", () => {
    for (const layer of SYSTEM_LAYERS) {
      expect(
        VOXEL_FORMATION_SPEC.cells.filter((cell) => cell.layer === layer),
      ).toHaveLength(141);
    }
  });

  it("emits finite positions, rotations and positive scales for every pose", () => {
    for (const formation of VOXEL_FORMATION_IDS) {
      for (const pose of VOXEL_FORMATION_SPEC.formations[formation]) {
        expect(everyNumber(pose).every(Number.isFinite)).toBe(true);
        expect(pose.scale).toBeGreaterThan(0);
      }
    }
  });

  it("surrounds the identity with visibly smaller dispersed halo cubes", () => {
    const identity = VOXEL_FORMATION_SPEC.formations.identity;
    const coreScales = identity.slice(0, VOXEL_CORE_COUNT).map((pose) => pose.scale);
    const dustPoses = identity.slice(VOXEL_CORE_COUNT);
    const dustScales = dustPoses.map((pose) => pose.scale);

    expect(Math.max(...dustScales)).toBeLessThan(Math.min(...coreScales));
    expect(
      Math.max(...dustPoses.map(({ position }) => Math.abs(position[2]))),
    ).toBeGreaterThan(0.75);
  });

  it("centres a volumetric cloud that spans all three axes", () => {
    const positions = VOXEL_FORMATION_SPEC.formations.cloud.map(
      (pose) => pose.position,
    );
    const centroid = [0, 1, 2].map(
      (axis) =>
        positions.reduce((sum, position) => sum + position[axis], 0) /
        positions.length,
    );
    centroid.forEach((value) => expect(value).toBeCloseTo(0, 10));

    const span = [0, 1, 2].map((axis) => {
      const values = positions.map((position) => position[axis]);
      return Math.max(...values) - Math.min(...values);
    });
    expect(span[0]).toBeGreaterThan(4.7);
    expect(span[1]).toBeGreaterThan(3.7);
    expect(span[2]).toBeGreaterThan(2.8);
  });

  it("retains the existing four three-turn helix strands", () => {
    for (let strand = 0; strand < SYSTEM_LAYERS.length; strand += 1) {
      const positions = VOXEL_FORMATION_SPEC.formations.helix
        .filter((_, index) => index % SYSTEM_LAYERS.length === strand)
        .map((pose) => pose.position);
      expect(positions).toHaveLength(141);

      for (let index = 1; index < positions.length; index += 1) {
        expect(positions[index][1]).toBeLessThan(positions[index - 1][1]);
      }
    }
  });

  it("keeps the entire monogram and halo in the static composition", () => {
    expect(VOXEL_FORMATION_SPEC.staticIndices).toHaveLength(VOXEL_COUNT);
    expect(VOXEL_FORMATION_SPEC.staticIndices).toEqual(
      Array.from({ length: VOXEL_COUNT }, (_, index) => index),
    );
  });
});
