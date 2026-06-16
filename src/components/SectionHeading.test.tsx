import { describe, it, expect, vi } from "vitest";
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

import SectionHeading from "./SectionHeading";

describe("<SectionHeading />", () => {
  it("renders eyebrow, title and description", () => {
    render(
      <SectionHeading
        eyebrow="About"
        title="My Title"
        description="My description"
      />,
    );
    expect(screen.getByText("About")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "My Title" }),
    ).toBeInTheDocument();
    expect(screen.getByText("My description")).toBeInTheDocument();
  });

  it("omits the description when not provided", () => {
    render(<SectionHeading eyebrow="X" title="Only Title" />);
    expect(screen.getByRole("heading", { name: "Only Title" })).toBeInTheDocument();
    expect(screen.queryByText("My description")).not.toBeInTheDocument();
  });
});
