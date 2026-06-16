import type { Translation } from "./en-US";
import enUS from "./en-US";
import enGB from "./en-GB";
import hi from "./hi";
import gu from "./gu";
import es from "./es";
import fr from "./fr";
import de from "./de";
import ja from "./ja";

export type { Translation, TranslationKey } from "./en-US";

/** Metadata for a supported locale, used to render the language selector. */
export interface LanguageMeta {
  /** i18next language code (BCP-47 where it matters, e.g. en-US / en-GB). */
  code: string;
  /** Name shown in English (for the aria-label / fallback). */
  englishName: string;
  /** Name shown in its own script. */
  nativeName: string;
  /** Short flag/region emoji for the selector. */
  flag: string;
}

/**
 * Ordered list of every supported locale. The order here is the order the
 * language selector renders them in.
 */
export const languages: LanguageMeta[] = [
  { code: "en-US", englishName: "English (US)", nativeName: "English (US)", flag: "🇺🇸" },
  { code: "en-GB", englishName: "English (UK)", nativeName: "English (UK)", flag: "🇬🇧" },
  { code: "hi", englishName: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
  { code: "gu", englishName: "Gujarati", nativeName: "ગુજરાતી", flag: "🇮🇳" },
  { code: "es", englishName: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  { code: "fr", englishName: "French", nativeName: "Français", flag: "🇫🇷" },
  { code: "de", englishName: "German", nativeName: "Deutsch", flag: "🇩🇪" },
  { code: "ja", englishName: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
];

/** i18next resources bundle: one `translation` namespace per locale. */
export const resources: Record<string, { translation: Translation }> = {
  "en-US": { translation: enUS },
  "en-GB": { translation: enGB },
  hi: { translation: hi },
  gu: { translation: gu },
  es: { translation: es },
  fr: { translation: fr },
  de: { translation: de },
  ja: { translation: ja },
};

export const supportedLngs = languages.map((l) => l.code);
export const fallbackLng = "en-US";
