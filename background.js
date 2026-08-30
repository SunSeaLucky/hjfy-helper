// Toolbar button handler. This is the only way to offer the jump on
// /pdf/ pages, since content scripts can't run inside Chrome's PDF viewer.
// It also works on /abs/ pages as an alternative to the floating button.

function extractArxivId(url) {
  const m = url.match(/arxiv\.org\/(?:abs|pdf)\/([^?#/]+(?:\/[^?#/]+)?)/i);
  if (!m) return null;
  return m[1].replace(/\.pdf$/i, '').replace(/v\d+$/i, '');
}

chrome.action.onClicked.addListener((tab) => {
  const id = extractArxivId(tab.url || '');
  if (!id || tab.id === undefined) return;
  chrome.tabs.update(tab.id, { url: `https://hjfy.top/arxiv/${id}` });
});
