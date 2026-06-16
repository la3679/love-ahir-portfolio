import { describe, it, expect } from "vitest";
import { buildMailtoUrl } from "@/lib/mailto";

describe("buildMailtoUrl", () => {
  it("targets the provided address", () => {
    const url = buildMailtoUrl("a@b.com", {
      name: "Sam",
      email: "sam@x.com",
      message: "Hello",
    });
    expect(url.startsWith("mailto:a@b.com?")).toBe(true);
  });

  it("encodes the subject with the sender name", () => {
    const url = buildMailtoUrl("a@b.com", {
      name: "Ada Lovelace",
      email: "ada@x.com",
      message: "Hi",
    });
    expect(url).toContain(encodeURIComponent("Ada Lovelace"));
    expect(url).toContain("subject=");
    expect(url).toContain("body=");
  });

  it("encodes special characters in the message body safely", () => {
    const url = buildMailtoUrl("a@b.com", {
      name: "Q",
      email: "q@x.com",
      message: "line1 & line2 ? yes",
    });
    expect(url).not.toContain(" & ");
    expect(url).toContain(encodeURIComponent("line1 & line2 ? yes"));
  });

  it("falls back to a default sender when name is empty", () => {
    const url = buildMailtoUrl("a@b.com", { name: "", email: "", message: "" });
    expect(url).toContain(encodeURIComponent("a visitor"));
  });
});
