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
 * Every locale row is a 44px pointer target.
 *
 * `min-h-11` is the load-bearing part: the shadcn radio item ships with
 * `py-1.5`, which left the short rows (Hindi, Gujarati, Español, Français,
 * Deutsch, 日本語) at 32px and only pushed the two English rows to 52px
 * because their labels wrapped. Exported so `LanguageSelector.test.tsx` can
 * assert the floor never silently regresses.
 */
export const LANGUAGE_OPTION_CLASS = "min-h-11 cursor-pointer gap-3";

/**
 * The dropdown panel is capped to the space the trigger actually has and
 * scrolls inside that cap, so eight 44px rows still fit at 320x780 without
 * pushing the page. `collisionPadding` keeps it inside the 20px content
 * gutter instead of letting collision detection flush it to x=0.
 */
export const LANGUAGE_MENU_COLLISION_PADDING = 20;

/**
 * Accessible locale switcher for the header. Renders a globe button that
 * opens a radio-group menu of the 8 supported languages (each shown in its
 * own script). Selecting one calls i18n.changeLanguage, which both re-renders
 * the tree and persists the choice via the LanguageDetector localStorage cache.
 *
 * `align` defaults to end-alignment for the desktop header, where the trigger
 * sits at the right edge. The mobile panel passes `align="start"` because the
 * trigger sits at the left content gutter there and end-alignment pushed the
 * panel off the left edge of the viewport.
 *
 * `onOpenChange` lets an outer dismissable layer (the mobile navigation panel)
 * know this nested layer is open, so one Escape closes only this menu.
 */
export function LanguageSelector({
  className = "",
  align = "end",
  onOpenChange,
}: {
  className?: string;
  align?: "start" | "end";
  onOpenChange?: (open: boolean) => void;
}) {
  const { i18n, t } = useTranslation();

  // resolvedLanguage is the actually-active locale after fallback resolution.
  const active = i18n.resolvedLanguage ?? i18n.language;
  const current = languages.find((l) => l.code === active) ?? languages[0];

  return (
    <DropdownMenu onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={t("language.label")}
          title={t("language.label")}
          className={`inline-flex h-11 items-center gap-1.5 rounded-md border border-border bg-card px-2.5 text-muted-foreground transition-colors hover:border-border-bright hover:text-foreground ${className}`}
        >
          <Globe className="h-[1.1rem] w-[1.1rem]" />
          <span className="max-w-[5.5rem] truncate text-sm font-medium" aria-hidden="true">
            {current.nativeName}
          </span>
          <span className="sr-only">{current.englishName}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        collisionPadding={LANGUAGE_MENU_COLLISION_PADDING}
        // The available-height var is published by Radix's collision-aware
        // positioner; capping to it turns the panel into a keyboard-scrollable
        // list (arrow keys keep the focused row in view) on short viewports.
        className="max-h-[var(--radix-dropdown-menu-content-available-height)] w-52 overflow-y-auto"
      >
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
              className={LANGUAGE_OPTION_CLASS}
            >
              <span className="flex-1">{lng.nativeName}</span>
              {/* The two English rows name themselves identically; repeating
                  the label only forced a wrap, so show it when it adds info. */}
              {lng.englishName !== lng.nativeName && (
                <span className="whitespace-nowrap text-xs text-muted-foreground">
                  {lng.englishName}
                </span>
              )}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default LanguageSelector;
