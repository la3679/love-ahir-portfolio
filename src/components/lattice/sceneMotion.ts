/**
 * Pure motion primitives for the warm voxel formation scene.
 *
 * The cx20 CodePen is credited as interaction inspiration only. This easing,
 * orbit mapping and interpolation state are independently implemented and do
 * not depend on Tween.js, so the existing lazy Three.js chunk stays bounded.
 */

export const VOXEL_MORPH_ACTIVE_MS = 1500;
export const VOXEL_MORPH_STAGGER_MS = 180;
export const VOXEL_MORPH_DURATION_MS =
  VOXEL_MORPH_ACTIVE_MS + VOXEL_MORPH_STAGGER_MS;
/**
 * Bounded idle drift around each formation's rest pose.
 *
 * The rest pose — ~8° yaw and -4° pitch for the monogram — is what makes the
 * object read as extruded rather than as a flat glyph. Idle motion used to
 * accumulate yaw without bound at 0.05 rad/s, so the scene completed a full
 * revolution roughly every two minutes and periodically presented edge-on as
 * an unreadable vertical slab.
 *
 * The drift is now an oscillation about the rest pose instead of a rotation
 * away from it: wide enough to stay alive, never wide enough to lose the
 * extrusion. The two axes use different periods so the combined motion does
 * not visibly repeat and the object is never momentarily still on both axes
 * at once.
 */
export const VOXEL_IDLE_DRIFT = {
  yawRadians: (11 * Math.PI) / 180,
  pitchRadians: (3 * Math.PI) / 180,
  yawPeriodSeconds: 19,
  pitchPeriodSeconds: 27,
} as const;

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

/** Fast departure with a calm settle, matching the narrative morph. */
export function easeOutCubic(value: number): number {
  const t = clampUnit(value);
  return 1 - (1 - t) ** 3;
}

/**
 * Distance-staggered per-voxel progress. The furthest voxel starts 180ms
 * after the centre and still settles at the shared 1.68-second deadline.
 */
export function voxelMorphProgress(
  elapsedMs: number,
  distanceFromCentre: number,
  maximumDistance: number,
): number {
  const distance = maximumDistance <= 0
    ? 0
    : clampUnit(distanceFromCentre / maximumDistance);
  const delay = distance * VOXEL_MORPH_STAGGER_MS;
  return easeOutCubic((elapsedMs - delay) / VOXEL_MORPH_ACTIVE_MS);
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
 * Idle offset from the rest pose at `elapsedSeconds`. Bounded by construction:
 * both components are a sine scaled by the amplitudes above, so no elapsed
 * time — however large, and however long the tab was left open — can rotate
 * the object past `VOXEL_IDLE_DRIFT`.
 */
export function voxelIdleDrift(elapsedSeconds: number): OrbitTarget {
  const phase = (period: number) => (elapsedSeconds / period) * Math.PI * 2;

  return {
    pitch:
      Math.sin(phase(VOXEL_IDLE_DRIFT.pitchPeriodSeconds)) *
      VOXEL_IDLE_DRIFT.pitchRadians,
    yaw:
      Math.sin(phase(VOXEL_IDLE_DRIFT.yawPeriodSeconds)) *
      VOXEL_IDLE_DRIFT.yawRadians,
  };
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
