import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";

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
  return {
    motion: new Proxy({}, { get: (_t, tag: string) => make(tag) }),
    useReducedMotion: () => false,
  };
});

import i18n from "@/lib/i18n";
import Layout from "./Layout";
import Index from "@/pages/Index";
import Work from "@/pages/Work";
import About from "@/pages/About";

let scrollIntoView: ReturnType<typeof vi.spyOn>;

beforeEach(async () => {
  await i18n.changeLanguage("en-US");
  scrollIntoView = vi.spyOn(Element.prototype, "scrollIntoView").mockImplementation(() => {});
});

afterEach(() => {
  scrollIntoView.mockRestore();
});

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Index />} />
          <Route path="/work" element={<Work />} />
          <Route path="/about" element={<About />} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );

/**
 * The same destinations appear in the footer and in page bodies, so scope to
 * the sticky header, which React renders before the routed page.
 */
const headerLink = (href: string) => {
  const header = document.querySelector("header");
  const link = header?.querySelector<HTMLAnchorElement>(`a[href="${href}"]`);
  expect(link, `header link to ${href}`).not.toBeNull();
  return link as HTMLAnchorElement;
};

describe("hash deep linking", () => {
  it("mounts exactly one global FX layer as a direct sibling of main", () => {
    const { container } = renderAt("/");
    const layer = container.querySelector("[data-fx-layer]");
    const main = container.querySelector("main");

    expect(layer).toBeInTheDocument();
    expect(container.querySelectorAll("[data-fx-layer]")).toHaveLength(1);
    expect(layer?.parentElement).toBe(main?.parentElement);
    expect(layer?.parentElement).toHaveClass("relative", "min-h-screen");
  });

  it("handles a hash present on the initial render", async () => {
    // The old `firstRender` early return skipped this entirely: a direct hit
    // on /about#experience left scrollY at 0 with focus on <body>.
    renderAt("/about#experience");

    const section = document.getElementById("experience");
    expect(section).not.toBeNull();

    await waitFor(() => expect(section).toHaveFocus());
    expect(scrollIntoView).toHaveBeenCalled();
    expect(scrollIntoView.mock.instances[0]).toBe(section);
    expect(document.body).not.toHaveFocus();
  });

  it("gives the hash target an explicit programmatic focus stop", () => {
    renderAt("/about#experience");
    // Focus only lands here because the section opts in; without tabIndex the
    // focus() call is a silent no-op and the user stays on <body>.
    expect(document.getElementById("experience")).toHaveAttribute("tabindex", "-1");
  });

  it("scrolls and focuses the section on in-app hash navigation", async () => {
    const user = userEvent.setup();
    renderAt("/");
    scrollIntoView.mockClear();

    await user.click(headerLink("/about#experience"));

    await waitFor(() => {
      const section = document.getElementById("experience");
      expect(section).not.toBeNull();
      expect(section).toHaveFocus();
    });
    expect(scrollIntoView).toHaveBeenCalled();
  });

  it("handles the credentials deep link the same way", async () => {
    renderAt("/about#credentials");

    const section = document.getElementById("credentials");
    expect(section).not.toBeNull();
    expect(section).toHaveAttribute("tabindex", "-1");

    await waitFor(() => expect(section).toHaveFocus());
    expect(scrollIntoView.mock.instances[0]).toBe(section);
  });

  it("scrolls and focuses credentials from the home page preview", async () => {
    const user = userEvent.setup();
    renderAt("/");
    scrollIntoView.mockClear();

    const link = document.querySelector<HTMLAnchorElement>(
      'main a[href="/about#credentials"]',
    );
    expect(link, "home preview link to /about#credentials").not.toBeNull();
    await user.click(link as HTMLAnchorElement);

    await waitFor(() => {
      const section = document.getElementById("credentials");
      expect(section).not.toBeNull();
      expect(section).toHaveFocus();
    });
    expect(scrollIntoView).toHaveBeenCalled();
  });

  it("still focuses main on a plain route change", async () => {
    const user = userEvent.setup();
    renderAt("/");

    await user.click(headerLink("/work"));

    await waitFor(() => expect(document.getElementById("main")).toHaveFocus());
  });
});
