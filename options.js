const DEFAULT_MODE = 'new-tab';
let savedTimer = null;

chrome.storage.sync.get({ openMode: DEFAULT_MODE }, ({ openMode }) => {
  const radio = document.querySelector(`input[name="openMode"][value="${openMode}"]`);
  if (radio) radio.checked = true;
});

document.querySelectorAll('input[name="openMode"]').forEach((radio) => {
  radio.addEventListener('change', () => {
    chrome.storage.sync.set({ openMode: radio.value }, () => {
      const saved = document.getElementById('saved');
      saved.classList.add('show');
      clearTimeout(savedTimer);
      savedTimer = setTimeout(() => saved.classList.remove('show'), 1500);
    });
  });
});
