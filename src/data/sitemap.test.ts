import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { caseStudies } from "./caseStudies";

/**
 * Keeps public/sitemap.xml in sync with the case-study data: if a slug is
 * added or renamed without re-running `npm run generate:sitemap`, this fails.
 */
describe("sitemap.xml", () => {
  const xml = readFileSync(join(process.cwd(), "public/sitemap.xml"), "utf8");

  it("lists every static route", () => {
    for (const route of ["/", "/work", "/research", "/about"]) {
      expect(xml).toContain(`<loc>https://loveahir.com${route === "/" ? "/" : route}</loc>`);
    }
  });

  it("lists every case-study slug", () => {
    for (const cs of caseStudies) {
      expect(xml, `sitemap entry for ${cs.slug}`).toContain(
        `<loc>https://loveahir.com/work/${cs.slug}</loc>`,
      );
    }
  });
});
