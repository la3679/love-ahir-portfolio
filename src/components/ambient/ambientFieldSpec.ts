/**
 * Dependency-free geometry and interaction rules for the hero ambient field.
 *
 * The field borrows only the general interaction principles of sparse drift,
 * pointer repulsion and shallow parallax. Its seed, budgets, geometry and
 * motion values are original to this portfolio and deterministic so the SVG
 * first paint and the optional canvas enhancement can share one composition.
 */

export const AMBIENT_VIEWBOX = { width: 1200, height: 760 } as const;

export const AMBIENT_PARALLAX_LIMIT = { x: 14, y: 9 } as const;

const STREAM_CENTRES = [0.14, 0.34, 0.61, 0.82] as const;
const STREAM_BENDS = [0.045, -0.052, 0.048, -0.04] as const;

export interface AmbientPointSpec {
  id: string;
  /** Normalised coordinates, intentionally independent of viewport size. */
  nx: number;
  ny: number;
  /** CSS-pixel velocity per second. */
  vx: number;
  vy: number;
  radius: number;
  accent: boolean;
  phase: number;
}

export interface AmbientPoint2D {
  x: number;
  y: number;
}

export interface AmbientLink {
  from: number;
  to: number;
  distance: number;
}

export interface AmbientRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface AmbientPointer {
  active: boolean;
  x: number;
  y: number;
  parallaxX: number;
  parallaxY: number;
}

const INACTIVE_POINTER: AmbientPointer = {
  active: false,
  x: 0,
  y: 0,
  parallaxX: 0,
  parallaxY: 0,
};

const clamp = (value: number, minimum: number, maximum: number) =>
  Math.min(maximum, Math.max(minimum, value));

/** Small deterministic PRNG; never couples the composition to Math.random. */
function seededRandom(seed: number) {
  let state = seed >>> 0 || 0x4c6f7665;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 0x1_0000_0000;
  };
}

export function createAmbientPoints(
  count: number,
  seed = 0x4c41_2026,
): AmbientPointSpec[] {
  const total = Math.max(0, Math.floor(count));
  const random = seededRandom(seed);

  return Array.from({ length: total }, (_, index) => {
    const stream = index % STREAM_CENTRES.length;
    const streamIndex = Math.floor(index / STREAM_CENTRES.length);
    const streamLength =
      Math.floor((total - 1 - stream) / STREAM_CENTRES.length) + 1;
    const progress = (streamIndex + 0.5) / Math.max(1, streamLength);
    const phase = random() * Math.PI * 2;
    const horizontalJitter = (random() - 0.5) * 0.018;
    const verticalJitter = (random() - 0.5) * 0.024;
    const bend = Math.sin(progress * Math.PI) * STREAM_BENDS[stream];
    const ripple = Math.sin(progress * Math.PI * 2 + phase) * 0.012;
    const nx = clamp(0.025 + progress * 0.95 + horizontalJitter, 0.025, 0.975);
    const ny = clamp(
      STREAM_CENTRES[stream] + bend + ripple + verticalJitter,
      0.035,
      0.965,
    );
    const accent =
      Math.abs(progress - 0.28) <= 0.5 / Math.max(1, streamLength) ||
      Math.abs(progress - 0.72) <= 0.5 / Math.max(1, streamLength);
    const radius = accent
      ? 2.85 + random() * 0.65
      : 1.4 + random() * 1.35;

    // A small tangent-aligned drift keeps each strand coherent long enough to
    // read as a designed trajectory rather than immediately becoming noise.
    const direction = stream % 2 === 0 ? 1 : -1;
    const speed = 5.2 + random() * 3.8;
    const curveDerivative =
      Math.cos(progress * Math.PI) * Math.PI * STREAM_BENDS[stream] +
      Math.cos(progress * Math.PI * 2 + phase) * Math.PI * 2 * 0.012;
    const pixelSlope =
      (curveDerivative * AMBIENT_VIEWBOX.height) /
      (0.95 * AMBIENT_VIEWBOX.width);

    return {
      id: `ambient-${index}`,
      nx,
      ny,
      vx: direction * speed,
      vy: direction * speed * pixelSlope,
      radius,
      accent,
      phase,
    };
  });
}

export function ambientParticleBudget(width: number): number {
  if (width >= 1120) return 76;
  if (width >= 720) return 56;
  return 36;
}

export function ambientDpr(width: number, deviceDpr: number): number {
  const safeDpr = Number.isFinite(deviceDpr) ? Math.max(1, deviceDpr) : 1;
  return Math.min(safeDpr, width < 768 ? 1.25 : 1.5);
}

export function ambientLinkDistance(width: number): number {
  return clamp(width * 0.105, 82, 134);
}

export function ambientRepulsionRadius(width: number, height: number): number {
  return clamp(Math.min(width, height) * 0.14, 72, 136);
}

function contains(rect: AmbientRect, clientX: number, clientY: number) {
  return (
    rect.width > 0 &&
    rect.height > 0 &&
    clientX >= rect.left &&
    clientX <= rect.left + rect.width &&
    clientY >= rect.top &&
    clientY <= rect.top + rect.height
  );
}

/**
 * Maps a pointer to hero-local coordinates. The exclusion rectangle is the
 * observatory stage: while the pointer is there, the voxel scene owns local
 * repulsion, while the ambient field retains its shallow global parallax.
 */
export function mapAmbientPointer(
  clientX: number,
  clientY: number,
  host: AmbientRect,
  excluded?: AmbientRect | null,
): AmbientPointer {
  if (!contains(host, clientX, clientY)) return INACTIVE_POINTER;

  const nx = clamp((clientX - host.left) / host.width, 0, 1);
  const ny = clamp((clientY - host.top) / host.height, 0, 1);
  return {
    active: !(excluded && contains(excluded, clientX, clientY)),
    x: nx * host.width,
    y: ny * host.height,
    parallaxX: (nx * 2 - 1) * AMBIENT_PARALLAX_LIMIT.x,
    parallaxY: (ny * 2 - 1) * AMBIENT_PARALLAX_LIMIT.y,
  };
}

/** A bounded, eased displacement rather than permanently moved particles. */
export function ambientRepulsion(
  pointX: number,
  pointY: number,
  pointer: Pick<AmbientPointer, "active" | "x" | "y">,
  radius: number,
  maximum = 24,
  fallbackAngle = 0,
): AmbientPoint2D {
  if (!pointer.active || radius <= 0 || maximum <= 0) return { x: 0, y: 0 };

  const dx = pointX - pointer.x;
  const dy = pointY - pointer.y;
  const distanceSquared = dx * dx + dy * dy;
  if (distanceSquared >= radius * radius) return { x: 0, y: 0 };

  if (distanceSquared < 0.0001) {
    return {
      x: Math.cos(fallbackAngle) * maximum,
      y: Math.sin(fallbackAngle) * maximum,
    };
  }

  const distance = Math.sqrt(distanceSquared);
  const falloff = 1 - distance / radius;
  const displacement = falloff * falloff * maximum;
  return {
    x: (dx / distance) * displacement,
    y: (dy / distance) * displacement,
  };
}

/**
 * Selects a sparse nearest-neighbour graph. A degree cap prevents the dense
 * spiderweb treatment that would compete with the hero text and voxel stage.
 */
export function selectAmbientLinks(
  points: ReadonlyArray<AmbientPoint2D>,
  maximumDistance: number,
  maximumLinks = Math.max(0, Math.floor(points.length * 0.62)),
): AmbientLink[] {
  if (maximumDistance <= 0 || maximumLinks <= 0) return [];

  const maximumDistanceSquared = maximumDistance * maximumDistance;
  const candidates: AmbientLink[] = [];
  for (let from = 0; from < points.length; from += 1) {
    for (let to = from + 1; to < points.length; to += 1) {
      const dx = points[from].x - points[to].x;
      const dy = points[from].y - points[to].y;
      const distanceSquared = dx * dx + dy * dy;
      if (distanceSquared <= maximumDistanceSquared) {
        candidates.push({ from, to, distance: Math.sqrt(distanceSquared) });
      }
    }
  }

  candidates.sort((a, b) => a.distance - b.distance);
  const degree = new Uint8Array(points.length);
  const selected: AmbientLink[] = [];
  for (const candidate of candidates) {
    if (selected.length >= maximumLinks) break;
    if (degree[candidate.from] >= 2 || degree[candidate.to] >= 2) continue;
    degree[candidate.from] += 1;
    degree[candidate.to] += 1;
    selected.push(candidate);
  }
  return selected;
}
