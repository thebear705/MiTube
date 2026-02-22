// playlist_end_time.js

import { calculateTotalDuration } from './playlist_duration.js';
import { formatEndTime, parseTimeToSeconds } from '../utils/time_utils.js';
import { getPlaylistTitleElement, getCurrentVideoElapsedTime, getCurrentlyPlayingIndex } from '../utils/dom.js';
import { YOUTUBE_SELECTORS } from '../utils/constants.js';
import { createInfoElement, removeElementById, insertAfter } from '../utils/dom.js';
import { FEATURE_ELEMENT_IDS, STYLES } from '../utils/constants.js';

/**
 * Calculate the total duration of videos that have been watched (before current video)
 * @returns {number} Total watched duration in seconds
 */
export function getWatchedVideosDurationBeforeCurrent() {
  const currentIndex = getCurrentlyPlayingIndex();
  if (currentIndex <= 0) return 0; // No videos before current
  
  const container = document.querySelector(YOUTUBE_SELECTORS.playlistContainer);
  if (!container) return 0;
  
  const playlistItems = container.querySelectorAll(YOUTUBE_SELECTORS.playlistItems);
  let watchedDuration = 0;
  
  // Get time elements for all playlist items
  const timeElements = container.querySelectorAll(YOUTUBE_SELECTORS.videoTimeElements);
  
  // Sum durations of all videos before the current one
  for (let i = 0; i < currentIndex; i++) {
    if (timeElements[i]) {
      const timeText = timeElements[i].textContent.trim();
      const durationSeconds = parseTimeToSeconds(timeText);
      watchedDuration += durationSeconds;
    }
  }
  
  return watchedDuration;
}

/**
 * Playlist End Time Feature Module
 * 
 * This module handles the calculation and display of when the playlist will finish.
 * It provides functions to calculate, display, and remove the end time display.
 */

const END_TIME_ELEMENT_ID = FEATURE_ELEMENT_IDS.endTime;

/**
 * Calculates the end time of the playlist
 * @param {Object} cache - Optional calculation cache
 * @returns {Date|null} End time as Date object, or null if no videos found
 */
export function calculateEndTime(cache = null) {
  // Use cache if available and valid
  if (cache && cache.cacheValid && cache.endTime !== null) {
    return cache.endTime;
  }

  const totalSeconds = calculateTotalDuration(cache);
  
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
  const endTime = new Date(Date.now() + safeRemainingSeconds * 1000);

  // Update cache if provided
  if (cache !== null) {
    cache.endTime = endTime;
    cache.cacheValid = true;
    cache.lastCalculationTime = Date.now();
  }

  return endTime;
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

  // Create end time display element using utility
  const endTimeText = formatEndTime(endDate);
  const endTimeElement = createInfoElement(
    END_TIME_ELEMENT_ID, 
    endTimeText,
    {
      color: STYLES.endTimeColor,
      marginTop: STYLES.endTimeMarginTop,
      fontStyle: 'italic'
    }
  );

  // Insert after the duration element if it exists, otherwise after title
  const durationElement = document.getElementById(FEATURE_ELEMENT_IDS.totalDuration);
  if (durationElement) {
    insertAfter(endTimeElement, durationElement, durationElement.parentNode);
  } else {
    insertAfter(endTimeElement, titleElement, titleElement.parentNode);
  }
}

/**
 * Displays "Playlist has ended" message when playlist is finished
 */
export function displayPlaylistEnded() {
  const titleElement = getPlaylistTitleElement();
  
  if (!titleElement) {
    console.warn('MiTube: Could not find playlist title element to display end time');
    return;
  }

  // Remove existing end time element if present
  removeEndTime();

  // Create end time display element using utility
  const endTimeElement = createInfoElement(
    END_TIME_ELEMENT_ID, 
    'End Time: Playlist has ended',
    {
      color: STYLES.endTimeColor,
      marginTop: STYLES.endTimeMarginTop,
      fontStyle: 'italic',
      fontWeight: 'bold'
    }
  );

  // Insert after the duration element if it exists, otherwise after title
  const durationElement = document.getElementById(FEATURE_ELEMENT_IDS.totalDuration);
  if (durationElement) {
    insertAfter(endTimeElement, durationElement, durationElement.parentNode);
  } else {
    insertAfter(endTimeElement, titleElement, titleElement.parentNode);
  }
}

/**
 * Removes the end time display from the playlist
 */
export function removeEndTime() {
  removeElementById(END_TIME_ELEMENT_ID);
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
 * @param {Object} cache - Optional calculation cache
 * @returns {boolean} True if end time was calculated and displayed, false otherwise
 */
export function showEndTime(cache = null) {
  const totalSeconds = calculateTotalDuration(cache);
  
  if (totalSeconds === null) {
    return false;
  }

  // Get elapsed time of current video
  const elapsedSeconds = getCurrentVideoElapsedTime();
  
  // Get the index of currently playing video
  const currentIndex = getCurrentlyPlayingIndex();
  
  // Check if playlist has ended (no video selected and no elapsed time)
  if (currentIndex === -1 && elapsedSeconds === 0) {
    displayPlaylistEnded();
    return true;
  }
  
  // Get duration of already watched videos (videos before current)
  const watchedDuration = getWatchedVideosDurationBeforeCurrent();
  
  // Calculate remaining time
  const remainingSeconds = totalSeconds - watchedDuration - elapsedSeconds;
  
  // Check if playlist has ended
  if (remainingSeconds <= 0) {
    displayPlaylistEnded();
    return true;
  }
  
  // Calculate end time by adding remaining duration to current time
  const endDate = calculateEndTime(cache);
  displayEndTime(endDate);
  return true;
}

/**
 * Hides the end time display
 */
export function hideEndTime() {
  removeEndTime();
}