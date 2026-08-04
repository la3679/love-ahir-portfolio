import { describe, expect, it } from "vitest";
import {
  VOXEL_IDLE_DRIFT,
  VOXEL_MORPH_DURATION_MS,
  VOXEL_ORBIT,
  dampingFactor,
  easeOutCubic,
  interpolate,
  mapVoxelOrbit,
  motionSettled,
  voxelIdleDrift,
} from "./sceneMotion";
import { VOXEL_IDENTITY_ORIENTATION } from "./voxelFormationSpec";

const toDegrees = (radians: number) => (radians * 180) / Math.PI;

describe("voxel formation motion", () => {
  it("settles every formation change inside the 1.8s budget", () => {
    expect(VOXEL_MORPH_DURATION_MS).toBeGreaterThanOrEqual(900);
    expect(VOXEL_MORPH_DURATION_MS).toBeLessThan(1800);
  });

  it("returns exact easing endpoints and stays monotonic", () => {
    expect(easeOutCubic(-1)).toBe(0);
    expect(easeOutCubic(0)).toBe(0);
    expect(easeOutCubic(1)).toBe(1);
    expect(easeOutCubic(2)).toBe(1);

    const samples = Array.from({ length: 101 }, (_, index) =>
      easeOutCubic(index / 100),
    );
    for (let index = 1; index < samples.length; index += 1) {
      expect(samples[index]).toBeGreaterThanOrEqual(samples[index - 1]);
    }
  });

  /*
    The regression these guard: idle motion used to accumulate yaw without
    bound, so the object completed a full revolution and periodically showed
    edge-on as an unreadable slab. Drift must stay near the rest pose, and it
    must never come to rest.
  */
  it("keeps idle drift bounded no matter how long the scene has run", () => {
    for (const elapsed of [0, 9.5, 128.2, 3600, 86_400]) {
      const drift = voxelIdleDrift(elapsed);
      expect(Math.abs(drift.yaw)).toBeLessThanOrEqual(
        VOXEL_IDLE_DRIFT.yawRadians + 1e-9,
      );
      expect(Math.abs(drift.pitch)).toBeLessThanOrEqual(
        VOXEL_IDLE_DRIFT.pitchRadians + 1e-9,
      );
    }
  });

  it("never turns the monogram edge-on at any point in the drift cycle", () => {
    let worstYaw = 0;

    for (let elapsed = 0; elapsed <= 600; elapsed += 0.05) {
      const yaw =
        VOXEL_IDENTITY_ORIENTATION.yaw + voxelIdleDrift(elapsed).yaw;
      worstYaw = Math.max(worstYaw, Math.abs(toDegrees(yaw)));
    }

    // Edge-on is 90°; the extrusion stops reading well before that.
    expect(worstYaw).toBeLessThan(30);
  });

  it("never leaves the scene visibly frozen", () => {
    const step = 0.05;
    let stillSeconds = 0;
    let longestStill = 0;

    for (let elapsed = 0; elapsed <= 600; elapsed += step) {
      const from = voxelIdleDrift(elapsed);
      const to = voxelIdleDrift(elapsed + step);
      const speed =
        (Math.abs(to.yaw - from.yaw) + Math.abs(to.pitch - from.pitch)) / step;

      stillSeconds = toDegrees(speed) < 0.08 ? stillSeconds + step : 0;
      longestStill = Math.max(longestStill, stillSeconds);
    }

    expect(longestStill).toBeLessThan(0.5);
  });

  it("interpolates exact source and destination values", () => {
    expect(interpolate(-2, 6, 0)).toBe(-2);
    expect(interpolate(-2, 6, 1)).toBe(6);
    expect(interpolate(-2, 6, 0.5)).toBe(2);
  });

  it("caps hover and drag orbit even for escaped pointer coordinates", () => {
    expect(mapVoxelOrbit(8, -8)).toEqual({
      pitch: -VOXEL_ORBIT.hoverPitchRadians,
      yaw: VOXEL_ORBIT.hoverYawRadians,
    });
    expect(mapVoxelOrbit(-8, 8, true)).toEqual({
      pitch: VOXEL_ORBIT.dragPitchRadians,
      yaw: -VOXEL_ORBIT.dragYawRadians,
    });
  });

  it("uses frame-rate-independent damping and a strict settled threshold", () => {
    expect(dampingFactor(10, 0)).toBe(0);
    expect(dampingFactor(10, 1 / 30)).toBeGreaterThan(
      dampingFactor(10, 1 / 120),
    );
    expect(motionSettled({ pitch: 0, yaw: 0 }, { pitch: 0, yaw: 0 })).toBe(true);
    expect(
      motionSettled({ pitch: 0.01, yaw: 0 }, { pitch: 0, yaw: 0 }),
    ).toBe(false);
  });
});
