# hjfy arXiv Helper

A Chrome extension that jumps from an arXiv paper page to the corresponding
`hjfy.top` page.

- On `arxiv.org/abs/<id>` pages, a floating **"Open on hjfy.top"** button is
  shown at the bottom-right corner.
- On `arxiv.org/pdf/<id>` pages, Chrome's built-in PDF viewer does not allow
  content scripts, so use the **toolbar button** (the extension icon) instead.
  The toolbar button works on `/abs/` pages too.
- Clicking either button navigates the current tab to
  `https://hjfy.top/arxiv/<id>`.

Version suffixes (`v2`) and trailing `.pdf` are stripped, so
`/pdf/2303.00938v2.pdf` still lands on `https://hjfy.top/arxiv/2303.00938`.
Old-style IDs like `hep-th/9901001` are supported.

## Install

1. Open `chrome://extensions` in Chrome.
2. Enable **Developer mode** (top-right toggle).
3. Click **Load unpacked** and select this folder (`hjfy_helper`).
4. Open any arXiv paper, e.g. <https://arxiv.org/abs/2303.00938> or
   <https://arxiv.org/pdf/2303.00938>.

## Files

- `manifest.json` — Manifest V3 configuration
- `content.js` — floating button on `/abs/` pages
- `background.js` — toolbar button handler (needed for `/pdf/` pages)
- `make_icons.py` — regenerates `icons/` (stdlib only: `python3 make_icons.py`)
