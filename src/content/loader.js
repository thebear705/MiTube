// TODO: Do we really need a separate loader? Maybe we can just put this
// code in content.js?

(async () => {
  const src = chrome.runtime.getURL('content/content.js');
  await import(src);
})();