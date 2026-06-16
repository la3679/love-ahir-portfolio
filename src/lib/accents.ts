/**
 * Static Tailwind class maps for the aurora accent palette.
 * Kept as full literal strings so Tailwind's JIT scanner can see them
 * (never build class names with string interpolation).
 */
export type AccentKey = "violet" | "cyan" | "magenta" | "emerald";

export interface AccentClasses {
  text: string;
  bg: string;
  softBg: string;
  border: string;
  dot: string;
  glow: string;
  gradient: string;
}

export const accents: Record<AccentKey, AccentClasses> = {
  violet: {
    text: "text-aurora-violet",
    bg: "bg-aurora-violet",
    softBg: "bg-aurora-violet/10",
    border: "border-aurora-violet/30",
    dot: "bg-aurora-violet",
    glow: "group-hover:shadow-[0_0_36px_-8px_hsl(var(--aurora-violet)/0.6)]",
    gradient: "from-aurora-violet/25 to-transparent",
  },
  cyan: {
    text: "text-aurora-cyan",
    bg: "bg-aurora-cyan",
    softBg: "bg-aurora-cyan/10",
    border: "border-aurora-cyan/30",
    dot: "bg-aurora-cyan",
    glow: "group-hover:shadow-[0_0_36px_-8px_hsl(var(--aurora-cyan)/0.6)]",
    gradient: "from-aurora-cyan/25 to-transparent",
  },
  magenta: {
    text: "text-aurora-magenta",
    bg: "bg-aurora-magenta",
    softBg: "bg-aurora-magenta/10",
    border: "border-aurora-magenta/30",
    dot: "bg-aurora-magenta",
    glow: "group-hover:shadow-[0_0_36px_-8px_hsl(var(--aurora-magenta)/0.6)]",
    gradient: "from-aurora-magenta/25 to-transparent",
  },
  emerald: {
    text: "text-aurora-emerald",
    bg: "bg-aurora-emerald",
    softBg: "bg-aurora-emerald/10",
    border: "border-aurora-emerald/30",
    dot: "bg-aurora-emerald",
    glow: "group-hover:shadow-[0_0_36px_-8px_hsl(var(--aurora-emerald)/0.6)]",
    gradient: "from-aurora-emerald/25 to-transparent",
  },
};

export function getAccent(key: AccentKey): AccentClasses {
  return accents[key];
}
