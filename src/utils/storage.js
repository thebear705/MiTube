// Chrome Storage utilities for MiTube extension

/**
 * Get settings from Chrome storage
 * @param {Array} keys - Array of setting keys to retrieve
 * @returns {Promise<Object>} Promise resolving to settings object
 */
export async function getSettings(keys = null) {
  return new Promise((resolve, reject) => {
    const keysToGet = keys || ['showTotalDuration', 'showEndTime', 'hideShorts', 'hideMemberOnly'];
    
    chrome.storage.sync.get(keysToGet, (result) => {
      if (chrome.runtime.lastError) {
        console.error('Error getting settings:', chrome.runtime.lastError);
        reject(chrome.runtime.lastError);
      } else {
        resolve(result);
      }
    });
  });
}

/**
 * Set settings in Chrome storage
 * @param {Object} settings - Object containing settings to update
 * @returns {Promise<boolean>} Promise resolving to success status
 */
export async function setSettings(settings) {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set(settings, () => {
      if (chrome.runtime.lastError) {
        console.error('Error setting settings:', chrome.runtime.lastError);
        reject(chrome.runtime.lastError);
      } else {
        resolve(true);
      }
    });
  });
}

/**
 * Get a single setting value
 * @param {string} key - The setting key
 * @returns {Promise<any>} Promise resolving to the setting value
 */
export async function getSetting(key) {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(key, (result) => {
      if (chrome.runtime.lastError) {
        console.error('Error getting setting:', chrome.runtime.lastError);
        reject(chrome.runtime.lastError);
      } else {
        resolve(result[key]);
      }
    });
  });
}

/**
 * Set a single setting value
 * @param {string} key - The setting key
 * @param {any} value - The setting value
 * @returns {Promise<boolean>} Promise resolving to success status
 */
export async function setSetting(key, value) {
  return new Promise((resolve, reject) => {
    const settings = {};
    settings[key] = value;
    
    chrome.storage.sync.set(settings, () => {
      if (chrome.runtime.lastError) {
        console.error('Error setting setting:', chrome.runtime.lastError);
        reject(chrome.runtime.lastError);
      } else {
        resolve(true);
      }
    });
  });
}

/**
 * Clear all settings from storage
 * @returns {Promise<boolean>} Promise resolving to success status
 */
export async function clearSettings() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.clear(() => {
      if (chrome.runtime.lastError) {
        console.error('Error clearing settings:', chrome.runtime.lastError);
        reject(chrome.runtime.lastError);
      } else {
        resolve(true);
        console.log('All settings cleared');
      }
    });
  });
}