import { RefreshCw } from "lucide-react";
import {
  Component,
  Fragment,
  Suspense,
  lazy,
  useEffect,
  useState,
  type ErrorInfo,
  type ReactNode,
} from "react";
import { useTranslation } from "react-i18next";
import {
  decideSceneMode,
  isCoarsePointer,
  prefersReducedMotion,
} from "@/lib/sceneCapability";
import LatticeFallback from "./LatticeFallback";
import { useLattice } from "./latticeState";
import {
  DEFAULT_VOXEL_FORMATION,
  VOXEL_FORMATION_SEQUENCE,
  type VoxelFormationId,
} from "./voxelFormationSpec";

/**
 * Lazy enhancement boundary for the warm voxel stage.
 *
 * A complete SVG monogram renders synchronously. WebGL is requested only
 * after first paint when every capability gate passes. The adjacent control
 * remains keyboard and touch operable even when the static fallback is
 * permanent.
 */
const loadLatticeScene = () => import("./LatticeScene");
const LatticeScene = lazy(loadLatticeScene);

const SECTION_OPACITY: Record<string, number> = {
  hero: 1,
  proof: 0.82,
  about: 0,
  experience: 0,
  projects: 0,
  calm: 0,
};

const AUTO_MORPH_DELAY_MS = 5200;
const AUTO_MORPH_STEP_LIMIT = VOXEL_FORMATION_SEQUENCE.length;

const FORMATION_LABEL_KEYS: Record<
  VoxelFormationId,
  | "hero.formation.identity"
  | "hero.formation.architecture"
  | "hero.formation.throughput"
> = {
  identity: "hero.formation.identity",
  architecture: "hero.formation.architecture",
  throughput: "hero.formation.throughput",
};

function whenIdle(callback: () => void): () => void {
  if (typeof window === "undefined") return () => undefined;

  const idleWindow = window as Window & {
    requestIdleCallback?: (
      cb: () => void,
      options?: { timeout: number },
    ) => number;
    cancelIdleCallback?: (handle: number) => void;
  };

  if (typeof idleWindow.requestIdleCallback === "function") {
    const handle = idleWindow.requestIdleCallback(callback, { timeout: 2500 });
    return () => idleWindow.cancelIdleCallback?.(handle);
  }

  const timer = window.setTimeout(callback, 1200);
  return () => window.clearTimeout(timer);
}

function nextVoxelFormation(
  current: VoxelFormationId,
): VoxelFormationId {
  const index = VOXEL_FORMATION_SEQUENCE.indexOf(current);
  return VOXEL_FORMATION_SEQUENCE[(index + 1) % VOXEL_FORMATION_SEQUENCE.length];
}

interface BoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
  onFail: () => void;
}

class SceneBoundary extends Component<
  BoundaryProps,
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(_error: Error, _info: ErrorInfo) {
    this.props.onFail();
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

const SystemsLattice = () => {
  const { t } = useTranslation();
  const { section, activeLayer, emphasis } = useLattice();
  const [enhanced, setEnhanced] = useState(false);
  const [coarse, setCoarse] = useState(false);
  const [pageVisible, setPageVisible] = useState(
    () => typeof document === "undefined" || !document.hidden,
  );
  const [reducedMotion, setReducedMotion] = useState(prefersReducedMotion);
  const [formation, setFormation] = useState<VoxelFormationId>(
    DEFAULT_VOXEL_FORMATION,
  );
  const [autoMorphSteps, setAutoMorphSteps] = useState(0);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches);
      if (event.matches) {
        setEnhanced(false);
        setFormation(DEFAULT_VOXEL_FORMATION);
        setAutoMorphSteps(AUTO_MORPH_STEP_LIMIT);
      }
    };

    setReducedMotion(query.matches);
    query.addEventListener?.("change", onChange);
    return () => query.removeEventListener?.("change", onChange);
  }, []);

  useEffect(() => {
    setCoarse(isCoarsePointer());
    let cancelIdle = () => undefined;

    const armUpgrade = () => {
      const visible = !document.hidden;
      setPageVisible(visible);
      cancelIdle();
      if (reducedMotion || !visible || decideSceneMode() !== "webgl") {
        setEnhanced(false);
        return;
      }
      cancelIdle = whenIdle(() => {
        if (!document.hidden) setEnhanced(true);
      });
    };

    armUpgrade();
    document.addEventListener("visibilitychange", armUpgrade);
    return () => {
      cancelIdle();
      document.removeEventListener("visibilitychange", armUpgrade);
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (
      !enhanced ||
      reducedMotion ||
      autoMorphSteps >= AUTO_MORPH_STEP_LIMIT ||
      section !== "hero" ||
      !pageVisible
    ) {
      return;
    }
    const timer = window.setTimeout(() => {
      setFormation((current) => nextVoxelFormation(current));
      setAutoMorphSteps((current) => current + 1);
    }, AUTO_MORPH_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [autoMorphSteps, enhanced, formation, pageVisible, reducedMotion, section]);

  const base = SECTION_OPACITY[section] ?? 0;
  const opacity = Math.min(1, emphasis ? base + 0.12 : base);
  const accessibleName = t("hero.monogramAlt");
  const fallback = (
    <LatticeFallback
      section={section}
      activeLayer={activeLayer}
      coarse={coarse}
      formation={formation}
      accessibleName={accessibleName}
    />
  );
  const nextFormation = nextVoxelFormation(formation);
  const currentFormationLabel = t(FORMATION_LABEL_KEYS[formation]);

  return (
    <Fragment>
      <div
        data-scene-section={section}
        data-voxel-formation={formation}
        className="systems-observatory pointer-events-none select-none"
        style={{ opacity }}
      >
        {enhanced ? (
          <SceneBoundary fallback={fallback} onFail={() => setEnhanced(false)}>
            <Suspense fallback={fallback}>
              <LatticeScene
                section={section}
                activeLayer={activeLayer}
                coarse={coarse}
                formation={formation}
                accessibleName={accessibleName}
                motionAllowed={!reducedMotion && pageVisible}
                onFail={() => setEnhanced(false)}
              />
            </Suspense>
          </SceneBoundary>
        ) : (
          fallback
        )}
      </div>

      <div className="absolute bottom-14 right-4 z-30 flex max-w-[calc(100%-2rem)] flex-col items-end gap-1.5 sm:right-5">
        <button
          type="button"
          data-voxel-control
          data-voxel-state={formation}
          onClick={() => {
            setAutoMorphSteps(AUTO_MORPH_STEP_LIMIT);
            setFormation(nextFormation);
          }}
          aria-label={`${t("hero.transformScene")}: ${currentFormationLabel}`}
          title={`${t("hero.transformScene")}: ${currentFormationLabel}`}
          className="voxel-transform-control inline-flex min-h-11 min-w-11 items-center justify-center gap-2.5 rounded-full border border-border-bright/70 bg-background/80 px-3 font-mono text-[0.64rem] font-medium uppercase tracking-[0.14em] text-foreground shadow-sm backdrop-blur-sm transition-colors hover:border-primary/70 hover:text-primary"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          <span>{currentFormationLabel}</span>
          <span className="inline-flex gap-1" aria-hidden="true">
            {VOXEL_FORMATION_SEQUENCE.map((state) => (
              <span
                key={state}
                data-active={state === formation ? "true" : "false"}
                className={`h-1.5 w-1.5 rounded-full ${
                  state === formation ? "bg-signal" : "bg-muted-foreground/35"
                }`}
              />
            ))}
          </span>
        </button>
        <p className="rounded-full bg-background/70 px-2 py-1 text-right font-mono text-[0.58rem] leading-tight text-muted-foreground backdrop-blur-sm">
          {t("hero.sceneDisclaimer")}
        </p>
      </div>
      <span className="sr-only" role="status" aria-live="polite">
        {currentFormationLabel}
      </span>
    </Fragment>
  );
};

export default SystemsLattice;
