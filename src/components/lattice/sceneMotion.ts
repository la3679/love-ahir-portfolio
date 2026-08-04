/**
 * Pure motion primitives for the warm voxel formation scene.
 *
 * The cx20 CodePen is credited as interaction inspiration only. This easing,
 * orbit mapping and interpolation state are independently implemented and do
 * not depend on Tween.js, so the existing lazy Three.js chunk stays bounded.
 */

export const VOXEL_MORPH_DURATION_MS = 1050;

export const VOXEL_ORBIT = {
  hoverPitchRadians: (3.5 * Math.PI) / 180,
  hoverYawRadians: (4.5 * Math.PI) / 180,
  dragPitchRadians: (14 * Math.PI) / 180,
  dragYawRadians: (20 * Math.PI) / 180,
} as const;

export const VOXEL_POINTER_RESPONSE = {
  follow: 14,
  return: 8,
} as const;

export function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

export function clampUnit(value: number): number {
  return clamp(value, 0, 1);
}

/** Symmetric exponential easing with exact endpoints. */
export function easeInOutExpo(value: number): number {
  const t = clampUnit(value);
  if (t === 0 || t === 1) return t;
  if (t < 0.5) return 2 ** (20 * t - 10) / 2;
  return (2 - 2 ** (-20 * t + 10)) / 2;
}

export function interpolate(from: number, to: number, progress: number): number {
  return from + (to - from) * clampUnit(progress);
}

/** Frame-rate-independent exponential damping factor. */
export function dampingFactor(response: number, deltaSeconds: number): number {
  if (response <= 0 || deltaSeconds <= 0) return 0;
  return 1 - Math.exp(-response * deltaSeconds);
}

export interface OrbitTarget {
  pitch: number;
  yaw: number;
}

/**
 * Map normalized pointer coordinates to a bounded orbit. Inputs are clamped so
 * an escaped pointer or synthetic event can never spin the scene unexpectedly.
 */
export function mapVoxelOrbit(
  normalizedX: number,
  normalizedY: number,
  dragging = false,
): OrbitTarget {
  const x = clamp(normalizedX, -1, 1);
  const y = clamp(normalizedY, -1, 1);
  return {
    pitch:
      y *
      (dragging
        ? VOXEL_ORBIT.dragPitchRadians
        : VOXEL_ORBIT.hoverPitchRadians),
    yaw:
      x *
      (dragging ? VOXEL_ORBIT.dragYawRadians : VOXEL_ORBIT.hoverYawRadians),
  };
}

export function motionSettled(
  current: OrbitTarget,
  target: OrbitTarget,
  epsilon = 0.0005,
): boolean {
  return (
    Math.abs(current.pitch - target.pitch) <= epsilon &&
    Math.abs(current.yaw - target.yaw) <= epsilon
  );
}
