#!/usr/bin/env python3
"""Trim solid-colour padding from a raster image.

Usage: python3 scripts/trim-image-padding.py INPUT [INPUT ...] [--output OUTPUT]

Padding is defined as contiguous outer rows/columns whose pixels are close to
the top-left pixel. Near-black borders allow for compression artefacts.
Use --scale 0.5 to halve the cropped
dimensions, for example when the screenshot was captured at twice the source
image's displayed size.
Use --scale auto to look for exact integer nearest-neighbour enlargement
(repeated square pixel blocks); if found, one source pixel is kept per block.
After trimming and any optional scaling, images wider than 1,920 pixels are
downscaled. A .webp output is saved at quality 92 by default.
Inputs can include quoted wildcard patterns. If OUTPUT is omitted, each input
name is used with a .webp extension. For a single input, an output path that
does not yet exist may also be given as the second positional argument.
"""

import argparse
from collections import Counter
import glob
import math
from pathlib import Path

from PIL import Image


def trim_bounds(image: Image.Image) -> tuple[int, int, int, int]:
    pixels = image.convert("RGBA")
    width, height = pixels.size
    background = pixels.getpixel((0, 0))
    left, top, right, bottom = 0, 0, width, height

    def matches(pixel: tuple[int, int, int, int]) -> bool:
        if max(background[:3]) <= 12 and background[3] == 255:
            return max(pixel[:3]) <= 35 and pixel[3] == 255
        return all(abs(a - b) <= 12 for a, b in zip(pixel, background))

    def row_matches(y: int) -> bool:
        return all(matches(pixels.getpixel((x, y))) for x in range(left, right))

    def column_matches(x: int) -> bool:
        return all(matches(pixels.getpixel((x, y))) for y in range(top, bottom))

    changed = True
    while changed:
        changed = False
        while top < bottom - 1 and row_matches(top):
            top += 1
            changed = True
        while bottom > top + 1 and row_matches(bottom - 1):
            bottom -= 1
            changed = True
        while left < right - 1 and column_matches(left):
            left += 1
            changed = True
        while right > left + 1 and column_matches(right - 1):
            right -= 1
            changed = True

    return left, top, right, bottom


def detect_integer_zoom(image: Image.Image) -> int | None:
    """Find an exact repeated-pixel block size, avoiding guesses from smooth areas."""
    pixels = image.convert("RGBA")
    width, height = pixels.size
    for factor in range(min(16, width, height), 1, -1):
        if width % factor or height % factor:
            continue

        columns, rows = width // factor, height // factor
        uniform_blocks = 0
        block_colours = []
        for block_y in range(rows):
            for block_x in range(columns):
                first = pixels.getpixel((block_x * factor, block_y * factor))
                uniform = True
                for y in range(block_y * factor, (block_y + 1) * factor):
                    for x in range(block_x * factor, (block_x + 1) * factor):
                        if pixels.getpixel((x, y)) != first:
                            uniform = False
                            break
                    if not uniform:
                        break
                if uniform:
                    uniform_blocks += 1
                    block_colours.append(first)

        block_count = columns * rows
        common_colour_count = Counter(block_colours).most_common(1)[0][1] if block_colours else 0
        informative_blocks = uniform_blocks - common_colour_count
        if uniform_blocks / block_count >= 0.995 and informative_blocks >= 32:
            return factor
    return None


def undo_integer_zoom(image: Image.Image, factor: int) -> Image.Image:
    """Sample the centre of each replicated block without adding resampling blur."""
    pixels = image.convert("RGBA")
    width, height = pixels.size
    reduced = Image.new("RGBA", (width // factor, height // factor))
    source_pixels, output_pixels = pixels.load(), reduced.load()
    offset = factor // 2
    for y in range(reduced.height):
        for x in range(reduced.width):
            output_pixels[x, y] = source_pixels[x * factor + offset, y * factor + offset]
    return reduced


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("inputs", nargs="+", metavar="INPUT", help="input files or wildcard patterns")
    parser.add_argument("-o", "--output", type=Path, help="output path for a single input")
    parser.add_argument("--scale", default="1", metavar="FACTOR|auto",
                        help="resize by a factor, or detect integer pixel replication with 'auto' (default: 1)")
    parser.add_argument("--max-width", type=int, default=1920,
                        help="maximum output width in pixels (default: 1920)")
    parser.add_argument("--quality", type=int, default=92,
                        help="WebP quality from 0 to 100 (default: 92)")
    args = parser.parse_args()
    patterns = args.inputs
    if (args.output is None and len(patterns) == 2
            and not glob.has_magic(patterns[1]) and not Path(patterns[1]).exists()):
        args.output = Path(patterns.pop())
    inputs = []
    for pattern in patterns:
        matches = sorted(glob.glob(pattern, recursive=True)) if glob.has_magic(pattern) else [pattern]
        if not matches:
            parser.error(f"no files match: {pattern}")
        for match in matches:
            path = Path(match)
            if not path.is_file():
                parser.error(f"input is not a file: {path}")
            inputs.append(path)
    if args.output is not None and len(inputs) != 1:
        parser.error("an explicit output path requires exactly one input")
    outputs = [args.output or path.with_suffix(".webp") for path in inputs]
    input_paths = {path.resolve() for path in inputs}
    output_paths = [path.resolve() for path in outputs]
    if len(set(output_paths)) != len(output_paths):
        parser.error("multiple inputs would produce the same output path")
    if input_paths.intersection(output_paths):
        parser.error("an output would overwrite an input; specify a different output path")
    if args.max_width < 1:
        parser.error("--max-width must be greater than zero")
    if not 0 <= args.quality <= 100:
        parser.error("--quality must be between 0 and 100")

    if args.scale == "auto":
        scale = None
    else:
        try:
            scale = float(args.scale)
        except ValueError:
            parser.error("--scale must be a positive number or 'auto'")
        if not math.isfinite(scale) or scale <= 0:
            parser.error("--scale must be a finite number greater than zero")

    for input_path, output_path in zip(inputs, outputs):
        process_image(input_path, output_path, scale, args.max_width, args.quality)
    return 0


def process_image(input_path: Path, output_path: Path, scale: float | None,
                  max_width: int, quality: int) -> None:
    with Image.open(input_path) as source_image:
        bounds = trim_bounds(source_image)
        result = source_image.crop(bounds)
        detected_factor = None
        if scale is None:
            detected_factor = detect_integer_zoom(result)
            if detected_factor is not None:
                result = undo_integer_zoom(result, detected_factor)
        resize_factor = min(scale if scale is not None else 1, max_width / result.width)
        if resize_factor != 1:
            dimensions = (
                max(1, round(result.width * resize_factor)),
                max(1, round(result.height * resize_factor)),
            )
            result = result.resize(dimensions, Image.Resampling.LANCZOS)
        save_options = {"quality": quality, "method": 6} if output_path.suffix.lower() == ".webp" else {}
        result.save(output_path, **save_options)

    zoom_note = f" (detected {detected_factor}x pixel replication)" if detected_factor else ""
    if scale is None and detected_factor is None:
        zoom_note = " (no integer pixel replication detected)"
    print(f"Trimmed {input_path} to {result.width}x{result.height}{zoom_note} -> {output_path}")


if __name__ == "__main__":
    raise SystemExit(main())
