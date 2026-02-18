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