"""
Generate the Love Ahir brand asset family from the single geometry source.

Reads src/lib/brandMark.json -- the same file src/components/BrandLogo.tsx
imports -- so the icons and the React component are drawn from one set of
numbers. The generated rasters are committed output, and no test proves they
are current: re-run this script whenever the geometry changes.

Dev-time only. Pillow is NOT a project dependency and nothing is added to
package.json; run this by hand when the mark changes:

    python scripts/generate-brand-assets.py

Outputs into public/: favicon.svg, favicon.ico, favicon-32.png,
apple-touch-icon.png, icon-192.png, icon-512.png, icon-maskable-512.png,
preview.png, twitter_preview.png.
"""

import json
import os
import struct

from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GEOMETRY_PATH = os.path.join(ROOT, "src", "lib", "brandMark.json")
PUBLIC = os.path.join(ROOT, "public")

# Warm cinematic tokens, kept in sync with src/index.css .dark
EMBER = (255, 107, 26, 255)          # --primary  21 100% 55%
TILE = (22, 18, 16, 255)             # warm charcoal favicon container
CANVAS = (11, 9, 8, 255)             # --background 20 16% 4%
IVORY = (247, 242, 234, 255)         # --foreground 37 45% 94%
MUTED = (173, 161, 152, 255)         # --muted-foreground
AMBER = (255, 150, 61, 255)          # --accent

SS = 8  # supersample factor for antialiasing

with open(GEOMETRY_PATH, "r", encoding="utf-8") as fh:
    GEO = json.load(fh)

VIEWBOX = GEO["viewBox"]


def rounded_rect(draw, shape, scale, offset, fill):
    x = shape["x"] * scale + offset[0]
    y = shape["y"] * scale + offset[1]
    w = shape["w"] * scale
    h = shape["h"] * scale
    r = shape.get("r", 0) * scale
    draw.rounded_rectangle([x, y, x + w, y + h], radius=r, fill=fill)


def draw_mark(draw, variant, scale, offset, fill):
    """Draw the Layer Seam mark. Rects come from `shapes`, the A chevron from
    `polygons` -- Pillow has no SVG path parser, so the chevron is stored
    twice in the geometry file (as an SVG `d` for the browser and as points
    for the rasteriser) and a test asserts the two agree."""
    for shape in GEO["shapes"][variant]:
        if shape["kind"] == "rect":
            rounded_rect(draw, shape, scale, offset, fill)
    for poly in GEO["polygons"][variant]:
        pts = [(px * scale + offset[0], py * scale + offset[1]) for px, py in poly]
        draw.polygon(pts, fill=fill)


def render_icon(size, padding_ratio=0.16, tile=True, variant=None, radius_ratio=0.22):
    """Square app icon: ember mark on a warm charcoal tile.

    The tile is a favicon *container*, not a change to the brand mark -- the
    header renders the bare mark. It exists because a bare ember mark on a
    light browser chrome sits near 2.8:1, and the tile guarantees the mark
    reads in both light and dark chrome with consistent optical padding.
    """
    if variant is None:
        variant = "compact" if size <= 48 else "regular"

    big = size * SS
    img = Image.new("RGBA", (big, big), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    if tile:
        draw.rounded_rectangle(
            [0, 0, big - 1, big - 1], radius=int(big * radius_ratio), fill=TILE
        )

    inner = big * (1 - 2 * padding_ratio)
    scale = inner / VIEWBOX
    offset = (big * padding_ratio, big * padding_ratio)
    draw_mark(draw, variant, scale, offset, EMBER)

    return img.resize((size, size), Image.LANCZOS)


def build_svg():
    """favicon.svg from the same geometry. Uses the compact shape set so the
    vector matches what the rasterised small sizes show."""
    pad = 0.16 * VIEWBOX
    inner = VIEWBOX - 2 * pad
    s = inner / VIEWBOX

    def mapped_rect(sh):
        return (
            f'<rect x="{sh["x"] * s + pad:.2f}" y="{sh["y"] * s + pad:.2f}" '
            f'width="{sh["w"] * s:.2f}" height="{sh["h"] * s:.2f}" '
            f'rx="{sh.get("r", 0) * s:.2f}"/>'
        )

    def mapped_poly(poly):
        pts = " ".join(f"{px * s + pad:.2f},{py * s + pad:.2f}" for px, py in poly)
        return f'<polygon points="{pts}"/>'

    parts = [mapped_rect(sh) for sh in GEO["shapes"]["compact"] if sh["kind"] == "rect"]
    parts += [mapped_poly(p) for p in GEO["polygons"]["compact"]]

    r = VIEWBOX * 0.22
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {VIEWBOX} {VIEWBOX}">'
        f"<title>Love Ahir</title>"
        f'<rect width="{VIEWBOX}" height="{VIEWBOX}" rx="{r:.2f}" fill="#161210"/>'
        f'<g fill="#FF6B1A">{"".join(parts)}</g>'
        f"</svg>"
    )


def load_font(size, bold=True):
    candidates = (
        ["segoeuib.ttf", "arialbd.ttf", "calibrib.ttf"]
        if bold
        else ["segoeui.ttf", "arial.ttf", "calibri.ttf"]
    )
    for name in candidates:
        path = os.path.join("C:\\", "Windows", "Fonts", name)
        if os.path.exists(path):
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def render_social(width=1200, height=630):
    """Open Graph / Twitter card.

    NOTE: Space Grotesk ships from Fontsource as woff2/woff only and no
    converter is available here, so the wordmark is set in a locally
    available grotesque. Cosmetic deviation from site typography -- flagged
    in IMPLEMENTATION.md 26.5.
    """
    img = Image.new("RGBA", (width, height), CANVAS)
    draw = ImageDraw.Draw(img)

    # Directional ember wash, bottom-left, matching the hero underglow.
    glow = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(glow)
    for i in range(28):
        a = int(16 - i * 0.55)
        if a <= 0:
            break
        rr = 260 + i * 26
        gdraw.ellipse([-rr // 2, height - rr // 2, rr, height + rr // 2],
                      fill=(255, 107, 26, a))
    img = Image.alpha_composite(img, glow)
    draw = ImageDraw.Draw(img)

    mark = render_icon(112, padding_ratio=0.10, tile=False, variant="regular")
    img.paste(mark, (84, 74), mark)

    draw.text((214, 84), "Love Ahir", font=load_font(52), fill=IVORY)
    draw.text((214, 146), "Software Engineer", font=load_font(24, bold=False), fill=AMBER)

    headline = ["I build reliable full-stack", "products and applied AI systems."]
    y = 262
    for line in headline:
        draw.text((84, y), line, font=load_font(62), fill=IVORY)
        y += 78

    draw.line([(84, 468), (1116, 468)], fill=(45, 40, 35, 255), width=2)
    draw.text(
        (84, 496),
        "4+ years  ·  Backend  ·  Full-stack  ·  Applied AI  ·  Phoenix, AZ",
        font=load_font(26, bold=False),
        fill=MUTED,
    )
    return img.convert("RGB")


def kb(path):
    return round(os.path.getsize(path) / 1024, 1)


def verify_ico(path, expected_sizes):
    """Read the ICO directory back and fail loudly if a frame is missing.

    Parses the container directly rather than trusting the writer, because the
    previous silent single-frame regression looked correct in the script's own
    summary line. src/data/favicon.test.ts asserts the same bytes from Node.
    """
    with open(path, "rb") as fh:
        data = fh.read()
    reserved, ico_type, count = struct.unpack("<HHH", data[:6])
    if reserved != 0 or ico_type != 1:
        raise SystemExit(f"{path}: not an ICO container")
    found = []
    for i in range(count):
        entry = data[6 + i * 16: 22 + i * 16]
        width, height = entry[0] or 256, entry[1] or 256
        found.append((width, height))
    want = sorted((s, s) for s in expected_sizes)
    if sorted(found) != want:
        raise SystemExit(f"{path}: expected frames {want}, got {sorted(found)}")


def main():
    os.makedirs(PUBLIC, exist_ok=True)
    written = []

    svg_path = os.path.join(PUBLIC, "favicon.svg")
    with open(svg_path, "w", encoding="utf-8") as fh:
        fh.write(build_svg())
    written.append(("favicon.svg", "96x96 vector", kb(svg_path)))

    # Pillow's ICO writer skips any requested size larger than the image it is
    # called on (`if size[0] > width: continue`). Saving from the 16px frame
    # therefore silently dropped 32 and 48 and produced a single-frame ICO.
    # Save from the LARGEST frame and pass the smaller ones as append_images so
    # each entry is its own independently supersampled render rather than a
    # downscale of one bitmap.
    ico_sizes = [16, 32, 48]
    ico_frames = {s: render_icon(s) for s in ico_sizes}
    largest = max(ico_sizes)
    ico_path = os.path.join(PUBLIC, "favicon.ico")
    ico_frames[largest].save(
        ico_path,
        format="ICO",
        sizes=[(s, s) for s in ico_sizes],
        append_images=[ico_frames[s] for s in ico_sizes if s != largest],
    )
    verify_ico(ico_path, ico_sizes)
    written.append(("favicon.ico", "16+32+48 multi-res", kb(ico_path)))

    for name, size, pad in [
        ("favicon-32.png", 32, 0.16),
        ("apple-touch-icon.png", 180, 0.18),
        ("icon-192.png", 192, 0.16),
        ("icon-512.png", 512, 0.16),
        ("icon-maskable-512.png", 512, 0.30),
    ]:
        path = os.path.join(PUBLIC, name)
        render_icon(size, padding_ratio=pad).save(path, optimize=True)
        written.append((name, f"{size}x{size}", kb(path)))

    social = render_social()
    for name in ["preview.png", "twitter_preview.png"]:
        path = os.path.join(PUBLIC, name)
        social.save(path, optimize=True, compress_level=9)
        written.append((name, "1200x630", kb(path)))

    print(f"{'asset':<26}{'dimensions':<20}{'KB':>8}")
    print("-" * 54)
    for name, dims, size in written:
        print(f"{name:<26}{dims:<20}{size:>8}")


if __name__ == "__main__":
    main()
