// DOM utilities for MiTube Chrome Extension

import { FEATURE_ELEMENT_IDS, STYLES, YOUTUBE_SELECTORS } from './constants.js';

// ============================================================================
// Badge Detection Utilities
// ============================================================================

/**
 * Find elements that contain a specific badge text
 * @param {string} selector - CSS selector for parent elements to check
 * @param {string} badgeText - Text to search for in badges (case-insensitive)
 * @param {string} [badgeSelector='.yt-content-metadata-view-model__badge'] - CSS selector for badge elements
 * @returns {Array<Element>} Array of elements that contain the badge
 */
export function findElementsByBadgeText(selector, badgeText, badgeSelector = '.yt-content-metadata-view-model__badge') {
  const elements = document.querySelectorAll(selector);
  const matching = [];
  
  elements.forEach(el => {
    const badges = el.querySelectorAll(badgeSelector);
    for (const badge of badges) {
      const text = (badge.textContent || badge.innerText || '').toLowerCase();
      if (text.includes(badgeText.toLowerCase())) {
        matching.push(el);
        break; // Found the badge, no need to check more
      }
    }
  });
  
  return matching;
}

/**
 * Check if an element contains a specific badge text
 * @param {Element} element - The element to check
 * @param {string} badgeText - Text to search for in badges (case-insensitive)
 * @param {string} [badgeSelector='.yt-content-metadata-view-model__badge'] - CSS selector for badge elements
 * @returns {boolean} True if the element contains the badge
 */
export function hasBadgeText(element, badgeText, badgeSelector = '.yt-content-metadata-view-model__badge') {
  const badges = element.querySelectorAll(badgeSelector);
  for (const badge of badges) {
    const text = (badge.textContent || badge.innerText || '').toLowerCase();
    if (text.includes(badgeText.toLowerCase())) {
      return true;
    }
  }
  return false;
}

// ============================================================================
// Element Creation and Manipulation
// ============================================================================

/**
 * Create a styled info element for displaying duration or end time
 * @param {string} id - The element ID
 * @param {string} text - The text content
 * @param {Object} options - Additional styling options
 * @param {string} options.color - Text color
 * @param {string} options.marginTop - Top margin
 * @param {string} options.fontStyle - Font style (italic, normal)
 * @param {string} options.fontWeight - Font weight (bold, normal)
 * @returns {HTMLElement} The created element
 */
export function createInfoElement(id, text, options = {}) {
  const element = document.createElement('div');
  element.id = id;
  element.textContent = text;
  
  // Apply base styles
  element.style.fontSize = STYLES.fontSize;
  element.style.opacity = STYLES.opacity;
  element.style.fontFamily = STYLES.fontFamily;
  element.style.color = options.color || STYLES.durationColor;
  element.style.marginTop = options.marginTop || STYLES.marginTop;
  
  // Apply optional styles
  if (options.fontStyle) {
    element.style.fontStyle = options.fontStyle;
  }
  
  if (options.fontWeight) {
    element.style.fontWeight = options.fontWeight;
  }
  
  return element;
}

/**
 * Remove an element by its ID
 * @param {string} id - The element ID to remove
 */
export function removeElementById(id) {
  const element = document.getElementById(id);
  if (element) {
    element.remove();
  }
}

/**
 * Get the playlist container element
 * @returns {Element|null} The playlist container or null if not found
 */
export function getPlaylistContainer() {
  return document.querySelector(YOUTUBE_SELECTORS.playlistContainer);
}

/**
 * Get the playlist title element
 * @returns {Element|null} The playlist title element or null if not found
 */
export function getPlaylistTitleElement() {
  const container = getPlaylistContainer();
  if (!container) return null;
  return container.querySelector(YOUTUBE_SELECTORS.playlistTitle);
}

/**
 * Get all video time elements in the playlist
 * @returns {NodeList} List of video time elements
 */
export function getVideoTimeElements() {
  const container = getPlaylistContainer();
  if (!container) return [];
  return container.querySelectorAll(YOUTUBE_SELECTORS.videoTimeElements);
}

/**
 * Get the currently playing playlist item
 * @returns {Element|null} The currently playing item or null if not found
 */
export function getCurrentlyPlayingItem() {
  const container = getPlaylistContainer();
  if (!container) return null;
  return container.querySelector(YOUTUBE_SELECTORS.currentlyPlayingItem);
}

/**
 * Get the index of the currently playing video in the playlist
 * @returns {number} Index of currently playing video, or -1 if not found
 */
export function getCurrentlyPlayingIndex() {
  const container = getPlaylistContainer();
  if (!container) return -1;
  
  const playlistItems = container.querySelectorAll(YOUTUBE_SELECTORS.playlistItems);
  const currentItem = getCurrentlyPlayingItem();
  
  if (!currentItem) return -1;
  
  return Array.from(playlistItems).indexOf(currentItem);
}

/**
 * Get the elapsed time of the currently playing video
 * @returns {number} Elapsed time in seconds, or 0 if no video is playing
 */
export function getCurrentVideoElapsedTime() {
  const video = document.querySelector(YOUTUBE_SELECTORS.videoPlayer);
  return video ? video.currentTime : 0;
}

/**
 * Check if we're on a playlist page
 * @returns {boolean} True if on a playlist page
 */
export function isPlaylistPage() {
  return !!getPlaylistContainer();
}

/**
 * Insert an element after a reference element
 * @param {Element} newElement - The element to insert
 * @param {Element|null} referenceElement - The reference element
 * @param {Element} parentElement - The parent element to insert into
 */
export function insertAfter(newElement, referenceElement, parentElement) {
  if (referenceElement && referenceElement.nextSibling) {
    parentElement.insertBefore(newElement, referenceElement.nextSibling);
  } else {
    parentElement.appendChild(newElement);
  }
}