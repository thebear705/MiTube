// hide_shorts.js

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

/**
 * Gets the Shorts navigation button element in the sidebar
 * @returns {Element|null} The ytd-guide-entry-renderer element for Shorts, or null if not found
 */
function getShortsNavElement() {
  const shortsLink = document.querySelector(YOUTUBE_SELECTORS.shortsNavButton);
  if (!shortsLink) {
    return null;
  }
  
  // Get the parent ytd-guide-entry-renderer element
  const guideEntry = shortsLink.closest('ytd-guide-entry-renderer');
  return guideEntry;
}

/**
 * Gets all Shorts shelf elements on the homepage feed
 * @returns {NodeList} All ytd-rich-shelf-renderer elements with is-shorts attribute
 */
function getShortsHomeElements() {
  return document.querySelectorAll(YOUTUBE_SELECTORS.shortsHomeShelf);
}

/**
 * Gets all Shorts shelf elements in search results
 * @returns {NodeList} All grid-shelf-view-model elements
 */
function getShortsSearchElements() {
  return document.querySelectorAll(YOUTUBE_SELECTORS.shortsSearchShelf);
}

/**
 * Gets all video renderer elements in search results that are actually shorts
 * Finds ytd-video-renderer elements that contain an anchor with href="/shorts/*"
 * @returns {Array} Array of ytd-video-renderer elements that are shorts
 */
function getDisguisedShortsElements() {
  // Find all video renderers in search results
  const videoRenderers = document.querySelectorAll('ytd-video-renderer');
  
  // Filter to find only those that link to shorts
  const shortsInDisguise = [];
  videoRenderers.forEach(renderer => {
    // Check if this video links to a short
    const shortsLink = renderer.querySelector('a[href^="/shorts/"]');
    if (shortsLink) {
      shortsInDisguise.push(renderer);
    }
  });
  
  return shortsInDisguise;
}

/**
 * Gets all Shorts filter chip elements in the search bar
 * Finds yt-chip-cloud-chip-renderer elements that contain text "Shorts"
 * @returns {Array} Array of chip elements containing "Shorts"
 */
function getShortsFilterChipElements() {
  // Find all chip cloud chip renderers
  const chipRenderers = document.querySelectorAll('yt-chip-cloud-chip-renderer');
  
  // Filter to find only those with "Shorts" text
  const shortsChips = [];
  chipRenderers.forEach(chip => {
    const textContent = chip.textContent || chip.innerText || '';
    if (textContent.trim() === 'Shorts') {
      shortsChips.push(chip);
    }
  });
  
  return shortsChips;
}

/**
 * Gets all Shorts filter elements in the Filters popup
 * Finds ytd-search-filter-renderer elements containing yt-formatted-string with "Shorts"
 * @returns {Array} Array of filter elements containing "Shorts"
 */
function getShortsFilterElements() {
  // Find all search filter renderers
  const filterRenderers = document.querySelectorAll('ytd-search-filter-renderer');
  
  // Filter to find only those with "Shorts" text
  const shortsFilters = [];
  filterRenderers.forEach(filter => {
    const textContent = filter.textContent || filter.innerText || '';
    if (textContent.trim() === 'Shorts') {
      shortsFilters.push(filter);
    }
  });
  
  return shortsFilters;
}

/**
 * Gets all Shorts tab elements on creator channel pages
 * Finds yt-tab-shape elements with tab-title="Shorts"
 * @returns {Array} Array of tab elements with tab-title="Shorts"
 */
function getShortsTabElements() {
  // Find all tab shape elements
  const tabElements = document.querySelectorAll('yt-tab-shape');
  
  // Filter to find only those with tab-title="Shorts"
  const shortsTabs = [];
  tabElements.forEach(tab => {
    if (tab.getAttribute('tab-title') === 'Shorts') {
      shortsTabs.push(tab);
    }
  });
  
  return shortsTabs;
}

/**
 * Gets all Reel shelf elements on creator channel pages
 * Finds ytd-reel-shelf-renderer elements
 * @returns {NodeList} All ytd-reel-shelf-renderer elements
 */
function getReelShelfElements() {
  return document.querySelectorAll('ytd-reel-shelf-renderer');
}

/**
 * Hides the Shorts navigation button in the sidebar
 */
function hideShortsNav() {
  const shortsElement = getShortsNavElement();
  
  if (shortsElement) {
    shortsElement.style.display = 'none';
  }
}

/**
 * Shows the Shorts navigation button in the sidebar
 */
function showShortsNav() {
  const shortsElement = getShortsNavElement();
  
  if (shortsElement) {
    shortsElement.style.display = '';
  }
}

/**
 * Hides all Shorts sections on the homepage feed
 */
function hideShortsHome() {
  const shortsElements = getShortsHomeElements();
  
  shortsElements.forEach(element => {
    element.style.display = 'none';
  });
}

/**
 * Shows all Shorts sections on the homepage feed
 */
function showShortsHome() {
  const shortsElements = getShortsHomeElements();
  
  shortsElements.forEach(element => {
    element.style.display = '';
  });
}

/**
 * Hides all Shorts sections in search results
 */
function hideShortsSearch() {
  const shortsElements = getShortsSearchElements();
  
  shortsElements.forEach(element => {
    element.style.display = 'none';
  });
}

/**
 * Shows all Shorts sections in search results
 */
function showShortsSearch() {
  const shortsElements = getShortsSearchElements();
  
  shortsElements.forEach(element => {
    element.style.display = '';
  });
}

/**
 * Hides shorts disguised as normal videos in search results
 */
function hideDisguisedShorts() {
  const disguisedShorts = getDisguisedShortsElements();
  
  disguisedShorts.forEach(element => {
    element.style.display = 'none';
  });
}

/**
 * Shows shorts disguised as normal videos in search results
 */
function showDisguisedShorts() {
  const disguisedShorts = getDisguisedShortsElements();
  
  disguisedShorts.forEach(element => {
    element.style.display = '';
  });
}

/**
 * Hides Shorts filter chips in the search bar
 */
function hideShortsFilterChip() {
  const chipElements = getShortsFilterChipElements();
  
  chipElements.forEach(element => {
    element.style.display = 'none';
  });
}

/**
 * Shows Shorts filter chips in the search bar
 */
function showShortsFilterChip() {
  const chipElements = getShortsFilterChipElements();
  
  chipElements.forEach(element => {
    element.style.display = '';
  });
}

/**
 * Hides Shorts filter options in the Filters popup
 */
function hideShortsFilter() {
  const filterElements = getShortsFilterElements();
  
  filterElements.forEach(element => {
    element.style.display = 'none';
  });
}

/**
 * Shows Shorts filter options in the Filters popup
 */
function showShortsFilter() {
  const filterElements = getShortsFilterElements();
  
  filterElements.forEach(element => {
    element.style.display = '';
  });
}

/**
 * Hides Shorts tabs on creator channel pages
 */
function hideShortsTab() {
  const tabElements = getShortsTabElements();
  
  tabElements.forEach(element => {
    element.style.display = 'none';
  });
}

/**
 * Shows Shorts tabs on creator channel pages
 */
function showShortsTab() {
  const tabElements = getShortsTabElements();
  
  tabElements.forEach(element => {
    element.style.display = '';
  });
}

/**
 * Hides Reel shelf on creator channel pages
 */
function hideReelShelf() {
  const reelElements = getReelShelfElements();
  
  reelElements.forEach(element => {
    element.style.display = 'none';
  });
}

/**
 * Shows Reel shelf on creator channel pages
 */
function showReelShelf() {
  const reelElements = getReelShelfElements();
  
  reelElements.forEach(element => {
    element.style.display = '';
  });
}

/**
 * Hides Shorts in all locations
 */
export function hideShorts() {
  hideShortsNav();
  hideShortsHome();
  hideShortsSearch();
  hideDisguisedShorts();
  hideShortsFilterChip();
  hideShortsFilter();
  hideShortsTab();
  hideReelShelf();
}

/**
 * Shows Shorts in all locations
 */
export function showShorts() {
  showShortsNav();
  showShortsHome();
  showShortsSearch();
  showDisguisedShorts();
  showShortsFilterChip();
  showShortsFilter();
  showShortsTab();
  showReelShelf();
}

/**
 * Toggles Shorts visibility
 * @param {boolean} hide - True to hide, false to show
 */
export function toggleShorts(hide) {
  if (hide) {
    hideShorts();
  } else {
    showShorts();
  }
}
