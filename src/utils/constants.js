// Shared constants for MiTube Chrome Extension

// ============================================================================
// Feature Text Constants (Magic Strings)
// ============================================================================

/**
 * Text constants used for feature detection and display
 * Centralized to avoid scattered magic strings throughout the codebase
 */
export const FEATURE_TEXT = {
  // Badge text for detection (lowercase for case-insensitive matching)
  MEMBERS_ONLY: 'members only',
  SHORTS: 'shorts',
  
  // Display text
  PLAYLIST_ENDED: 'Playlist has ended',
};

/**
 * YouTube element selectors for feature detection
 */
export const ELEMENT_SELECTORS = {
  // Badge selectors
  BADGE: '.yt-content-metadata-view-model__badge',
  
  // Content renderers
  RICH_ITEM: 'ytd-rich-item-renderer',
  VIDEO_RENDERER: 'ytd-video-renderer',
  PLAYLIST_ITEM: 'ytd-playlist-panel-video-renderer',
  SHELF_RENDERER: 'ytd-shelf-renderer',
  
  // Navigation
  GUIDE_ENTRY: 'ytd-guide-entry-renderer',
  
  // Tabs
  TAB_SHAPE: 'yt-tab-shape',
  
  // Filters
  CHIP_RENDERER: 'yt-chip-cloud-chip-renderer',
  SEARCH_FILTER: 'ytd-search-filter-renderer',
  
  // Reels
  REEL_SHELF: 'ytd-reel-shelf-renderer',
};

// ============================================================================
// Default Settings
// ============================================================================

/**
 * Default settings for the extension
 * Used across background.js, popup.js, and content scripts
 */
export const DEFAULT_SETTINGS = {
  // Playlists
  showTotalDuration: false,
  showEndTime: true,
  clearPlayed: false,
  
  // Video Player
  miniPlayerButton: false,
  videoPlayerEndTime: false,
  timeLeftToggle: false,
  alwaysShowNextButton: false,
  enableChapterButtons: true,
  
  // Video Feed & Search Results
  hideShorts: false,
  hideAutoDubbed: false,
  hideMemberOnly: false,
  
  // UI & Theme
  theme: 'system',  // 'light', 'dark', or 'system'
  
  // Dropdown states
  dropdownStates: {
    playlists: false,
    videoPlayer: false,
    videoFeed: false
  }
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
 * Human-readable labels for settings
 * Single source of truth used by popup and other UI components
 */
export const SETTING_LABELS = {
  showTotalDuration: 'Playlist Total Duration',
  showEndTime: 'Playlist End Time',
  clearPlayed: 'Clear Played',
  miniPlayerButton: 'Mini Player Button',
  videoPlayerEndTime: 'Video Player End Time',
  timeLeftToggle: 'Time Left Toggle',
  hideShorts: 'Hide Shorts',
  hideAutoDubbed: 'Hide Auto-Dubbed Videos',
  hideMemberOnly: 'Hide Member-only Videos',
  alwaysShowNextButton: 'Always Show Next Video',
  enableChapterButtons: 'Chapter Navigation Buttons'
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
  videoTimeElements: '.ytBadgeShapeText, .yt-badge-shape__text',
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
  memberOnlyBadge: '.ytd-badge-supported-renderer',
  
  // Navigation sidebar
  shortsNavButton: 'a[title="Shorts"]',
  
  // Homepage shorts sections
  shortsHomeShelf: 'ytd-rich-shelf-renderer[is-shorts]',
  
  // Search results shorts
  shortsSearchShelf: 'grid-shelf-view-model'
};
