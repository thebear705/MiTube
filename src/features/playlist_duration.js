// playlist_duration.js - Refactored with FeatureDisplayManager

import { totalTimeInSeconds, secondsToStringTime } from '../utils/time_utils.js';
import { getVideoTimeElements } from '../utils/dom.js';
import { durationDisplayManager } from '../utils/display.js';
import { FEATURE_ELEMENT_IDS } from '../utils/constants.js';

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
 * @returns {boolean} True if displayed successfully
 */
export function displayTotalDuration(totalSeconds) {
  const durationText = secondsToStringTime(totalSeconds);
  return durationDisplayManager.display(`Total Duration: ${durationText}`);
}

/**
 * Removes the total duration display from the playlist
 */
export function removeTotalDuration() {
  durationDisplayManager.remove();
}

/**
 * Updates the total duration display
 * If duration is null, removes the display
 * @param {number|null} totalSeconds - Total duration in seconds, or null to remove
 */
export function updateTotalDuration(totalSeconds) {
  durationDisplayManager.update(totalSeconds, (s) => `Total Duration: ${secondsToStringTime(s)}`);
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