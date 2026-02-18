// MiTube Popup Logic

import { getSettings, setSettings } from '../utils/storage.js';

// DOM elements
const elements = {
  showTotalDuration: document.getElementById('showTotalDuration'),
  showEndTime: document.getElementById('showEndTime'),
  hideShorts: document.getElementById('hideShorts'),
  hideMemberOnly: document.getElementById('hideMemberOnly'),
  status: document.getElementById('status'),
  resetSettings: document.getElementById('resetSettings')
};

// Default settings
const DEFAULT_SETTINGS = {
  showTotalDuration: true,
  showEndTime: true,
  hideShorts: false,
  hideMemberOnly: false
};

/**
 * Initialize the popup
 */
async function init() {
  try {
    // Load current settings
    const settings = await getSettings();
    
    // Update UI with current settings
    updateUI(settings);
    
    // Set up event listeners
    setupEventListeners();
    
    // Show success status
    showStatus('Settings loaded successfully', 'success');
  } catch (error) {
    console.error('MiTube: Failed to load settings:', error);
    showStatus('Failed to load settings', 'error');
  }
}

/**
 * Update UI elements with current settings
 * @param {Object} settings - Current settings object
 */
function updateUI(settings) {
  // Update toggle states
  elements.showTotalDuration.checked = settings.showTotalDuration ?? DEFAULT_SETTINGS.showTotalDuration;
  elements.showEndTime.checked = settings.showEndTime ?? DEFAULT_SETTINGS.showEndTime;
  elements.hideShorts.checked = settings.hideShorts ?? DEFAULT_SETTINGS.hideShorts;
  elements.hideMemberOnly.checked = settings.hideMemberOnly ?? DEFAULT_SETTINGS.hideMemberOnly;
}

/**
 * Set up event listeners for UI interactions
 */
function setupEventListeners() {
  // Toggle listeners
  elements.showTotalDuration.addEventListener('change', (e) => handleToggleChange('showTotalDuration', e.target.checked));
  elements.showEndTime.addEventListener('change', (e) => handleToggleChange('showEndTime', e.target.checked));
  elements.hideShorts.addEventListener('change', (e) => handleToggleChange('hideShorts', e.target.checked));
  elements.hideMemberOnly.addEventListener('change', (e) => handleToggleChange('hideMemberOnly', e.target.checked));
  
  // Reset button
  elements.resetSettings.addEventListener('click', handleResetSettings);
}

/**
 * Handle toggle state changes
 * @param {string} settingKey - The setting key to update
 * @param {boolean} newValue - The new value for the setting
 */
async function handleToggleChange(settingKey, newValue) {
  try {
    // Update storage
    await setSettings({ [settingKey]: newValue });
    
    // Show success status
    showStatus(`${getSettingLabel(settingKey)} ${newValue ? 'enabled' : 'disabled'}`, 'success');
    
    // Note: No need to send message to content script
    // The chrome.storage.onChanged listener in content.js handles updates automatically
  } catch (error) {
    console.error('MiTube: Failed to update setting:', error);
    showStatus('Failed to update setting', 'error');
    
    // Revert UI change
    const checkbox = elements[settingKey];
    checkbox.checked = !newValue;
  }
}

/**
 * Handle reset settings button
 */
async function handleResetSettings() {
  try {
    // Reset to defaults
    await setSettings(DEFAULT_SETTINGS);
    
    // Update UI
    updateUI(DEFAULT_SETTINGS);
    
    // Show success status
    showStatus('Settings reset to defaults', 'success');
    
    // Note: No need to send message to content script
    // The chrome.storage.onChanged listener in content.js handles updates automatically
  } catch (error) {
    console.error('MiTube: Failed to reset settings:', error);
    showStatus('Failed to reset settings', 'error');
  }
}

/**
 * Show status message
 * @param {string} message - The status message to display
 * @param {string} type - The type of status ('success' or 'error')
 */
function showStatus(message, type = 'info') {
  elements.status.textContent = message;
  elements.status.className = `status ${type}`;
  
  // Auto-hide success messages after 3 seconds
  if (type === 'success') {
    setTimeout(() => {
      elements.status.textContent = '';
      elements.status.className = 'status';
    }, 3000);
  }
}

/**
 * Get human-readable label for a setting key
 * @param {string} settingKey - The setting key
 * @returns {string} Human-readable label
 */
function getSettingLabel(settingKey) {
  const labels = {
    showTotalDuration: 'Playlist Total Duration',
    showEndTime: 'Playlist End Time',
    hideShorts: 'Hide Shorts',
    hideMemberOnly: 'Hide Member-only Videos'
  };
  
  return labels[settingKey] || settingKey;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);