// selectors.js

/**
* A collection of dom selectors to extract specific page elements.
* This file serves as a centralized location for all DOM selectors used in the 
* extension, making it easier to maintain and update them as needed.
*/

import { YOUTUBE_SELECTORS } from './constants.js';
import { parseTimeToSeconds } from './time_utils.js';

// YouTube Playlist DOM Selectors (re-exported from constants for backward compatibility)
export { YOUTUBE_SELECTORS };

// Utility function to get playlist container
export function getPlaylistContainer() {
  return document.querySelector(YOUTUBE_SELECTORS.playlistContainer);
}

// Utility function to get all video time elements
export function getVideoTimeElements() {
  const container = getPlaylistContainer();
  if (!container) return [];
  return container.querySelectorAll(YOUTUBE_SELECTORS.videoTimeElements);
}

// Utility function to get playlist title element
export function getPlaylistTitleElement() {
  const container = getPlaylistContainer();
  if (!container) return null;
  return container.querySelector(YOUTUBE_SELECTORS.playlistTitle);
}

// Utility function to check if we're on a playlist page
export function isPlaylistPage() {
  return !!getPlaylistContainer();
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
 * Get the currently playing playlist item
 * @returns {Element|null} The currently playing playlist item element, or null if not found
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
 * Calculate the total duration of videos that have been watched (before current video)
 * @returns {number} Total watched duration in seconds
 */
export function getWatchedVideosDurationBeforeCurrent() {
  const currentIndex = getCurrentlyPlayingIndex();
  if (currentIndex <= 0) return 0; // No videos before current
  
  const container = getPlaylistContainer();
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

