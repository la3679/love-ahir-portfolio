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
    // Love's Gate 3 cap. All seven roles still render on /about#experience.
    expect(homeExperienceIds).toHaveLength(3);
    expect(homeExperiences).toHaveLength(3);
    expect(experiences.length).toBe(7);
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

  it("uses the approved umbrella headline and a 4+ years summary", () => {
    expect(profile.headline).toBe(
      "I build reliable full-stack products and applied AI systems.",
    );
    expect(profile.summary).toMatch(/^Software engineer with 4\+ years/);
    expect(profile.summary).not.toMatch(/privacy researcher/i);
  });

  it("reports Phoenix as the current location", () => {
    expect(profile.location).toBe("Phoenix, AZ");
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

  it("adds the Morgan Stanley and both Sage Softtech roles", () => {
    const morgan = byId("morgan-stanley");
    expect(morgan?.company).toBe("Morgan Stanley");
    expect(morgan?.period).toBe("Aug 2025 — Present");
    expect(morgan?.location).toBe("Phoenix, AZ");
    expect(morgan?.focusKey).toBe("exp.morgan-stanley.focus");

    const sage2 = byId("sage-software-engineer-2");
    expect(sage2?.company).toBe("Sage Softtech");
    expect(sage2?.period).toBe("Oct 2021 — Jul 2023");
    expect(sage2?.location).toBe("Ahmedabad, India");

    const sage1 = byId("sage-associate-developer");
    expect(sage1?.company).toBe("Sage Softtech");
    expect(sage1?.period).toBe("Feb 2021 — Sep 2021");
  });

  it("preserves every previously listed role", () => {
    for (const id of [
      "axisray",
      "moon-technolabs",
      "rit-research-assistant",
      "rit-teaching-assistant",
    ]) {
      expect(byId(id), `preserved role ${id}`).toBeDefined();
    }
    expect(experiences).toHaveLength(7);
  });

  it("marks only Morgan Stanley as current", () => {
    const current = experiences.filter((e) => e.current);
    expect(current.map((e) => e.id)).toEqual(["morgan-stanley"]);
  });

  it("groups roles without changing the stated chronology", () => {
    expect(experiencesInGroup(experiences, "industry").map((e) => e.id)).toEqual([
      "morgan-stanley",
      "sage-software-engineer-2",
      "axisray",
      "moon-technolabs",
      "sage-associate-developer",
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

  it("publishes the authorized Morgan Stanley metrics", () => {
    for (const claim of [
      "99.97% uptime",
      "more than 200 fixed-income users",
      "reducing manual intervention by 65%",
      "an estimated $2.4M",
      "10M+ documents",
      "8 minutes to under 90 seconds",
      "precision by 38%",
      "deployment cycle time by 50%",
    ]) {
      expect(englishExperienceCopy, `claim: ${claim}`).toContain(claim);
    }
  });

  it("publishes the authorized Sage Softtech metrics", () => {
    for (const claim of [
      "500K daily transactions",
      "API response time by 40%",
      "1M events per day",
      "fraud false positives by 30%",
      "10 features across four sprints",
      "QA bug cycle by 45%",
      "14 seconds to 2.1 seconds",
      "85% improvement",
      "five-member Agile squad",
      "mentored three engineers",
      "120 pull requests",
      "MTTR by 32%",
      "10K daily records",
      "40 bugs",
      "reliability by 22%",
      "page-load time by 30%",
      "500K records",
    ]) {
      expect(englishExperienceCopy, `claim: ${claim}`).toContain(claim);
    }
  });

  it("always qualifies the $2.4M figure as estimated", () => {
    const occurrences = englishExperienceCopy.match(/\$2\.4M/g) ?? [];
    expect(occurrences).toHaveLength(1);
    expect(englishExperienceCopy).toContain("an estimated $2.4M");
  });

  it("carries no superseded metric from the earlier candidate documents", () => {
    const everyEnglishString = Object.values(enUS).join("\n");
    for (const superseded of [
      "3+ years",
      "60% fewer",
      "40% shorter reconciliation",
      "55% faster",
      "99.95%",
      "six FastAPI",
      "35%",
      "28% fewer",
      "eight features across three sprints",
      "42% fewer",
      "12 seconds to 1.8 seconds",
      "four-person squad",
      "100+ PR",
    ]) {
      expect(everyEnglishString.toLowerCase()).not.toContain(superseded.toLowerCase());
    }
  });
});
