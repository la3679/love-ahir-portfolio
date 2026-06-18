import { useId } from "react";
import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

type BrandLogoSize = "sm" | "md" | "lg" | "xl";
type BrandLogoVariant = "mark" | "lockup";

interface BrandLogoProps {
  size?: BrandLogoSize;
  variant?: BrandLogoVariant;
  animated?: boolean;
  className?: string;
  title?: string;
}

const sizeClasses: Record<BrandLogoSize, string> = {
  sm: "h-9 w-9",
  md: "h-12 w-12",
  lg: "h-20 w-20",
  xl: "h-28 w-28",
};

const prismVariants: Variants = {
  hidden: { opacity: 0, scale: 0.92, rotate: -3 },
  show: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
  },
};

const pathVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  show: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
};

/**
 * Aurora Prism: an original angular brand mark for the portfolio.
 * It hints at an upward path, precision, and a prism aperture without
 * relying on a plain monogram.
 */
export function BrandLogo({
  size = "md",
  variant = "mark",
  animated = false,
  className,
  title,
}: BrandLogoProps) {
  const rawId = useId().replace(/:/g, "");
  const edgeId = `aurora-prism-edge-${rawId}`;
  const coreId = `aurora-prism-core-${rawId}`;
  const glowId = `aurora-prism-glow-${rawId}`;
  const Svg = animated ? motion.svg : "svg";
  const Line = animated ? motion.path : "path";
  const ariaProps = title
    ? { role: "img", "aria-label": title }
    : { "aria-hidden": true };

  const mark = (
    <Svg
      viewBox="0 0 96 96"
      className={cn("shrink-0 overflow-visible", sizeClasses[size])}
      initial={animated ? "hidden" : undefined}
      animate={animated ? "show" : undefined}
      variants={animated ? prismVariants : undefined}
      {...ariaProps}
    >
      <defs>
        <linearGradient id={edgeId} x1="14" y1="10" x2="82" y2="86">
          <stop offset="0%" stopColor="hsl(var(--aurora-violet))" />
          <stop offset="54%" stopColor="hsl(var(--aurora-cyan))" />
          <stop offset="100%" stopColor="hsl(var(--aurora-magenta))" />
        </linearGradient>
        <linearGradient id={coreId} x1="26" y1="20" x2="70" y2="78">
          <stop offset="0%" stopColor="hsl(var(--foreground))" stopOpacity="0.96" />
          <stop offset="100%" stopColor="hsl(var(--foreground))" stopOpacity="0.52" />
        </linearGradient>
        <filter id={glowId} x="-45%" y="-45%" width="190%" height="190%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="0 0 0 0 0.62 0 0 0 0 0.42 0 0 0 0 1 0 0 0 0.6 0"
          />
          <feBlend in="SourceGraphic" mode="screen" />
        </filter>
      </defs>

      <circle
        cx="48"
        cy="48"
        r="43"
        fill="hsl(var(--card) / 0.62)"
        stroke="hsl(var(--border) / 0.78)"
        strokeWidth="1"
      />
      <path
        d="M48 9 84 29 84 68 48 88 12 68 12 29 48 9Z"
        fill="hsl(var(--background) / 0.18)"
        stroke={`url(#${edgeId})`}
        strokeWidth="2.4"
        filter={`url(#${glowId})`}
      />
      <path
        d="M28 66 47 24 68 66H55L48 48 40 66H28Z"
        fill={`url(#${coreId})`}
        opacity="0.92"
      />
      <path
        d="M39 66 59 66 48 43 39 66Z"
        fill="hsl(var(--background) / 0.9)"
        opacity="0.78"
      />
      <Line
        d="M25 72C37 57 47 47 72 27"
        fill="none"
        stroke={`url(#${edgeId})`}
        strokeLinecap="round"
        strokeWidth="3.2"
        variants={animated ? pathVariants : undefined}
      />
      <path
        d="M70 27 72 39 61 34Z"
        fill="hsl(var(--aurora-cyan))"
        opacity="0.9"
      />
      <circle cx="48" cy="48" r="4" fill="hsl(var(--aurora-cyan))" opacity="0.9" />
    </Svg>
  );

  if (variant === "mark") {
    return <span className={cn("inline-flex items-center", className)}>{mark}</span>;
  }

  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      {mark}
      <span className="leading-none">
        <span className="block font-display text-base font-bold text-gradient">
          Love Ahir
        </span>
        <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
          Aurora Prism
        </span>
      </span>
    </span>
  );
}

export default BrandLogo;
