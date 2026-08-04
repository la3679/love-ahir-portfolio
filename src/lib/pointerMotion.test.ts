import { describe, expect, it } from "vitest";
import { mapPointerDepth } from "./pointerMotion";

const rect = { left: 100, top: 50, width: 400, height: 600 };

describe("pointer depth mapping", () => {
  it("keeps both surfaces neutral at their centre", () => {
    for (const surface of ["stage", "portrait"] as const) {
      const motion = mapPointerDepth(300, 350, rect, surface);
      expect(motion.rotateX).toBeCloseTo(0);
      expect(motion.rotateY).toBeCloseTo(0);
      expect(motion.translateX).toBeCloseTo(0);
      expect(motion.translateY).toBeCloseTo(0);
    }
  });

  it("gives the portrait a clearly perceptible but bounded response", () => {
    const topRight = mapPointerDepth(500, 50, rect, "portrait");
    expect(topRight.rotateX).toBe(5);
    expect(topRight.rotateY).toBe(6);
    expect(Math.abs(topRight.rotateZ)).toBeLessThanOrEqual(0.6);
    expect(topRight.translateX).toBe(4);
    expect(topRight.translateY).toBe(-3);
    expect(topRight.scale).toBe(1.015);
  });

  it("keeps the stage response secondary to the field parallax", () => {
    const bottomLeft = mapPointerDepth(100, 650, rect, "stage");
    expect(bottomLeft.rotateX).toBe(-1.6);
    expect(bottomLeft.rotateY).toBe(-2.2);
    expect(bottomLeft.translateX).toBe(-5);
    expect(bottomLeft.translateY).toBe(4);
    expect(bottomLeft.scale).toBe(1.004);
  });

  it("clamps coordinates outside the surface to the approved limits", () => {
    const motion = mapPointerDepth(5000, -5000, rect, "portrait");
    expect(motion.rotateX).toBe(5);
    expect(motion.rotateY).toBe(6);
    expect(motion.translateX).toBe(4);
    expect(motion.translateY).toBe(-3);
  });

  it("returns a neutral result for a zero-sized surface", () => {
    expect(
      mapPointerDepth(0, 0, { left: 0, top: 0, width: 0, height: 0 }, "stage"),
    ).toEqual({
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      translateX: 0,
      translateY: 0,
      scale: 1,
    });
  });
});
