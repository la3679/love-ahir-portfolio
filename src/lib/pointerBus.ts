/**
 * One pointer listener for the whole application.
 *
 * The FX constellation, the ambient parallax/aura layer and the delegated tilt
 * system all need the same pointer position. Before this module each of them
 * attached its own `pointermove` — three listeners plus one per depth surface.
 * Everything now subscribes here instead, so the document carries exactly one
 * passive `pointermove` no matter how many effects are mounted.
 *
 * The listener itself is attached lazily on the first subscription and removed
 * again when the last subscriber unmounts, so a page with no ambient effects
 * pays nothing.
 */

export interface PointerSample {
  clientX: number;
  clientY: number;
  /** The deepest element under the pointer, used for delegated hit-testing. */
  target: EventTarget | null;
  pointerType: string;
  /** False before the first move and after the pointer leaves the document. */
  active: boolean;
}

export type PointerListener = (sample: PointerSample) => void;

/**
 * Far enough off-screen that no repulsion radius or element rect can contain
 * it, so nothing jumps between mount and the reader's first movement.
 */
const OFFSCREEN = -9999;

const IDLE: PointerSample = {
  clientX: OFFSCREEN,
  clientY: OFFSCREEN,
  target: null,
  pointerType: "mouse",
  active: false,
};

const listeners = new Set<PointerListener>();
let sample: PointerSample = IDLE;
let attached = false;

function emit(next: PointerSample) {
  sample = next;
  for (const listener of listeners) listener(next);
}

function onPointerMove(event: PointerEvent) {
  emit({
    clientX: event.clientX,
    clientY: event.clientY,
    target: event.target,
    pointerType: event.pointerType,
    active: true,
  });
}

/**
 * `pointerout` fires on every element-to-element transition. Only the one that
 * carries no `relatedTarget` means the pointer actually left the document.
 */
function onPointerOut(event: PointerEvent) {
  if (event.relatedTarget) return;
  emit(IDLE);
}

function onBlur() {
  emit(IDLE);
}

function attach() {
  if (attached || typeof window === "undefined") return;
  window.addEventListener("pointermove", onPointerMove, { passive: true });
  window.addEventListener("pointerout", onPointerOut, { passive: true });
  window.addEventListener("blur", onBlur, { passive: true });
  attached = true;
}

function detach() {
  if (!attached) return;
  window.removeEventListener("pointermove", onPointerMove);
  window.removeEventListener("pointerout", onPointerOut);
  window.removeEventListener("blur", onBlur);
  attached = false;
  sample = IDLE;
}

/** Subscribe to pointer movement. Returns the unsubscribe function. */
export function subscribePointer(listener: PointerListener): () => void {
  listeners.add(listener);
  attach();

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) detach();
  };
}

/** The last known pointer position, for effects that mount mid-session. */
export function getPointerSample(): PointerSample {
  return sample;
}
