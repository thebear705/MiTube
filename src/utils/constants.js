// Shared constants for MiTube Chrome Extension

/**
 * Default settings for the extension
 * Used across background.js, popup.js, and content scripts
 */
export const DEFAULT_SETTINGS = {
  showTotalDuration: true,
  showEndTime: true,
  hideShorts: false,
  hideMemberOnly: false,
  theme: 'system'  // 'light', 'dark', or 'system'
};

/**
 * Feature element IDs for DOM manipulation
 */
export const FEATURE_ELEMENT_IDS = {
  totalDuration: 'miTube-total-duration',
  endTime: 'miTube-end-time'
};

/**
 * Performance and timing constants
 */
export const PERFORMANCE = {
  DEBOUNCE_DELAY: 250,        // ms - for playlist update handling
  URL_CHECK_INTERVAL: 1000,   // ms - for YouTube SPA navigation detection
  STORAGE_UPDATE_DELAY: 100   // ms - small delay for storage change propagation
};

/**
 * CSS styling constants for consistent appearance
 */
export const STYLES = {
  fontSize: '12px',
  opacity: '0.8',
  fontFamily: 'inherit',
  durationColor: 'var(--yt-spec-text-primary, #ffffff)',
  endTimeColor: 'var(--yt-spec-text-secondary, #aaaaaa)',
  marginTop: '4px',
  endTimeMarginTop: '2px'
};

/**
 * YouTube DOM selectors
 * Centralized for consistency and easier maintenance
 */
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