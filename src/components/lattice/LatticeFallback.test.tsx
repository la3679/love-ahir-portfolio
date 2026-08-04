import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import LatticeFallback from "./LatticeFallback";
import { VOXEL_COUNT, VOXEL_FORMATION_SPEC } from "./voxelFormationSpec";

describe("LatticeFallback", () => {
  it("renders the complete authored mask on first paint", () => {
    const { container } = render(<LatticeFallback />);
    const svg = container.querySelector("svg");

    expect(svg).toHaveAttribute("data-voxel-density", "desktop");
    expect(svg).toHaveAttribute("data-voxel-formation", "mask");
    expect(container.querySelectorAll("[data-voxel-id]")).toHaveLength(
      VOXEL_COUNT,
    );
    expect(container.querySelectorAll('[data-voxel-tone="eye"]')).toHaveLength(
      VOXEL_FORMATION_SPEC.cells.filter((cell) => cell.tone === "eye").length,
    );
  });

  it("retains the complete dense mask and halo on coarse devices", () => {
    const { container } = render(<LatticeFallback coarse />);
    expect(container.querySelector("svg")).toHaveAttribute(
      "data-voxel-density",
      "coarse",
    );
    expect(container.querySelectorAll("[data-voxel-id]")).toHaveLength(
      VOXEL_COUNT,
    );
  });

  it("can show each deterministic formation without animation", () => {
    const { container, rerender } = render(<LatticeFallback formation="cloud" />);
    expect(container.querySelector("svg")).toHaveAttribute(
      "data-voxel-formation",
      "cloud",
    );

    rerender(<LatticeFallback formation="helix" />);
    expect(container.querySelector("svg")).toHaveAttribute(
      "data-voxel-formation",
      "helix",
    );
    expect(container.querySelectorAll("[data-voxel-id]")).toHaveLength(
      VOXEL_COUNT,
    );
  });

  it("uses size and stroke weight as non-colour active-layer cues", () => {
    const { container } = render(<LatticeFallback activeLayer="data" />);
    const selected = container.querySelector(
      '[data-voxel-layer="data"]',
    );
    const resting = container.querySelector(
      '[data-voxel-layer="interface"]',
    );

    expect(Number(selected?.getAttribute("width"))).toBeGreaterThan(
      Number(resting?.getAttribute("width")),
    );
    expect(Number(selected?.getAttribute("stroke-width"))).toBeGreaterThan(
      Number(resting?.getAttribute("stroke-width")),
    );
  });

  it("contains no external image, texture or hidden text", () => {
    const { container } = render(<LatticeFallback />);
    expect(container.querySelector("image")).toBeNull();
    expect(container.querySelector("text")).toBeNull();
    expect(container.querySelector("foreignObject")).toBeNull();
  });

  it("keeps settled sections visible as a quieter complete composition", () => {
    const { container } = render(<LatticeFallback section="calm" />);
    expect(container.querySelector("svg")).toHaveStyle({ opacity: "0.56" });
    expect(container.querySelectorAll("[data-voxel-id]")).toHaveLength(
      VOXEL_COUNT,
    );
  });
});
