// MiTube Content Script - Main entry point for YouTube page interaction
import { getSettings } from '../utils/storage.js';
import { showTotalDuration, hideTotalDuration } from '../features/playlist_duration.js';
import { showEndTime, hideEndTime } from '../features/playlist_end_time.js';
import { debounce } from '../utils/time_utils.js';
import { PERFORMANCE } from '../utils/constants.js';

/**
 * MiTube Content Script
 * 
 * Main orchestrator for YouTube page interaction and feature management.
 * Handles settings, feature toggles, and DOM observation.
 */

// State management
let currentSettings = {
  showTotalDuration: true,
  showEndTime: true,
  hideShorts: false,
  hideMemberOnly: false
};

let isInitialized = false;
let playlistObserver = null;
let settingsListener = null;

// Performance optimization: Cache calculated values
let calculationCache = {
  totalDuration: null,
  endTime: null,
  lastCalculationTime: 0,
  cacheValid: false
};

/**
 * Initialize the content script
 */
async function initialize() {
  if (isInitialized) return;
  
  console.log('MiTube: Initializing content script');
  
  try {
    // Load current settings
    currentSettings = await getSettings();
    console.log('MiTube: Loaded settings:', currentSettings);
    
    // Set up settings change listener
    setupSettingsListener();
    
    // Start observing playlist
    startPlaylistObservation();
    
    isInitialized = true;
    console.log('MiTube: Content script initialized successfully');
  } catch (error) {
    console.error('MiTube: Failed to initialize content script:', error);
  }
}

/**
 * Set up listener for storage changes
 */
function setupSettingsListener() {
  if (settingsListener) return;
  
  settingsListener = (changes, namespace) => {
    if (namespace === 'sync' && changes) {
      // Update current settings - extract newValue from each change
      for (const key in changes) {
        currentSettings[key] = changes[key].newValue;
      }
      console.log('MiTube: Settings updated:', currentSettings);
      
      // Apply settings changes
      applySettingsChanges(changes);
    }
  };
  
  chrome.storage.onChanged.addListener(settingsListener);
}

/**
 * Apply settings changes to the current page
 * @param {Object} changes - Changed settings
 */
function applySettingsChanges(changes) {
  // Handle playlist duration setting
  if ('showTotalDuration' in changes) {
    if (changes.showTotalDuration.newValue) {
      showTotalDuration();
    } else {
      hideTotalDuration();
    }
  }
  
  // Handle playlist end time setting
  if ('showEndTime' in changes) {
    if (changes.showEndTime.newValue) {
      showEndTime();
    } else {
      hideEndTime();
    }
  }
}

/**
 * Start observing playlist for changes
 */
function startPlaylistObservation() {
  const playlistContainer = document.getElementById('playlist');
  
  if (playlistContainer) {
    observePlaylist(playlistContainer);
  } else {
    // Wait for playlist to be added to DOM
    const observer = new MutationObserver((mutationsList) => {
      for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {
          const playlistContainer = document.getElementById('playlist');
          if (playlistContainer) {
            observer.disconnect();
            observePlaylist(playlistContainer);
            break;
          }
        }
      }
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
  }
}

/**
 * Observe playlist for content changes
 * @param {Element} targetNode - The playlist container element
 */
function observePlaylist(targetNode) {
  if (playlistObserver) {
    playlistObserver.disconnect();
  }
  
  playlistObserver = new MutationObserver((mutationsList) => {
    for (let mutation of mutationsList) {
      if (mutation.type === 'childList') {
        handlePlaylistUpdate();
        break;
      }
    }
  });
  
  // Observe the target node for child list mutations
  playlistObserver.observe(targetNode, { childList: true, subtree: true });
}

/**
 * Handle playlist content updates with debouncing and caching
 */
const handlePlaylistUpdate = debounce(() => {
  // Clear cache when playlist content changes
  calculationCache.cacheValid = false;
  calculationCache.totalDuration = null;
  calculationCache.endTime = null;
  
  // Update duration if enabled
  if (currentSettings.showTotalDuration) {
    showTotalDuration(calculationCache);
  }
  
  // Update end time if enabled
  if (currentSettings.showEndTime) {
    showEndTime(calculationCache);
  }
}, PERFORMANCE.DEBOUNCE_DELAY);

/**
 * Cleanup function to disconnect observers
 */
function cleanup() {
  if (playlistObserver) {
    playlistObserver.disconnect();
    playlistObserver = null;
  }
  
  if (settingsListener) {
    chrome.storage.onChanged.removeListener(settingsListener);
    settingsListener = null;
  }
  
  isInitialized = false;
}

// Initialize when DOM is ready
if (document.readyState === 'complete' || document.readyState !== 'loading') {
  initialize();
} else {
  document.addEventListener('DOMContentLoaded', initialize);
}

// Handle page navigation (for SPA behavior) - optimized version
if (window.location.hostname === 'www.youtube.com') {
  let currentUrl = window.location.href;
  
  // Use a less aggressive approach for URL changes
  const urlCheckInterval = setInterval(() => {
    const newUrl = window.location.href;
    if (newUrl !== currentUrl) {
      currentUrl = newUrl;
      cleanup();
      initialize();
    }
  }, 1000); // Check every second instead of watching all DOM changes
  
  // Cleanup interval when content script is destroyed
  window.addEventListener('beforeunload', () => {
    clearInterval(urlCheckInterval);
  });
}
