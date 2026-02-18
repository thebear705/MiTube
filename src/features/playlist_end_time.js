// playlist_end_time.js

import { calculateTotalDuration } from './playlist_duration.js';
import { formatEndTime } from '../utils/time_utils.js';
import { getPlaylistTitleElement, getCurrentVideoElapsedTime, getWatchedVideosDurationBeforeCurrent } from '../utils/selectors.js';

/**
 * Playlist End Time Feature Module
 * 
 * This module handles the calculation and display of when the playlist will finish.
 * It provides functions to calculate, display, and remove the end time display.
 */

const END_TIME_ELEMENT_ID = 'miTube-end-time';

/**
 * Calculates the end time of the playlist
 * @returns {Date|null} End time as Date object, or null if no videos found
 */
export function calculateEndTime() {
  const totalSeconds = calculateTotalDuration();
  
  if (totalSeconds === null) {
    return null;
  }

  // Get elapsed time of current video
  const elapsedSeconds = getCurrentVideoElapsedTime();
  
  // Get duration of already watched videos (videos before current)
  const watchedDuration = getWatchedVideosDurationBeforeCurrent();
  
  // Calculate remaining time
  const remainingSeconds = totalSeconds - watchedDuration - elapsedSeconds;
  
  // Ensure we don't have negative time
  const safeRemainingSeconds = Math.max(0, remainingSeconds);
  
  // Calculate end time by adding remaining duration to current time
  return new Date(Date.now() + safeRemainingSeconds * 1000);
}

/**
 * Displays the end time in the playlist header
 * @param {Date} endDate - The calculated end date
 */
export function displayEndTime(endDate) {
  const titleElement = getPlaylistTitleElement();
  
  if (!titleElement) {
    console.warn('MiTube: Could not find playlist title element to display end time');
    return;
  }

  // Remove existing end time element if present
  removeEndTime();

  // Create end time display element
  const endTimeElement = document.createElement('div');
  endTimeElement.id = END_TIME_ELEMENT_ID;
  endTimeElement.style.color = 'var(--yt-spec-text-secondary, #aaaaaa)';
  endTimeElement.style.fontSize = '12px';
  endTimeElement.style.opacity = '0.8';
  endTimeElement.style.marginTop = '2px';
  endTimeElement.style.fontFamily = 'inherit';
  endTimeElement.style.fontStyle = 'italic';
  
  const endTimeText = formatEndTime(endDate);
  endTimeElement.textContent = endTimeText;

  // Insert after the duration element if it exists, otherwise after title
  const durationElement = document.getElementById('miTube-total-duration');
  if (durationElement) {
    durationElement.parentNode.insertBefore(endTimeElement, durationElement.nextSibling);
  } else {
    titleElement.parentNode.insertBefore(endTimeElement, titleElement.nextSibling);
  }
}

/**
 * Removes the end time display from the playlist
 */
export function removeEndTime() {
  const existingElement = document.getElementById(END_TIME_ELEMENT_ID);
  if (existingElement) {
    existingElement.remove();
  }
}

/**
 * Updates the end time display
 * If end time is null, removes the display
 * @param {Date|null} endDate - End time as Date object, or null to remove
 */
export function updateEndTime(endDate) {
  if (endDate === null) {
    removeEndTime();
  } else {
    displayEndTime(endDate);
  }
}

/**
 * Main function to calculate and display end time
 * @returns {boolean} True if end time was calculated and displayed, false otherwise
 */
export function showEndTime() {
  const endDate = calculateEndTime();
  
  if (endDate !== null) {
    displayEndTime(endDate);
    return true;
  }
  
  return false;
}

/**
 * Hides the end time display
 */
export function hideEndTime() {
  removeEndTime();
}