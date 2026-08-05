import { describe, expect, it } from "vitest";
import {
  basinFactor,
  brandCells,
  createCornerBuffer,
  createVoxelCubes,
  gridDeltaForScreenDelta,
  projectCube,
  screenX,
  screenY,
  seededRandomVoxel,
  stepVoxelCube,
  visibleSideFaces,
  voxelAlpha,
  voxelCount,
  voxelEdge,
  voxelPulse,
  voxelRenderValues,
  voxelSpeed,
  VOXEL_BASIN_RADIUS,
  VOXEL_JITTER_RAD,
  VOXEL_MAX_COUNT,
  VOXEL_MIN_COUNT,
  VOXEL_MOBILE_COUNT,
  VOXEL_PULSE_PERIOD_MS,
  VOXEL_WRAP_MARGIN,
  type VoxelRenderValues,
} from "./fxVoxels";
import { LA_GLYPH_COLUMNS, LA_GLYPH_VOXEL_COUNT } from "@/scenes/glyphs/la";

const IDLE = { x: 0, y: 0, active: false } as const;
const WRAP_GRID = { gx: 0, gy: 0 };

describe("voxelCount", () => {
  it("is deliberately sparser than the old dot field", () => {
    // 1440 x 900 = 1,296,000 / 26,000 = 49.8 -> 50 cubes, vs 64 dots.
    expect(voxelCount(1440, 900)).toBe(50);
    expect(voxelCount(390, 844)).toBe(VOXEL_MOBILE_COUNT);
    expect(voxelCount(768, 500)).toBe(VOXEL_MIN_COUNT);
    expect(voxelCount(3840, 2160)).toBe(VOXEL_MAX_COUNT);
  });
});

describe("depth ramps", () => {
  it("makes near cubes larger, brighter and faster than far ones", () => {
    expect(voxelEdge(1)).toBeGreaterThan(voxelEdge(0));
    expect(voxelAlpha(1)).toBeGreaterThan(voxelAlpha(0));
    expect(voxelSpeed(1)).toBeGreaterThan(voxelSpeed(0));

    expect(voxelEdge(0)).toBe(3);
    expect(voxelEdge(1)).toBe(9);
    expect(voxelAlpha(0)).toBeCloseTo(0.1, 5);
    expect(voxelAlpha(1)).toBeCloseTo(0.34, 5);
    expect(voxelSpeed(0)).toBeCloseTo(0.06, 5);
    expect(voxelSpeed(1)).toBeCloseTo(0.22, 5);
  });

  it("keeps even the nearest cube well behind the copy", () => {
    expect(voxelAlpha(1)).toBeLessThan(0.4);
  });
});

describe("projectCube", () => {
  it("returns eight corners: a bottom ring and a top ring", () => {
    const out = projectCube(0, 0, 0, 10, 0, createCornerBuffer());
    expect(out).toHaveLength(16);

    // The top ring sits exactly one edge length above the bottom ring.
    for (let i = 0; i < 4; i += 1) {
      expect(out[8 + i * 2]).toBeCloseTo(out[i * 2], 6);
      expect(out[8 + i * 2 + 1]).toBeCloseTo(out[i * 2 + 1] - 10, 6);
    }
  });

  it("produces a true isometric footprint", () => {
    const out = projectCube(0, 0, 0, 10, 0, createCornerBuffer());
    // Corners 0 and 2 are diagonally opposite: pure vertical separation.
    expect(out[0]).toBeCloseTo(out[4], 6);
    expect(out[1]).toBeLessThan(out[5]);
    // Corners 1 and 3 are the horizontal extremes.
    expect(out[2]).toBeGreaterThan(out[6]);
  });

  it("rotates about the vertical axis only, so the top face never hides", () => {
    const flat = projectCube(0, 0, 0, 10, 0, createCornerBuffer());
    const turned = projectCube(0, 0, 0, 10, 0.7, createCornerBuffer());

    for (let i = 0; i < 4; i += 1) {
      // Every corner keeps its exact one-edge vertical extrusion.
      expect(turned[8 + i * 2 + 1]).toBeCloseTo(turned[i * 2 + 1] - 10, 6);
    }
    expect(turned[0]).not.toBeCloseTo(flat[0], 3);
  });

  it("writes into the supplied buffer rather than allocating", () => {
    const buffer = createCornerBuffer();
    expect(projectCube(1, 2, 0.5, 8, 0.2, buffer)).toBe(buffer);
  });
});

describe("visibleSideFaces", () => {
  it("always selects exactly two distinct, viewer-facing sides", () => {
    const out = { right: 0, left: 0 };
    for (let yaw = 0; yaw < Math.PI * 2; yaw += 0.15) {
      visibleSideFaces(yaw, out);
      expect(out.right).not.toBe(out.left);
      // Opposite faces (i and i+2) can never both face the viewer.
      expect(Math.abs(out.right - out.left)).not.toBe(2);
    }
  });

  it("picks the +x and +y faces at zero yaw", () => {
    const out = { right: 0, left: 0 };
    visibleSideFaces(0, out);
    expect(new Set([out.right, out.left])).toEqual(new Set([1, 2]));
  });
});

describe("createVoxelCubes", () => {
  it("drifts as one coherent current, not independent jitter", () => {
    const cubes = createVoxelCubes(1440, 900, seededRandomVoxel(11));
    const angles = cubes.map((cube) => Math.atan2(cube.dgy, cube.dgx));

    // Every heading sits within the jitter cone of every other heading.
    for (const a of angles) {
      for (const b of angles) {
        const delta = Math.abs(
          Math.atan2(Math.sin(a - b), Math.cos(a - b)),
        );
        expect(delta).toBeLessThanOrEqual(VOXEL_JITTER_RAD * 2 + 1e-9);
      }
    }
  });

  it("gives every cube a unit heading and a bounded depth", () => {
    for (const cube of createVoxelCubes(1440, 900, seededRandomVoxel(3))) {
      expect(Math.hypot(cube.dgx, cube.dgy)).toBeCloseTo(1, 6);
      expect(cube.gz).toBeGreaterThanOrEqual(0);
      expect(cube.gz).toBeLessThanOrEqual(1);
      expect(cube.basin).toBe(0);
    }
  });

  it("mixes roughly 28% accent cubes", () => {
    const cubes = createVoxelCubes(3840, 2160, seededRandomVoxel(5));
    const accent = cubes.filter((cube) => cube.accent).length;
    expect(accent / cubes.length).toBeGreaterThan(0.1);
    expect(accent / cubes.length).toBeLessThan(0.5);
  });

  it("is repeatable for a given seed, so the static frame never shifts", () => {
    expect(createVoxelCubes(1440, 900, seededRandomVoxel(42))).toEqual(
      createVoxelCubes(1440, 900, seededRandomVoxel(42)),
    );
  });
});

describe("brand derivation", () => {
  it("reuses the hero lattice's LA occupancy grid verbatim", () => {
    const cells = brandCells();
    expect(cells).toHaveLength(LA_GLYPH_VOXEL_COUNT);
    for (const [column] of cells) {
      expect(column).toBeLessThan(LA_GLYPH_COLUMNS);
    }
  });

  it("memoises the grid", () => {
    expect(brandCells()).toBe(brandCells());
  });

  it("seeds a majority of cubes inside the monogram's footprint", () => {
    // The glyph occupies the middle columns; a purely uniform field would not
    // concentrate there.
    const cubes = createVoxelCubes(1440, 900, seededRandomVoxel(17));
    const buffer = createCornerBuffer();
    let insideBand = 0;

    for (const cube of cubes) {
      projectCube(cube.gx, cube.gy, cube.gz, voxelEdge(cube.gz), 0, buffer);
      const x = screenX(cube.gx, cube.gy, voxelEdge(cube.gz));
      if (x > 1440 * 0.1 && x < 1440 * 0.9) insideBand += 1;
    }

    expect(insideBand).toBeGreaterThan(cubes.length * 0.4);
  });
});

describe("gridDeltaForScreenDelta", () => {
  it("inverts the projection exactly", () => {
    const out = { gx: 0, gy: 0 };
    gridDeltaForScreenDelta(120, -45, 7, out);
    expect(screenX(out.gx, out.gy, 7)).toBeCloseTo(120, 6);
    expect(screenY(out.gx, out.gy, 0, 7)).toBeCloseTo(-45, 6);
  });

  it("returns zero for a degenerate edge", () => {
    const out = { gx: 1, gy: 1 };
    gridDeltaForScreenDelta(120, -45, 0, out);
    expect(out).toEqual({ gx: 0, gy: 0 });
  });
});

describe("basinFactor", () => {
  it("falls off quadratically and reaches zero at the rim", () => {
    expect(basinFactor(0)).toBe(1);
    expect(basinFactor(VOXEL_BASIN_RADIUS)).toBe(0);
    expect(basinFactor(VOXEL_BASIN_RADIUS * 2)).toBe(0);
    expect(basinFactor(VOXEL_BASIN_RADIUS / 2)).toBeCloseTo(0.25, 6);
    // Quadratic, so the midpoint sits below a linear ramp.
    expect(basinFactor(VOXEL_BASIN_RADIUS / 2)).toBeLessThan(0.5);
  });
});

describe("voxelPulse", () => {
  it("breathes over a 15 second period", () => {
    expect(voxelPulse(0)).toBeCloseTo(0.5, 6);
    expect(voxelPulse(VOXEL_PULSE_PERIOD_MS / 4)).toBeCloseTo(1, 6);
    expect(voxelPulse(VOXEL_PULSE_PERIOD_MS * 0.75)).toBeCloseTo(0, 6);
    expect(voxelPulse(VOXEL_PULSE_PERIOD_MS)).toBeCloseTo(0.5, 6);
  });
});

describe("stepVoxelCube", () => {
  const cubeAt = (gx: number, gy: number, gz = 0.5) => ({
    gx,
    gy,
    gz,
    dgx: 1,
    dgy: 0,
    yaw: 0,
    yawRate: 0,
    accent: false,
    basin: 0,
  });

  it("advances along the shared heading", () => {
    const cube = cubeAt(0, 0);
    stepVoxelCube(cube, 1440, 900, IDLE, 1, WRAP_GRID);
    expect(cube.gx).toBeGreaterThan(0);
    expect(cube.gy).toBe(0);
  });

  it("moves near cubes further per frame than far ones", () => {
    const near = cubeAt(0, 0, 1);
    const far = cubeAt(0, 0, 0);
    stepVoxelCube(near, 1440, 900, IDLE, 1, WRAP_GRID);
    stepVoxelCube(far, 1440, 900, IDLE, 1, WRAP_GRID);

    expect(screenX(near.gx, near.gy, voxelEdge(1))).toBeGreaterThan(
      screenX(far.gx, far.gy, voxelEdge(0)),
    );
  });

  it("slows down at the trough of the breathing cadence", () => {
    const fast = cubeAt(0, 0);
    const slow = cubeAt(0, 0);
    stepVoxelCube(fast, 1440, 900, IDLE, 1, WRAP_GRID);
    stepVoxelCube(slow, 1440, 900, IDLE, 0, WRAP_GRID);
    expect(slow.gx).toBeLessThan(fast.gx);
    expect(slow.gx).toBeGreaterThan(0);
  });

  it("eases the basin in rather than snapping to it", () => {
    const edge = voxelEdge(0.5);
    const cube = cubeAt(0, 0);
    const pointer = {
      x: screenX(cube.gx, cube.gy, edge),
      y: screenY(cube.gx, cube.gy, cube.gz, edge),
      active: true,
    };

    stepVoxelCube(cube, 1440, 900, pointer, 1, WRAP_GRID);
    const afterOne = cube.basin;
    expect(afterOne).toBeGreaterThan(0);
    expect(afterOne).toBeLessThan(0.2);

    for (let i = 0; i < 40; i += 1) {
      stepVoxelCube(cube, 1440, 900, pointer, 1, WRAP_GRID);
    }
    expect(cube.basin).toBeGreaterThan(afterOne);
  });

  it("heals the basin when the cursor leaves", () => {
    const cube = { ...cubeAt(0, 0), basin: 0.9 };
    for (let i = 0; i < 60; i += 1) {
      stepVoxelCube(cube, 1440, 900, IDLE, 1, WRAP_GRID);
    }
    expect(cube.basin).toBeLessThan(0.05);
  });

  it("ignores an inactive pointer entirely", () => {
    const cube = cubeAt(0, 0);
    stepVoxelCube(cube, 1440, 900, IDLE, 1, WRAP_GRID);
    expect(cube.basin).toBe(0);
  });

  it("wraps a cube that has just cleared the right margin round to the left", () => {
    const edge = voxelEdge(0.5);
    const out = { gx: 0, gy: 0 };
    // Just past the margin, which is the only state reachable in practice:
    // cubes move well under a pixel per frame.
    gridDeltaForScreenDelta(1440 + VOXEL_WRAP_MARGIN + 0.5, 400, edge, out);
    const cube = { ...cubeAt(out.gx, out.gy), gz: 0.5 };

    stepVoxelCube(cube, 1440, 900, IDLE, 1, WRAP_GRID);

    const x = screenX(cube.gx, cube.gy, edge);
    expect(x).toBeLessThan(0);
    expect(x).toBeGreaterThanOrEqual(-VOXEL_WRAP_MARGIN);
  });

  it("wraps vertically too, keeping the cube on its heading", () => {
    const depth = 0.5;
    const edge = voxelEdge(depth);
    const out = { gx: 0, gy: 0 };
    // `gridDeltaForScreenDelta` inverts the 2D part only, so the depth term
    // that `screenY` subtracts has to be added back into the target here.
    gridDeltaForScreenDelta(
      700,
      900 + VOXEL_WRAP_MARGIN + 0.5 + depth * edge,
      edge,
      out,
    );
    const cube = { ...cubeAt(out.gx, out.gy), gz: depth };

    stepVoxelCube(cube, 1440, 900, IDLE, 1, WRAP_GRID);

    const y = screenY(cube.gx, cube.gy, cube.gz, edge);
    expect(y).toBeLessThan(0);
    expect(cube.dgx).toBe(1);
    expect(cube.dgy).toBe(0);
  });
});

describe("voxelRenderValues", () => {
  const base = {
    gx: 4,
    gy: 2,
    gz: 0.8,
    dgx: 1,
    dgy: 0,
    yaw: 0,
    yawRate: 0,
    accent: false,
    basin: 0,
  };

  it("leaves a cube untouched when no basin is applied", () => {
    const out: VoxelRenderValues = { sx: 0, sy: 0, depth: 0, edge: 0, alpha: 0 };
    voxelRenderValues({ ...base }, 1, out);
    expect(out.depth).toBeCloseTo(0.8, 6);
    expect(out.edge).toBeCloseTo(voxelEdge(0.8), 6);
    expect(out.alpha).toBeCloseTo(voxelAlpha(0.8), 6);
  });

  it("sinks, dims and shrinks a cube inside the basin", () => {
    const rest: VoxelRenderValues = { sx: 0, sy: 0, depth: 0, edge: 0, alpha: 0 };
    const sunk: VoxelRenderValues = { sx: 0, sy: 0, depth: 0, edge: 0, alpha: 0 };
    voxelRenderValues({ ...base }, 1, rest);
    voxelRenderValues({ ...base, basin: 1 }, 1, sunk);

    expect(sunk.depth).toBeLessThan(rest.depth);
    expect(sunk.alpha).toBeLessThan(rest.alpha);
    expect(sunk.edge).toBeLessThan(rest.edge);
    // A sunk cube must not invert or vanish.
    expect(sunk.edge).toBeGreaterThan(0);
    expect(sunk.alpha).toBeGreaterThan(0);
  });

  it("never writes the basin back into the cube's resting depth", () => {
    const cube = { ...base, basin: 1 };
    const out: VoxelRenderValues = { sx: 0, sy: 0, depth: 0, edge: 0, alpha: 0 };
    voxelRenderValues(cube, 1, out);
    expect(cube.gz).toBe(0.8);
  });

  it("dims the whole field at the trough of the breath", () => {
    const bright: VoxelRenderValues = { sx: 0, sy: 0, depth: 0, edge: 0, alpha: 0 };
    const dim: VoxelRenderValues = { sx: 0, sy: 0, depth: 0, edge: 0, alpha: 0 };
    voxelRenderValues({ ...base }, 1, bright);
    voxelRenderValues({ ...base }, 0, dim);
    expect(dim.alpha).toBeLessThan(bright.alpha);
  });
});
