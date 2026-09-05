import { describe, it, expect } from "vitest";
import {
  caseStudies,
  featuredSlugs,
  featuredCaseStudies,
  getCaseStudy,
  adjacentCaseStudies,
} from "./caseStudies";
import { projects } from "./portfolio";
import enUS from "@/lib/locales/en-US";
import { resources, supportedLngs } from "@/lib/locales";

describe("caseStudies data integrity", () => {
  it("contains ten case studies with unique slugs", () => {
    expect(caseStudies).toHaveLength(10);
    const slugs = caseStudies.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("matches a featured project in portfolio.ts for every slug", () => {
    const projectSlugs = new Set(projects.filter((p) => p.slug).map((p) => p.slug));
    for (const cs of caseStudies) {
      expect(projectSlugs.has(cs.slug), `project for ${cs.slug}`).toBe(true);
    }
  });

  it("has a translated summary key in every locale", () => {
    for (const cs of caseStudies) {
      expect(enUS, `en-US key ${cs.summaryKey}`).toHaveProperty(cs.summaryKey);
      for (const code of supportedLngs) {
        const dict = resources[code].translation as Record<string, string>;
        expect(dict[cs.summaryKey], `${code} → ${cs.summaryKey}`).toBeTruthy();
      }
    }
  });

  it("provides non-empty narrative sections and at least one metric each", () => {
    for (const cs of caseStudies) {
      for (const section of [cs.context, cs.problem, cs.approach, cs.shipped, cs.retro]) {
        expect(section.length, `${cs.slug} section`).toBeGreaterThan(0);
      }
      expect(cs.metrics.length, `${cs.slug} metrics`).toBeGreaterThan(0);
      expect(cs.evidence.length).toBeGreaterThan(0);
    }
  });

  it("looks up case studies by slug and 404s unknown slugs", () => {
    expect(getCaseStudy("privacy-policies-vs-logs")?.project).toContain("Privacy");
    expect(getCaseStudy("nope")).toBeUndefined();
  });

  it("leads with engineering work and closes with the publication", () => {
    expect(caseStudies[0].slug).toBe("tradeops-copilot");
    expect(caseStudies[caseStudies.length - 1].slug).toBe("privacy-policies-vs-logs");
  });

  it("curates four featured slugs that all resolve", () => {
    expect(featuredSlugs).toHaveLength(4);
    expect(featuredCaseStudies).toHaveLength(4);
    expect(featuredCaseStudies.map((c) => c.slug)).toEqual([...featuredSlugs]);
  });

  it("never features the publication as a home card", () => {
    expect(featuredSlugs).not.toContain("privacy-policies-vs-logs");
    for (const cs of featuredCaseStudies) {
      expect(cs.category, `${cs.slug} category`).not.toBe("Publication");
    }
  });

  it("wraps prev/next navigation at both ends", () => {
    const first = caseStudies[0];
    const last = caseStudies[caseStudies.length - 1];
    expect(adjacentCaseStudies(first.slug).prev.slug).toBe(last.slug);
    expect(adjacentCaseStudies(last.slug).next.slug).toBe(first.slug);
  });
});
