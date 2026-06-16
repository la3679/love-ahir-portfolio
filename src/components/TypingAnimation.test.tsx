import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import TypingAnimation from "./TypingAnimation";
import { nextTypingState, type TypingState } from "@/lib/typing";

describe("nextTypingState (pure reducer)", () => {
  const words = ["Hi", "Yo"];

  it("types one character at a time while typing", () => {
    const start: TypingState = { text: "", wordIndex: 0, phase: "typing" };
    const next = nextTypingState(start, words);
    expect(next.text).toBe("H");
    expect(next.phase).toBe("typing");
  });

  it("switches to pausing once the word is fully typed", () => {
    const full: TypingState = { text: "Hi", wordIndex: 0, phase: "typing" };
    expect(nextTypingState(full, words).phase).toBe("pausing");
  });

  it("moves from pausing to deleting", () => {
    const paused: TypingState = { text: "Hi", wordIndex: 0, phase: "pausing" };
    expect(nextTypingState(paused, words).phase).toBe("deleting");
  });

  it("deletes one character at a time", () => {
    const del: TypingState = { text: "Hi", wordIndex: 0, phase: "deleting" };
    expect(nextTypingState(del, words).text).toBe("H");
  });

  it("advances to the next word and wraps around", () => {
    const empty: TypingState = { text: "", wordIndex: 0, phase: "deleting" };
    const next = nextTypingState(empty, words);
    expect(next.wordIndex).toBe(1);
    expect(next.phase).toBe("typing");

    const last: TypingState = { text: "", wordIndex: 1, phase: "deleting" };
    expect(nextTypingState(last, words).wordIndex).toBe(0);
  });
});

describe("<TypingAnimation />", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("progressively types the first word", () => {
    render(<TypingAnimation words={["React"]} typeSpeed={50} />);
    act(() => {
      vi.advanceTimersByTime(50 * 5);
    });
    expect(screen.getByText(/React/)).toBeInTheDocument();
  });
});
