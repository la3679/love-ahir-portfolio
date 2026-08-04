import { describe, expect, it } from "vitest";
import { SYSTEM_LAYERS } from "./layers";
import {
  DEFAULT_VOXEL_FORMATION,
  VOXEL_CORE_COUNT,
  VOXEL_COUNT,
  VOXEL_DUST_COUNT,
  VOXEL_FORMATION_IDS,
  VOXEL_FORMATION_SPEC,
  VOXEL_GRID,
  VOXEL_MASK_ROW_WIDTHS,
  createVoxelFormationSpec,
  type VoxelPose,
} from "./voxelFormationSpec";

const everyNumber = (pose: VoxelPose) => [
  ...pose.position,
  ...pose.rotation,
  pose.scale,
];

describe("dense voxel-mask formation specification", () => {
  it("plots a 432-cell tapered 22 x 28 face plus exactly 132 halo cubes", () => {
    expect(VOXEL_GRID).toEqual({ columns: 22, rows: 28 });
    expect(VOXEL_MASK_ROW_WIDTHS).toHaveLength(VOXEL_GRID.rows);
    expect(VOXEL_MASK_ROW_WIDTHS.reduce((sum, width) => sum + width, 0)).toBe(
      VOXEL_CORE_COUNT,
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

  it("keeps identical cube ordering through mask, cloud and helix", () => {
    expect(DEFAULT_VOXEL_FORMATION).toBe("mask");
    expect(VOXEL_FORMATION_IDS).toEqual(["mask", "cloud", "helix"]);

    for (const formation of VOXEL_FORMATION_IDS) {
      expect(VOXEL_FORMATION_SPEC.formations[formation]).toHaveLength(
        VOXEL_COUNT,
      );
    }
  });

  it("keeps a dense dominant mask, large mirrored eyes and dark web seams", () => {
    const core = VOXEL_FORMATION_SPEC.cells.filter((cell) => cell.kind === "core");
    const counts = core.reduce(
      (result, cell) => {
        result[cell.tone as "mask" | "eye" | "web"] += 1;
        return result;
      },
      { mask: 0, eye: 0, web: 0 },
    );

    expect(counts).toEqual({ mask: 242, eye: 74, web: 116 });
    expect(counts.mask).toBeGreaterThan(counts.eye);
    expect(counts.mask).toBeGreaterThan(counts.web);

    const eyes = core.filter((cell) => cell.tone === "eye");
    const center = (VOXEL_GRID.columns - 1) / 2;
    const left = eyes
      .filter((cell) => (cell.column ?? center) < center)
      .map((cell) => `${cell.row}:${VOXEL_GRID.columns - 1 - (cell.column ?? 0)}`)
      .sort();
    const right = eyes
      .filter((cell) => (cell.column ?? center) > center)
      .map((cell) => `${cell.row}:${cell.column}`)
      .sort();
    expect(left).toHaveLength(37);
    expect(left).toEqual(right);
  });

  it("keeps core coordinates inside the tapered source grid", () => {
    const core = VOXEL_FORMATION_SPEC.cells.filter((cell) => cell.kind === "core");
    expect(
      core.every(
        ({ row, column }) =>
          row !== null && column !== null &&
          row >= 0 && row < VOXEL_GRID.rows &&
          column >= 0 && column < VOXEL_GRID.columns,
      ),
    ).toBe(true);

    const rowCounts = Array.from({ length: VOXEL_GRID.rows }, (_, row) =>
      core.filter((cell) => cell.row === row).length,
    );
    expect(rowCounts).toEqual([...VOXEL_MASK_ROW_WIDTHS]);
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

  it("surrounds the resolved face with visibly smaller dispersed halo cubes", () => {
    const mask = VOXEL_FORMATION_SPEC.formations.mask;
    const coreScales = mask.slice(0, VOXEL_CORE_COUNT).map((pose) => pose.scale);
    const dustPoses = mask.slice(VOXEL_CORE_COUNT);
    const dustScales = dustPoses.map((pose) => pose.scale);

    expect(Math.max(...dustScales)).toBeLessThan(Math.min(...coreScales));

    const outsideFace = dustPoses.filter(({ position: [x, y] }) =>
      Math.hypot(x / 1.76, y / 2.08) > 1,
    );
    expect(outsideFace.length).toBeGreaterThanOrEqual(126);
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

  it("builds four three-turn helix strands with monotonic vertical progress", () => {
    for (let strand = 0; strand < SYSTEM_LAYERS.length; strand += 1) {
      const positions = VOXEL_FORMATION_SPEC.formations.helix
        .filter((_, index) => index % SYSTEM_LAYERS.length === strand)
        .map((pose) => pose.position);
      expect(positions).toHaveLength(141);

      for (let index = 1; index < positions.length; index += 1) {
        expect(positions[index][1]).toBeLessThan(positions[index - 1][1]);
      }

      const angles = positions.map(([x, , z]) => Math.atan2(z / 0.8, x));
      let travelled = 0;
      for (let index = 1; index < angles.length; index += 1) {
        let delta = angles[index] - angles[index - 1];
        if (delta < -Math.PI) delta += Math.PI * 2;
        if (delta > Math.PI) delta -= Math.PI * 2;
        travelled += delta;
      }
      expect(Math.abs(travelled)).toBeGreaterThan(Math.PI * 5.8);
    }
  });

  it("keeps the entire dense mask and halo in the authored static composition", () => {
    expect(VOXEL_FORMATION_SPEC.staticIndices).toHaveLength(VOXEL_COUNT);
    expect(VOXEL_FORMATION_SPEC.staticIndices).toEqual(
      Array.from({ length: VOXEL_COUNT }, (_, index) => index),
    );
  });
});
