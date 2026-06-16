import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { resources, supportedLngs, fallbackLng } from "./locales";

/**
 * i18next bootstrap for the portfolio.
 *
 * - 8 locales (en-US, en-GB, hi, gu, es, fr, de, ja) sourced from
 *   src/lib/locales, each implementing the same flat key set.
 * - keySeparator / nsSeparator are disabled so our dotted keys
 *   ("hero.badge", "contact.link.email") are treated as literal keys
 *   rather than nested lookups.
 * - LanguageDetector persists the user's choice in localStorage and falls
 *   back to the browser language, then to en-US.
 */
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    supportedLngs,
    fallbackLng,
    // Keep region codes intact: en-US / en-GB are distinct locales, so we do
    // NOT collapse them to a base "en" (which has no bundle). Unsupported or
    // bare codes resolve via fallbackLng instead.
    load: "currentOnly",
    keySeparator: false,
    nsSeparator: false,
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      lookupLocalStorage: "i18nextLng",
      caches: ["localStorage"],
    },
  });

export default i18n;
