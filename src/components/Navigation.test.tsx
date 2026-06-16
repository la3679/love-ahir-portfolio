import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Navigation, { navItems, scrollToHref } from "./Navigation";
import { profile } from "@/data/portfolio";

describe("navItems config", () => {
  it("exposes the expected anchor sections", () => {
    const hrefs = navItems.map((n) => n.href);
    expect(hrefs).toContain("#about");
    expect(hrefs).toContain("#projects");
    expect(hrefs).toContain("#contact");
  });
});

describe("scrollToHref", () => {
  beforeEach(() => {
    window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;
  });

  it("scrolls to the top for the home anchor", () => {
    scrollToHref("#");
    expect(window.scrollTo).toHaveBeenCalledWith(
      expect.objectContaining({ top: 0 }),
    );
  });

  it("does not throw when the target element is missing", () => {
    expect(() => scrollToHref("#does-not-exist")).not.toThrow();
  });
});

describe("<Navigation />", () => {
  it("renders the brand and every nav label", () => {
    render(<Navigation />);
    expect(screen.getByText("Love Ahir")).toBeInTheDocument();
    for (const item of navItems) {
      expect(
        screen.getAllByText(item.label).length,
      ).toBeGreaterThan(0);
    }
  });

  it("links the resume button to the resume URL", () => {
    render(<Navigation />);
    const resumeLinks = screen.getAllByRole("link", { name: /resume/i });
    expect(resumeLinks[0]).toHaveAttribute("href", profile.resumeUrl);
  });

  it("scrolls when a nav item is clicked", async () => {
    window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;
    // scrollToHref only scrolls when the target anchor exists, so provide it.
    const target = document.createElement("section");
    target.id = "about";
    document.body.appendChild(target);
    const user = userEvent.setup();
    render(<Navigation />);
    await user.click(screen.getByRole("button", { name: "About" }));
    expect(window.scrollTo).toHaveBeenCalled();
    target.remove();
  });
});
