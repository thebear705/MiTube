// MiTube Popup Logic

import { getSettings, setSettings } from '../utils/storage.js';

/** Popup DOM elements */
const elements = {
  // Settings toggles
  showTotalDuration: document.getElementById('showTotalDuration'),
  showEndTime: document.getElementById('showEndTime'),
  clearPlayed: document.getElementById('clearPlayed'),
  miniPlayerButton: document.getElementById('miniPlayerButton'),
  videoPlayerEndTime: document.getElementById('videoPlayerEndTime'),
  timeLeftToggle: document.getElementById('timeLeftToggle'),
  hideShorts: document.getElementById('hideShorts'),
  hideAutoDubbed: document.getElementById('hideAutoDubbed'),
  hideMemberOnly: document.getElementById('hideMemberOnly'),
  
  // Dropdown elements
  dropdownHeaders: document.querySelectorAll('.dropdown-header'),
  playlistsContent: document.getElementById('playlists-content'),
  videoPlayerContent: document.getElementById('videoPlayer-content'),
  videoFeedContent: document.getElementById('videoFeed-content'),
  
  // Other elements
  status: document.getElementById('status'),
  resetSettings: document.getElementById('resetSettings'),
  themeToggle: document.getElementById('themeToggle')
};

// Import default settings from shared constants
import { DEFAULT_SETTINGS } from '../utils/constants.js';

/**
 * Update dropdown states based on settings
 * @param {Object} dropdownStates - Object with dropdown states
 */
function updateDropdownStates(dropdownStates) {
  // Playlists section
  const playlistsSection = elements.playlistsContent.closest('.dropdown-section');
  if (dropdownStates.playlists) {
    playlistsSection.classList.add('expanded');
  } else {
    playlistsSection.classList.remove('expanded');
  }
  
  // Video Player section
  const videoPlayerSection = elements.videoPlayerContent.closest('.dropdown-section');
  if (dropdownStates.videoPlayer) {
    videoPlayerSection.classList.add('expanded');
  } else {
    videoPlayerSection.classList.remove('expanded');
  }
  
  // Video Feed section
  const videoFeedSection = elements.videoFeedContent.closest('.dropdown-section');
  if (dropdownStates.videoFeed) {
    videoFeedSection.classList.add('expanded');
  } else {
    videoFeedSection.classList.remove('expanded');
  }
}

/**
 * Handle dropdown toggle
 * @param {Event} event - Click event
 */
async function handleDropdownToggle(event) {
  const header = event.currentTarget;
  const section = header.getAttribute('data-section');
  const sectionElement = header.closest('.dropdown-section');
  
  // Toggle the expanded class
  sectionElement.classList.toggle('expanded');
  
  // Update storage with new state
  const currentSettings = await getSettings();
  const newDropdownStates = {
    ...currentSettings.dropdownStates,
    [section]: sectionElement.classList.contains('expanded')
  };
  
  await setSettings({ dropdownStates: newDropdownStates });
}

/**
 * Initialize the popup
 */
async function init() {
  try {
    // Load current settings
    const settings = await getSettings();
    
    // Apply theme first
    applyTheme(settings.theme || 'system');
    
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
 * Update the Popup UI elements with current settings
 * @param {Object} settings - Current settings object
 */
function updateUI(settings) {
  // Update toggle states
  elements.showTotalDuration.checked = settings.showTotalDuration ?? DEFAULT_SETTINGS.showTotalDuration;
  elements.showEndTime.checked = settings.showEndTime ?? DEFAULT_SETTINGS.showEndTime;
  elements.clearPlayed.checked = settings.clearPlayed ?? DEFAULT_SETTINGS.clearPlayed;
  elements.miniPlayerButton.checked = settings.miniPlayerButton ?? DEFAULT_SETTINGS.miniPlayerButton;
  elements.videoPlayerEndTime.checked = settings.videoPlayerEndTime ?? DEFAULT_SETTINGS.videoPlayerEndTime;
  elements.timeLeftToggle.checked = settings.timeLeftToggle ?? DEFAULT_SETTINGS.timeLeftToggle;
  elements.hideShorts.checked = settings.hideShorts ?? DEFAULT_SETTINGS.hideShorts;
  elements.hideAutoDubbed.checked = settings.hideAutoDubbed ?? DEFAULT_SETTINGS.hideAutoDubbed;
  elements.hideMemberOnly.checked = settings.hideMemberOnly ?? DEFAULT_SETTINGS.hideMemberOnly;
  
  // Update dropdown states
  updateDropdownStates(settings.dropdownStates || DEFAULT_SETTINGS.dropdownStates);
}

/**
 * Set up event listeners for UI interactions
 */
function setupEventListeners() {
  // Toggle listeners
  elements.showTotalDuration.addEventListener('change', (e) => handleToggleChange('showTotalDuration', e.target.checked));
  elements.showEndTime.addEventListener('change', (e) => handleToggleChange('showEndTime', e.target.checked));
  elements.clearPlayed.addEventListener('change', (e) => handleToggleChange('clearPlayed', e.target.checked));
  elements.miniPlayerButton.addEventListener('change', (e) => handleToggleChange('miniPlayerButton', e.target.checked));
  elements.videoPlayerEndTime.addEventListener('change', (e) => handleToggleChange('videoPlayerEndTime', e.target.checked));
  elements.timeLeftToggle.addEventListener('change', (e) => handleToggleChange('timeLeftToggle', e.target.checked));
  elements.hideShorts.addEventListener('change', (e) => handleToggleChange('hideShorts', e.target.checked));
  elements.hideAutoDubbed.addEventListener('change', (e) => handleToggleChange('hideAutoDubbed', e.target.checked));
  elements.hideMemberOnly.addEventListener('change', (e) => handleToggleChange('hideMemberOnly', e.target.checked));
  
  // Dropdown listeners
  elements.dropdownHeaders.forEach(header => {
    header.addEventListener('click', handleDropdownToggle);
  });
  
  // Theme toggle
  elements.themeToggle.addEventListener('click', handleThemeToggle);
  
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
 * Handle theme toggle button
 */
function handleThemeToggle() {
  const currentTheme = getCurrentTheme();
  let newTheme;
  
  // Cycle through themes: light → dark → system → light
  if (currentTheme === 'light') {
    newTheme = 'dark';
  } else if (currentTheme === 'dark') {
    newTheme = 'system';
  } else {
    newTheme = 'light';
  }
  
  // Apply theme immediately
  applyTheme(newTheme);
  
  // Save to storage
  setSettings({ theme: newTheme });
  
  // Show status
  const themeLabels = {
    'light': 'Light mode',
    'dark': 'Dark mode', 
    'system': 'System theme'
  };
  showStatus(`${themeLabels[newTheme]} activated`, 'success');
}

/**
 * Get current theme from data-theme attribute or system preference
 */
function getCurrentTheme() {
  const theme = document.body.getAttribute('data-theme');
  if (theme) return theme;
  
  // Return 'system' when no data-theme is set
  return 'system';
}

/**
 * Apply theme to the popup
 * @param {string} theme - 'light', 'dark', or 'system'
 */
function applyTheme(theme) {
  // Remove existing theme classes
  document.body.removeAttribute('data-theme');
  
  if (theme === 'light') {
    document.body.setAttribute('data-theme', 'light');
  } else if (theme === 'dark') {
    document.body.setAttribute('data-theme', 'dark');
  } else {
    // System theme - remove attribute to let CSS media query handle it
  }
  
  // Update icon visibility
  updateThemeIcon(theme);
}

/**
 * Update theme toggle button icon visibility
 * @param {string} theme - Current theme
 */
function updateThemeIcon(theme) {
  const toggle = elements.themeToggle;
  
  // Remove all icon classes
  toggle.classList.remove('theme-light', 'theme-dark', 'theme-system');
  
  if (theme === 'light') {
    toggle.classList.add('theme-light');
  } else if (theme === 'dark') {
    toggle.classList.add('theme-dark');
  } else {
    toggle.classList.add('theme-system');
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
    
    // Apply default theme
    applyTheme(DEFAULT_SETTINGS.theme);
    
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