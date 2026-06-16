import { describe, it, expect, afterAll, beforeEach } from "vitest";
import i18n from "./i18n";
import { languages, resources, supportedLngs, fallbackLng } from "./locales";
import enUS, { type TranslationKey } from "./locales/en-US";

const allKeys = Object.keys(enUS) as TranslationKey[];

afterAll(async () => {
  await i18n.changeLanguage("en-US");
});

describe("locale configuration", () => {
  it("registers all 8 required locales", () => {
    expect(supportedLngs).toEqual([
      "en-US",
      "en-GB",
      "hi",
      "gu",
      "es",
      "fr",
      "de",
      "ja",
    ]);
    expect(languages).toHaveLength(8);
  });

  it("falls back to en-US", () => {
    expect(fallbackLng).toBe("en-US");
  });

  it("gives every locale a native name and flag for the selector", () => {
    for (const lng of languages) {
      expect(lng.nativeName.length).toBeGreaterThan(0);
      expect(lng.flag.length).toBeGreaterThan(0);
      expect(resources[lng.code]).toBeDefined();
    }
  });

  it("keeps every locale structurally in sync with the en-US key set", () => {
    for (const code of supportedLngs) {
      const dict = resources[code].translation;
      const keys = Object.keys(dict).sort();
      expect(keys, `locale ${code} key set`).toEqual([...allKeys].sort());
      // No empty / missing values.
      for (const key of allKeys) {
        expect(dict[key], `${code} → ${key}`).toBeTruthy();
      }
    }
  });
});

describe("i18n translation loading", () => {
  beforeEach(async () => {
    await i18n.changeLanguage("en-US");
  });

  it("initializes with the translation resources bundled", () => {
    expect(i18n.hasResourceBundle("en-US", "translation")).toBe(true);
    expect(i18n.hasResourceBundle("ja", "translation")).toBe(true);
  });

  it("loads English (US) strings by default", () => {
    expect(i18n.t("nav.about")).toBe("About");
    expect(i18n.t("hero.explore")).toBe("Explore my work");
  });

  it("switches the active language and returns localized strings", async () => {
    await i18n.changeLanguage("es");
    expect(i18n.t("nav.about")).toBe("Sobre mí");

    await i18n.changeLanguage("ja");
    expect(i18n.t("nav.contact")).toBe("連絡先");

    await i18n.changeLanguage("de");
    expect(i18n.t("theme.dark")).toBe("Dunkel");

    await i18n.changeLanguage("hi");
    expect(i18n.t("nav.skills")).toBe("कौशल");
  });

  it("treats dotted keys as literal (keySeparator disabled)", async () => {
    await i18n.changeLanguage("fr");
    // Would resolve to a nested object lookup if keySeparator were on.
    expect(i18n.t("contact.link.email")).toBe("E-mail");
  });

  it("falls back to en-US for an unsupported language", async () => {
    await i18n.changeLanguage("zz");
    expect(i18n.t("nav.about")).toBe("About");
  });
});
