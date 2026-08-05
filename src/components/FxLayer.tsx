import { useRef } from "react";
import ConstellationField from "./fx/ConstellationField";
import VoxelField from "./fx/VoxelField";
import { FX_MODE } from "@/lib/fxMode";

/**
 * The site-wide FX plane: five decorative layers, one canvas, one loop.
 *
 * Depth is built from separate planes rather than one busy texture — the live
 * canvas field, a blurred colour mesh, an engineered grid that dissolves
 * downward, three drifting orbs and a noise wash that kills gradient banding.
 * Only the canvas costs an animation frame; everything else is CSS.
 *
 * The canvas renderer is selected by `FX_MODE` (src/lib/fxMode.ts). The two
 * renderers are independent siblings that share nothing but this shell and the
 * pointer bus, so either can be removed without disturbing the other.
 *
 * The whole layer is `aria-hidden`, fixed, and pointer-transparent, so it can
 * never capture input or contribute to the accessibility tree. Content sits
 * above it at `z-index: 1`.
 */
const FxLayer = () => {
  const hostRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={hostRef}
      className="fx"
      aria-hidden="true"
      data-fx-layer="true"
      data-fx-mode={FX_MODE}
    >
      {FX_MODE === "voxel" ? (
        <VoxelField hostRef={hostRef} />
      ) : (
        <ConstellationField hostRef={hostRef} />
      )}
      <div className="fx__mesh" data-scroll-depth="-0.04" />
      <div className="fx__grid" />
      <div className="fx__orbs" data-scroll-depth="-0.02">
        <div className="orb orb--1" />
        <div className="orb orb--2" />
        <div className="orb orb--3" />
      </div>
      <div className="fx__noise" />
    </div>
  );
};

export default FxLayer;
