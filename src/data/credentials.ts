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
 * - `datePrecision` keeps rendering honest. Four LinkedIn Learning
 *   certificates were recorded as the first of the month, which is month
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
    url: "https://www.linkedin.com/learning/certificates/b3e66a7d7344afa613aea09e7dba21533b25eb62d2d6506917ca3e6f1f6ca3f3",
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
 * for role relevance: cloud fundamentals, Python, then the data-analysis path.
 */
export const homeCredentialIds = [
  "az-900-cert-prep",
  "python-essential-training",
  "career-essentials-data-analysis",
  "learning-data-analytics-foundations",
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
