// always_show_next.js

/**
 * Always Show Next Video Button Feature Module
 * 
 * This module handles always showing the next video button in the video player
 */

/**
 * Gets the next video button element
 * @returns {Element|null} The ytp-next-button element, or null if not found
 */
function getNextButtonElement() {
  return document.querySelector('a.ytp-next-button');
}

/**
 * Shows the next video button
 */
export function showNextButton() {
  const nextButton = getNextButtonElement();
  
  if (nextButton) {
    nextButton.style.display = 'inline';
  }
}

/**
 * Hides the next video button
 */
export function hideNextButton() {
  const nextButton = getNextButtonElement();
  
  if (nextButton) {
    nextButton.style.display = 'none';
  }
}

/**
 * Toggles the next video button visibility
 * @param {boolean} show - True to show, false to hide
 */
export function toggleNextButton(show) {
  if (show) {
    showNextButton();
  } else {
    hideNextButton();
  }
}
