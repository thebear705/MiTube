// MiTube Popup Logic - Optimized Version

import { getSettings, setSettings } from '../utils/storage.js';
import { DEFAULT_SETTINGS, SETTING_LABELS } from '../utils/constants.js';

/**
 * Core Popup Elements - Only keep non-toggle elements
 */
const elements = {
  dropdownHeaders: document.querySelectorAll('.dropdown-header'),
  status: document.getElementById('status'),
  resetSettings: document.getElementById('resetSettings'),
  themeToggle: document.getElementById('themeToggle')
};

// ============================================================================
// Dynamic Toggle System 
// ============================================================================

/**
 * Update all toggle UI elements with current settings
 * Automatically handles ALL settings without manual mapping
 */
function updateUI(settings) {
  // Iterate over all DEFAULT_SETTINGS keys to automatically support new features
  Object.keys(DEFAULT_SETTINGS).forEach(settingKey => {
    if (typeof DEFAULT_SETTINGS[settingKey] === 'boolean') {
      const checkbox = document.getElementById(settingKey);
      if (checkbox) {
        checkbox.checked = settings[settingKey] ?? DEFAULT_SETTINGS[settingKey];
      }
    }
  });

  // Update dropdown states
  updateDropdownStates(settings.dropdownStates || DEFAULT_SETTINGS.dropdownStates);
}

/**
 * Schedule UI update for elements that may not be rendered yet
 * Fixes issue where toggles inside collapsed dropdowns are not initialized
 */
function scheduleUIUpdate(settings, attempts = 10) {
  // Try immediate update first
  updateUI(settings);
  
  // Schedule delayed updates to catch elements that render after dropdown expands
  let attemptCount = 0;
  const updateInterval = setInterval(() => {
    attemptCount++;
    updateUI(settings);
    
    if (attemptCount >= attempts) {
      clearInterval(updateInterval);
    }
  }, 50);
}

/**
 * Setup event listeners for all toggles using event delegation
 */
function setupEventListeners() {
  // Single delegated listener for ALL toggle changes
  document.addEventListener('change', (e) => {
    if (e.target.matches('input[type="checkbox"]')) {
      handleToggleChange(e.target.id, e.target.checked);
    }
  });

  // Dropdown listeners
  elements.dropdownHeaders.forEach(header => {
    header.addEventListener('click', handleDropdownToggle);
  });

  // Theme toggle
  elements.themeToggle.addEventListener('click', handleThemeToggle);

  // Reset button
  elements.resetSettings.addEventListener('click', handleResetSettings);
}

// ============================================================================
// Dropdown System
// ============================================================================

/**
 * Update dropdown states - fully dynamic
 */
function updateDropdownStates(dropdownStates) {
  Object.keys(dropdownStates).forEach(section => {
    const contentElement = document.getElementById(`${section}-content`);
    if (contentElement) {
      const sectionElement = contentElement.closest('.dropdown-section');
      sectionElement.classList.toggle('expanded', dropdownStates[section]);
    }
  });
}

/**
 * Handle dropdown toggle
 */
async function handleDropdownToggle(event) {
  const header = event.currentTarget;
  const section = header.getAttribute('data-section');
  const sectionElement = header.closest('.dropdown-section');
  
  sectionElement.classList.toggle('expanded');
  
  // Update UI when dropdown expands to ensure toggles have correct state
  updateUI(await getSettings());
  
  const currentSettings = await getSettings();
  await setSettings({
    dropdownStates: {
      ...currentSettings.dropdownStates,
      [section]: sectionElement.classList.contains('expanded')
    }
  });
}

// ============================================================================
// Toggle Handler
// ============================================================================

/**
 * Handle toggle state changes
 */
async function handleToggleChange(settingKey, newValue) {
  try {
    await setSettings({ [settingKey]: newValue });
    showStatus(`${SETTING_LABELS[settingKey] || settingKey} ${newValue ? 'enabled' : 'disabled'}`, 'success');
  } catch (error) {
    console.error('MiTube: Failed to update setting:', error);
    showStatus('Failed to update setting', 'error');
    
    // Revert UI change
    const checkbox = document.getElementById(settingKey);
    if (checkbox) checkbox.checked = !newValue;
  }
}

// ============================================================================
// Theme System
// ============================================================================

function handleThemeToggle() {
  const currentTheme = getCurrentTheme();
  const themes = ['light', 'dark', 'system'];
  const currentIndex = themes.indexOf(currentTheme);
  const newTheme = themes[(currentIndex + 1) % themes.length];
  
  applyTheme(newTheme);
  setSettings({ theme: newTheme });
  
  const themeLabels = {
    'light': 'Light mode',
    'dark': 'Dark mode', 
    'system': 'System theme'
  };
  showStatus(`${themeLabels[newTheme]} activated`, 'success');
}

function getCurrentTheme() {
  return document.body.getAttribute('data-theme') || 'system';
}

function applyTheme(theme) {
  document.body.removeAttribute('data-theme');
  
  if (theme === 'light' || theme === 'dark') {
    document.body.setAttribute('data-theme', theme);
  }
  
  updateThemeIcon(theme);
}

function updateThemeIcon(theme) {
  elements.themeToggle.classList.remove('theme-light', 'theme-dark', 'theme-system');
  elements.themeToggle.classList.add(`theme-${theme}`);
}

// ============================================================================
// Reset Settings
// ============================================================================

async function handleResetSettings() {
  try {
    await setSettings(DEFAULT_SETTINGS);
    updateUI(DEFAULT_SETTINGS);
    applyTheme(DEFAULT_SETTINGS.theme);
    
    showStatus('Settings reset to defaults', 'success');
    console.log('MiTube: Settings reset to defaults');
  } catch (error) {
    console.error('MiTube: Failed to reset settings:', error);
    showStatus('Failed to reset settings', 'error');
  }
}

// ============================================================================
// Status Messages
// ============================================================================

function showStatus(message, type = 'info') {
  elements.status.textContent = message;
  elements.status.className = `status ${type}`;
  
  if (type === 'success') {
    setTimeout(() => {
      elements.status.textContent = '';
      elements.status.className = 'status';
    }, 3000);
  }
}

// ============================================================================
// Initialization
// ============================================================================

async function init() {
  try {
    const settings = await getSettings();
    
    applyTheme(settings.theme || 'system');
    scheduleUIUpdate(settings);
    setupEventListeners();
    
    showStatus('Settings loaded successfully', 'success');
  } catch (error) {
    console.error('MiTube: Failed to load settings:', error);
    showStatus('Failed to load settings', 'error');
  }
}

document.addEventListener('DOMContentLoaded', init);