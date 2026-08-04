import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import LatticeFallback from "./LatticeFallback";
import { VOXEL_COUNT, VOXEL_FORMATION_SPEC } from "./voxelFormationSpec";

describe("LatticeFallback", () => {
  it("renders the complete authored LA monogram on first paint", () => {
    const { container } = render(<LatticeFallback />);
    const svg = container.querySelector("svg");

    expect(svg).toHaveAttribute("data-voxel-density", "desktop");
    expect(svg).toHaveAttribute("data-voxel-formation", "identity");
    expect(svg).toHaveAccessibleName("Love Ahir monogram");
    expect(container.querySelectorAll("[data-voxel-id]")).toHaveLength(
      VOXEL_COUNT,
    );
    expect(container.querySelectorAll('[data-voxel-tone="front"]')).toHaveLength(
      VOXEL_FORMATION_SPEC.cells.filter((cell) => cell.tone === "front").length,
    );
  });

  it("retains the complete extruded monogram and halo on coarse devices", () => {
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
    const { container, rerender } = render(<LatticeFallback formation="architecture" />);
    expect(container.querySelector("svg")).toHaveAttribute(
      "data-voxel-formation",
      "architecture",
    );

    rerender(<LatticeFallback formation="throughput" />);
    expect(container.querySelector("svg")).toHaveAttribute(
      "data-voxel-formation",
      "throughput",
    );
    expect(container.querySelectorAll("[data-voxel-id]")).toHaveLength(
      VOXEL_COUNT,
    );
  });

  it("uses size and stroke weight as non-colour active-layer cues", () => {
    /*
      Compare one voxel against itself, selected and resting. Voxels carry very
      different base scales — a dust voxel is a fraction of a core one — so
      comparing the first voxel of two different layers measures the scale
      spread rather than the selection cue.
    */
    const { container, rerender } = render(<LatticeFallback activeLayer="data" />);
    const probe = container.querySelector('[data-voxel-layer="data"]');
    const id = probe?.getAttribute("data-voxel-id");
    expect(id).toBeTruthy();

    const selected = {
      width: Number(probe?.getAttribute("width")),
      stroke: Number(probe?.getAttribute("stroke-width")),
    };

    rerender(<LatticeFallback activeLayer={null} />);
    const same = container.querySelector(`[data-voxel-id="${id}"]`);
    const resting = {
      width: Number(same?.getAttribute("width")),
      stroke: Number(same?.getAttribute("stroke-width")),
    };

    expect(selected.width).toBeGreaterThan(resting.width);
    expect(selected.stroke).toBeGreaterThan(resting.stroke);
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
