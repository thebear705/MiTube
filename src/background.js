// Background service worker for MiTube Chrome Extension

import { DEFAULT_SETTINGS } from './utils/constants.js';

/**
 * Handle extension installation
 */
chrome.runtime.onInstalled.addListener(async (details) => {
  console.log('MiTube: Extension installed/updated', details);
  
  try {
    
    // Set default settings on install/update
    // TODO: Only set default settings if they don't exist.
    await chrome.storage.sync.set(DEFAULT_SETTINGS);
    console.log('MiTub3: Default settings applied');
    
    // Show welcome notification on first install
    if (details.reason === 'install') {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon48.png',
        title: 'MiTube Installed',
        message: 'YouTube playlist duration tracking is now enabled. Click the extension icon to customize settings.'
      });
    }
  } catch (error) {
    console.error('MiTube: Failed to set default settings:', error);
  }
});

/**
 * Handle messages from content scripts
 */
// TODO: This does nothing at the moment find out why and if it's needed.
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Message Interceptped by background.js', message);
  if (message.action === 'settingsChanged') {
    console.log('MiTub3: Settings changed in content script:', message);
    // Forward to other tabs if needed
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach(tab => {
        if (tab.id !== sender.tab.id) {
          chrome.tabs.sendMessage(tab.id, message);
        }
      });
    });
  }
  
  return true; // Keep message channel open for async response
});