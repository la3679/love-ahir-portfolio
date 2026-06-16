import { describe, it, expect } from "vitest";
import {
  projects,
  experiences,
  skillGroups,
  certifications,
  education,
  expertise,
  profile,
  projectCategories,
  filterProjects,
  countByCategory,
  type Project,
} from "./portfolio";

const sample: Project[] = [
  { title: "A", category: "Web App", blurb: "x", stack: ["t"], link: "#" },
  { title: "B", category: "Publication", blurb: "x", stack: ["t"], link: "#" },
  { title: "C", category: "Web App", blurb: "x", stack: ["t"], link: "#" },
];

describe("filterProjects", () => {
  it("returns every project for the 'All' category", () => {
    expect(filterProjects(sample, "All")).toHaveLength(3);
    // 'All' is a pass-through and returns the same reference.
    expect(filterProjects(sample, "All")).toBe(sample);
  });

  it("returns only projects matching a specific category", () => {
    const webApps = filterProjects(sample, "Web App");
    expect(webApps).toHaveLength(2);
    expect(webApps.every((p) => p.category === "Web App")).toBe(true);
  });

  it("does not mutate the input list", () => {
    const copy = [...sample];
    filterProjects(sample, "Publication");
    expect(sample).toEqual(copy);
  });

  it("returns an empty array when nothing matches", () => {
    const none: Project[] = [];
    expect(filterProjects(none, "Mobile App")).toHaveLength(0);
  });
});

describe("countByCategory", () => {
  it("counts 'All' as the total length", () => {
    expect(countByCategory(sample).All).toBe(3);
  });

  it("counts each category correctly", () => {
    const counts = countByCategory(sample);
    expect(counts["Web App"]).toBe(2);
    expect(counts.Publication).toBe(1);
  });
});

describe("portfolio data integrity", () => {
  it("ships a meaningful number of projects", () => {
    expect(projects.length).toBeGreaterThanOrEqual(15);
  });

  it("gives every project the required fields and a valid category", () => {
    for (const p of projects) {
      expect(p.title.length).toBeGreaterThan(0);
      expect(p.blurb.length).toBeGreaterThan(0);
      expect(p.stack.length).toBeGreaterThan(0);
      expect(p.link.length).toBeGreaterThan(0);
      expect(projectCategories).toContain(p.category);
    }
  });

  it("gives every experience achievements and tags", () => {
    for (const e of experiences) {
      expect(e.achievements.length).toBeGreaterThanOrEqual(2);
      expect(e.tags.length).toBeGreaterThan(0);
      expect(e.company.length).toBeGreaterThan(0);
    }
  });

  it("populates every skill group", () => {
    for (const g of skillGroups) {
      expect(g.skills.length).toBeGreaterThanOrEqual(5);
    }
  });

  it("has well-formed certifications, education, expertise and profile", () => {
    expect(certifications.every((c) => c.link.startsWith("http"))).toBe(true);
    expect(education).toHaveLength(2);
    expect(expertise.length).toBeGreaterThanOrEqual(6);
    expect(profile.roles.length).toBeGreaterThanOrEqual(3);
    expect(profile.email).toContain("@");
  });

  it("uses only http(s) or anchor links across projects", () => {
    for (const p of projects) {
      expect(/^(https?:\/\/|#)/.test(p.link)).toBe(true);
    }
  });
});
