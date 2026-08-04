import { describe, expect, it } from "vitest";
import {
  AMBIENT_PARALLAX_LIMIT,
  ambientDpr,
  ambientParticleBudget,
  ambientRepulsion,
  ambientRepulsionRadius,
  createAmbientPoints,
  mapAmbientPointer,
  selectAmbientLinks,
} from "./ambientFieldSpec";

describe("ambient field specification", () => {
  it("generates a deterministic, bounded composition", () => {
    const first = createAmbientPoints(44);
    const second = createAmbientPoints(44);

    expect(first).toEqual(second);
    expect(first).toHaveLength(44);
    for (const point of first) {
      expect(point.nx).toBeGreaterThanOrEqual(0.025);
      expect(point.nx).toBeLessThanOrEqual(0.975);
      expect(point.ny).toBeGreaterThanOrEqual(0.035);
      expect(point.ny).toBeLessThanOrEqual(0.965);
      expect(Number.isFinite(point.vx)).toBe(true);
      expect(Number.isFinite(point.vy)).toBe(true);
      expect(point.radius).toBeGreaterThanOrEqual(1.4);
      expect(point.radius).toBeLessThanOrEqual(3.5);
    }
  });

  it("lays points along four deterministic shallow streams", () => {
    const points = createAmbientPoints(48);
    const streams = Array.from({ length: 4 }, (_, stream) =>
      points.filter((_, index) => index % 4 === stream),
    );

    for (const stream of streams) {
      expect(stream).toHaveLength(12);
      expect(stream[stream.length - 1].nx - stream[0].nx).toBeGreaterThan(
        0.82,
      );
      expect(
        stream.every(
          (point, index) => index === 0 || point.nx > stream[index - 1].nx,
        ),
      ).toBe(true);
    }

    expect(points.filter((point) => point.accent)).toHaveLength(8);
    expect(Math.max(...points.filter((point) => point.accent).map((point) => point.radius))).toBeGreaterThan(3);
  });

  it("scales density and DPR without exceeding their performance caps", () => {
    expect(ambientParticleBudget(1440)).toBe(76);
    expect(ambientParticleBudget(900)).toBe(56);
    expect(ambientParticleBudget(390)).toBe(36);
    expect(ambientDpr(1440, 3)).toBe(1.5);
    expect(ambientDpr(390, 3)).toBe(1.25);
    expect(ambientDpr(1440, Number.NaN)).toBe(1);
  });

  it("maps only the hero background and yields the stage to its own scene", () => {
    const hero = { left: 0, top: 100, width: 1200, height: 760 };
    const stage = { left: 680, top: 180, width: 480, height: 580 };
    const background = mapAmbientPointer(100, 200, hero, stage);
    const insideStage = mapAmbientPointer(900, 300, hero, stage);
    const outsideHero = mapAmbientPointer(1300, 300, hero, stage);

    expect(background.active).toBe(true);
    expect(Math.abs(background.parallaxX)).toBeLessThanOrEqual(
      AMBIENT_PARALLAX_LIMIT.x,
    );
    expect(Math.abs(background.parallaxY)).toBeLessThanOrEqual(
      AMBIENT_PARALLAX_LIMIT.y,
    );
    expect(insideStage.active).toBe(false);
    expect(insideStage.parallaxX).not.toBe(0);
    expect(insideStage.parallaxY).not.toBe(0);
    expect(outsideHero.active).toBe(false);
  });

  it("keeps repulsion local and bounded", () => {
    const pointer = { active: true, x: 100, y: 100 };
    const near = ambientRepulsion(110, 100, pointer, 90, 24);
    const far = ambientRepulsion(300, 100, pointer, 90, 24);
    const atPointer = ambientRepulsion(100, 100, pointer, 90, 24, Math.PI / 2);

    expect(Math.hypot(near.x, near.y)).toBeLessThanOrEqual(24);
    expect(near.x).toBeGreaterThan(0);
    expect(far).toEqual({ x: 0, y: 0 });
    expect(Math.hypot(atPointer.x, atPointer.y)).toBeCloseTo(24);
    expect(ambientRepulsionRadius(1440, 760)).toBeLessThanOrEqual(136);
  });

  it("builds a sparse graph with no node degree above two", () => {
    const points = createAmbientPoints(44).map((point) => ({
      x: point.nx * 1200,
      y: point.ny * 760,
    }));
    const links = selectAmbientLinks(points, 180, 28);
    const degree = new Array(points.length).fill(0);
    for (const link of links) {
      degree[link.from] += 1;
      degree[link.to] += 1;
      expect(link.from).toBeLessThan(link.to);
      expect(link.distance).toBeLessThanOrEqual(180);
    }

    expect(links.length).toBeLessThanOrEqual(28);
    expect(Math.max(...degree)).toBeLessThanOrEqual(2);
  });
});
