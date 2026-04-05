// hide_shorts.js - Refactored with VisibilityManager

import { VisibilityManager } from '../utils/visibility.js';
import { YOUTUBE_SELECTORS } from '../utils/constants.js';

/**
 * Hide Shorts Feature Module
 * 
 * This module handles hiding Shorts in:
 * 1. Navigation sidebar
 * 2. Homepage feed
 * 3. Search results (shelves)
 * 4. Search results (individual videos disguised as normal videos)
 * 5. Shorts filter chip in search bar
 * 6. Shorts filter option in Filters popup
 * 7. Shorts tab on creator channel pages
 * 8. Reel shelf on creator channel pages
 */

// Helper functions to find elements that need special filtering

/**
 * Gets the parent ytd-guide-entry-renderer for the Shorts nav button
 * @param {Element} el - The shorts link element
 * @returns {Element|null} The guide entry renderer
 */
function getShortsGuideEntry(el) {
  return el.closest('ytd-guide-entry-renderer');
}

// Create a VisibilityManager instance for all Shorts locations
const shortsManager = new VisibilityManager([
  {
    name: 'nav',
    selector: YOUTUBE_SELECTORS.shortsNavButton,
    filterFn: (el) => getShortsGuideEntry(el) !== null
  },
  {
    name: 'home',
    selector: YOUTUBE_SELECTORS.shortsHomeShelf
  },
  {
    name: 'search_shelf',
    selector: YOUTUBE_SELECTORS.shortsSearchShelf
  },
  {
    name: 'disguised',
    selector: 'ytd-video-renderer',
    filterFn: (el) => el.querySelector('a[href^="/shorts/"]') !== null
  },
  {
    name: 'filter_chip',
    selector: 'yt-chip-cloud-chip-renderer',
    filterFn: (el) => {
      const text = el.textContent || el.innerText || '';
      return text.trim() === 'Shorts';
    }
  },
  {
    name: 'filter_popup',
    selector: 'ytd-search-filter-renderer',
    filterFn: (el) => {
      const text = el.textContent || el.innerText || '';
      return text.trim() === 'Shorts';
    }
  },
  {
    name: 'channel_tab',
    selector: 'yt-tab-shape',
    filterFn: (el) => el.getAttribute('tab-title') === 'Shorts'
  },
  {
    name: 'reel_shelf',
    selector: 'ytd-reel-shelf-renderer'
  }
]);

/**
 * Hides Shorts in all locations
 */
export function hideShorts() {
  shortsManager.hide();
}

/**
 * Shows Shorts in all locations
 */
export function showShorts() {
  shortsManager.show();
}

/**
 * Toggles Shorts visibility
 * @param {boolean} hide - True to hide, false to show
 */
export function toggleShorts(hide) {
  shortsManager.toggle(hide);
}