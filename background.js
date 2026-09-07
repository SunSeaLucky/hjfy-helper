// Single entry point: the toolbar button jumps between an arXiv paper
// page and its hjfy.top mirror, in both directions.
//
//   arxiv.org/abs|pdf/<id>  ->  hjfy.top/arxiv/<id>
//   hjfy.top/arxiv/<id>     ->  arxiv.org/abs/<id>
//
// No floating button is injected into pages: content scripts cannot run
// inside Chrome's built-in PDF viewer on /pdf/ pages, so the toolbar
// button is the one consistent control everywhere.

const ARXIV_PAGE_RE = /arxiv\.org\/(?:abs|pdf)\/([^?#/]+(?:\/[^?#/]+)?)/i;
const HJFY_PAGE_RE = /hjfy\.top\/arxiv\/([^?#/]+(?:\/[^?#/]+)?)/i;

// Strips an optional ".pdf" extension or version suffix ("v2").
function cleanId(id) {
  return id.replace(/\.pdf$/i, '').replace(/v\d+$/i, '');
}

function targetFor(url) {
  const arxiv = url.match(ARXIV_PAGE_RE);
  if (arxiv) return `https://hjfy.top/arxiv/${cleanId(arxiv[1])}`;
  const hjfy = url.match(HJFY_PAGE_RE);
  if (hjfy) return `https://arxiv.org/abs/${cleanId(hjfy[1])}`;
  return null;
}

chrome.action.onClicked.addListener((tab) => {
  const target = targetFor(tab.url || '');
  if (!target) return;
  // "openMode" is set on the options page: open the destination either in
  // a new tab next to the current one, or in the current tab itself.
  chrome.storage.sync.get({ openMode: 'new-tab' }, ({ openMode }) => {
    if (openMode === 'current-tab') {
      chrome.tabs.update(tab.id, { url: target });
    } else {
      chrome.tabs.create({ url: target, index: tab.index + 1, openerTabId: tab.id });
    }
  });
});
