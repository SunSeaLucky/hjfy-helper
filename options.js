const DEFAULTS = { openMode: 'new-tab', aiTarget: 'chatgpt' };
let savedTimer = null;

chrome.storage.sync.get(DEFAULTS, (values) => {
  for (const [key, value] of Object.entries(values)) {
    const radio = document.querySelector(`input[name="${key}"][value="${value}"]`);
    if (radio) radio.checked = true;
  }
});

document.querySelectorAll('input[type="radio"]').forEach((radio) => {
  radio.addEventListener('change', () => {
    chrome.storage.sync.set({ [radio.name]: radio.value }, () => {
      const saved = document.getElementById('saved');
      saved.classList.add('show');
      clearTimeout(savedTimer);
      savedTimer = setTimeout(() => saved.classList.remove('show'), 1500);
    });
  });
});
