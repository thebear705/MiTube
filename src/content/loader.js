// We Really need this. Cauases errors when not done sthis way.

(async () => {
  const src = chrome.runtime.getURL('content/content.js');
  await import(src);
})();