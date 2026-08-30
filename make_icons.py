"""Generate the extension icons (red square with a white 'H') using only the stdlib.

Usage: python3 make_icons.py  ->  icons/icon16.png, icons/icon48.png, icons/icon128.png
"""
import os
import struct
import zlib

RED = (179, 27, 27, 255)     # arXiv-style red
WHITE = (255, 255, 255, 255)


def chunk(tag, data):
    return (
        struct.pack('>I', len(data))
        + tag
        + data
        + struct.pack('>I', zlib.crc32(tag + data) & 0xFFFFFFFF)
    )


def make_icon(path, size):
    margin = round(size * 0.22)
    bar = max(2, round(size * 0.14))
    cross0 = size // 2 - bar // 2

    rows = bytearray()
    for y in range(size):
        rows.append(0)  # PNG filter type 0
        for x in range(size):
            in_h = (
                margin <= x < margin + bar
                or size - margin - bar <= x < size - margin
                or (cross0 <= y < cross0 + bar and margin <= x < size - margin)
            )
            rows += bytes(WHITE if in_h else RED)

    ihdr = struct.pack('>IIBBBBB', size, size, 8, 6, 0, 0, 0)
    png = (
        b'\x89PNG\r\n\x1a\n'
        + chunk(b'IHDR', ihdr)
        + chunk(b'IDAT', zlib.compress(bytes(rows)))
        + chunk(b'IEND', b'')
    )
    with open(path, 'wb') as f:
        f.write(png)


if __name__ == '__main__':
    os.makedirs('icons', exist_ok=True)
    for s in (16, 48, 128):
        make_icon(f'icons/icon{s}.png', s)
        print(f'icons/icon{s}.png written')
