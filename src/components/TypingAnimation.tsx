import { useEffect, useState } from "react";
import { nextTypingState, type TypingState } from "@/lib/typing";

export type { TypingState };
export { nextTypingState };

interface TypingAnimationProps {
  words: string[];
  typeSpeed?: number;
  deleteSpeed?: number;
  pause?: number;
}

const TypingAnimation = ({
  words,
  typeSpeed = 110,
  deleteSpeed = 55,
  pause = 1600,
}: TypingAnimationProps) => {
  const [state, setState] = useState<TypingState>({
    text: "",
    wordIndex: 0,
    phase: "typing",
  });

  useEffect(() => {
    const delay =
      state.phase === "pausing"
        ? pause
        : state.phase === "deleting"
          ? deleteSpeed
          : typeSpeed;

    const timer = setTimeout(() => {
      setState((prev) => nextTypingState(prev, words));
    }, delay);

    return () => clearTimeout(timer);
  }, [state, words, typeSpeed, deleteSpeed, pause]);

  return (
    <span className="text-aurora font-semibold">
      {state.text}
      <span className="ml-0.5 inline-block h-[1em] w-px animate-blink bg-aurora-cyan align-middle" />
    </span>
  );
};

export default TypingAnimation;
