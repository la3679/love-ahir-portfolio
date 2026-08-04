import { useReducedMotion } from "framer-motion";

/**
 * Motion system for the Warm Systems Editorial design.
 *
 * Two hard rules, both learned from defects measured on the previous system:
 *
 * 1. **Content is never opacity-gated — anywhere.** Above the fold, content
 *    renders visible in markup and is enhanced only by the CSS `.rise-in`
 *    class, which animates transform alone. Framer Motion writes inline
 *    styles from JS, so `initial="hidden"` on a hero meant the H1 sat at
 *    `opacity: 0` until rAF ran — which never happens in a background tab.
 *    The guarantee this buys, stated exactly: critical content is visible
 *    immediately once React mounts, even when Framer/rAF does not advance or
 *    the tab is in the background. It is not protection against application
 *    JavaScript failing outright — index.html ships an empty #root, so
 *    nothing renders before mount.
 *
 *    Gate 3 extends the same rule below the fold. The scroll reveal used to
 *    animate `opacity: 0 → 1`, which left every section past the first screen
 *    invisible whenever the IntersectionObserver callback or rAF did not run.
 *    `riseUp` is now transform-only, so a reveal that never fires costs a
 *    16px offset rather than the content itself.
 *
 * 2. **Reduced motion is honoured in JS, not just CSS.** The global
 *    `prefers-reduced-motion` block in index.css only neutralises CSS
 *    animation and transition durations; it has no effect on Framer's
 *    JS-driven inline styles. Components therefore route through `useReveal()`.
 *
 * Entrances run once, are short, and animate transform only. Nothing loops.
 */

/**
 * The shared reveal variant. Transform-only by design — adding `opacity` here
 * would re-introduce the defect described in rule 1 for every section that
 * uses it.
 */
export const riseUp = {
  hidden: { y: 16 },
  show: {
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

/** Standard once-only viewport config for whileInView reveals. */
export const viewportOnce = { once: true, margin: "-60px" } as const;

/**
 * Props for a below-the-fold reveal that degrades safely.
 *
 * When the user prefers reduced motion this returns the settled state with no
 * variants at all, so Framer renders the content immediately rather than
 * animating it quickly. Use for content below the fold only — above-the-fold
 * content should not be gated on animation in the first place.
 */
export function useReveal() {
  const reduced = useReducedMotion();

  if (reduced) {
    return {
      initial: false as const,
      animate: "show" as const,
      variants: undefined,
      viewport: undefined,
      whileInView: undefined,
    };
  }

  return {
    initial: "hidden" as const,
    whileInView: "show" as const,
    viewport: viewportOnce,
    variants: riseUp,
    animate: undefined,
  };
}

/**
 * Container variant for staggering a group of `useReveal()` children.
 * Returns a no-op container under reduced motion.
 */
export function useRevealGroup() {
  const reduced = useReducedMotion();

  if (reduced) {
    return { initial: false as const, animate: "show" as const, variants: undefined };
  }

  return {
    initial: "hidden" as const,
    whileInView: "show" as const,
    viewport: viewportOnce,
    variants: stagger,
  };
}

/**
 * Staggered CSS delay for first-paint-safe hero entrances.
 * Pairs with the `.rise-in` class, which animates transform only — so the
 * delay can never leave content invisible.
 */
export function riseDelay(index: number): { animationDelay: string } {
  return { animationDelay: `${index * 60}ms` };
}
