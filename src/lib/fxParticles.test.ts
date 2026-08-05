import { describe, expect, it } from "vitest";
import {
  createFxParticles,
  fxLinkAlpha,
  fxLinkDistance,
  fxParticleCount,
  seededRandom,
  stepFxParticle,
  FX_LINK_DISTANCE,
  FX_MAX_PARTICLES,
  FX_MIN_PARTICLES,
  FX_MOBILE_LINK_DISTANCE,
  FX_MOBILE_PARTICLES,
  FX_REPULSION_RADIUS,
  FX_WRAP_MARGIN,
  type FxParticle,
} from "./fxParticles";

const still = (x: number, y: number): FxParticle => ({ x, y, vx: 0, vy: 0, r: 3 });
const IDLE = { x: 0, y: 0, active: false } as const;

describe("fxParticleCount", () => {
  it("thins the field on phone-class viewports", () => {
    expect(fxParticleCount(390, 844)).toBe(FX_MOBILE_PARTICLES);
    expect(fxParticleCount(767, 1024)).toBe(FX_MOBILE_PARTICLES);
  });

  it("scales with area between the desktop bounds", () => {
    // 1440 x 900 = 1,296,000 / 20,000 = 64.8 -> 64
    expect(fxParticleCount(1440, 900)).toBe(64);
    expect(fxParticleCount(768, 600)).toBe(FX_MIN_PARTICLES);
    expect(fxParticleCount(3840, 2160)).toBe(FX_MAX_PARTICLES);
  });

  it("never returns NaN for a degenerate viewport", () => {
    expect(fxParticleCount(Number.NaN, 900)).toBe(FX_MOBILE_PARTICLES);
    expect(fxParticleCount(1440, Number.NaN)).toBe(FX_MIN_PARTICLES);
  });
});

describe("fxLinkDistance", () => {
  it("shortens the link radius on mobile", () => {
    expect(fxLinkDistance(390)).toBe(FX_MOBILE_LINK_DISTANCE);
    expect(fxLinkDistance(1440)).toBe(FX_LINK_DISTANCE);
  });
});

describe("createFxParticles", () => {
  it("places every node inside the viewport with a bounded drift and radius", () => {
    const particles = createFxParticles(1440, 900, seededRandom(7));

    expect(particles).toHaveLength(fxParticleCount(1440, 900));
    for (const particle of particles) {
      expect(particle.x).toBeGreaterThanOrEqual(0);
      expect(particle.x).toBeLessThanOrEqual(1440);
      expect(particle.y).toBeGreaterThanOrEqual(0);
      expect(particle.y).toBeLessThanOrEqual(900);
      expect(Math.abs(particle.vx)).toBeLessThanOrEqual(0.25);
      expect(Math.abs(particle.vy)).toBeLessThanOrEqual(0.25);
      expect(particle.r).toBeGreaterThanOrEqual(2.2);
      expect(particle.r).toBeLessThanOrEqual(3.7);
    }
  });

  it("is repeatable for a given seed, so the static frame never shifts", () => {
    const first = createFxParticles(1440, 900, seededRandom(99));
    const second = createFxParticles(1440, 900, seededRandom(99));
    expect(first).toEqual(second);
  });
});

describe("stepFxParticle", () => {
  it("integrates velocity", () => {
    const particle: FxParticle = { x: 100, y: 100, vx: 0.2, vy: -0.1, r: 3 };
    stepFxParticle(particle, 1440, 900, IDLE);
    expect(particle.x).toBeCloseTo(100.2, 5);
    expect(particle.y).toBeCloseTo(99.9, 5);
  });

  it("pushes a node directly away from the cursor", () => {
    const particle = still(510, 400);
    stepFxParticle(particle, 1440, 900, { x: 500, y: 400, active: true });

    // Pure +x separation, so all of the displacement lands on x.
    expect(particle.x).toBeGreaterThan(510);
    expect(particle.y).toBeCloseTo(400, 5);
  });

  it("pushes harder the closer the cursor is", () => {
    const near = still(510, 400);
    const far = still(500 + FX_REPULSION_RADIUS - 10, 400);
    const pointer = { x: 500, y: 400, active: true };

    stepFxParticle(near, 1440, 900, pointer);
    stepFxParticle(far, 1440, 900, pointer);

    expect(near.x - 510).toBeGreaterThan(far.x - (500 + FX_REPULSION_RADIUS - 10));
  });

  it("ignores a cursor beyond the repulsion radius", () => {
    const particle = still(500 + FX_REPULSION_RADIUS, 400);
    stepFxParticle(particle, 1440, 900, { x: 500, y: 400, active: true });
    expect(particle.x).toBe(500 + FX_REPULSION_RADIUS);
  });

  it("ignores an inactive cursor", () => {
    const particle = still(510, 400);
    stepFxParticle(particle, 1440, 900, { x: 500, y: 400, active: false });
    expect(particle.x).toBe(510);
  });

  it("survives a cursor sitting exactly on a node", () => {
    const particle = still(500, 400);
    stepFxParticle(particle, 1440, 900, { x: 500, y: 400, active: true });
    expect(Number.isFinite(particle.x)).toBe(true);
    expect(Number.isFinite(particle.y)).toBe(true);
  });

  it("wraps rather than bounces at every edge", () => {
    const left: FxParticle = { x: -FX_WRAP_MARGIN, y: 400, vx: -1, vy: 0, r: 3 };
    stepFxParticle(left, 1440, 900, IDLE);
    expect(left.x).toBe(1440 + FX_WRAP_MARGIN);

    const right: FxParticle = { x: 1440 + FX_WRAP_MARGIN, y: 400, vx: 1, vy: 0, r: 3 };
    stepFxParticle(right, 1440, 900, IDLE);
    expect(right.x).toBe(-FX_WRAP_MARGIN);

    const top: FxParticle = { x: 700, y: -FX_WRAP_MARGIN, vx: 0, vy: -1, r: 3 };
    stepFxParticle(top, 1440, 900, IDLE);
    expect(top.y).toBe(900 + FX_WRAP_MARGIN);

    const bottom: FxParticle = { x: 700, y: 900 + FX_WRAP_MARGIN, vx: 0, vy: 1, r: 3 };
    stepFxParticle(bottom, 1440, 900, IDLE);
    expect(bottom.y).toBe(-FX_WRAP_MARGIN);
  });
});

describe("fxLinkAlpha", () => {
  it("fades linearly with squared distance", () => {
    const max = FX_LINK_DISTANCE * FX_LINK_DISTANCE;
    expect(fxLinkAlpha(0, max)).toBe(1);
    expect(fxLinkAlpha(max, max)).toBe(0);
    expect(fxLinkAlpha(max / 2, max)).toBeCloseTo(0.5, 5);
  });

  it("clamps outside the link radius and for a degenerate radius", () => {
    expect(fxLinkAlpha(10_000, 100)).toBe(0);
    expect(fxLinkAlpha(10, 0)).toBe(0);
  });
});
