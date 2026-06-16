import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

/**
 * Accessible light/dark switch wired into next-themes. Renders a single
 * button that flips the active theme; the sun/moon crossfade is driven by
 * the `.dark` class so it stays in sync with the global theme transition.
 *
 * Guards against hydration mismatch by only resolving the icon after mount.
 */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";
  const next = isDark ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={mounted ? `Switch to ${next} mode` : "Toggle theme"}
      title={mounted ? `Switch to ${next} mode` : "Toggle theme"}
      className={`relative grid h-10 w-10 place-items-center rounded-lg border border-border bg-card/40 text-muted-foreground backdrop-blur transition-colors hover:border-aurora-violet/50 hover:text-foreground ${className}`}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}

export default ThemeToggle;
