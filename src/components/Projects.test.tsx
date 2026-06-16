import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Render framer-motion components as plain host elements so filtering is
// deterministic (no async enter/exit animations) in jsdom.
vi.mock("framer-motion", async () => {
  const React = await import("react");
  const MOTION_PROPS = [
    "initial",
    "animate",
    "exit",
    "whileInView",
    "whileHover",
    "whileTap",
    "variants",
    "transition",
    "viewport",
    "layout",
  ];
  const make = (tag: string) =>
    React.forwardRef((props: Record<string, unknown>, ref) => {
      const clean: Record<string, unknown> = { ...props };
      for (const k of MOTION_PROPS) delete clean[k];
      return React.createElement(tag, { ...clean, ref });
    });
  const motion = new Proxy(
    {},
    { get: (_t, tag: string) => make(tag) },
  );
  return {
    motion,
    AnimatePresence: ({ children }: { children: React.ReactNode }) =>
      React.createElement(React.Fragment, null, children),
  };
});

import Projects from "./Projects";
import { projects, filterProjects } from "@/data/portfolio";

const publications = filterProjects(projects, "Publication").length;

describe("<Projects />", () => {
  it("renders all projects initially", () => {
    render(<Projects />);
    expect(screen.getAllByText("View project")).toHaveLength(projects.length);
  });

  it("renders a filter button for every category", () => {
    render(<Projects />);
    expect(screen.getByRole("button", { name: /^All/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Publication/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Web App/ })).toBeInTheDocument();
  });

  it("narrows the grid when a category filter is selected", async () => {
    const user = userEvent.setup();
    render(<Projects />);

    await user.click(screen.getByRole("button", { name: /Publication/ }));

    expect(screen.getAllByText("View project")).toHaveLength(publications);
    expect(
      screen.getByText("Privacy Policies vs. the Logs"),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("VidKing — AI Streaming Platform"),
    ).not.toBeInTheDocument();
  });

  it("marks the active filter via aria-pressed", async () => {
    const user = userEvent.setup();
    render(<Projects />);
    const webApp = screen.getByRole("button", { name: /Web App/ });
    await user.click(webApp);
    expect(webApp).toHaveAttribute("aria-pressed", "true");
  });
});
