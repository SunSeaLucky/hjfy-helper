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

// Canonical arxiv.org/abs URL for the paper shown in the tab, from either
// an arXiv page or its hjfy.top mirror.
function arxivAbsFor(url) {
  const m = url.match(ARXIV_PAGE_RE) || url.match(HJFY_PAGE_RE);
  return m ? `https://arxiv.org/abs/${cleanId(m[1])}` : null;
}

// "openMode" is set on the options page: open the destination either in
// a new tab next to the current one, or in the current tab itself.
function openTarget(tab, target) {
  chrome.storage.sync.get({ openMode: 'new-tab' }, ({ openMode }) => {
    if (openMode === 'current-tab') {
      chrome.tabs.update(tab.id, { url: target });
    } else {
      chrome.tabs.create({ url: target, index: tab.index + 1, openerTabId: tab.id });
    }
  });
}

chrome.action.onClicked.addListener((tab) => {
  const target = targetFor(tab.url || '');
  if (target) openTarget(tab, target);
});

// Right-click menu on the toolbar icon: hand the paper to an AI chat with
// a pre-filled prompt. Which AI is used is chosen on the options page
// ("aiTarget"); only sites that accept the prompt as a URL query are
// offered — Kimi, DeepSeek, Doubao, Tongyi etc. have no such parameter.
// Chrome never reports middle/wheel clicks on the action icon, so the
// context menu is the closest available trigger.
const ASK_AI_ID = 'ask-ai';

const AI_TARGETS = [
  { id: 'chatgpt', title: 'ChatGPT', url: (p) => `https://chatgpt.com/?q=${encodeURIComponent(p)}` },
  { id: 'claude', title: 'Claude', url: (p) => `https://claude.ai/new?q=${encodeURIComponent(p)}` },
  { id: 'perplexity', title: 'Perplexity', url: (p) => `https://www.perplexity.ai/search?q=${encodeURIComponent(p)}` },
  { id: 'grok', title: 'Grok', url: (p) => `https://grok.com/?q=${encodeURIComponent(p)}` },
];

function aiTargetById(id) {
  return AI_TARGETS.find((t) => t.id === id) || AI_TARGETS[0];
}

function menuTitleFor(aiId) {
  return `让 ${aiTargetById(aiId).title} 用中文详细解释这篇论文`;
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get({ aiTarget: 'chatgpt' }, ({ aiTarget }) => {
    chrome.contextMenus.removeAll(() => {
      chrome.contextMenus.create({
        id: ASK_AI_ID,
        title: menuTitleFor(aiTarget),
        contexts: ['action'],
      });
    });
  });
});

// Keep the menu label in sync when the AI is changed on the options page.
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes.aiTarget) {
    chrome.contextMenus.update(ASK_AI_ID, { title: menuTitleFor(changes.aiTarget.newValue) });
  }
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId !== ASK_AI_ID || !tab) return;
  const abs = arxivAbsFor(tab.url || '');
  if (!abs) return;
  chrome.storage.sync.get({ aiTarget: 'chatgpt' }, ({ aiTarget }) => {
    const prompt = `请用中文详细解释这篇论文，包括研究背景、核心方法、主要结果和贡献：${abs}`;
    openTarget(tab, aiTargetById(aiTarget).url(prompt));
  });
});
