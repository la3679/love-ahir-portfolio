/**
 * Capability gating for the shared spatial scene (IMPLEMENTATION.md §31.7).
 *
 * This module is deliberately free of any `three` / `@react-three/fiber`
 * import. It ships in the main bundle and decides whether the WebGL chunk is
 * ever requested, so importing a 3D library here would defeat the entire
 * performance architecture.
 *
 * Everything is guarded for jsdom and for older browsers: a missing
 * `matchMedia`, a missing `navigator.connection`, or a WebGL probe that throws
 * all resolve to the static experience rather than to an exception.
 */

export type SceneMode = "static" | "webgl";

function media(query: string): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  try {
    return window.matchMedia(query).matches;
  } catch {
    return false;
  }
}

/** True when the visitor has asked the OS to reduce motion. */
export function prefersReducedMotion(): boolean {
  return media("(prefers-reduced-motion: reduce)");
}

/** True on touch-first devices, where the pointer parallax is meaningless. */
export function isCoarsePointer(): boolean {
  return media("(pointer: coarse)");
}

/**
 * True when the visitor has switched on Data Saver. Non-standard and absent in
 * Safari and Firefox, so a missing value is treated as "not enabled".
 */
export function isSaveData(): boolean {
  if (typeof navigator === "undefined") return false;
  const connection = (
    navigator as Navigator & { connection?: { saveData?: boolean } }
  ).connection;
  return connection?.saveData === true;
}

let webGlSupport: boolean | null = null;

/**
 * Probe for a usable WebGL context, once per page load.
 *
 * The throwaway canvas is explicitly released: some drivers cap the number of
 * live contexts, and leaking one here could starve the real scene.
 */
export function hasWebGl(): boolean {
  if (webGlSupport !== null) return webGlSupport;
  if (typeof document === "undefined") {
    webGlSupport = false;
    return webGlSupport;
  }

  try {
    const canvas = document.createElement("canvas");
    const context =
      canvas.getContext("webgl2") ??
      canvas.getContext("webgl") ??
      canvas.getContext("experimental-webgl");
    webGlSupport = Boolean(context);

    if (context && "getExtension" in context) {
      // Hand the context back immediately rather than waiting for GC.
      (context as WebGLRenderingContext)
        .getExtension("WEBGL_lose_context")
        ?.loseContext();
    }
  } catch {
    webGlSupport = false;
  }

  return webGlSupport;
}

/** Test seam — resets the memoised probe between cases. */
export function resetWebGlProbe(): void {
  webGlSupport = null;
}

/**
 * The single decision point.
 *
 * Any one of these routes the visitor to the polished static composition, and
 * the WebGL chunk is then never requested at all — the fallback is a designed
 * end state, not an error state, so nothing is reported to the visitor.
 */
export function decideSceneMode(): SceneMode {
  if (prefersReducedMotion()) return "static";
  // Touch-first/coarse devices receive the authored SVG end state. Loading a
  // 220 kB WebGL chunk for pointer proximity that cannot be used would spend
  // battery and bandwidth without adding information.
  if (isCoarsePointer()) return "static";
  if (isSaveData()) return "static";
  if (!hasWebGl()) return "static";
  return "webgl";
}
