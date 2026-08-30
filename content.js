// Injects a floating button on arXiv /abs/ pages.
// Note: this script cannot run on /pdf/ pages because Chrome's built-in
// PDF viewer does not allow content scripts. Those pages are handled by
// the toolbar button (background.js).

function extractArxivId(url) {
  // Matches new-style IDs (2303.00938) and old-style IDs (hep-th/9901001),
  // allowing an optional version suffix (v2) or trailing ".pdf".
  const m = url.match(/arxiv\.org\/(?:abs|pdf)\/([^?#/]+(?:\/[^?#/]+)?)/i);
  if (!m) return null;
  return m[1].replace(/\.pdf$/i, '').replace(/v\d+$/i, '');
}

(function () {
  const id = extractArxivId(location.href);
  if (!id) return;

  const btn = document.createElement('button');
  btn.textContent = 'Open on hjfy.top';
  btn.title = `Go to https://hjfy.top/arxiv/${id}`;
  Object.assign(btn.style, {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    zIndex: '2147483647',
    padding: '10px 18px',
    background: '#b31b1b',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
  });
  btn.addEventListener('mouseenter', () => { btn.style.background = '#8f1515'; });
  btn.addEventListener('mouseleave', () => { btn.style.background = '#b31b1b'; });
  btn.addEventListener('click', () => {
    location.href = `https://hjfy.top/arxiv/${id}`;
  });

  document.body.appendChild(btn);
})();
