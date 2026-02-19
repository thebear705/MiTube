// playlist_duration.js

import { totalTimeInSeconds, secondsToStringTime } from '../utils/time_utils.js';
import { getVideoTimeElements, getPlaylistTitleElement } from '../utils/selectors.js';
import { createInfoElement, removeElementById, insertAfter } from '../utils/dom.js';
import { FEATURE_ELEMENT_IDS, STYLES } from '../utils/constants.js';

/**
 * Playlist Duration Feature Module
 * 
 * This module handles the calculation and display of total playlist duration.
 * It provides functions to calculate, display, and remove the duration display.
 */

const DURATION_ELEMENT_ID = FEATURE_ELEMENT_IDS.totalDuration;

/**
 * Calculates the total duration of all videos in the playlist
 * @param {Object} cache - Optional calculation cache
 * @returns {number|null} Total duration in seconds, or null if no videos found
 */
export function calculateTotalDuration(cache = null) {
  // Use cache if available and valid
  if (cache && cache.cacheValid && cache.totalDuration !== null) {
    return cache.totalDuration;
  }

  const timeElements = getVideoTimeElements();
  
  if (timeElements.length === 0) {
    return null;
  }

  const times = Array.from(timeElements).map(element => element.textContent.trim());
  const totalSeconds = totalTimeInSeconds(times);

  // Update cache if provided
  if (cache !== null) {
    cache.totalDuration = totalSeconds;
    cache.cacheValid = true;
    cache.lastCalculationTime = Date.now();
  }

  return totalSeconds;
}

/**
 * Displays the total duration in the playlist header
 * @param {number} totalSeconds - Total duration in seconds
 */
export function displayTotalDuration(totalSeconds) {
  const titleElement = getPlaylistTitleElement();
  
  if (!titleElement) {
    console.warn('MiTube: Could not find playlist title element to display duration');
    return;
  }

  // Remove existing duration element if present
  removeTotalDuration();

  // Create duration display element using utility
  const durationText = secondsToStringTime(totalSeconds);
  const durationElement = createInfoElement(
    DURATION_ELEMENT_ID, 
    `Total Duration: ${durationText}`,
    {
      color: STYLES.durationColor,
      marginTop: STYLES.marginTop
    }
  );

  // Insert after the title element
  insertAfter(durationElement, titleElement, titleElement.parentNode);
}

/**
 * Removes the total duration display from the playlist
 */
export function removeTotalDuration() {
  removeElementById(DURATION_ELEMENT_ID);
}

/**
 * Updates the total duration display
 * If duration is null, removes the display
 * @param {number|null} totalSeconds - Total duration in seconds, or null to remove
 */
export function updateTotalDuration(totalSeconds) {
  if (totalSeconds === null) {
    removeTotalDuration();
  } else {
    displayTotalDuration(totalSeconds);
  }
}

/**
 * Main function to calculate and display total duration
 * @param {Object} cache - Optional calculation cache
 * @returns {boolean} True if duration was calculated and displayed, false otherwise
 */
export function showTotalDuration(cache = null) {
  const totalSeconds = calculateTotalDuration(cache);
  
  if (totalSeconds !== null) {
    displayTotalDuration(totalSeconds);
    return true;
  }
  
  return false;
}

/**
 * Hides the total duration display
 */
export function hideTotalDuration() {
  removeTotalDuration();
}