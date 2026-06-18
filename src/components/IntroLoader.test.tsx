import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import IntroLoader from "./IntroLoader";

describe("<IntroLoader />", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    sessionStorage.clear();
  });

  it("shows once, marks the session, and dismisses itself", async () => {
    render(<IntroLoader />);

    expect(screen.getByRole("status")).toHaveAccessibleName(
      "Loading Love Ahir portfolio",
    );
    expect(sessionStorage.getItem("love-ahir-intro-seen")).toBe("true");

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1550);
    });

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("does not render when the session has already seen it", () => {
    sessionStorage.setItem("love-ahir-intro-seen", "true");

    render(<IntroLoader />);

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("uses the short reduced-motion timeout", async () => {
    vi.spyOn(window, "matchMedia").mockImplementation((query: string) => ({
      matches: query.includes("prefers-reduced-motion"),
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    render(<IntroLoader />);
    expect(screen.getByRole("status")).toBeInTheDocument();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(180);
    });

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});
