import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { personJsonLd } from "./Seo";

/**
 * Positioning guard. The static tags in index.html and the Person schema are
 * the first thing a recruiter or a crawler sees, so they are asserted rather
 * than trusted to stay in sync with the rest of the copy.
 */
const html = readFileSync(join(process.cwd(), "index.html"), "utf8");

describe("Person JSON-LD", () => {
  it("declares Software Engineer as the job title", () => {
    expect(personJsonLd.jobTitle).toBe("Software Engineer");
  });

  it("does not present research as the primary identity", () => {
    expect(personJsonLd.jobTitle).not.toMatch(/research/i);
  });

  it("lists only capabilities backed by documented work", () => {
    expect(personJsonLd.knowsAbout).toContain("Backend Development");
    expect(personJsonLd.knowsAbout).toContain("Full-Stack Development");
    // Skills-list-only technologies must not appear as demonstrated capability.
    for (const unsupported of ["Kubernetes", "Terraform", "MLOps", "Jenkins"]) {
      expect(personJsonLd.knowsAbout, unsupported).not.toContain(unsupported);
    }
  });
});

describe("static document metadata", () => {
  it("titles the site as a software engineer", () => {
    expect(html).toContain(
      "<title>Love Ahir — Software Engineer | Full-Stack, Backend &amp; Applied AI</title>",
    );
  });

  it("describes 4+ years of engineering rather than a research record", () => {
    const description = html.match(/name="description"\s+content="([^"]+)"/s)?.[1] ?? "";
    expect(description).toContain("4+ years");
    expect(description).toMatch(/backends/i);
    expect(description).not.toMatch(/privacy researcher|GPA|EASE/i);
  });

  it("keeps research language out of the social preview copy", () => {
    const og = html.match(/property="og:description"\s+content="([^"]+)"/s)?.[1] ?? "";
    expect(og).not.toMatch(/privacy researcher|EASE/i);
  });
});
