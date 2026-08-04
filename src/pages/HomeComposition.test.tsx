import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import i18n from "@/lib/i18n";
import Index from "./Index";
import { education, experiences } from "@/data/portfolio";
import { featuredSlugs, getCaseStudy } from "@/data/caseStudies";

/**
 * Locks the approved "Editorial Geospatial Systems Lattice" homepage
 * (IMPLEMENTATION.md §31): the section order, the About/photo moment, and the
 * Pokédex lead artifact with its verified stages and outcome.
 */

const renderHome = () =>
  render(
    <MemoryRouter initialEntries={["/"]}>
      <Index />
    </MemoryRouter>,
  );

describe("approved homepage section order", () => {
  it("renders hero → proof → about → experience → projects → capabilities → credentials → research", () => {
    const { container } = renderHome();

    const order = [
      i18n.t("hero.statement"),
      i18n.t("home.proof.yearsLabel"),
      i18n.t("about.title"),
      i18n.t("home.experience.title"),
      i18n.t("home.work.title"),
      i18n.t("capabilities.title"),
      i18n.t("credentials.title"),
      i18n.t("home.research.title"),
    ];

    const text = container.textContent ?? "";
    const positions = order.map((needle) => text.indexOf(needle));

    positions.forEach((position, i) => {
      expect(position, `"${order[i]}" should be present`).toBeGreaterThan(-1);
    });
    // Strictly increasing = the sections appear in the approved order.
    for (let i = 1; i < positions.length; i++) {
      expect(positions[i]).toBeGreaterThan(positions[i - 1]);
    }
  });

  it("places experience before featured projects", () => {
    const { container } = renderHome();
    const text = container.textContent ?? "";
    expect(text.indexOf(i18n.t("home.experience.title"))).toBeLessThan(
      text.indexOf(i18n.t("home.work.title")),
    );
  });

  it("keeps exactly one h1 and puts it first in the heading order", () => {
    const { container } = renderHome();
    const h1s = container.querySelectorAll("h1");
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent(i18n.t("hero.statement"));
  });
});

describe("first paint", () => {
  it("renders the h1 with no inline opacity, so a stalled frame cannot hide it", () => {
    const { container } = renderHome();
    const h1 = container.querySelector("h1") as HTMLElement;
    expect(h1).toBeInTheDocument();
    expect(h1.style.opacity).toBe("");
  });

  it("renders the h1 and both CTAs while the document reports itself hidden", () => {
    const spy = Object.getOwnPropertyDescriptor(Document.prototype, "hidden");
    Object.defineProperty(document, "hidden", { value: true, configurable: true });
    try {
      renderHome();
      expect(
        screen.getByRole("heading", { level: 1, name: i18n.t("hero.statement") }),
      ).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /view work/i })).toBeInTheDocument();
      expect(screen.getAllByRole("link", { name: /resume/i }).length).toBeGreaterThan(0);
    } finally {
      if (spy) Object.defineProperty(Document.prototype, "hidden", spy);
      else Reflect.deleteProperty(document as unknown as Record<string, unknown>, "hidden");
    }
  });

  it("ships no canvas at first paint — the spatial layer starts as SVG", () => {
    const { container } = renderHome();
    expect(container.querySelector("canvas")).toBeNull();
    const stage = container.querySelector(".observatory-stage");
    expect(stage?.querySelector(".systems-observatory > svg")).toBeInTheDocument();
  });
});

describe("About section", () => {
  it("shows the real profile photograph with explicit dimensions and factual alt", () => {
    const { container } = renderHome();
    const img = container.querySelector('img[alt="Love Ahir"]') as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.getAttribute("src")).toMatch(/profile-photo/);
    // Explicit width/height prevent layout shift.
    expect(img.getAttribute("width")).toBeTruthy();
    expect(img.getAttribute("height")).toBeTruthy();
  });

  it("renders the portrait as a plain DOM image, never as a WebGL texture", () => {
    const { container } = renderHome();
    const img = container.querySelector('img[alt="Love Ahir"]') as HTMLImageElement;
    expect(img.tagName).toBe("IMG");
    // The photo is not a control — it performs no action, so it is not a link.
    expect(img.closest("a")).toBeNull();
    expect(img.closest("button")).toBeNull();
    expect(img.closest("[data-depth-surface='portrait']")).not.toHaveAttribute(
      "tabindex",
    );
  });

  it("carries the current role read from the canonical experience record", () => {
    renderHome();
    const current = experiences.find((role) => role.current);
    expect(current).toBeDefined();
    expect(
      screen.getAllByText(new RegExp(current!.company, "i")).length,
    ).toBeGreaterThan(0);
  });
});

describe("Pokédex lead project", () => {
  const pokedex = getCaseStudy("pokedex-mongodb")!;

  it("is the first featured project", () => {
    expect(featuredSlugs[0]).toBe("pokedex-mongodb");
  });

  it("renders the lead systems artifact with its verified stack", () => {
    renderHome();
    const figure = screen.getByRole("figure");
    expect(figure).toHaveTextContent(pokedex.project);
    for (const tech of pokedex.stack) {
      expect(figure).toHaveTextContent(tech);
    }
  });

  it("shows the four verified architecture stages as accessible controls", async () => {
    renderHome();
    const figure = screen.getByRole("figure");
    const stages = within(figure).getAllByRole("button");
    expect(stages).toHaveLength(4);

    const labels = stages.map((b) => b.textContent ?? "");
    expect(labels[0]).toContain("React interface");
    expect(labels[1]).toContain("Flask API");
    expect(labels[2]).toContain("MongoDB 2dsphere");
    expect(labels[3]).toContain("GridFS");

    // Every target meets the 44px floor via a min-height utility class.
    stages.forEach((b) => expect(b.className).toMatch(/min-h-\[44px\]/));

    // Nothing is selected until the visitor engages.
    stages.forEach((b) => expect(b).toHaveAttribute("aria-pressed", "false"));

    // Click, hover and keyboard focus all resolve to the same selection.
    await userEvent.click(stages[2]);
    expect(stages[2]).toHaveAttribute("aria-pressed", "true");
    stages
      .filter((_, i) => i !== 2)
      .forEach((b) => expect(b).toHaveAttribute("aria-pressed", "false"));

    // Keyboard parity: focus alone produces the same selection as a click.
    fireEvent.focusIn(stages[0]);
    expect(stages[0]).toHaveAttribute("aria-pressed", "true");
    expect(stages[2]).toHaveAttribute("aria-pressed", "false");

    // Hover parity, on the same control.
    await userEvent.hover(stages[3]);
    expect(stages[3]).toHaveAttribute("aria-pressed", "true");
  });

  it("marks the selected stage by more than colour", () => {
    renderHome();
    const figure = screen.getByRole("figure");
    const stages = within(figure).getAllByRole("button");
    fireEvent.focusIn(stages[1]);
    // Border weight changes and a filled marker appears alongside the colour,
    // so the state is never signalled by colour alone.
    expect(stages[1].className).toMatch(/border-primary/);
    expect(stages[1].querySelector(".bg-primary")).toBeInTheDocument();
  });

  it("keeps its stage controls usable with no WebGL at all", () => {
    // jsdom reports no WebGL (see src/test/setup.ts), so this whole suite
    // already runs in the static-fallback path — the artifact is complete and
    // interactive without the scene ever existing.
    renderHome();
    const figure = screen.getByRole("figure");
    expect(within(figure).getAllByRole("button")).toHaveLength(4);
    expect(figure).toHaveTextContent("296k+");
  });

  it("publishes the verified 296k+ outcome", () => {
    renderHome();
    const figure = screen.getByRole("figure");
    expect(figure).toHaveTextContent("296k+");
    expect(figure).toHaveTextContent(pokedex.metrics[0].label);
  });

  it("states plainly that the visual is a diagram, not a screenshot", () => {
    renderHome();
    const figure = screen.getByRole("figure");
    expect(figure).toHaveTextContent(i18n.t("artifact.disclaimer"));
    // No image inside the artifact: nothing can be mistaken for a screenshot.
    expect(figure.querySelector("img")).toBeNull();
  });

  it("never describes Pokédex as an AI or machine-learning project", () => {
    renderHome();
    const figure = screen.getByRole("figure");
    const text = figure.textContent ?? "";
    expect(text).not.toMatch(/\bAI\b|machine learning|\bML\b|LLM|Gemini|multiplayer/i);
  });

  it("links to the case study and the verified repository", () => {
    renderHome();
    const figure = screen.getByRole("figure");
    expect(
      within(figure).getByRole("link", { name: new RegExp(i18n.t("artifact.cta"), "i") }),
    ).toHaveAttribute("href", "/work/pokedex-mongodb");
    expect(pokedex.links.repo).toBeTruthy();
  });

  it("keeps ResuMatch featured rather than deleting or weakening it", () => {
    expect(featuredSlugs).toContain("resumatch-ai");
    expect(getCaseStudy("resumatch-ai")).toBeDefined();
  });
});

describe("preserved content", () => {
  it("keeps all seven roles in the dataset while previewing three", () => {
    expect(experiences).toHaveLength(7);
  });

  it("renders both education entries on the home page", () => {
    renderHome();
    for (const entry of education) {
      expect(screen.getAllByText(entry.degree).length).toBeGreaterThan(0);
    }
    expect(education).toHaveLength(2);
    expect(education.map((e) => e.institution).join(" ")).toMatch(/Rochester/);
    expect(education.map((e) => e.institution).join(" ")).toMatch(/LJ Institute/);
  });

  it("keeps research present but subordinate — after work, experience and credentials", () => {
    const { container } = renderHome();
    const text = container.textContent ?? "";
    expect(text.indexOf(i18n.t("home.research.title"))).toBeGreaterThan(
      text.indexOf(i18n.t("credentials.title")),
    );
  });

  it("adds no skill bars, percentages, testimonials or availability claims", () => {
    const { container } = renderHome();
    expect(container.querySelector('[role="progressbar"]')).toBeNull();
    const text = container.textContent ?? "";
    expect(text).not.toMatch(/testimonial|available now|work authorization|proficiency/i);
  });
});
