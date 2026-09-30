import { describe, it, expect } from "vitest";
import {
  projects,
  experiences,
  experienceGroups,
  experiencesInGroup,
  skillGroups,
  education,
  expertise,
  profile,
  projectCategories,
  filterProjects,
  countByCategory,
  homeExperiences,
  homeExperienceIds,
  type Project,
} from "./portfolio";
import enUS from "@/lib/locales/en-US";
import { resources, supportedLngs } from "@/lib/locales";

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
      expect(e.achievementKeys.length).toBeGreaterThanOrEqual(2);
      expect(e.tags.length).toBeGreaterThan(0);
      expect(e.company.length).toBeGreaterThan(0);
      expect(e.period.length).toBeGreaterThan(0);
      expect(e.location.length).toBeGreaterThan(0);
    }
  });

  it("populates every skill group", () => {
    for (const g of skillGroups) {
      expect(g.skills.length).toBeGreaterThanOrEqual(5);
    }
  });

  it("has well-formed education, expertise and profile", () => {
    expect(education).toHaveLength(2);
    expect(expertise.length).toBeGreaterThanOrEqual(6);
    expect(profile.roles.length).toBeGreaterThanOrEqual(3);
    expect(profile.email).toContain("@");
  });

  it("previews exactly three curated engineering roles on the home page", () => {
    // Love's Gate 3 cap. All five roles still render on /about#experience.
    expect(homeExperienceIds).toHaveLength(3);
    expect(homeExperiences).toHaveLength(3);
    expect(experiences.length).toBe(5);
  });

  it("resolves every previewed role, newest first, without touching its dates", () => {
    expect(homeExperiences.map((r) => r.id)).toEqual([...homeExperienceIds]);
    for (const role of homeExperiences) {
      const canonical = experiences.find((e) => e.id === role.id);
      // The preview reads the canonical record — it never restates a period.
      expect(role).toBe(canonical);
      expect(role.period).toMatch(/\d{4}/);
      expect(role.location.length).toBeGreaterThan(0);
    }
  });

  it("previews only industry engineering roles", () => {
    for (const role of homeExperiences) {
      expect(role.group, role.id).toBe("industry");
    }
  });

  it("uses only http(s) or anchor links across projects", () => {
    for (const p of projects) {
      expect(/^(https?:\/\/|#)/.test(p.link)).toBe(true);
    }
  });
});

describe("profile positioning", () => {
  it("leads with Software Engineer and keeps research subordinate", () => {
    expect(profile.roles[0]).toBe("Software Engineer");
    expect(profile.roles.slice(0, 4)).toEqual([
      "Software Engineer",
      "Full-Stack Engineer",
      "Backend Engineer",
      "AI Engineer",
    ]);
    // Research may appear, but never as a leading identity.
    const researchIndex = profile.roles.findIndex((r) => /research/i.test(r));
    if (researchIndex !== -1) expect(researchIndex).toBeGreaterThanOrEqual(3);
  });

  it("uses the approved umbrella headline and a 3+ years summary", () => {
    expect(profile.headline).toBe(
      "I build reliable full-stack products and applied AI systems.",
    );
    expect(profile.summary).toMatch(/^Software engineer with 3\+ years/);
    expect(profile.summary).not.toMatch(/privacy researcher/i);
  });

  it("reports San Jose as the current location, matching the résumé", () => {
    expect(profile.location).toBe("San Jose, CA");
    expect(profile.location).not.toContain("Rochester");
  });

  it("serves the resume from the site rather than a Drive link", () => {
    expect(profile.resumeUrl).toBe("/resume.pdf");
  });

  it("never publishes a phone number", () => {
    const serialized = JSON.stringify(profile);
    expect(serialized).not.toMatch(/\d{10}/);
    expect(serialized).not.toMatch(/\+?\d[\d\s().-]{8,}\d/);
  });
});

describe("experience dataset", () => {
  const byId = (id: string) => experiences.find((e) => e.id === id);

  it("mirrors the résumé's Databricks and Neon IT Systems roles", () => {
    const databricks = byId("databricks");
    expect(databricks?.company).toBe("Databricks");
    expect(databricks?.period).toBe("Aug 2025 — Present");
    expect(databricks?.focusKey).toBe("exp.databricks.focus");
    expect(enUS["exp.databricks.role"]).toBe("Software Engineer, AI Platform");

    const neon2 = byId("neon-software-engineer-2");
    expect(neon2?.company).toBe("Neon IT Systems");
    expect(neon2?.period).toBe("May 2022 — Jul 2023");
    expect(enUS["exp.neon-software-engineer-2.role"]).toBe("Software Engineer II");

    const neon1 = byId("neon-associate-software-engineer");
    expect(neon1?.company).toBe("Neon IT Systems");
    expect(neon1?.period).toBe("Feb 2021 — Apr 2022");
    expect(enUS["exp.neon-associate-software-engineer.role"]).toBe(
      "Associate Software Engineer",
    );
  });

  it("keeps the RIT research and teaching roles", () => {
    for (const id of ["rit-research-assistant", "rit-teaching-assistant"]) {
      expect(byId(id), `preserved role ${id}`).toBeDefined();
    }
    expect(experiences).toHaveLength(5);
  });

  it("drops every role that is not on the résumé", () => {
    for (const id of [
      "morgan-stanley",
      "sage-software-engineer-2",
      "sage-associate-developer",
      "axisray",
      "moon-technolabs",
    ]) {
      expect(byId(id), `retired role ${id}`).toBeUndefined();
    }
    const companies = experiences.map((e) => e.company).join(" ");
    expect(companies).not.toMatch(/Morgan Stanley|Sage Softtech|Axisray|Moon Technolabs/);
  });

  it("marks only Databricks as current", () => {
    const current = experiences.filter((e) => e.current);
    expect(current.map((e) => e.id)).toEqual(["databricks"]);
  });

  it("groups roles without changing the stated chronology", () => {
    expect(experiencesInGroup(experiences, "industry").map((e) => e.id)).toEqual([
      "databricks",
      "neon-software-engineer-2",
      "neon-associate-software-engineer",
    ]);
    expect(
      experiencesInGroup(experiences, "research-teaching").map((e) => e.id),
    ).toEqual(["rit-research-assistant", "rit-teaching-assistant"]);
    // Every role belongs to exactly one rendered group.
    expect(
      experienceGroups.flatMap((g) => experiencesInGroup(experiences, g)),
    ).toHaveLength(experiences.length);
  });

  it("resolves every experience translation key in all eight locales", () => {
    const keys = experiences.flatMap((e) => [
      e.roleKey,
      e.summaryKey,
      ...e.achievementKeys,
      ...(e.focusKey ? [e.focusKey] : []),
    ]);
    for (const key of keys) {
      expect(enUS, `en-US key ${key}`).toHaveProperty(key);
      for (const code of supportedLngs) {
        const dict = resources[code].translation as Record<string, string>;
        expect(dict[key], `${code} → ${key}`).toBeTruthy();
      }
    }
  });
});

describe("published claim set", () => {
  const englishExperienceCopy = experiences
    .flatMap((e) => [
      enUS[e.roleKey],
      enUS[e.summaryKey],
      ...e.achievementKeys.map((k) => enUS[k]),
    ])
    .join("\n");

  it("publishes the résumé's Databricks metrics", () => {
    for (const claim of [
      "4 recurring engineering tasks per sprint",
      "1,000+ agent traces",
      "failed service calls by 18%",
      "10M+ records per run",
      "2.5 hours to 40 minutes",
      "10+ developer and data workflows",
      "150+ automated checks",
      "8+ production workflows",
    ]) {
      expect(englishExperienceCopy, `claim: ${claim}`).toContain(claim);
    }
  });

  it("publishes the résumé's Neon IT Systems metrics", () => {
    for (const claim of [
      "20+ REST APIs",
      "2.1 seconds to 480 ms",
      "250K+ records",
      "API timeout errors by 24%",
      "12 application releases",
      "Mentored 3 junior engineers",
      "15+ REST APIs",
      "100K+ business records",
      "7 hours per week",
      "18+ production defects",
    ]) {
      expect(englishExperienceCopy, `claim: ${claim}`).toContain(claim);
    }
  });

  it("carries no metric from the retired, off-résumé roles", () => {
    const everyEnglishString = Object.values(enUS).join("\n");
    for (const superseded of [
      "4+ years",
      "four-plus",
      "99.97%",
      "fixed-income",
      "$2.4M",
      "500K daily transactions",
      "Morgan Stanley",
      "Sage Softtech",
      "financial services",
    ]) {
      expect(everyEnglishString.toLowerCase()).not.toContain(superseded.toLowerCase());
    }
  });
});
