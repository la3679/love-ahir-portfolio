export interface TypingState {
  text: string;
  wordIndex: number;
  phase: "typing" | "pausing" | "deleting";
}

/**
 * Pure state transition for the typewriter effect. No timers, no DOM —
 * one call advances the animation by a single step so the logic stays
 * fully unit-testable.
 */
export function nextTypingState(
  state: TypingState,
  words: string[],
): TypingState {
  const current = words[state.wordIndex] ?? "";

  if (state.phase === "typing") {
    if (state.text.length < current.length) {
      return { ...state, text: current.slice(0, state.text.length + 1) };
    }
    return { ...state, phase: "pausing" };
  }

  if (state.phase === "pausing") {
    return { ...state, phase: "deleting" };
  }

  // deleting
  if (state.text.length > 0) {
    return { ...state, text: state.text.slice(0, -1) };
  }
  return {
    text: "",
    phase: "typing",
    wordIndex: words.length ? (state.wordIndex + 1) % words.length : 0,
  };
}
