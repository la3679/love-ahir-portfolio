import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

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

import Hero from "./Hero";
import i18n from "@/lib/i18n";
import { profile } from "@/data/portfolio";

const renderHero = () =>
  render(
    <MemoryRouter>
      <Hero />
    </MemoryRouter>,
  );

describe("<Hero />", () => {
  it("renders the positioning statement as the page heading", () => {
    renderHero();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "I build reliable full-stack products and applied AI systems.",
    );
  });

  it("links the primary CTA to the work index", () => {
    renderHero();
    expect(
      screen.getByRole("link", { name: new RegExp(i18n.t("hero.seeWork"), "i") }),
    ).toHaveAttribute("href", "/work");
  });

  it("limits the primary CTA row to View work and Resume", () => {
    renderHero();
    // Gate 3: exactly two primary actions, so the next click is unambiguous.
    expect(screen.getByRole("link", { name: i18n.t("hero.seeWork") })).toHaveAttribute(
      "href",
      "/work",
    );
    expect(screen.getByRole("link", { name: /resume|cv/i })).toHaveAttribute(
      "href",
      profile.resumeUrl,
    );
    // Experience and Contact moved out of the hero entirely.
    expect(
      screen.queryByRole("link", { name: i18n.t("nav.experience") }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: i18n.t("nav.contact") }),
    ).not.toBeInTheDocument();
  });

  it("shows no portrait in the hero", () => {
    // The homepage leads with what was built. Love's portrait stays on /about.
    const { container } = renderHero();
    expect(container.querySelector('img[src*="profile-photo"]')).toBeNull();
  });

  it("no longer carries the architecture artifact", () => {
    // §31.2 moved the architecture-summary treatment into Featured Projects,
    // where it is now the Pokédex systems artifact. The hero stays a single
    // centred text column over the shared spatial layer.
    renderHero();
    expect(screen.queryByRole("figure")).not.toBeInTheDocument();
  });

  it("mounts the spatial layer inside the observatory stage", () => {
    const { container } = renderHero();

    const stage = container.querySelector(".observatory-stage");
    const scene = stage?.querySelector(".systems-observatory");
    expect(stage).toBeInTheDocument();
    expect(scene).toBeInTheDocument();
    expect(scene?.querySelector("svg")).toBeInTheDocument();
    // The synchronous first-paint design is SVG; WebGL still upgrades lazily.
    expect(container.querySelector("canvas")).toBeNull();
  });

  it("keeps two different verified technology rails inside the stage", () => {
    const { container } = renderHero();
    const stage = container.querySelector(".observatory-stage");
    const top = stage?.querySelector('[data-tech-rail="top"]');
    const bottom = stage?.querySelector('[data-tech-rail="bottom"]');
    const topTrack = top?.querySelector<HTMLElement>(
      '[data-tech-rail-track="top"]',
    );
    const bottomTrack = bottom?.querySelector<HTMLElement>(
      '[data-tech-rail-track="bottom"]',
    );

    expect(top).toBeInTheDocument();
    expect(bottom).toBeInTheDocument();
    expect(top).toHaveAttribute("aria-hidden", "true");
    expect(bottom).toHaveAttribute("aria-hidden", "true");
    expect(stage).toHaveAttribute("data-stage-rails-active", "true");
    expect(top).toHaveTextContent("Java");
    expect(top).toHaveTextContent("Spring Boot");
    expect(top).toHaveTextContent("React");
    expect(top).toHaveTextContent("PostgreSQL");
    expect(top).toHaveTextContent("AWS");
    expect(bottom).toHaveTextContent("Python");
    expect(bottom).toHaveTextContent("FastAPI");
    expect(bottom).toHaveTextContent("MongoDB");
    expect(bottom).toHaveTextContent("Appium");
    expect(bottom).toHaveTextContent("Three.js");
    expect(bottom).not.toHaveTextContent("Docker");

    const logos = Array.from(
      stage?.querySelectorAll<HTMLImageElement>(".stage-tech-rail__logo img") ??
        [],
    );
    expect(logos).toHaveLength(20);
    for (const logo of logos) {
      expect(logo.getAttribute("src")).toMatch(/^\/img\/tech\/.+\.svg$/);
      expect(logo).toHaveAttribute("alt", "");
      expect(logo).toHaveAttribute("width");
      expect(logo).toHaveAttribute("height", "24");
    }

    expect(topTrack?.style.animationDuration).toBe("38s");
    expect(topTrack?.style.animationDirection).toBe("normal");
    expect(bottomTrack?.style.animationDuration).toBe("44s");
    expect(bottomTrack?.style.animationDirection).toBe("reverse");

    const topItems = Array.from(
      top?.querySelectorAll(".stage-tech-rail__item") ?? [],
    ).map((item) => item.textContent);
    const bottomItems = Array.from(
      bottom?.querySelectorAll(".stage-tech-rail__item") ?? [],
    ).map((item) => item.textContent);

    // Each five-item source set is duplicated exactly once so translating the
    // full track by -50% produces the same sequence with no seam.
    expect(topItems).toHaveLength(10);
    expect(bottomItems).toHaveLength(10);
    expect(topItems.slice(0, 5)).toEqual(topItems.slice(5));
    expect(bottomItems.slice(0, 5)).toEqual(bottomItems.slice(5));
    expect(
      bottomItems.slice(0, 5).filter((item) => topItems.slice(0, 5).includes(item)),
    ).toHaveLength(0);
    expect(container.querySelector("section#home > [data-tech-rail]")).toBeNull();
  });

  it("defines a seamless, pausable, reduced-motion-safe marquee", () => {
    const css = readFileSync(join(process.cwd(), "src", "index.css"), "utf8");
    const reducedMotion = css.slice(
      css.indexOf("@media (prefers-reduced-motion: reduce)"),
    );

    expect(css).toContain("@keyframes stage-tech-rail-scroll");
    expect(css).toContain("transform: translate3d(-50%, 0, 0)");
    expect(css).toContain(".observatory-stage:hover .stage-tech-rail__track");
    expect(css).toContain(".observatory-stage:focus-within .stage-tech-rail__track");
    expect(css).toContain(
      '.observatory-stage[data-stage-rails-active="false"] .stage-tech-rail__track',
    );
    expect(reducedMotion).toContain(".stage-tech-rail__track");
    expect(reducedMotion).toContain("animation: none !important");
  });

  it("keeps research, publication, and education language out of the hero", () => {
    const { container } = renderHero();
    expect(container.textContent).not.toMatch(
      /research|publication|EASE|GPA|M\.S\.|university/i,
    );
  });

  it("exposes social links and a resume link", () => {
    renderHero();
    expect(screen.getByLabelText("GitHub")).toHaveAttribute("href", profile.github);
    expect(screen.getByLabelText("LinkedIn")).toHaveAttribute("href", profile.linkedin);
    const resume = screen.getByRole("link", { name: /resume|cv/i });
    expect(resume).toHaveAttribute("href", profile.resumeUrl);
  });

  it("leads with the software-engineering role eyebrow, not availability", () => {
    renderHero();
    expect(screen.getByText(i18n.t("hero.badge"))).toBeInTheDocument();
    expect(i18n.t("hero.badge")).toContain("Software Engineer");
    expect(i18n.t("hero.badge")).not.toMatch(/research/i);
  });

  it("keeps research language out of the hero entirely", () => {
    const { container } = renderHero();
    expect(container.textContent ?? "").not.toMatch(/privacy research|researcher|EASE/i);
  });
});
