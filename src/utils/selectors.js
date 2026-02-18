// selectors.js

/**
* A collection of dom selectors to extract specific page elements.
* This file serves as a centralized location for all DOM selectors used in the 
* extension, making it easier to maintain and update them as needed.
*/

// YouTube Playlist DOM Selectors
export const YOUTUBE_SELECTORS = {
  // Main playlist container
  playlistContainer: '#playlist',
  
  // Playlist title and header area
  playlistTitle: '.title.style-scope.ytd-playlist-panel-renderer',
  playlistHeader: '.header.style-scope.ytd-playlist-panel-renderer',
  
  // Video time elements in playlist
  videoTimeElements: '.yt-badge-shape__text',
  videoDuration: '.ytd-thumbnail-overlay-time-status-renderer',
  
  // Playlist items
  playlistItems: 'ytd-playlist-panel-video-renderer',
  playlistItem: 'ytd-playlist-panel-video-renderer',
  currentlyPlayingItem: 'ytd-playlist-panel-video-renderer[selected]',
  
  // Video player
  videoPlayer: '#movie_player video',
  
  // Queue/Up next elements
  queueTitle: '.title.style-scope.ytd-playlist-panel-renderer',
  queueContainer: '#items.style-scope.ytd-playlist-panel-renderer',
  
  // Additional selectors for future features
  shortsIndicator: '.ytd-thumbnail-overlay-side-panel-renderer',
  memberOnlyBadge: '.ytd-badge-supported-renderer'
};

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
      const durationSeconds = parseVideoTimeToSeconds(timeText);
      watchedDuration += durationSeconds;
    }
  }
  
  return watchedDuration;
}

/**
 * Parse video time string to seconds
 * @param {string} timeString - Time string in format "H:MM:SS", "MM:SS", or "SS"
 * @returns {number} Duration in seconds
 */
function parseVideoTimeToSeconds(timeString) {
  if (!timeString) return 0;
  
  const parts = timeString.split(':').map(part => parseInt(part, 10));
  
  if (parts.length === 1) {
    // SS format
    return parts[0] || 0;
  } else if (parts.length === 2) {
    // MM:SS format
    return (parts[0] * 60) + (parts[1] || 0);
  } else if (parts.length === 3) {
    // H:MM:SS format
    return (parts[0] * 3600) + (parts[1] * 60) + (parts[2] || 0);
  }
  
  return 0;
}
