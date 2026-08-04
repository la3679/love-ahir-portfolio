import { describe, expect, it } from "vitest";
import {
  VOXEL_MORPH_DURATION_MS,
  VOXEL_ORBIT,
  dampingFactor,
  easeInOutExpo,
  interpolate,
  mapVoxelOrbit,
  motionSettled,
} from "./sceneMotion";

describe("voxel formation motion", () => {
  it("uses a deliberate one-second morph rather than a perpetual tween", () => {
    expect(VOXEL_MORPH_DURATION_MS).toBeGreaterThanOrEqual(900);
    expect(VOXEL_MORPH_DURATION_MS).toBeLessThanOrEqual(1200);
  });

  it("returns exact easing endpoints and stays monotonic", () => {
    expect(easeInOutExpo(-1)).toBe(0);
    expect(easeInOutExpo(0)).toBe(0);
    expect(easeInOutExpo(1)).toBe(1);
    expect(easeInOutExpo(2)).toBe(1);

    const samples = Array.from({ length: 101 }, (_, index) =>
      easeInOutExpo(index / 100),
    );
    for (let index = 1; index < samples.length; index += 1) {
      expect(samples[index]).toBeGreaterThanOrEqual(samples[index - 1]);
    }
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
