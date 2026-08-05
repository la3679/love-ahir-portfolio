import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import FxLayer from "./FxLayer";
import { FX_MODE } from "@/lib/fxMode";

/**
 * `FxLayer` is a shell: it owns the shared decorative planes and picks a
 * canvas renderer. The renderers are covered by their own suites in
 * `src/components/fx/`, so this file asserts only what the shell is
 * responsible for.
 */
describe("FxLayer", () => {
  it("renders the five inert depth planes", () => {
    const { container } = render(<FxLayer />);
    const layer = container.querySelector("[data-fx-layer]");

    expect(layer).toHaveClass("fx");
    expect(layer).toHaveAttribute("aria-hidden", "true");
    expect(layer?.querySelector(".fx__canvas")).toBeInTheDocument();
    expect(layer?.querySelector(".fx__mesh")).toBeInTheDocument();
    expect(layer?.querySelector(".fx__grid")).toBeInTheDocument();
    expect(layer?.querySelector(".fx__noise")).toBeInTheDocument();
    expect(layer?.querySelectorAll(".orb")).toHaveLength(3);
    expect(
      layer?.querySelectorAll('a,button,input,select,textarea,[tabindex="0"]'),
    ).toHaveLength(0);
  });

  it("gives the mesh and the orb group their own scroll-depth factors", () => {
    const { container } = render(<FxLayer />);
    expect(container.querySelector(".fx__mesh")).toHaveAttribute(
      "data-scroll-depth",
      "-0.04",
    );
    expect(container.querySelector(".fx__orbs")).toHaveAttribute(
      "data-scroll-depth",
      "-0.02",
    );
  });

  it("mounts exactly one canvas, selected by FX_MODE", () => {
    const { container } = render(<FxLayer />);
    const layer = container.querySelector("[data-fx-layer]");

    expect(layer).toHaveAttribute("data-fx-mode", FX_MODE);
    expect(layer?.querySelectorAll("canvas")).toHaveLength(1);

    const voxelCanvas = layer?.querySelector(".fx__canvas--voxel");
    if (FX_MODE === "voxel") expect(voxelCanvas).toBeInTheDocument();
    else expect(voxelCanvas).toBeNull();
  });
});
