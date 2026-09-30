/**
 * Credentials and continued learning.
 *
 * Replaces the old `certifications` array in portfolio.ts, whose titles were
 * materially wrong (see IMPLEMENTATION.md §25.5). Every field here was
 * reconciled against the certificate URLs Love supplied; nothing is inferred.
 *
 * Honesty rules baked into the model:
 * - `type` is the real award type. None of these is a professional
 *   certification, which is why the public section is titled "Credentials and
 *   continued learning" and no "Certifications" group exists.
 * - The AZ-900 entry is exam *preparation*. It must never be presented as a
 *   Microsoft or Azure certification; `noteKey` carries that disclaimer and
 *   `credentials.test.ts` asserts it stays attached.
 * - `datePrecision` keeps rendering honest. Entries whose certificate register
 *   gives only a month are recorded as the first of that month, which is month
 *   precision written in ISO form, so they render as "June 2025" rather than
 *   inventing a day. Only Python Essential Training has a verified day, and
 *   the CDAC certificate is year-only.
 * - `published: false` withholds an entry from every surface. CDAC stays
 *   unpublished until Love verifies its link and framing (§26.4).
 * - No credential ID, grade, expiry, or skill list is claimed. A certificate
 *   URL hash is not a credential ID.
 */

export type CredentialType =
  | "course-completion"
  | "learning-path"
  | "certificate"
  | "professional-certification";

export type DatePrecision = "day" | "month" | "year";

export interface Credential {
  /** Stable slug, used as a React key and in tests. */
  id: string;
  /** Exact official title as it appears on the certificate. Never shortened. */
  title: string;
  type: CredentialType;
  /** Who issues/hosts the certificate. */
  provider: string;
  /** Authoring organisation and/or instructor, when named on the certificate. */
  attribution?: string;
  /** ISO date. Read together with `datePrecision` — never rendered raw. */
  issued: string;
  datePrecision: DatePrecision;
  /** Verified HTTPS certificate URL. */
  url: string;
  /** Locale key for a required clarification shown next to the title. */
  noteKey?: string;
  /** Withheld from every surface until its provenance is verified. */
  published?: boolean;
}

export const credentials: Credential[] = [
  {
    id: "anthropic-mcp-advanced-topics",
    title: "Model Context Protocol: Advanced Topics",
    type: "course-completion",
    provider: "Anthropic",
    issued: "2026-08-01",
    datePrecision: "month",
    url: "https://verify.skilljar.com/c/aj8uuzaqu3u5",
  },
  {
    id: "anthropic-intro-mcp",
    title: "Introduction to Model Context Protocol",
    type: "course-completion",
    provider: "Anthropic",
    issued: "2026-08-01",
    datePrecision: "month",
    url: "https://verify.skilljar.com/c/bxbpx8vxtw7t",
  },
  {
    id: "anthropic-intro-claude-cowork",
    title: "Introduction to Claude Cowork",
    type: "course-completion",
    provider: "Anthropic",
    issued: "2026-08-01",
    datePrecision: "month",
    url: "https://verify.skilljar.com/c/gcbnd5c7dc4o",
  },
  {
    id: "anthropic-claude-platform-101",
    title: "Claude Platform 101",
    type: "course-completion",
    provider: "Anthropic",
    issued: "2026-08-01",
    datePrecision: "month",
    url: "https://verify.skilljar.com/c/kdymtyobnxy6",
  },
  {
    id: "anthropic-claude-code-101",
    title: "Claude Code 101",
    type: "course-completion",
    provider: "Anthropic",
    issued: "2026-08-01",
    datePrecision: "month",
    url: "https://verify.skilljar.com/c/a3zjnprjyrkt",
  },
  {
    id: "anthropic-claude-code-in-action",
    title: "Claude Code in Action",
    type: "course-completion",
    provider: "Anthropic",
    issued: "2026-08-01",
    datePrecision: "month",
    url: "https://verify.skilljar.com/c/c7xxexgvupid",
  },
  {
    id: "anthropic-building-with-claude-api",
    title: "Building with the Claude API",
    type: "course-completion",
    provider: "Anthropic",
    issued: "2026-08-01",
    datePrecision: "month",
    url: "https://verify.skilljar.com/c/qw9ncfwp74k7",
  },
  {
    id: "anthropic-ai-fluency-framework",
    title: "AI Fluency: Framework & Foundations",
    type: "course-completion",
    provider: "Anthropic",
    issued: "2026-08-01",
    datePrecision: "month",
    url: "https://verify.skilljar.com/c/7tz4cdqo8uqj",
  },
  {
    id: "anthropic-ai-fluency-students",
    title: "AI Fluency for Students",
    type: "course-completion",
    provider: "Anthropic",
    issued: "2026-08-01",
    datePrecision: "month",
    url: "https://verify.skilljar.com/c/rn4fkiqz72pd",
  },
  {
    id: "anthropic-ai-fluency-educators",
    title: "AI Fluency for Educators",
    type: "course-completion",
    provider: "Anthropic",
    issued: "2026-08-01",
    datePrecision: "month",
    url: "https://verify.skilljar.com/c/6nkdnu5z4r4r",
  },
  {
    id: "anthropic-claude-101",
    title: "Claude 101",
    type: "course-completion",
    provider: "Anthropic",
    issued: "2026-08-01",
    datePrecision: "month",
    url: "https://verify.skilljar.com/c/dbz3ce4gxjq5",
  },
  {
    id: "forage-jpmorganchase-software-engineering",
    title: "Software Engineering Job Simulation",
    type: "course-completion",
    provider: "Forage",
    attribution: "JPMorganChase",
    issued: "2026-05-01",
    datePrecision: "month",
    url: "https://www.theforage.com/completion-certificates/Sj7temL583QAYpHXD/E6McHJDKsQYh79moz_Sj7temL583QAYpHXD_6a0a18c4bf9fe929381fef96_1779050339694_completion_certificate.pdf",
  },
  {
    id: "az-900-cert-prep",
    title: "Microsoft Azure Fundamentals (AZ-900) Cert Prep by Microsoft Press",
    type: "course-completion",
    provider: "LinkedIn Learning",
    attribution: "Microsoft Press · Jim Cheshire",
    issued: "2025-06-01",
    datePrecision: "month",
    url: "https://www.linkedin.com/learning/certificates/53b8f4559dd722ff7fb5e3a6438894f33da0e7cb07636ca3936ff99f150ab5bc",
    noteKey: "credentials.note.examPrep",
  },
  {
    id: "career-essentials-data-analysis",
    title: "Career Essentials in Data Analysis by Microsoft and LinkedIn",
    type: "learning-path",
    provider: "LinkedIn Learning",
    attribution: "Microsoft · LinkedIn",
    issued: "2025-06-01",
    datePrecision: "month",
    url: "https://www.linkedin.com/learning/certificates/b7e85032290a4f063ef4905f75d28d23df2ef7d98a738df62e79268b6ce3eb14",
  },
  {
    id: "python-essential-training",
    title: "Python Essential Training",
    type: "course-completion",
    provider: "LinkedIn Learning",
    attribution: "Ryan Mitchell",
    issued: "2025-05-03",
    datePrecision: "day",
    url: "https://www.linkedin.com/learning/certificates/4c32a950aef5b51ab3e526d3daa47af2bdb69bc99c58400c61d4fb4243674cce",
  },
  {
    id: "learning-data-analytics-foundations",
    title: "Learning Data Analytics: 1 Foundations",
    type: "course-completion",
    provider: "LinkedIn Learning",
    attribution: "Robin Hunt",
    issued: "2025-06-01",
    datePrecision: "month",
    url: "https://www.linkedin.com/learning/certificates/16b440727ecaddf60b4ccdf38a9d88085e41e468136c951772ab9a1e74f09e47",
  },
  {
    id: "learning-data-analytics-part-2",
    title: "Learning Data Analytics Part 2: Extending and Applying Core Knowledge",
    type: "course-completion",
    provider: "LinkedIn Learning",
    attribution: "Robin Hunt",
    issued: "2025-06-01",
    datePrecision: "month",
    url: "https://www.linkedin.com/learning/certificates/83056fccabeba7e7f5127c74177147622ced93f8e9d1cdc5f202a62bb7b046f1",
  },
  {
    id: "intro-career-skills-data-analytics",
    title: "Introduction to Career Skills in Data Analytics",
    type: "course-completion",
    provider: "LinkedIn Learning",
    issued: "2025-06-01",
    datePrecision: "month",
    url: "https://www.linkedin.com/learning/certificates/a6b15365103a23ac6ac545c9d987b73904128f9d31e1f3cffc0e0a327a37f24a",
  },
  {
    id: "data-engineering-foundations",
    title: "Data Engineering Foundations",
    type: "course-completion",
    provider: "LinkedIn Learning",
    issued: "2025-04-01",
    datePrecision: "month",
    url: "https://www.linkedin.com/learning/certificates/456c1c69c23de948aeeed25a7e4108d2ab39e320fd2502ce4989eb7321431c58",
  },
  {
    // Held back deliberately (§26.4): the link is a Drive file rather than an
    // issuer-hosted certificate, and the framing is unverified. Kept in the
    // dataset so the decision stays visible instead of silently disappearing.
    id: "cdac-c-programming",
    title: "C Programming",
    type: "certificate",
    provider: "CDAC",
    issued: "2022-01-01",
    datePrecision: "year",
    url: "https://drive.google.com/file/d/1RT9VAduDF422qZg2ho9nak0OUSkk7BL4/view?usp=sharing",
    published: false,
  },
];

/** Everything cleared for public display, in the order above. */
export const publishedCredentials: Credential[] = credentials.filter(
  (c) => c.published !== false,
);

/**
 * The homepage preview set — explicit curation, not a slice, so reordering
 * the full list never silently changes what a recruiter sees first. Chosen
 * for role relevance: building on LLM APIs, agent tooling, AI-assisted
 * engineering, then a software-engineering job simulation.
 */
export const homeCredentialIds = [
  "anthropic-building-with-claude-api",
  "anthropic-mcp-advanced-topics",
  "anthropic-claude-code-in-action",
  "forage-jpmorganchase-software-engineering",
] as const;

export const homeCredentials: Credential[] = homeCredentialIds.flatMap((id) =>
  publishedCredentials.filter((c) => c.id === id),
);

/**
 * Render an issue date at exactly the precision that was verified, localised
 * for the active UI language. A year-precision entry never gains a month, and
 * a month-precision entry never gains a day.
 */
export function formatCredentialDate(credential: Credential, locale: string): string {
  const date = new Date(`${credential.issued}T00:00:00Z`);
  if (credential.datePrecision === "year") return String(date.getUTCFullYear());

  const options: Intl.DateTimeFormatOptions =
    credential.datePrecision === "day"
      ? { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }
      : { year: "numeric", month: "long", timeZone: "UTC" };

  return new Intl.DateTimeFormat(locale, options).format(date);
}
