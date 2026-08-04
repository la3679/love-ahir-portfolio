import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import i18n from "@/lib/i18n";
import { languages } from "@/lib/locales";
import LanguageSelector, {
  LANGUAGE_OPTION_CLASS,
  LANGUAGE_MENU_COLLISION_PADDING,
} from "./LanguageSelector";

beforeEach(async () => {
  await i18n.changeLanguage("en-US");
});

const openMenu = async () => {
  const user = userEvent.setup();
  render(<LanguageSelector />);
  await user.click(screen.getByRole("button", { name: /language/i }));
  return user;
};

describe("<LanguageSelector />", () => {
  it("keeps a 44px minimum target on the option class", () => {
    // Guards the exact regression Love measured at 390px: six of the eight
    // rows rendered 32px tall, and the two English rows only reached 52px
    // because their labels wrapped.
    expect(LANGUAGE_OPTION_CLASS).toContain("min-h-11");
  });

  it("applies the 44px option class to every language row", async () => {
    await openMenu();
    const options = await screen.findAllByRole("menuitemradio");
    expect(options).toHaveLength(languages.length);
    for (const option of options) {
      expect(option.className, option.textContent ?? "").toContain("min-h-11");
    }
  });

  it("holds the dropdown inside the 20px content gutter", () => {
    // Radix flushed the 208px panel to x=0 at 390px without this.
    expect(LANGUAGE_MENU_COLLISION_PADDING).toBe(20);
  });

  it("does not repeat a label that adds no information", async () => {
    await openMenu();
    // Scoped to the menu: the trigger legitimately carries the active locale
    // twice (visible label + sr-only English name).
    const menu = within(screen.getByRole("menu"));
    // "English (US)" names itself identically in both columns; rendering it
    // twice was what forced the wrap. Non-English rows keep both names.
    expect(menu.getAllByText("English (US)")).toHaveLength(1);
    expect(menu.getByText("हिन्दी")).toBeInTheDocument();
    expect(menu.getByText("Hindi")).toBeInTheDocument();
  });

  it("marks the active locale as the checked radio option", async () => {
    await openMenu();
    const checked = await screen.findAllByRole("menuitemradio", { checked: true });
    expect(checked).toHaveLength(1);
    expect(checked[0]).toHaveTextContent("English (US)");
  });

  it("reports open state so an outer layer can defer its own dismissal", async () => {
    const user = userEvent.setup();
    const seen: boolean[] = [];
    render(<LanguageSelector align="start" onOpenChange={(o) => seen.push(o)} />);

    await user.click(screen.getByRole("button", { name: /language/i }));
    expect(seen).toEqual([true]);

    await user.keyboard("{Escape}");
    expect(seen).toEqual([true, false]);
  });
});
