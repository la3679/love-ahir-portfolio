import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("framer-motion", async () => {
  const React = await import("react");
  const make = (tag: string) =>
    React.forwardRef((props: Record<string, unknown>, ref) => {
      const clean = { ...props };
      for (const k of [
        "initial",
        "animate",
        "whileInView",
        "variants",
        "transition",
        "viewport",
        "layout",
      ])
        delete clean[k];
      return React.createElement(tag, { ...clean, ref });
    });
  return {
    motion: new Proxy({}, { get: (_t, tag: string) => make(tag) }),
    useReducedMotion: () => false,
  };
});

import Contact from "./Contact";
import i18n from "@/lib/i18n";
import { profile } from "@/data/portfolio";

beforeEach(async () => {
  await i18n.changeLanguage("en-US");
});

describe("<Contact />", () => {
  it("renders the section heading and the role-target note", () => {
    render(<Contact />);
    expect(
      screen.getByRole("heading", { name: i18n.t("contact.title") }),
    ).toBeInTheDocument();
    expect(screen.getByText(i18n.t("contact.openTo"))).toBeInTheDocument();
    expect(screen.getByText(i18n.t("contact.openToText"))).toBeInTheDocument();
  });

  it("states engineering role targets without an unverified availability claim", () => {
    const { container } = render(<Contact />);
    const text = container.textContent ?? "";
    expect(text).toMatch(/Software Engineer/);
    expect(text).not.toMatch(/available now/i);
  });

  it("links the primary CTA to a mailto for the profile email", () => {
    render(<Contact />);
    const mail = screen.getByRole("link", { name: new RegExp(profile.email) });
    expect(mail).toHaveAttribute("href", `mailto:${profile.email}`);
  });

  it("copies the email address to the clipboard", async () => {
    // userEvent installs a working clipboard stub; read it back to verify.
    const user = userEvent.setup();
    render(<Contact />);
    await user.click(
      screen.getByRole("button", { name: i18n.t("contact.copyEmail") }),
    );

    expect(await screen.findByText(i18n.t("contact.copied"))).toBeInTheDocument();
    await expect(navigator.clipboard.readText()).resolves.toBe(profile.email);
  });

  it("exposes GitHub, LinkedIn, and resume links", () => {
    render(<Contact />);
    expect(
      screen.getByRole("link", { name: new RegExp(i18n.t("contact.link.github")) }),
    ).toHaveAttribute("href", profile.github);
    expect(
      screen.getByRole("link", { name: new RegExp(i18n.t("contact.link.linkedin")) }),
    ).toHaveAttribute("href", profile.linkedin);
    expect(
      screen.getByRole("link", { name: new RegExp(i18n.t("nav.resume"), "i") }),
    ).toHaveAttribute("href", profile.resumeUrl);
  });
});
