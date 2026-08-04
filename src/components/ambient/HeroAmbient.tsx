import {
  Component,
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ErrorInfo,
  type ReactNode,
  type RefObject,
} from "react";
import { isSaveData } from "@/lib/sceneCapability";
import AmbientFallback from "./AmbientFallback";

const AmbientCanvas = lazy(() => import("./AmbientCanvas"));

interface Props {
  /** The interactive WebGL stage owns pointer motion inside this rectangle. */
  excludeRef?: RefObject<HTMLElement>;
  className?: string;
}

interface BoundaryProps {
  children: ReactNode;
  onFail: () => void;
}

class AmbientBoundary extends Component<BoundaryProps, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(_error: Error, _info: ErrorInfo) {
    this.props.onFail();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function safeMedia(query: string): MediaQueryList | null {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return null;
  }
  try {
    return window.matchMedia(query);
  } catch {
    return null;
  }
}

function scheduleAfterPaint(callback: () => void): () => void {
  const idleWindow = window as Window & {
    requestIdleCallback?: (
      task: () => void,
      options?: { timeout: number },
    ) => number;
    cancelIdleCallback?: (handle: number) => void;
  };

  if (typeof idleWindow.requestIdleCallback === "function") {
    const handle = idleWindow.requestIdleCallback(callback, { timeout: 1800 });
    return () => idleWindow.cancelIdleCallback?.(handle);
  }

  const timer = window.setTimeout(callback, 680);
  return () => window.clearTimeout(timer);
}

/**
 * Hero-only ambient field: authored SVG synchronously, lazy canvas later.
 * It is decorative, pointer-transparent and independent of the WebGL scene.
 */
const HeroAmbient = ({ excludeRef, className = "" }: Props) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const [enhanced, setEnhanced] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  const handleReady = useCallback(() => setReady(true), []);

  const handleFail = useCallback(() => {
    setReady(false);
    setEnhanced(false);
    setFailed(true);
  }, []);

  const handleUnavailable = useCallback(() => {
    setReady(false);
    setEnhanced(false);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || failed) return;

    const reduceMotion = safeMedia("(prefers-reduced-motion: reduce)");
    // `any-*` keeps the live treatment available on hybrid laptops when a
    // mouse/trackpad is present even if the primary pointer is touch-first.
    const finePointer = safeMedia("(any-hover: hover) and (any-pointer: fine)");
    const connection = (
      navigator as Navigator & {
        connection?: {
          saveData?: boolean;
          addEventListener?: (type: string, listener: () => void) => void;
          removeEventListener?: (type: string, listener: () => void) => void;
        };
      }
    ).connection;
    let cancelUpgrade = () => undefined;

    const canEnhance = () =>
      !document.hidden &&
      !reduceMotion?.matches &&
      finePointer?.matches === true &&
      !isSaveData();

    const arm = () => {
      cancelUpgrade();
      if (!canEnhance()) {
        setReady(false);
        setEnhanced(false);
        return;
      }
      cancelUpgrade = scheduleAfterPaint(() => {
        if (canEnhance()) setEnhanced(true);
      });
    };

    arm();
    document.addEventListener("visibilitychange", arm);
    reduceMotion?.addEventListener("change", arm);
    finePointer?.addEventListener("change", arm);
    connection?.addEventListener?.("change", arm);

    return () => {
      cancelUpgrade();
      document.removeEventListener("visibilitychange", arm);
      reduceMotion?.removeEventListener("change", arm);
      finePointer?.removeEventListener("change", arm);
      connection?.removeEventListener?.("change", arm);
    };
  }, [failed]);

  const classes = [
    "pointer-events-none absolute inset-0 z-[1] overflow-hidden select-none",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={hostRef}
      className={classes}
      aria-hidden="true"
      data-hero-ambient="true"
      style={{ contain: "layout paint style" }}
    >
      <AmbientFallback live={ready} />
      {enhanced && !failed ? (
        <AmbientBoundary onFail={handleFail}>
          <Suspense fallback={null}>
            <AmbientCanvas
              hostRef={hostRef}
              excludeRef={excludeRef}
              onReady={handleReady}
              onFail={handleFail}
              onUnavailable={handleUnavailable}
            />
          </Suspense>
        </AmbientBoundary>
      ) : null}
    </div>
  );
};

export default HeroAmbient;
