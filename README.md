# hjfy arXiv Helper

A Chrome extension that jumps between an arXiv paper page and its
`hjfy.top` mirror — in both directions.

- On an arXiv paper page (`arxiv.org/abs/<id>` or `arxiv.org/pdf/<id>`),
  click the extension's **toolbar button** to go to
  `https://hjfy.top/arxiv/<id>`.
- On a `hjfy.top/arxiv/<id>` page, click the toolbar button again to go
  back to `https://arxiv.org/abs/<id>`.

The toolbar button is the single control for both directions. No floating
button is injected into pages: Chrome's built-in PDF viewer does not allow
content scripts on `/pdf/` pages, so the toolbar button keeps the behavior
consistent everywhere.

Version suffixes (`v2`) and trailing `.pdf` are stripped, so
`/pdf/2303.00938v2.pdf` still lands on `https://hjfy.top/arxiv/2303.00938`.
Old-style IDs like `hep-th/9901001` are supported.

## Install

1. Open `chrome://extensions` in Chrome.
2. Enable **Developer mode** (top-right toggle).
3. Click **Load unpacked** and select this folder (`hjfy_helper`).
4. Open any arXiv paper, e.g. <https://arxiv.org/abs/2303.00938> or
   <https://arxiv.org/pdf/2303.00938>, and click the toolbar button.

## Files

- `manifest.json` — Manifest V3 configuration
- `background.js` — toolbar button handler, both jump directions
- `make_icons.py` — regenerates `icons/` (stdlib only: `python3 make_icons.py`)
