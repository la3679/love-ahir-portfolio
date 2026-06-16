import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { languages } from "@/lib/locales";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * Accessible locale switcher for the header. Renders a globe button that
 * opens a radio-group menu of the 8 supported languages (each shown in its
 * own script). Selecting one calls i18n.changeLanguage, which both re-renders
 * the tree and persists the choice via the LanguageDetector localStorage cache.
 */
export function LanguageSelector({ className = "" }: { className?: string }) {
  const { i18n, t } = useTranslation();

  // resolvedLanguage is the actually-active locale after fallback resolution.
  const active = i18n.resolvedLanguage ?? i18n.language;
  const current = languages.find((l) => l.code === active) ?? languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={t("language.label")}
          title={t("language.label")}
          className={`inline-flex h-10 items-center gap-1.5 rounded-lg border border-border bg-card/40 px-2.5 text-muted-foreground backdrop-blur transition-colors hover:border-aurora-violet/50 hover:text-foreground ${className}`}
        >
          <Globe className="h-[1.1rem] w-[1.1rem]" />
          <span className="text-sm font-medium" aria-hidden="true">
            {current.flag}
          </span>
          <span className="sr-only">{current.englishName}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52 glass-strong">
        <DropdownMenuLabel>{t("language.label")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={active}
          onValueChange={(code) => i18n.changeLanguage(code)}
        >
          {languages.map((lng) => (
            <DropdownMenuRadioItem
              key={lng.code}
              value={lng.code}
              className="cursor-pointer gap-2"
            >
              <span className="text-base" aria-hidden="true">
                {lng.flag}
              </span>
              <span className="flex-1">{lng.nativeName}</span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default LanguageSelector;
