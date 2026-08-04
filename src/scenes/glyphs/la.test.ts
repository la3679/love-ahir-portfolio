import { describe, expect, it } from "vitest";
import {
  LA_GLYPH,
  LA_GLYPH_COLUMNS,
  LA_GLYPH_EXTRUSION_DEPTH,
  LA_GLYPH_ROWS,
  LA_GLYPH_VOXEL_COUNT,
} from "./la";

type Point = readonly [column: number, row: number];
const keyOf = ([column, row]: Point) => `${column}:${row}`;

function activePoints(): Point[] {
  return LA_GLYPH.flatMap((line, row) =>
    Array.from(line).flatMap((cell, column) =>
      cell === "#" ? [[column, row] as const] : [],
    ),
  );
}

describe("LA_GLYPH", () => {
  it("is an exact 32 x 24 bitmap with 108 occupied cells", () => {
    expect(LA_GLYPH).toHaveLength(LA_GLYPH_ROWS);
    expect(LA_GLYPH_ROWS).toBe(24);
    expect(LA_GLYPH_COLUMNS).toBe(32);
    expect(LA_GLYPH_EXTRUSION_DEPTH).toBe(4);
    expect(LA_GLYPH.every((line) => line.length === LA_GLYPH_COLUMNS)).toBe(true);
    expect(LA_GLYPH.every((line) => /^[.#]+$/.test(line))).toBe(true);
    expect(activePoints()).toHaveLength(LA_GLYPH_VOXEL_COUNT);
    expect(LA_GLYPH_VOXEL_COUNT).toBe(108);
  });

  it("authors one four-neighbour-connected LA stroke", () => {
    const points = activePoints();
    const active = new Set(points.map(keyOf));
    const visited = new Set<string>();
    const queue = [points[0]];

    while (queue.length > 0) {
      const point = queue.shift();
      if (!point || visited.has(keyOf(point))) continue;
      visited.add(keyOf(point));
      const [column, row] = point;
      const neighbours: Point[] = [
        [column - 1, row],
        [column + 1, row],
        [column, row - 1],
        [column, row + 1],
      ];
      neighbours.forEach((neighbour) => {
        if (active.has(keyOf(neighbour)) && !visited.has(keyOf(neighbour))) {
          queue.push(neighbour);
        }
      });
    }

    expect(visited.size).toBe(points.length);
  });

  it("shares the L stem with the A and preserves a broad A counter", () => {
    const active = new Set(activePoints().map(keyOf));

    for (let row = 2; row <= 20; row += 1) {
      expect(active.has(keyOf([5, row]))).toBe(true);
      expect(active.has(keyOf([6, row]))).toBe(true);
    }
    for (let column = 5; column <= 18; column += 1) {
      expect(active.has(keyOf([column, 20]))).toBe(true);
    }
    expect(active.has(keyOf([23, 20]))).toBe(true);
    expect(active.has(keyOf([24, 20]))).toBe(true);
    for (let column = 6; column <= 17; column += 1) {
      expect(active.has(keyOf([column, 12]))).toBe(true);
    }

    // Seven open cells at the counter's widest sampled row, comfortably over
    // the three-voxel minimum needed to remain legible after quantisation.
    for (let column = 7; column <= 13; column += 1) {
      expect(active.has(keyOf([column, 10]))).toBe(false);
    }
  });
});
