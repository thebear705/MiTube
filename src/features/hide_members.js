// hide_members.js

/**
 * Hide Members Only Feature Module
 * 
 * This module handles hiding members-only videos in:
 * 1. Homepage feed (ytd-rich-item-renderer)
 * 2. Search results
 */

/**
 * Gets all members-only video elements on the homepage feed
 * Finds ytd-rich-item-renderer elements that contain a badge with "Members only" text
 * @returns {Array} Array of ytd-rich-item-renderer elements that are members only
 */
function getMembersOnlyHomeElements() {
  // Find all rich item renderers on homepage
  const richItems = document.querySelectorAll('ytd-rich-item-renderer');
  
  // Filter to find only those with "Members only" badge
  const membersOnlyItems = [];
  richItems.forEach(item => {
    // Get all badges in this item
    const badges = item.querySelectorAll('.yt-content-metadata-view-model__badge');
    
    // Loop through badges to find "Members only"
    for (const badge of badges) {
      const textContent = badge.textContent || badge.innerText || '';
      if (textContent.toLowerCase().includes('members only')) {
        membersOnlyItems.push(item);
        break; // Found the badge, no need to check more
      }
    }
  });
  
  return membersOnlyItems;
}

/**
 * Gets all members-only video elements in search results
 * Finds ytd-video-renderer elements that contain a badge with "Members only" text
 * @returns {Array} Array of ytd-video-renderer elements that are members only
 */
function getMembersOnlySearchElements() {
  // Find all video renderers in search results
  const videoRenderers = document.querySelectorAll('ytd-video-renderer');
  
  // Filter to find only those with "Members only" badge
  const membersOnlyItems = [];
  videoRenderers.forEach(renderer => {
    // Get all badges in this renderer
    const badges = renderer.querySelectorAll('.yt-content-metadata-view-model__badge');
    
    // Loop through badges to find "Members only"
    for (const badge of badges) {
      const textContent = badge.textContent || badge.innerText || '';
      if (textContent.toLowerCase().includes('members only')) {
        membersOnlyItems.push(renderer);
        break; // Found the badge, no need to check more
      }
    }
  });
  
  return membersOnlyItems;
}

/**
 * Gets all members-only section elements on creator channel pages
 * Finds ytd-shelf-renderer elements that contain a link with title="Members-only videos"
 * @returns {Array} Array of ytd-shelf-renderer elements that are members-only sections
 */
function getMembersOnlyChannelSectionElements() {
  // Find all shelf renderers on the page
  const shelfRenderers = document.querySelectorAll('ytd-shelf-renderer');
  
  // Filter to find only those with "Members-only videos" title
  const membersOnlySections = [];
  shelfRenderers.forEach(shelf => {
    // Check if this shelf contains an anchor with title containing "Members-only videos"
    const membersOnlyLink = shelf.querySelector('a[title*="Members-only videos" i]');
    if (membersOnlyLink) {
      membersOnlySections.push(shelf);
    }
  });
  
  return membersOnlySections;
}

/**
 * Hides all members-only videos on the homepage feed
 */
function hideMembersOnlyHome() {
  const membersElements = getMembersOnlyHomeElements();
  
  membersElements.forEach(element => {
    element.style.display = 'none';
  });
}

/**
 * Shows all members-only videos on the homepage feed
 */
function showMembersOnlyHome() {
  const membersElements = getMembersOnlyHomeElements();
  
  membersElements.forEach(element => {
    element.style.display = '';
  });
}

/**
 * Hides all members-only videos in search results
 */
function hideMembersOnlySearch() {
  const membersElements = getMembersOnlySearchElements();
  
  membersElements.forEach(element => {
    element.style.display = 'none';
  });
}

/**
 * Shows all members-only videos in search results
 */
function showMembersOnlySearch() {
  const membersElements = getMembersOnlySearchElements();
  
  membersElements.forEach(element => {
    element.style.display = '';
  });
}

/**
 * Hides all members-only sections on creator channel pages
 */
function hideMembersOnlyChannelSection() {
  const membersElements = getMembersOnlyChannelSectionElements();
  
  membersElements.forEach(element => {
    element.style.display = 'none';
  });
}

/**
 * Shows all members-only sections on creator channel pages
 */
function showMembersOnlyChannelSection() {
  const membersElements = getMembersOnlyChannelSectionElements();
  
  membersElements.forEach(element => {
    element.style.display = '';
  });
}

/**
 * Hides members-only videos in all locations
 */
export function hideMembersOnly() {
  hideMembersOnlyHome();
  hideMembersOnlySearch();
  hideMembersOnlyChannelSection();
}

/**
 * Shows members-only videos in all locations
 */
export function showMembersOnly() {
  showMembersOnlyHome();
  showMembersOnlySearch();
  showMembersOnlyChannelSection();
}

/**
 * Toggles members-only videos visibility
 * @param {boolean} hide - True to hide, false to show
 */
export function toggleMembersOnly(hide) {
  if (hide) {
    hideMembersOnly();
  } else {
    showMembersOnly();
  }
}

/**
 * Start observing for members-only elements and hide them
 * This ensures members-only videos are hidden on initial load and when new content is dynamically added
 * @param {Function} shouldHide - Function that returns whether hiding is enabled
 */
export function observeAndHideMembers(shouldHide) {
  // Try to hide immediately on call
  if (shouldHide()) {
    hideMembersOnly();
  }
  
  // Set up observer to watch for members-only elements being added to DOM
  const observer = new MutationObserver(() => {
    if (shouldHide()) {
      hideMembersOnly();
    }
  });
  
  // Observe the entire document for new content
  observer.observe(document.body, { childList: true, subtree: true });
  
  return observer;
}
