// playlist_duration.js

import { totalTimeInSeconds, secondsToStringTime } from '../utils/time_utils.js';
import { getVideoTimeElements, getPlaylistTitleElement } from '../utils/selectors.js';

/**
 * Playlist Duration Feature Module
 * 
 * This module handles the calculation and display of total playlist duration.
 * It provides functions to calculate, display, and remove the duration display.
 */

const DURATION_ELEMENT_ID = 'miTube-total-duration';

/**
 * Calculates the total duration of all videos in the playlist
 * @returns {number|null} Total duration in seconds, or null if no videos found
 */
export function calculateTotalDuration() {
  const timeElements = getVideoTimeElements();
  
  if (timeElements.length === 0) {
    return null;
  }

  const times = Array.from(timeElements).map(element => element.textContent.trim());
  return totalTimeInSeconds(times);
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

  // Create duration display element
  const durationElement = document.createElement('div');
  durationElement.id = DURATION_ELEMENT_ID;
  durationElement.style.color = 'var(--yt-spec-text-primary, #ffffff)';
  durationElement.style.fontSize = '12px';
  durationElement.style.opacity = '0.8';
  durationElement.style.marginTop = '4px';
  durationElement.style.fontFamily = 'inherit';
  
  const durationText = secondsToStringTime(totalSeconds);
  durationElement.textContent = `Total Duration: ${durationText}`;

  // Insert after the title element
  titleElement.parentNode.insertBefore(durationElement, titleElement.nextSibling);
}

/**
 * Removes the total duration display from the playlist
 */
export function removeTotalDuration() {
  const existingElement = document.getElementById(DURATION_ELEMENT_ID);
  if (existingElement) {
    existingElement.remove();
  }
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
 * @returns {boolean} True if duration was calculated and displayed, false otherwise
 */
export function showTotalDuration() {
  const totalSeconds = calculateTotalDuration();
  
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