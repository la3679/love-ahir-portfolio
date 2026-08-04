import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Guards the first-paint defect found in the Gate 1 audit.
 *
 * Framer Motion applies `initial="hidden"` as an inline `opacity: 0` before
 * its JS runs. requestAnimationFrame is paused in background tabs, so a page
 * opened in one — normal behaviour when a recruiter opens a link from a
 * résumé — painted a blank hero indefinitely. These tests assert the hero and
 * proof strip never depend on animation to become readable.
 *
 * Scope: this covers the post-mount path only. index.html still ships an
 * empty #root, so nothing here claims the site renders without application
 * JavaScript.
 *
 * Framer is deliberately NOT mocked here: the point is to observe what these
 * components hand to the real library.
 */

beforeEach(async () => {
  const i18n = (await import("@/lib/i18n")).default;
  await i18n.changeLanguage("en-US");
});

const heroSource = readFileSync(
  join(process.cwd(), "src", "components", "Hero.tsx"),
  "utf8",
);
const proofSource = readFileSync(
  join(process.cwd(), "src", "components", "ProofStrip.tsx"),
  "utf8",
);

describe("above-the-fold content is never opacity-gated", () => {
  it("keeps Framer Motion out of the hero entirely", () => {
    expect(heroSource).not.toContain("framer-motion");
    expect(heroSource).not.toContain('initial="hidden"');
  });

  it("keeps Framer Motion out of the proof strip", () => {
    expect(proofSource).not.toContain("framer-motion");
    expect(proofSource).not.toContain('initial="hidden"');
  });

  it("renders the hero heading and CTAs with no inline opacity", async () => {
    const Hero = (await import("./Hero")).default;
    const { container } = render(
      <MemoryRouter>
        <Hero />
      </MemoryRouter>,
    );

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading.style.opacity).toBe("");
    expect(heading).toBeVisible();

    // Nothing in the hero may carry an inline opacity of 0.
    const hidden = [...container.querySelectorAll<HTMLElement>("*")].filter(
      (el) => el.style.opacity === "0",
    );
    expect(hidden).toHaveLength(0);
  });

  it("renders every proof figure with no inline opacity", async () => {
    const ProofStrip = (await import("./ProofStrip")).default;
    const { container } = render(
      <MemoryRouter>
        <ProofStrip />
      </MemoryRouter>,
    );

    for (const value of ["4+", "99.97%", "500K+", "10M+"]) {
      expect(screen.getByText(value)).toBeVisible();
    }
    const hidden = [...container.querySelectorAll<HTMLElement>("*")].filter(
      (el) => el.style.opacity === "0",
    );
    expect(hidden).toHaveLength(0);
  });

  it("animates transform only, so a stalled animation cannot hide content", () => {
    const css = readFileSync(join(process.cwd(), "src", "index.css"), "utf8");
    const block = css.match(/@keyframes\s+rise-in\s*\{[\s\S]*?\n\s*\}\s*\n/)?.[0];
    expect(block, "rise-in keyframes not found").toBeTruthy();
    expect(block).toContain("transform");
    expect(block).not.toContain("opacity");
  });

  it("disables the entrance animation under reduced motion", () => {
    const css = readFileSync(join(process.cwd(), "src", "index.css"), "utf8");
    const reduced = css.slice(css.indexOf("prefers-reduced-motion"));
    expect(reduced).toContain(".rise-in");
    expect(reduced).toContain("animation: none");
  });
});

describe("reduced motion is honoured in Framer paths", () => {
  it("returns the settled state instead of animating", async () => {
    vi.resetModules();
    vi.doMock("framer-motion", () => ({ useReducedMotion: () => true }));

    const { useReveal, useRevealGroup } = await import("@/lib/motion");
    expect(useReveal().initial).toBe(false);
    expect(useReveal().animate).toBe("show");
    expect(useReveal().variants).toBeUndefined();
    expect(useRevealGroup().initial).toBe(false);

    vi.doUnmock("framer-motion");
    vi.resetModules();
  });

  it("animates normally when motion is allowed", async () => {
    vi.resetModules();
    vi.doMock("framer-motion", () => ({ useReducedMotion: () => false }));

    const { useReveal } = await import("@/lib/motion");
    expect(useReveal().initial).toBe("hidden");
    expect(useReveal().whileInView).toBe("show");

    vi.doUnmock("framer-motion");
    vi.resetModules();
  });
});
