import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
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
import Layout from "@/components/Layout";
import Index from "./Index";
import Work from "./Work";
import CaseStudy from "./CaseStudy";
import Research from "./Research";
import About from "./About";
import NotFound from "./NotFound";
import { getCaseStudy, caseStudies, featuredSlugs } from "@/data/caseStudies";
import { experiences } from "@/data/portfolio";

beforeEach(async () => {
  await i18n.changeLanguage("en-US");
});

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Index />} />
          <Route path="/work" element={<Work />} />
          <Route path="/work/:slug" element={<CaseStudy />} />
          <Route path="/research" element={<Research />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );

describe("route smoke tests", () => {
  it("renders the home page with the hero statement", () => {
    renderAt("/");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      i18n.t("hero.statement"),
    );
  });

  it("renders the work index with all twenty-six entries", () => {
    renderAt("/work");
    expect(
      screen.getByRole("heading", { level: 1, name: i18n.t("work.title") }),
    ).toBeInTheDocument();
    // 10 internal case links + 16 archive rows
    expect(screen.getAllByText(i18n.t("work.caseStudy")).length).toBeGreaterThanOrEqual(10);
    expect(screen.getAllByText(i18n.t("work.external")).length).toBe(16);
  });

  it("renders every case study at its slug", () => {
    for (const cs of caseStudies) {
      const { unmount } = renderAt(`/work/${cs.slug}`);
      expect(
        screen.getByRole("heading", { level: 1, name: cs.title }),
      ).toBeInTheDocument();
      unmount();
    }
  });

  it("redirects unknown case slugs to the 404 page", () => {
    renderAt("/work/not-a-real-slug");
    expect(
      screen.getByRole("heading", { level: 1, name: i18n.t("notfound.title") }),
    ).toBeInTheDocument();
  });

  it("renders the research page with findings and citation", () => {
    renderAt("/research");
    expect(
      screen.getByRole("heading", { level: 1, name: i18n.t("research.title") }),
    ).toBeInTheDocument();
    // The finding appears in both the chart labels and the sr-only table.
    expect(screen.getAllByText(i18n.t("research.finding1")).length).toBeGreaterThan(0);
    expect(
      screen.getByRole("button", { name: new RegExp(i18n.t("research.copyBibtex")) }),
    ).toBeInTheDocument();
  });

  it("renders the about page with education and experience", () => {
    renderAt("/about");
    expect(
      screen.getByRole("heading", { level: 1, name: i18n.t("about.title") }),
    ).toBeInTheDocument();
    // RIT appears in both education and the experience timeline.
    expect(
      screen.getAllByText("Rochester Institute of Technology", { exact: false }).length,
    ).toBeGreaterThan(0);
  });

  it("puts Experience before Education on the about page", () => {
    renderAt("/about");
    const experience = document.getElementById("experience-heading");
    const education = document.getElementById("education-heading");
    expect(experience).not.toBeNull();
    expect(education).not.toBeNull();
    // DOCUMENT_POSITION_FOLLOWING === 4: education comes after experience.
    expect(
      experience!.compareDocumentPosition(education!) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it("anchors the experience section for the Experience nav link", () => {
    renderAt("/about");
    expect(document.getElementById("experience")).not.toBeNull();
  });

  it("lists every role, including the preserved ones, on the about page", () => {
    renderAt("/about");
    for (const exp of experiences) {
      expect(
        screen.getAllByText(i18n.t(exp.roleKey), { exact: false }).length,
        `role ${exp.id}`,
      ).toBeGreaterThan(0);
      expect(
        screen.getAllByText(exp.period, { exact: false }).length,
        `period ${exp.id}`,
      ).toBeGreaterThan(0);
    }
  });

  it("summarizes professional experience on the home page", () => {
    renderAt("/");
    expect(
      screen.getByRole("heading", { name: i18n.t("home.experience.title") }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Morgan Stanley", { exact: false }).length).toBeGreaterThan(
      0,
    );
    expect(screen.getAllByText("Sage Softtech", { exact: false }).length).toBeGreaterThan(
      0,
    );
  });

  it("features engineering case studies first, led by TradeOps, publication excluded", () => {
    renderAt("/");
    // Each entry links to its case study more than once (title + action), and
    // the lead artifact links to TradeOps above them, so compare the distinct
    // destinations in document order rather than raw link order.
    const seen = new Set<string>();
    const destinations = screen
      .getAllByRole("link")
      .map((link) => link.getAttribute("href") ?? "")
      .filter((href) => href.startsWith("/work/"))
      .filter((href) => (seen.has(href) ? false : seen.add(href)));

    expect(destinations).toEqual(featuredSlugs.map((slug) => `/work/${slug}`));
    // The architecture panel and curated list must agree on the lead.
    expect(destinations[0]).toBe("/work/tradeops-copilot");
    expect(getCaseStudy("resumatch-ai")).toBeDefined();
    expect(destinations).not.toContain("/work/privacy-policies-vs-logs");
  });

  it("keeps Research reachable from the footer on every route", () => {
    renderAt("/");
    const footer = screen.getByRole("contentinfo");
    const researchLinks = within(footer)
      .getAllByRole("link")
      .filter((link) => link.getAttribute("href") === "/research");
    expect(researchLinks.length).toBeGreaterThan(0);
  });

  it("renders the 404 page for unknown routes", () => {
    renderAt("/nowhere");
    expect(
      screen.getByRole("heading", { level: 1, name: i18n.t("notfound.title") }),
    ).toBeInTheDocument();
  });

  it("always renders the skip link and contact CTA", () => {
    renderAt("/research");
    expect(screen.getByText(i18n.t("nav.skipToContent"))).toHaveAttribute("href", "#main");
    expect(
      screen.getByRole("heading", { name: i18n.t("contact.title") }),
    ).toBeInTheDocument();
  });
});
