import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("framer-motion", async () => {
  const React = await import("react");
  const make = (tag: string) =>
    React.forwardRef((props: Record<string, unknown>, ref) => {
      const clean = { ...props };
      for (const k of [
        "initial",
        "animate",
        "whileInView",
        "variants",
        "transition",
        "viewport",
        "layout",
      ])
        delete clean[k];
      return React.createElement(tag, { ...clean, ref });
    });
  return { motion: new Proxy({}, { get: (_t, tag: string) => make(tag) }) };
});

import Hero from "./Hero";
import { profile, stats } from "@/data/portfolio";

describe("<Hero />", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("renders the name and primary call to action", () => {
    render(<Hero />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Ahir");
    expect(
      screen.getByRole("button", { name: /explore my work/i }),
    ).toBeInTheDocument();
  });

  it("exposes social links and a resume link", () => {
    render(<Hero />);
    expect(screen.getByLabelText("GitHub")).toHaveAttribute("href", profile.github);
    expect(screen.getByLabelText("LinkedIn")).toHaveAttribute("href", profile.linkedin);
    const resume = screen.getByRole("link", { name: /resume/i });
    expect(resume).toHaveAttribute("href", profile.resumeUrl);
  });

  it("shows the headline stats", () => {
    render(<Hero />);
    expect(screen.getByText(stats[0].value)).toBeInTheDocument();
  });
});
