import { describe, it, expect } from "vitest";
import {
  credentials,
  publishedCredentials,
  homeCredentials,
  homeCredentialIds,
  formatCredentialDate,
} from "./credentials";
import enUS from "@/lib/locales/en-US";
import { resources, supportedLngs } from "@/lib/locales";

describe("credential integrity", () => {
  it("uses HTTPS certificate URLs for everything published", () => {
    for (const c of publishedCredentials) {
      expect(c.url.startsWith("https://"), c.id).toBe(true);
    }
  });

  it("keeps the CDAC entry unpublished until its link and framing are verified", () => {
    const cdac = credentials.find((c) => c.id === "cdac-c-programming");
    expect(cdac).toBeDefined();
    expect(cdac?.published).toBe(false);
    expect(publishedCredentials.some((c) => c.id === "cdac-c-programming")).toBe(false);
    expect(homeCredentials.some((c) => c.id === "cdac-c-programming")).toBe(false);
  });

  it("never presents the AZ-900 course as a Microsoft or Azure certification", () => {
    const az = credentials.find((c) => c.id === "az-900-cert-prep");
    expect(az).toBeDefined();
    // Exact official title, and an award type that is not a certification.
    expect(az?.title).toBe(
      "Microsoft Azure Fundamentals (AZ-900) Cert Prep by Microsoft Press",
    );
    expect(az?.type).toBe("course-completion");
    // The disclaimer must travel with the entry to every surface.
    expect(az?.noteKey).toBe("credentials.note.examPrep");
    expect(enUS["credentials.note.examPrep"]).toMatch(/not a Microsoft or Azure/i);
  });

  it("claims no professional certification anywhere", () => {
    // None has been earned; a "certifications" heading would be a false claim.
    for (const c of credentials) {
      expect(c.type, c.id).not.toBe("professional-certification");
    }
  });

  it("carries the corrected official titles rather than the truncated ones", () => {
    const titles = credentials.map((c) => c.title);
    expect(titles).toContain("Learning Data Analytics: 1 Foundations");
    expect(titles).toContain(
      "Learning Data Analytics Part 2: Extending and Applying Core Knowledge",
    );
    expect(titles).toContain("Career Essentials in Data Analysis by Microsoft and LinkedIn");
    // The old truncated forms must not come back.
    expect(titles).not.toContain("Learning Data Analytics: Foundations");
    expect(titles).not.toContain("Data Analytics Part 2: Applying Core Knowledge");
  });

  it("claims no credential id, grade, or expiry", () => {
    for (const c of credentials) {
      expect(Object.keys(c)).not.toContain("credentialId");
      expect(Object.keys(c)).not.toContain("expires");
    }
  });
});

describe("credential dates", () => {
  it("renders each date at exactly the precision that was verified", () => {
    const byId = Object.fromEntries(credentials.map((c) => [c.id, c]));
    // Year-only: the CDAC certificate never gains an invented month or day.
    expect(formatCredentialDate(byId["cdac-c-programming"], "en-US")).toBe("2022");
    // Month precision: recorded as the first of the month, so no day is shown.
    expect(formatCredentialDate(byId["az-900-cert-prep"], "en-US")).toBe("June 2025");
    // Day precision: the only entry whose exact day was verified.
    expect(formatCredentialDate(byId["python-essential-training"], "en-US")).toBe(
      "May 3, 2025",
    );
  });

  it("localises the rendered date", () => {
    const az = credentials.find((c) => c.id === "az-900-cert-prep");
    expect(formatCredentialDate(az, "de")).toBe("Juni 2025");
  });
});

describe("home credential preview", () => {
  it("shows three or four published credentials", () => {
    expect(homeCredentials.length).toBeGreaterThanOrEqual(3);
    expect(homeCredentials.length).toBeLessThanOrEqual(4);
    expect(homeCredentials.map((c) => c.id)).toEqual([...homeCredentialIds]);
  });

  it("previews only credentials that are actually published", () => {
    for (const c of homeCredentials) {
      expect(publishedCredentials, c.id).toContain(c);
    }
  });
});

describe("credential copy", () => {
  it("titles the section honestly in every locale", () => {
    expect(enUS["credentials.title"]).toBe("Credentials and continued learning");
    for (const lng of supportedLngs) {
      const dict = resources[lng].translation;
      expect(dict["credentials.title"], lng).toBeTruthy();
      expect(dict["credentials.note.examPrep"], lng).toBeTruthy();
      // The retired "certifications.*" keys must not linger anywhere.
      expect(Object.keys(dict).some((k) => k.startsWith("certifications.")), lng).toBe(
        false,
      );
    }
  });

  it("has a type label for every type in use", () => {
    for (const c of credentials) {
      const key = `credentials.type.${c.type}` as keyof typeof enUS;
      expect(enUS[key], key).toBeTruthy();
    }
  });
});
