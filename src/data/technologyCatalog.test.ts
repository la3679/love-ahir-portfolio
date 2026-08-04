import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  capabilityGroups,
  getTechnology,
  stageTechnologyRails,
  technologies,
  type TechnologyId,
} from "./technologyCatalog";

describe("evidence-backed technology catalog", () => {
  it("contains exactly the 33 technologies supported by a project or dated role", () => {
    const names = Object.values(technologies).map(({ name }) => name);

    expect(names).toHaveLength(33);
    expect(names).not.toContain("Docker");
    expect(names).not.toContain("Selenium");
  });

  it("assigns every technology to exactly one of the six requested groups", () => {
    expect(capabilityGroups.map(({ id }) => id)).toEqual([
      "languages",
      "cloud",
      "databases",
      "ai",
      "testing",
      "practices",
    ]);

    const grouped = capabilityGroups.flatMap(({ technologies: ids }) => ids);
    expect(grouped).toHaveLength(33);
    expect(new Set(grouped).size).toBe(33);
    expect(new Set(grouped)).toEqual(
      new Set(Object.keys(technologies) as TechnologyId[]),
    );
  });

  it("keeps the two five-item hero rails disjoint and logo-backed", () => {
    const top = stageTechnologyRails.top;
    const bottom = stageTechnologyRails.bottom;

    expect(top).toHaveLength(5);
    expect(bottom).toHaveLength(5);
    expect(bottom.filter((id) => top.includes(id as (typeof top)[number]))).toEqual(
      [],
    );

    for (const id of [...top, ...bottom]) {
      expect(getTechnology(id).icon).toMatch(/^\/img\/tech\/.+\.svg$/);
    }
  });

  it("self-hosts every referenced logo with a normalized 24 by 24 viewBox", () => {
    const iconPaths = new Set(
      Object.values(technologies)
        .map((technology) => getTechnologyByValue(technology).icon)
        .filter((icon): icon is `/img/tech/${string}.svg` => Boolean(icon)),
    );

    for (const icon of iconPaths) {
      const file = resolve(process.cwd(), "public", icon.slice(1));
      expect(existsSync(file), `${icon} should exist`).toBe(true);
      expect(readFileSync(file, "utf8")).toMatch(/viewBox="0 0 24 24"/);
    }
  });
});

function getTechnologyByValue(
  technology: (typeof technologies)[TechnologyId],
) {
  return technology as { readonly icon?: `/img/tech/${string}.svg` };
}
