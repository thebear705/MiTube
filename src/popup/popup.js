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
  alwaysShowNextButton: document.getElementById('alwaysShowNextButton'),
  enableChapterButtons: document.getElementById('enableChapterButtons'),
  
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
  elements.alwaysShowNextButton.checked = settings.alwaysShowNextButton ?? DEFAULT_SETTINGS.alwaysShowNextButton;
  elements.enableChapterButtons.checked = settings.enableChapterButtons ?? DEFAULT_SETTINGS.enableChapterButtons;
  
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
  elements.alwaysShowNextButton.addEventListener('change', (e) => handleToggleChange('alwaysShowNextButton', e.target.checked));
  elements.enableChapterButtons.addEventListener('change', (e) => handleToggleChange('enableChapterButtons', e.target.checked));
  
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
  } 
  else if (theme === 'dark') {
    document.body.setAttribute('data-theme', 'dark');
  } else {
    // System theme - remove attribute to let CSS media query handle it
  }
  
  // Update icon visibility based on selected theme
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
    console.log('MiTube: Settings reset to defaults')
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
    hideMemberOnly: 'Hide Member-only Videos',
    alwaysShowNextButton: 'Always Show Next Video',
    enableChapterButtons: 'Chapter Navigation Buttons'
  };
  
  return labels[settingKey] || settingKey;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);


<svg width="36px" height="36px" viewBox="0 0 36 36" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <g id="DOM-Assets" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="skip">
            <g id="invisible_box">
                <rect id="Rectangle" x="0" y="0" width="36" height="36"></rect>
            </g>
            <g id="icons_Q2" transform="translate(1.5, 1.9466)" fill="#000000">
                <circle id="Oval" cx="4.5" cy="25.8034001" r="4.5"></circle>
                <path d="M16.5,21.3034001 C14.0147186,21.3034001 12,23.3181187 12,25.8034001 C12,28.2886815 14.0147186,30.3034001 16.5,30.3034001 C18.9852814,30.3034001 21,28.2886815 21,25.8034001 C21,23.3181187 18.9852814,21.3034001 16.5,21.3034001 L16.5,21.3034001 Z M16.5,27.3034001 C15.6715729,27.3034001 15,26.6318272 15,25.8034001 C15,24.974973 15.6715729,24.3034001 16.5,24.3034001 C17.3284271,24.3034001 18,24.974973 18,25.8034001 C18,26.6318272 17.3284271,27.3034001 16.5,27.3034001 Z" id="Shape" fill-rule="nonzero"></path>
                <circle id="Oval" cx="28.5" cy="25.8034001" r="4.5"></circle>
                <path d="M26.55,12.7534001 C26.2575245,12.4229774 25.8284713,12.2466944 25.3881765,12.2760474 C24.9478817,12.3054004 24.5460258,12.5370773 24.3,12.9034001 C23.8501375,13.5248453 23.9134838,14.3800199 24.45,14.9284001 L27.45,17.8534001 C27.7198902,18.1475531 28.1007924,18.3150076 28.5,18.3150076 C28.8992076,18.3150076 29.2801098,18.1475531 29.55,17.8534001 L32.55,14.9284001 C33.0582026,14.3745237 33.1492248,13.555324 32.775,12.9034001 C32.5133776,12.5346795 32.0994035,12.3036295 31.6482341,12.2745218 C31.1970646,12.2454141 30.7568332,12.4213541 30.45,12.7534001 L30,13.2034001 C29.8343144,5.74755608 23.655844,-0.162285051 16.2,0.00340037168 C8.74415599,0.169085794 2.83431473,6.34755607 3,13.8034001 L3,15.3034001 C3.00000002,16.1318272 3.67157289,16.8034001 4.5,16.8034001 C5.32842711,16.8034001 5.99999998,16.1318272 6,15.3034001 L6,13.8034001 C5.8136039,8.00441021 10.3635101,3.15229619 16.1625,2.96590009 C21.9614899,2.77950398 26.8136039,7.32941021 27,13.1284001 L26.55,12.7534001 Z" id="Path"></path>
            </g>
        </g>
    </g>
</svg>