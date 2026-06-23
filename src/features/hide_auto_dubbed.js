// hide_auto_dubbed.js - Refactored with VisibilityManager

import { VisibilityManager } from '../utils/visibility.js';
import { FEATURE_TEXT } from '../utils/constants.js';

/**
 * Hide Auto-Dubbed Feature Module
 * 
 * This module handles hiding auto-dubbed videos in:
 * 1. Homepage feed (ytd-rich-item-renderer)
 * 2. Search results (ytd-video-renderer)
 * 3. Other areas where auto-dubbed videos appear
 */

// Badge text constants for auto-dubbed and dubbed detection
// const AUTO_DUBBED_BADGE = FEATURE_TEXT.AUTO_DUBBED;
// const DUBBED_BADGE = FEATURE_TEXT.DUBBED;

const AUTO_DUBBED_BADGE = 'auto-dubbed';
const DUBBED_BADGE = 'dubbed';


/**
 * Check if an element contains an auto-dubbed badge
 * @param {Element} el - The element to check
 * @returns {boolean} True if the element has an auto-dubbed badge
 */
function hasAutoDubbedBadge(el) {
  const badges = el.querySelectorAll('.yt-content-metadata-view-model__badge');
  for (const badge of badges) {
    const text = (badge.textContent || badge.innerText || '').toLowerCase();
    const match = text.includes(AUTO_DUBBED_BADGE) || text.includes(DUBBED_BADGE);
    // Debug: log badge text and match result
    console.log('MiTube: Checking badge', { text, match, element: el });
    if (match) {
      return true;
    }
  }
  // Debug: no matching badge found
  console.debug('MiTube: No dubbed badge found for element', el);
  return false;
}

// Create a VisibilityManager instance for all auto-dubbed locations
const autoDubbedManager = new VisibilityManager([
  {
    name: 'homepage',
    selector: 'ytd-rich-item-renderer',
    filterFn: hasAutoDubbedBadge
  },
  {
    name: 'search_results',
    selector: 'ytd-video-renderer',
    filterFn: hasAutoDubbedBadge
  },
  {
    name: 'channel_section',
    selector: 'ytd-shelf-renderer',
    filterFn: (el) => el.querySelector('span[title*="Auto-dubbed" i], div[title*="Auto-dubbed" i]') !== null
  }
]);

/**
 * Hides auto-dubbed videos in all locations
 */
export function hideAutoDubbed() {
  const before = document.querySelectorAll('ytd-rich-item-renderer, ytd-video-renderer, ytd-shelf-renderer').length;
  autoDubbedManager.hide();
  const after = document.querySelectorAll('ytd-rich-item-renderer, ytd-video-renderer, ytd-shelf-renderer').length;
  console.log('MiTube: hideAutoDubbed called, elements before:', before, 'after:', after);
}


/**
 * Shows auto-dubbed videos in all locations
 */
export function showAutoDubbed() {
  autoDubbedManager.show();
}

/**
 * Toggles auto-dubbed videos visibility
 * @param {boolean} hide - True to hide, false to show
 */
export function toggleAutoDubbed(hide) {
  autoDubbedManager.toggle(hide);
}

/**
 * Start observing for auto-dubbed elements and hide them
 * This ensures auto-dubbed videos are hidden on initial load and when new content is dynamically added
 * @param {Function} shouldHide - Function that returns whether hiding is enabled
 */
export function observeAndHideAutoDubbed(shouldHide) {
  // Try to hide immediately on call
  if (shouldHide()) {
    hideAutoDubbed();
  }
  
  // Set up observer to watch for auto-dubbed elements being added to DOM
  const observer = new MutationObserver(() => {
    if (shouldHide()) {
       console.log('MiTube: MutationObserver triggered for auto-dubbed videos');
       hideAutoDubbed();
    }
  });
  
  // Observe the entire document for new content
  observer.observe(document.body, { childList: true, subtree: true });
  
  return observer;
}