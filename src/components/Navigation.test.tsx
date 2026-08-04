import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import i18n from "@/lib/i18n";
import Navigation, { navItems, footerNavItems } from "./Navigation";
import { profile } from "@/data/portfolio";

// Resolve labels through the same i18n instance the component uses.
const label = (key: string) => i18n.t(key);

beforeEach(async () => {
  await i18n.changeLanguage("en-US");
});

const renderNav = (initialPath = "/") =>
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Navigation />
    </MemoryRouter>,
  );

describe("navItems config", () => {
  it("exposes the five recruiter actions", () => {
    // Order approved at §31.2: About · Experience · Work · Contact.
    expect(navItems.map((n) => n.to)).toEqual([
      "/about",
      "/about#experience",
      "/work",
      "#contact",
    ]);
  });

  it("keeps Research out of the primary navigation", () => {
    expect(navItems.map((n) => n.to)).not.toContain("/research");
    expect(navItems.map((n) => n.labelKey)).not.toContain("nav.research");
  });

  it("keeps Research discoverable from the footer", () => {
    expect(footerNavItems.map((n) => n.to)).toContain("/research");
  });

  it("references i18n keys rather than hardcoded labels", () => {
    for (const item of [...navItems, ...footerNavItems]) {
      expect(item.labelKey).toMatch(/^nav\./);
    }
  });
});

describe("<Navigation />", () => {
  it("renders the brand and every nav label as a link", () => {
    renderNav();
    expect(screen.getByText("Love Ahir")).toBeInTheDocument();
    for (const item of navItems) {
      const links = screen
        .getAllByRole("link")
        .filter((l) => l.getAttribute("href") === item.to);
      expect(links.length, `link to ${item.to}`).toBeGreaterThan(0);
      expect(screen.getAllByText(label(item.labelKey)).length).toBeGreaterThan(0);
    }
  });

  it("marks the current route with aria-current", () => {
    renderNav("/work");
    const active = screen
      .getAllByRole("link")
      .filter((l) => l.getAttribute("aria-current") === "page");
    expect(active.some((l) => l.getAttribute("href") === "/work")).toBe(true);
  });

  it("links the resume button to the resume URL", () => {
    renderNav();
    const resumeLinks = screen.getAllByRole("link", { name: /resume|cv/i });
    expect(resumeLinks[0]).toHaveAttribute("href", profile.resumeUrl);
  });

  it("closes the mobile menu when Escape is pressed", async () => {
    const user = userEvent.setup();
    renderNav();
    const toggle = screen.getByRole("button", { name: /toggle menu/i });

    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");

    await user.keyboard("{Escape}");
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it("returns focus to the menu button after Escape", async () => {
    const user = userEvent.setup();
    renderNav();
    const toggle = screen.getByRole("button", { name: /toggle menu/i });

    await user.click(toggle);
    await user.keyboard("{Escape}");

    expect(toggle).toHaveFocus();
  });

  it("dismisses the language menu and the panel one Escape at a time", async () => {
    const user = userEvent.setup();
    renderNav();
    const toggle = screen.getByRole("button", { name: /toggle menu/i });

    await user.click(toggle);
    // jsdom has no media queries, so the desktop header controls are in the
    // tree too; scope to the mobile panel's own language trigger.
    const panel = document.getElementById("mobile-menu");
    expect(panel).not.toBeNull();
    const language = within(panel as HTMLElement).getByRole("button", {
      name: /language/i,
    });
    await user.click(language);
    expect(await screen.findByRole("menu")).toBeInTheDocument();

    // First Escape: the inner layer only.
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("menu")).not.toBeInTheDocument());
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(language).toHaveFocus();

    // Second Escape: the outer layer.
    await user.keyboard("{Escape}");
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).toHaveFocus();
  });
});
