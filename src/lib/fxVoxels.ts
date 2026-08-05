import {
  LA_GLYPH,
  LA_GLYPH_COLUMNS,
  LA_GLYPH_ROWS,
} from "@/scenes/glyphs/la";

/**
 * Pure simulation for the isometric Voxel Drift Field.
 *
 * No DOM, no canvas, no React — the projection, the population budget, the
 * coherent drift, the displacement basin and the breathing cadence are all
 * testable without a browser. `VoxelField` owns the canvas, the palette and
 * the loop; this module owns the maths.
 *
 * The brand derivation reuses the existing 32x24 `LA_GLYPH` occupancy bitmap
 * that already drives the hero lattice. Nothing is re-rasterised from
 * `brandMark.json`: the mark, the hero scene and this background all read the
 * same source of truth.
 */

/** Below this width the field thins out for phone-class viewports. */
export const VOXEL_MOBILE_WIDTH = 768;
export const VOXEL_MOBILE_COUNT = 14;
/** Cubes carry far more visual weight per element than the old dots did. */
export const VOXEL_AREA_PER_CUBE = 26_000;
export const VOXEL_MIN_COUNT = 22;
export const VOXEL_MAX_COUNT = 54;
/** Cubes are bigger than dots were, so they need a deeper offscreen margin. */
export const VOXEL_WRAP_MARGIN = 24;

export const VOXEL_NEAR_ALPHA = 0.34;
export const VOXEL_FAR_ALPHA = 0.1;
export const VOXEL_NEAR_SPEED = 0.22;
export const VOXEL_FAR_SPEED = 0.06;
export const VOXEL_NEAR_EDGE = 9;
export const VOXEL_FAR_EDGE = 3;

/** A barely perceptible tumble; anything faster reads as spinning. */
export const VOXEL_YAW_RATE = 0.00015;
/** One shared current with only this much per-cube deviation. */
export const VOXEL_JITTER_RAD = (12 * Math.PI) / 180;
export const VOXEL_ACCENT_SHARE = 0.28;

export const VOXEL_BASIN_RADIUS = 150;
export const VOXEL_BASIN_SINK = 0.9;
export const VOXEL_BASIN_DIM = 0.45;
export const VOXEL_BASIN_SHRINK = 0.12;
/** Eases the basin in and out so it forms and heals instead of snapping. */
export const VOXEL_BASIN_LERP = 0.08;

export const VOXEL_PULSE_PERIOD_MS = 15_000;
export const VOXEL_PULSE_MIN_SPEED = 0.45;
export const VOXEL_PULSE_MIN_ALPHA = 0.8;

export const VOXEL_TOP_FACE_ALPHA = 1;
export const VOXEL_RIGHT_FACE_ALPHA = 0.72;
export const VOXEL_LEFT_FACE_ALPHA = 0.46;

/** Share of cubes seeded from the monogram occupancy grid. */
export const VOXEL_BRAND_BIAS = 0.55;

const COS30 = Math.cos(Math.PI / 6);
const SIN30 = Math.sin(Math.PI / 6);

/** Local footprint corners, wound so consecutive pairs share a side face. */
const LOCAL_X = [-0.5, 0.5, 0.5, -0.5] as const;
const LOCAL_Y = [-0.5, -0.5, 0.5, 0.5] as const;

/** Outward normal of side face i, already unit length. */
const SIDE_NX = [0, 1, 0, -1] as const;
const SIDE_NY = [-1, 0, 1, 0] as const;

export type RandomSource = () => number;

/**
 * xorshift32, used only where a repeatable field is wanted — the static
 * reduced-motion frame and the tests. The live field seeds from `Math.random`.
 *
 * Deliberately defined here rather than imported from `fxParticles`: the two
 * renderers must stay isolated so either can be deleted without touching the
 * other.
 */
export function seededRandomVoxel(seed: number): RandomSource {
  let state = seed >>> 0 || 0x4c6f_7665;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 0x1_0000_0000;
  };
}

export interface VoxelCube {
  /** Grid-space position. The projection below maps it to screen pixels. */
  gx: number;
  gy: number;
  /** Resting depth in [0, 1]; the basin sinks the rendered value below it. */
  gz: number;
  /** Unit drift direction in grid space, shared current plus small jitter. */
  dgx: number;
  dgy: number;
  yaw: number;
  yawRate: number;
  accent: boolean;
  /** Eased displacement-basin factor in [0, 1]. */
  basin: number;
}

export const lerp = (from: number, to: number, t: number) =>
  from + (to - from) * t;

const clamp = (value: number, minimum: number, maximum: number) =>
  Math.min(maximum, Math.max(minimum, value));

const isMobile = (width: number) => width < VOXEL_MOBILE_WIDTH;

export function voxelCount(width: number, height: number): number {
  const safeWidth = Number.isFinite(width) ? Math.max(0, width) : 0;
  const safeHeight = Number.isFinite(height) ? Math.max(0, height) : 0;
  if (isMobile(safeWidth)) return VOXEL_MOBILE_COUNT;

  return clamp(
    Math.round((safeWidth * safeHeight) / VOXEL_AREA_PER_CUBE),
    VOXEL_MIN_COUNT,
    VOXEL_MAX_COUNT,
  );
}

/**
 * Depth-derived render values. Near cubes are larger, brighter and faster.
 *
 * The brief specifies both `scale = lerp(0.55, 1, z)` and
 * `edge = lerp(3, 9, z)`. Those are the same control expressed twice: applying
 * both multiplicatively puts the farthest cubes at 1.65px, which is below the
 * point where a cube reads as a cube at all. The depth ramp is therefore
 * carried once, by the edge length; `scale` survives only as the basin's
 * shrink factor in `voxelRenderValues`.
 */
export const voxelEdge = (depth: number) =>
  lerp(VOXEL_FAR_EDGE, VOXEL_NEAR_EDGE, depth);
export const voxelAlpha = (depth: number) =>
  lerp(VOXEL_FAR_ALPHA, VOXEL_NEAR_ALPHA, depth);
export const voxelSpeed = (depth: number) =>
  lerp(VOXEL_FAR_SPEED, VOXEL_NEAR_SPEED, depth);

/**
 * True isometric projection of one grid point.
 *
 * A unit step along a grid axis moves the projection by exactly `s` pixels,
 * because cos(30)^2 + sin(30)^2 = 1 — which is what lets the drift speed be
 * specified directly in pixels per frame.
 */
export function screenX(gx: number, gy: number, s: number): number {
  return (gx - gy) * COS30 * s;
}

export function screenY(gx: number, gy: number, gz: number, s: number): number {
  return (gx + gy) * SIN30 * s - gz * s;
}

/** Inverse of the 2D part, used to wrap a cube by an exact pixel distance. */
export function gridDeltaForScreenDelta(
  dsx: number,
  dsy: number,
  s: number,
  out: { gx: number; gy: number },
): void {
  if (s === 0) {
    out.gx = 0;
    out.gy = 0;
    return;
  }
  const a = dsx / (COS30 * s);
  const b = dsy / (SIN30 * s);
  out.gx = (a + b) / 2;
  out.gy = (b - a) / 2;
}

/** 8 corners x 2 components. Allocate once per canvas and reuse every frame. */
export function createCornerBuffer(): Float64Array {
  return new Float64Array(16);
}

/**
 * Project the 8 corners of one cube into `out`.
 *
 * Local corners are (+-0.5, +-0.5, 0..1). Rotation is about the vertical axis
 * only — x and y turn by `yaw`, z does not — which keeps the top face
 * permanently visible and avoids needing a real 3D pipeline. Indices 0-7 are
 * the bottom ring, 8-15 the top ring, in the same winding order.
 */
export function projectCube(
  gx: number,
  gy: number,
  gz: number,
  s: number,
  yaw: number,
  out: Float64Array,
): Float64Array {
  const cos = Math.cos(yaw);
  const sin = Math.sin(yaw);

  for (let i = 0; i < 4; i += 1) {
    const lx = LOCAL_X[i];
    const ly = LOCAL_Y[i];
    const rx = lx * cos - ly * sin;
    const ry = lx * sin + ly * cos;
    const x = gx + rx;
    const y = gy + ry;

    const px = screenX(x, y, s);
    const stack = (x + y) * SIN30 * s;

    out[i * 2] = px;
    out[i * 2 + 1] = stack - gz * s;
    out[8 + i * 2] = px;
    out[8 + i * 2 + 1] = stack - (gz + 1) * s;
  }

  return out;
}

/**
 * The two side faces facing the viewer, as `[right, left]` bottom-corner
 * indices.
 *
 * Isometric view direction is (+1, +1) in the ground plane, so exactly two of
 * the four outward normals have a positive dot product with it. Taking the two
 * largest keeps that true even when a normal sits exactly on the boundary. The
 * face whose normal projects further right on screen is the lit "right" face.
 */
export function visibleSideFaces(
  yaw: number,
  out: { right: number; left: number },
): void {
  const cos = Math.cos(yaw);
  const sin = Math.sin(yaw);

  let bestIndex = 0;
  let bestDot = -Infinity;
  let secondIndex = 1;
  let secondDot = -Infinity;

  for (let i = 0; i < 4; i += 1) {
    const nx = SIDE_NX[i] * cos - SIDE_NY[i] * sin;
    const ny = SIDE_NX[i] * sin + SIDE_NY[i] * cos;
    const dot = nx + ny;

    if (dot > bestDot) {
      secondDot = bestDot;
      secondIndex = bestIndex;
      bestDot = dot;
      bestIndex = i;
    } else if (dot > secondDot) {
      secondDot = dot;
      secondIndex = i;
    }
  }

  const bestScreenX =
    (SIDE_NX[bestIndex] * cos - SIDE_NY[bestIndex] * sin) -
    (SIDE_NX[bestIndex] * sin + SIDE_NY[bestIndex] * cos);
  const secondScreenX =
    (SIDE_NX[secondIndex] * cos - SIDE_NY[secondIndex] * sin) -
    (SIDE_NX[secondIndex] * sin + SIDE_NY[secondIndex] * cos);

  if (bestScreenX >= secondScreenX) {
    out.right = bestIndex;
    out.left = secondIndex;
  } else {
    out.right = secondIndex;
    out.left = bestIndex;
  }
}

let brandCellCache: ReadonlyArray<readonly [number, number]> | null = null;

/**
 * Occupied cells of the LA monogram, memoised.
 *
 * Reused from the hero lattice's glyph rather than re-derived from
 * `brandMark.json`, so the occupancy data has exactly one definition.
 */
export function brandCells(): ReadonlyArray<readonly [number, number]> {
  if (brandCellCache) return brandCellCache;

  const cells: Array<readonly [number, number]> = [];
  for (let row = 0; row < LA_GLYPH_ROWS; row += 1) {
    const line = LA_GLYPH[row];
    for (let column = 0; column < LA_GLYPH_COLUMNS; column += 1) {
      if (line[column] === "#") cells.push([column, row]);
    }
  }

  brandCellCache = cells;
  return cells;
}

/**
 * Seed a screen position, biased toward the monogram's occupancy grid.
 *
 * The glyph box is fitted to the viewport preserving its aspect ratio, so the
 * resting field carries an echo of the mark's proportions rather than a
 * stretched copy of them. The remainder of the cubes are placed uniformly, so
 * the echo stays faint.
 */
export function seedPosition(
  width: number,
  height: number,
  random: RandomSource,
  out: { x: number; y: number },
): void {
  const cells = brandCells();

  if (cells.length === 0 || random() > VOXEL_BRAND_BIAS) {
    out.x = random() * width;
    out.y = random() * height;
    return;
  }

  const unit = Math.min(width / LA_GLYPH_COLUMNS, height / LA_GLYPH_ROWS);
  const originX = (width - unit * LA_GLYPH_COLUMNS) / 2;
  const originY = (height - unit * LA_GLYPH_ROWS) / 2;
  const cell = cells[Math.min(cells.length - 1, Math.floor(random() * cells.length))];

  out.x = originX + (cell[0] + random()) * unit;
  out.y = originY + (cell[1] + random()) * unit;
}

/**
 * Build a field for the current viewport.
 *
 * Every cube shares one base drift angle and deviates from it by at most 12
 * degrees, which is what makes the field read as a single coherent current
 * instead of independent jitter.
 */
export function createVoxelCubes(
  width: number,
  height: number,
  random: RandomSource = Math.random,
): VoxelCube[] {
  const count = voxelCount(width, height);
  const baseAngle = random() * Math.PI * 2;
  const position = { x: 0, y: 0 };
  const grid = { gx: 0, gy: 0 };

  return Array.from({ length: count }, () => {
    const gz = random();
    const edge = voxelEdge(gz);
    seedPosition(width, height, random, position);
    gridDeltaForScreenDelta(position.x, position.y, edge, grid);

    const angle = baseAngle + (random() * 2 - 1) * VOXEL_JITTER_RAD;

    return {
      gx: grid.gx,
      gy: grid.gy,
      gz,
      dgx: Math.cos(angle),
      dgy: Math.sin(angle),
      yaw: random() * Math.PI * 2,
      yawRate: (random() < 0.5 ? -1 : 1) * VOXEL_YAW_RATE,
      accent: random() < VOXEL_ACCENT_SHARE,
      basin: 0,
    };
  });
}

/** The 15s tide. Felt as calm rather than noticed as an animation. */
export function voxelPulse(elapsedMs: number): number {
  return 0.5 + 0.5 * Math.sin((elapsedMs / VOXEL_PULSE_PERIOD_MS) * Math.PI * 2);
}

/**
 * Basin strength for a cube at `distance` from the cursor.
 *
 * Quadratic falloff so the depression has a soft rim and a defined centre,
 * reaching exactly zero at the radius.
 */
export function basinFactor(distance: number): number {
  if (!(distance < VOXEL_BASIN_RADIUS)) return 0;
  const t = 1 - distance / VOXEL_BASIN_RADIUS;
  return t * t;
}

export interface VoxelPointer {
  x: number;
  y: number;
  active: boolean;
}

/**
 * Advance one cube by one frame, in place.
 *
 * Mutation is deliberate: this runs up to 54 times a frame and allocating a
 * replacement would hand the collector thousands of objects a second.
 */
export function stepVoxelCube(
  cube: VoxelCube,
  width: number,
  height: number,
  pointer: VoxelPointer,
  pulse: number,
  grid: { gx: number; gy: number },
): void {
  const edge = voxelEdge(cube.gz);
  const speed =
    voxelSpeed(cube.gz) * lerp(VOXEL_PULSE_MIN_SPEED, 1, pulse);

  // A unit grid step projects to exactly `edge` pixels, so converting a pixel
  // speed into a grid step is a single division.
  const step = edge === 0 ? 0 : speed / edge;
  cube.gx += cube.dgx * step;
  cube.gy += cube.dgy * step;
  cube.yaw += cube.yawRate;

  const sx = screenX(cube.gx, cube.gy, edge);
  const sy = screenY(cube.gx, cube.gy, cube.gz, edge);

  const target = pointer.active
    ? basinFactor(Math.hypot(sx - pointer.x, sy - pointer.y))
    : 0;
  cube.basin += (target - cube.basin) * VOXEL_BASIN_LERP;

  // Wrapping is applied as an exact pixel jump converted back into grid space,
  // which keeps the cube on its current isometric heading.
  const spanX = width + VOXEL_WRAP_MARGIN * 2;
  const spanY = height + VOXEL_WRAP_MARGIN * 2;
  let shiftX = 0;
  let shiftY = 0;
  if (sx < -VOXEL_WRAP_MARGIN) shiftX = spanX;
  else if (sx > width + VOXEL_WRAP_MARGIN) shiftX = -spanX;
  if (sy < -VOXEL_WRAP_MARGIN) shiftY = spanY;
  else if (sy > height + VOXEL_WRAP_MARGIN) shiftY = -spanY;

  if (shiftX !== 0 || shiftY !== 0) {
    gridDeltaForScreenDelta(shiftX, shiftY, edge, grid);
    cube.gx += grid.gx;
    cube.gy += grid.gy;
  }
}

export interface VoxelRenderValues {
  /** Screen position of the cube's anchor point. */
  sx: number;
  sy: number;
  /** Depth after the basin has pulled it down. */
  depth: number;
  edge: number;
  alpha: number;
}

/**
 * Resolve the values the renderer needs, with the basin applied.
 *
 * The basin is never written back into `gz`: sinking is derived here, so
 * releasing the cursor heals the depression instead of leaving a dent.
 */
export function voxelRenderValues(
  cube: VoxelCube,
  pulse: number,
  out: VoxelRenderValues,
): void {
  const restingEdge = voxelEdge(cube.gz);
  const depth = cube.gz - cube.basin * VOXEL_BASIN_SINK;

  out.sx = screenX(cube.gx, cube.gy, restingEdge);
  out.sy = screenY(cube.gx, cube.gy, depth, restingEdge);
  out.depth = depth;
  out.edge = restingEdge * (1 - cube.basin * VOXEL_BASIN_SHRINK);
  out.alpha =
    voxelAlpha(cube.gz) *
    (1 - cube.basin * VOXEL_BASIN_DIM) *
    lerp(VOXEL_PULSE_MIN_ALPHA, 1, pulse);
}
