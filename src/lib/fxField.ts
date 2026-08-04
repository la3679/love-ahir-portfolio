/** Deterministic geometry for the fixed, document-wide FX constellation. */

const STREAM_CENTRES = [0.14, 0.34, 0.61, 0.82] as const;
const STREAM_BENDS = [0.045, -0.052, 0.048, -0.04] as const;
const MIN_POINTS = 16;
const MAX_POINTS = 96;

export interface FxPoint {
  id: string;
  nx: number;
  ny: number;
  radius: number;
  opacity: number;
  accent: boolean;
}

export interface FxPoint2D {
  x: number;
  y: number;
}

export interface FxLink {
  from: number;
  to: number;
  distance: number;
}

const clamp = (value: number, minimum: number, maximum: number) =>
  Math.min(maximum, Math.max(minimum, value));

function seededRandom(seed: number) {
  let state = seed >>> 0 || 0x4c6f7665;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 0x1_0000_0000;
  };
}

/** Approximately one node per 18,000 CSS pixels, with safe small/large caps. */
export function fxParticleBudget(width: number, height: number): number {
  const safeWidth = Number.isFinite(width) ? Math.max(0, width) : 0;
  const safeHeight = Number.isFinite(height) ? Math.max(0, height) : 0;
  return clamp(Math.round((safeWidth * safeHeight) / 18_000), MIN_POINTS, MAX_POINTS);
}

/** Four shallow, authored streams; deterministic across resize and hydration. */
export function createFxPoints(count: number, seed = 0x4c41_2026): FxPoint[] {
  const total = Math.max(0, Math.floor(count));
  const random = seededRandom(seed);

  return Array.from({ length: total }, (_, index) => {
    const stream = index % STREAM_CENTRES.length;
    const streamIndex = Math.floor(index / STREAM_CENTRES.length);
    const streamLength =
      Math.floor((total - 1 - stream) / STREAM_CENTRES.length) + 1;
    const progress = (streamIndex + 0.5) / Math.max(1, streamLength);
    const phase = random() * Math.PI * 2;
    const bend = Math.sin(progress * Math.PI) * STREAM_BENDS[stream];
    const ripple = Math.sin(progress * Math.PI * 2 + phase) * 0.012;
    const nx = clamp(
      0.025 + progress * 0.95 + (random() - 0.5) * 0.018,
      0.025,
      0.975,
    );
    const ny = clamp(
      STREAM_CENTRES[stream] + bend + ripple + (random() - 0.5) * 0.024,
      0.035,
      0.965,
    );
    const accent =
      Math.abs(progress - 0.28) <= 0.5 / Math.max(1, streamLength) ||
      Math.abs(progress - 0.72) <= 0.5 / Math.max(1, streamLength);

    return {
      id: `fx-${index}`,
      nx,
      ny,
      radius: accent ? 2.8 + random() * 0.45 : 1.35 + random() * 1.15,
      opacity: accent ? 0.4 : 0.25 + random() * 0.11,
      accent,
    };
  });
}

export function fxLinkDistance(width: number, height: number): number {
  return clamp(Math.min(width, height) * 0.16, 72, 140);
}

/** Sparse nearest-neighbour graph with a maximum degree of two. */
export function selectFxLinks(
  points: ReadonlyArray<FxPoint2D>,
  maximumDistance: number,
  maximumLinks = Math.max(0, Math.floor(points.length * 0.9)),
): FxLink[] {
  if (maximumDistance <= 0 || maximumLinks <= 0) return [];

  const maximumDistanceSquared = maximumDistance * maximumDistance;
  const candidates: FxLink[] = [];
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
  const selected: FxLink[] = [];
  for (const candidate of candidates) {
    if (selected.length >= maximumLinks) break;
    if (degree[candidate.from] >= 2 || degree[candidate.to] >= 2) continue;
    degree[candidate.from] += 1;
    degree[candidate.to] += 1;
    selected.push(candidate);
  }
  return selected;
}
