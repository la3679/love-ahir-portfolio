import { describe, expect, it } from "vitest";
import {
  createFxPoints,
  fxParticleBudget,
  selectFxLinks,
} from "./fxField";

describe("global FX geometry", () => {
  it("derives density from viewport area with bounded budgets", () => {
    expect(fxParticleBudget(1440, 900)).toBe(72);
    expect(fxParticleBudget(1024, 768)).toBe(44);
    expect(fxParticleBudget(390, 844)).toBe(18);
    expect(fxParticleBudget(320, 568)).toBe(16);
    expect(fxParticleBudget(4000, 3000)).toBe(96);
  });

  it("creates deterministic points in four bounded streams", () => {
    const first = createFxPoints(48);
    expect(first).toEqual(createFxPoints(48));
    expect(first).toHaveLength(48);
    expect(first.filter((point) => point.accent)).toHaveLength(8);

    for (const point of first) {
      expect(point.nx).toBeGreaterThanOrEqual(0.025);
      expect(point.nx).toBeLessThanOrEqual(0.975);
      expect(point.ny).toBeGreaterThanOrEqual(0.035);
      expect(point.ny).toBeLessThanOrEqual(0.965);
      expect(point.opacity).toBeGreaterThanOrEqual(0.25);
      expect(point.opacity).toBeLessThanOrEqual(0.4);
    }
  });

  it("keeps the connector graph sparse", () => {
    const points = createFxPoints(48).map((point) => ({
      x: point.nx * 1200,
      y: point.ny * 760,
    }));
    const links = selectFxLinks(points, 140, 43);
    const degree = new Array(points.length).fill(0);
    for (const link of links) {
      degree[link.from] += 1;
      degree[link.to] += 1;
    }
    expect(links.length).toBeLessThanOrEqual(43);
    expect(Math.max(...degree)).toBeLessThanOrEqual(2);
  });
});
