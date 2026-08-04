import { cn } from "@/lib/utils";
import markGeometry from "@/lib/brandMark.json";

type BrandLogoSize = "sm" | "md" | "lg" | "xl";
type BrandLogoVariant = "mark" | "lockup";
/**
 * `auto` follows the current theme via currentColor.
 * `brand` paints the ember accent. `mono` inherits from the parent, which is
 * how the reversed / dark-mono / light-mono applications are produced —
 * one geometry, recoloured by context rather than redrawn.
 */
type BrandLogoTone = "brand" | "mono";

interface BrandLogoProps {
  size?: BrandLogoSize;
  variant?: BrandLogoVariant;
  tone?: BrandLogoTone;
  /** Renders the thickened 16px-optimised shape set. */
  compact?: boolean;
  className?: string;
  /** Accessible name. Omit for decorative use next to visible text. */
  title?: string;
}

const sizeClasses: Record<BrandLogoSize, string> = {
  sm: "h-8 w-8",
  md: "h-11 w-11",
  lg: "h-16 w-16",
  xl: "h-24 w-24",
};

type Shape =
  | { kind: "rect"; x: number; y: number; w: number; h: number; r: number }
  | { kind: "path"; d: string };

/**
 * Layer Seam — the portfolio's brand mark.
 *
 * An LA monogram: an L stem and foot carrying an A chevron, read as two
 * stacked planes meeting at a seam. Deliberately flat — no gradients, no
 * filters, no interior detail — so it survives a 16px favicon and prints in
 * one colour. All coordinates come from `src/lib/brandMark.json`, the single
 * geometry source shared with `scripts/generate-brand-assets.py`.
 *
 * What that guarantees: the component and the rasteriser read the same
 * numbers, and `BrandLogo.test.tsx` fails if the SVG `d` and the polygon
 * points for a variant disagree. What it does NOT guarantee: that the PNG/ICO
 * files in `public/` were re-rendered after the geometry last changed. The
 * rasters are committed build output; run the script by hand after any edit
 * to the geometry.
 */
export function BrandLogo({
  size = "md",
  variant = "mark",
  tone = "brand",
  compact = false,
  className,
  title,
}: BrandLogoProps) {
  const shapes = (
    compact ? markGeometry.shapes.compact : markGeometry.shapes.regular
  ) as Shape[];
  const fill = tone === "brand" ? "hsl(var(--primary))" : "currentColor";
  const ariaProps = title
    ? { role: "img" as const, "aria-label": title }
    : { "aria-hidden": true as const };

  const mark = (
    <svg
      viewBox={`0 0 ${markGeometry.viewBox} ${markGeometry.viewBox}`}
      className={cn("shrink-0", sizeClasses[size])}
      {...ariaProps}
    >
      <g fill={fill}>
        {shapes.map((shape, i) =>
          shape.kind === "rect" ? (
            <rect
              key={i}
              x={shape.x}
              y={shape.y}
              width={shape.w}
              height={shape.h}
              rx={shape.r}
            />
          ) : (
            <path key={i} d={shape.d} />
          ),
        )}
      </g>
    </svg>
  );

  if (variant === "mark") {
    return <span className={cn("inline-flex items-center", className)}>{mark}</span>;
  }

  // The wordmark stays real text — selectable, translatable, and readable by
  // assistive technology. It is never converted to outlined paths.
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      {mark}
      <span className="font-display text-base font-bold leading-none tracking-tight text-foreground">
        Love Ahir
      </span>
    </span>
  );
}

export default BrandLogo;
