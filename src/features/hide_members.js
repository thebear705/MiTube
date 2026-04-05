// hide_members.js - Refactored with VisibilityManager

import { VisibilityManager } from '../utils/visibility.js';

/**
 * Hide Members Only Feature Module
 * 
 * This module handles hiding members-only videos in:
 * 1. Homepage feed (ytd-rich-item-renderer)
 * 2. Search results (ytd-video-renderer)
 * 3. Creator channel pages (ytd-shelf-renderer with members-only section)
 */

// Badge text constant for members-only detection
const MEMBERS_ONLY_BADGE = 'members only';

/**
 * Check if an element contains a members-only badge
 * @param {Element} el - The element to check
 * @returns {boolean} True if the element has a members-only badge
 */
function hasMembersOnlyBadge(el) {
  const badges = el.querySelectorAll('.yt-content-metadata-view-model__badge');
  for (const badge of badges) {
    const text = (badge.textContent || badge.innerText || '').toLowerCase();
    if (text.includes(MEMBERS_ONLY_BADGE)) {
      return true;
    }
  }
  return false;
}

// Create a VisibilityManager instance for all members-only locations
const membersManager = new VisibilityManager([
  {
    name: 'homepage',
    selector: 'ytd-rich-item-renderer',
    filterFn: hasMembersOnlyBadge
  },
  {
    name: 'search_results',
    selector: 'ytd-video-renderer',
    filterFn: hasMembersOnlyBadge
  },
  {
    name: 'channel_section',
    selector: 'ytd-shelf-renderer',
    filterFn: (el) => el.querySelector('a[title*="Members-only videos" i]') !== null
  }
]);

/**
 * Hides members-only videos in all locations
 */
export function hideMembersOnly() {
  membersManager.hide();
}

/**
 * Shows members-only videos in all locations
 */
export function showMembersOnly() {
  membersManager.show();
}

/**
 * Toggles members-only videos visibility
 * @param {boolean} hide - True to hide, false to show
 */
export function toggleMembersOnly(hide) {
  membersManager.toggle(hide);
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