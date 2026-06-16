import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "next-themes";
import { ThemeToggle } from "./ThemeToggle";

function renderToggle(defaultTheme = "dark") {
  return render(
    <ThemeProvider attribute="class" defaultTheme={defaultTheme} enableSystem={false}>
      <ThemeToggle />
    </ThemeProvider>,
  );
}

describe("<ThemeToggle />", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = "";
  });

  it("renders an accessible toggle button", () => {
    renderToggle();
    expect(screen.getByRole("button", { name: /theme|mode/i })).toBeInTheDocument();
  });

  it("applies the dark class to <html> for the default dark theme", async () => {
    await act(async () => {
      renderToggle("dark");
    });
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("switches to light mode when clicked from dark", async () => {
    const user = userEvent.setup();
    await act(async () => {
      renderToggle("dark");
    });
    await user.click(screen.getByRole("button"));
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(localStorage.getItem("theme")).toBe("light");
  });

  it("switches back to dark mode when clicked from light", async () => {
    const user = userEvent.setup();
    await act(async () => {
      renderToggle("light");
    });
    await user.click(screen.getByRole("button"));
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(localStorage.getItem("theme")).toBe("dark");
  });
});
