import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import BrandLogo from "./BrandLogo";
import { BRAND_ASSETS } from "./Seo";
import markGeometry from "@/lib/brandMark.json";

const html = readFileSync(join(process.cwd(), "index.html"), "utf8");

describe("brand mark geometry", () => {
  it("keeps one shared geometry source with both shape sets", () => {
    expect(markGeometry.viewBox).toBe(96);
    for (const variant of ["regular", "compact"] as const) {
      const shapes = markGeometry.shapes[variant];
      // L stem, L foot, A chevron, A crossbar.
      expect(shapes, `${variant} shape count`).toHaveLength(4);
      expect(shapes.filter((s) => s.kind === "rect")).toHaveLength(3);
      expect(shapes.filter((s) => s.kind === "path")).toHaveLength(1);
      expect(markGeometry.polygons[variant]).toHaveLength(1);
    }
  });

  it("keeps the SVG path and the rasteriser polygon in agreement", () => {
    // The browser draws the chevron from `d`; the Python generator draws it
    // from `polygons`. If they diverge, the favicon stops matching the header.
    for (const variant of ["regular", "compact"] as const) {
      const path = markGeometry.shapes[variant].find((s) => s.kind === "path");
      const numbers = (path.d.match(/-?\d+(\.\d+)?/g) ?? []).map(Number);
      const flat = markGeometry.polygons[variant][0].flat();
      expect(numbers, `${variant} chevron coordinates`).toEqual(flat);
    }
  });

  it("thickens the compact variant for small sizes", () => {
    const regularStem = markGeometry.shapes.regular[0];
    const compactStem = markGeometry.shapes.compact[0];
    expect(compactStem.w).toBeGreaterThan(regularStem.w);
  });
});

describe("<BrandLogo />", () => {
  it("renders a flat single-colour mark with no gradient or filter", () => {
    const { container } = render(<BrandLogo title="Love Ahir" />);
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg.querySelector("linearGradient")).toBeNull();
    expect(svg.querySelector("filter")).toBeNull();
    expect(svg.querySelector("feGaussianBlur")).toBeNull();
  });

  it("exposes an accessible name when given a title, and hides it otherwise", () => {
    const { unmount } = render(<BrandLogo title="Love Ahir" />);
    expect(screen.getByRole("img", { name: "Love Ahir" })).toBeInTheDocument();
    unmount();

    const { container } = render(<BrandLogo />);
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("keeps the wordmark as real text rather than outlined paths", () => {
    render(<BrandLogo variant="lockup" />);
    expect(screen.getByText("Love Ahir")).toBeInTheDocument();
  });

  it("no longer carries the retired Evidence descriptor", () => {
    const { container } = render(<BrandLogo variant="lockup" />);
    expect(container.textContent).not.toMatch(/evidence/i);
  });

  it("renders the compact shape set when asked", () => {
    const { container } = render(<BrandLogo compact />);
    const firstRect = container.querySelector("rect");
    expect(firstRect).toHaveAttribute(
      "width",
      String(markGeometry.shapes.compact[0].w),
    );
  });
});

describe("brand asset family", () => {
  it("ships every declared asset in public/", () => {
    for (const asset of BRAND_ASSETS) {
      const path = join(process.cwd(), "public", asset.replace(/^\//, ""));
      expect(existsSync(path), `missing ${asset}`).toBe(true);
    }
  });

  it("declares icon, apple-touch-icon, and manifest links in the document head", () => {
    expect(html).toMatch(/rel="icon"[^>]*type="image\/svg\+xml"[^>]*href="\/favicon\.svg"/);
    expect(html).toContain('href="/favicon.ico"');
    expect(html).toMatch(/rel="apple-touch-icon"[^>]*href="\/apple-touch-icon\.png"/);
    expect(html).toMatch(/rel="manifest"[^>]*href="\/site\.webmanifest"/);
  });

  it("uses warm theme colours rather than the retired cold near-black", () => {
    expect(html).not.toContain("#06070d");
    expect(html).toContain('content="#0B0908"');
  });

  it("ships favicon.ico as a genuine 16/32/48 multi-resolution container", () => {
    // Parses the ICO directory from the raw bytes — no image library — because
    // the writer previously reported "16+32+48 multi-res" while emitting a
    // single 16x16 frame. Layout: 6-byte ICONDIR (reserved, type, count) then
    // one 16-byte ICONDIRENTRY per frame, whose first two bytes are width and
    // height (0 meaning 256).
    const ico = readFileSync(join(process.cwd(), "public", "favicon.ico"));
    const dir = new DataView(ico.buffer, ico.byteOffset, ico.byteLength);

    expect(dir.getUint16(0, true), "ICONDIR reserved field").toBe(0);
    expect(dir.getUint16(2, true), "ICONDIR type (1 = icon)").toBe(1);

    const count = dir.getUint16(4, true);
    const frames = Array.from({ length: count }, (_, i) => {
      const entry = 6 + i * 16;
      return [ico[entry] || 256, ico[entry + 1] || 256] as const;
    });

    expect(frames.map(([w]) => w).sort((a, b) => a - b)).toEqual([16, 32, 48]);
    for (const [w, h] of frames) expect(h, `frame ${w} height`).toBe(w);
  });

  it("keeps the manifest pointing at icons that exist", () => {
    const manifest = JSON.parse(
      readFileSync(join(process.cwd(), "public", "site.webmanifest"), "utf8"),
    );
    expect(manifest.icons.length).toBeGreaterThanOrEqual(3);
    expect(manifest.icons.some((i: { purpose: string }) => i.purpose === "maskable")).toBe(
      true,
    );
    for (const icon of manifest.icons) {
      const path = join(process.cwd(), "public", icon.src.replace(/^\//, ""));
      expect(existsSync(path), `manifest icon ${icon.src}`).toBe(true);
    }
  });
});
