/**
 * The four conceptual system layers of the shared scene.
 *
 * Kept in a module of its own so `latticeState.ts` exports hooks and types
 * only — a file that mixes component and constant exports breaks React Fast
 * Refresh, which is what `react-refresh/only-export-components` warns about.
 *
 * These map to verified technologies across Love's work (IMPLEMENTATION.md
 * §31.4). They describe capability areas, never a claim that a personal
 * project was built for an employer.
 */
export const SYSTEM_LAYERS = ["interface", "services", "data", "systems"] as const;

export type SystemLayer = (typeof SYSTEM_LAYERS)[number];
