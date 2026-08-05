/**
 * Pure simulation for the site-wide FX constellation.
 *
 * Everything here works in CSS pixels and has no DOM, React or canvas
 * dependency, so the density budget, the drift integration, the cursor
 * repulsion, the edge wrap and the distance-based link fade are all testable
 * without a browser or an animation frame. `FxLayer` owns the canvas, the
 * colours and the loop; this module owns the maths.
 */

export interface FxParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

export interface FxPointer {
  x: number;
  y: number;
  active: boolean;
}

/** Below this width the field thins out for phone-class viewports. */
export const FX_MOBILE_WIDTH = 768;
/** One node per ~20,000 CSS pixels, bounded so no viewport is empty or busy. */
export const FX_AREA_PER_PARTICLE = 20_000;
export const FX_MIN_PARTICLES = 38;
export const FX_MAX_PARTICLES = 66;
export const FX_MOBILE_PARTICLES = 26;
export const FX_LINK_DISTANCE = 132;
export const FX_MOBILE_LINK_DISTANCE = 100;
/** Nodes leave and re-enter through this margin instead of bouncing. */
export const FX_WRAP_MARGIN = 14;
export const FX_REPULSION_RADIUS = 110;
export const FX_REPULSION_STRENGTH = 3.4;
/** Below this squared distance the pointer is effectively on the node. */
const FX_REPULSION_EPSILON = 0.01;

export type RandomSource = () => number;

const clamp = (value: number, minimum: number, maximum: number) =>
  Math.min(maximum, Math.max(minimum, value));

const isMobile = (width: number) => width < FX_MOBILE_WIDTH;

/**
 * xorshift32. Only used where a repeatable field is wanted — the static
 * reduced-motion frame and the tests. The live field seeds from `Math.random`.
 */
export function seededRandom(seed: number): RandomSource {
  let state = seed >>> 0 || 0x4c6f_7665;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 0x1_0000_0000;
  };
}

export function fxParticleCount(width: number, height: number): number {
  const safeWidth = Number.isFinite(width) ? Math.max(0, width) : 0;
  const safeHeight = Number.isFinite(height) ? Math.max(0, height) : 0;
  if (isMobile(safeWidth)) return FX_MOBILE_PARTICLES;

  return clamp(
    Math.floor((safeWidth * safeHeight) / FX_AREA_PER_PARTICLE),
    FX_MIN_PARTICLES,
    FX_MAX_PARTICLES,
  );
}

export function fxLinkDistance(width: number): number {
  return isMobile(width) ? FX_MOBILE_LINK_DISTANCE : FX_LINK_DISTANCE;
}

/**
 * A fresh field for the current viewport.
 *
 * Velocities land in ±0.25 px/frame, which is roughly 15 px/second at 60fps —
 * movement the eye registers as alive without ever becoming a distraction
 * behind long-form copy.
 */
export function createFxParticles(
  width: number,
  height: number,
  random: RandomSource = Math.random,
): FxParticle[] {
  const count = fxParticleCount(width, height);

  return Array.from({ length: count }, () => ({
    x: random() * width,
    y: random() * height,
    vx: (random() - 0.5) * 0.5,
    vy: (random() - 0.5) * 0.5,
    r: random() * 1.5 + 2.2,
  }));
}

/**
 * Advance one node by one frame, in place.
 *
 * Mutation is deliberate: this runs `count` times per frame and allocating a
 * replacement object each time would hand the collector 60×66 objects a second
 * for no benefit.
 */
export function stepFxParticle(
  particle: FxParticle,
  width: number,
  height: number,
  pointer: FxPointer,
): FxParticle {
  particle.x += particle.vx;
  particle.y += particle.vy;

  if (pointer.active) {
    const dx = particle.x - pointer.x;
    const dy = particle.y - pointer.y;
    const distanceSquared = dx * dx + dy * dy;

    if (
      distanceSquared < FX_REPULSION_RADIUS * FX_REPULSION_RADIUS &&
      distanceSquared > FX_REPULSION_EPSILON
    ) {
      const distance = Math.sqrt(distanceSquared);
      // Linear falloff: hardest right at the cursor, nothing at the radius.
      const force = (FX_REPULSION_RADIUS - distance) / FX_REPULSION_RADIUS;
      particle.x += (dx / distance) * force * FX_REPULSION_STRENGTH;
      particle.y += (dy / distance) * force * FX_REPULSION_STRENGTH;
    }
  }

  // Wrap rather than bounce, so the field has no visible walls.
  if (particle.x < -FX_WRAP_MARGIN) particle.x = width + FX_WRAP_MARGIN;
  else if (particle.x > width + FX_WRAP_MARGIN) particle.x = -FX_WRAP_MARGIN;
  if (particle.y < -FX_WRAP_MARGIN) particle.y = height + FX_WRAP_MARGIN;
  else if (particle.y > height + FX_WRAP_MARGIN) particle.y = -FX_WRAP_MARGIN;

  return particle;
}

/**
 * Link opacity from squared distance — the detail that makes the mesh read as
 * alive rather than printed. Squared throughout so the hot inner loop never
 * needs a square root.
 */
export function fxLinkAlpha(
  distanceSquared: number,
  maximumDistanceSquared: number,
): number {
  if (maximumDistanceSquared <= 0) return 0;
  return clamp(1 - distanceSquared / maximumDistanceSquared, 0, 1);
}
