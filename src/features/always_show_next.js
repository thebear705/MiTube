// always_show_next.js - Refactored with createSimpleVisibilityManager

import { createSimpleVisibilityManager } from '../utils/visibility.js';

/**
 * Always Show Next Video Button Feature Module
 * 
 * This module handles always showing the next video button in the video player
 */

// Create a simple visibility manager for the next button
const nextButtonManager = createSimpleVisibilityManager('a.ytp-next-button');

/**
 * Shows the next video button
 */
export function showNextButton() {
  nextButtonManager.show();
}

/**
 * Hides the next video button
 */
export function hideNextButton() {
  nextButtonManager.hide();
}

/**
 * Toggles the next video button visibility
 * @param {boolean} show - True to show, false to hide
 */
export function toggleNextButton(show) {
  nextButtonManager.toggle(!show);
}