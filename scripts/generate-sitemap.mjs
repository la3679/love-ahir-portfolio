/**
 * Generates public/sitemap.xml from the route list + case-study slugs.
 *
 * Slugs are extracted from src/data/caseStudies.ts textually so the script
 * needs no TS toolchain; a vitest test asserts the generated file stays in
 * sync with the data. Run via `npm run generate:sitemap` after adding or
 * renaming a case study.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://loveahir.com";

const source = readFileSync(join(root, "src/data/caseStudies.ts"), "utf8");
const slugs = [...source.matchAll(/^\s{4}slug: "([a-z0-9-]+)",$/gm)].map((m) => m[1]);

if (slugs.length === 0) {
  throw new Error("No case-study slugs found — did caseStudies.ts change shape?");
}

const routes = ["/", "/work", ...slugs.map((s) => `/work/${s}`), "/research", "/about"];

const today = new Date().toISOString().slice(0, 10);
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${SITE}${route === "/" ? "/" : route}</loc>
    <lastmod>${today}</lastmod>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

writeFileSync(join(root, "public/sitemap.xml"), xml);
console.log(`sitemap.xml written with ${routes.length} routes (${slugs.length} case studies).`);
