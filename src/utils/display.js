// Display Manager for MiTube Chrome Extension
// Provides a generic way to create, display, and remove feature info elements

import { createInfoElement, removeElementById, insertAfter } from './dom.js';
import { FEATURE_ELEMENT_IDS } from './constants.js';

/**
 * FeatureDisplayManager - A class for managing display of feature info elements
 * 
 * This class provides a unified way to display and remove info elements
 * (like duration, end time) in the playlist header area, reducing code duplication.
 */
export class FeatureDisplayManager {
  /**
   * @param {Object} config - Configuration object
   * @param {string} config.elementId - The ID for the created element
   * @param {string} [config.containerSelector] - CSS selector for the reference container
   * @param {string} [config.insertAfterId] - ID of element to insert after (if different from container)
   * @param {Object} [config.defaultStyles] - Default style options for createInfoElement
   */
  constructor(config) {
    this.elementId = config.elementId;
    this.containerSelector = config.containerSelector;
    this.insertAfterId = config.insertAfterId || null;
    this.defaultStyles = config.defaultStyles || {};
  }

  /**
   * Get the container element
   * @returns {Element|null} The container element or null
   */
  getContainer() {
    if (!this.containerSelector) return null;
    return document.querySelector(this.containerSelector);
  }

  /**
   * Get the reference element to insert after
   * @returns {Element|null} The reference element or null
   */
  getReferenceElement() {
    // If insertAfterId is set, use that element
    if (this.insertAfterId) {
      return document.getElementById(this.insertAfterId);
    }
    // Otherwise, use the container
    return this.getContainer();
  }

  /**
   * Display the feature element with the given text
   * @param {string} text - The text content to display
   * @returns {boolean} True if displayed successfully, false otherwise
   */
  display(text) {
    const container = this.getContainer();
    if (!container) {
      console.warn(`MiTube: Could not find container element for ${this.elementId}`);
      return false;
    }

    // Remove existing element if present
    this.remove();

    // Create the element
    const element = createInfoElement(this.elementId, text, this.defaultStyles);

    // Determine where to insert
    const referenceElement = this.getReferenceElement();
    const parentElement = referenceElement ? referenceElement.parentNode : container.parentNode;
    
    if (referenceElement) {
      insertAfter(element, referenceElement, parentElement);
    } else if (parentElement) {
      parentElement.appendChild(element);
    }

    return true;
  }

  /**
   * Remove the feature element
   */
  remove() {
    removeElementById(this.elementId);
  }

  /**
   * Update the display - show if value is provided, remove if null/undefined
   * @param {*} value - The value to display, or null to remove
   * @param {Function} [formatter] - Optional function to format the value to string
   */
  update(value, formatter = null) {
    if (value === null || value === undefined) {
      this.remove();
    } else {
      const text = formatter ? formatter(value) : String(value);
      this.display(text);
    }
  }
}

// Pre-configured managers for common use cases

/**
 * Manager for displaying total playlist duration
 */
export const durationDisplayManager = new FeatureDisplayManager({
  elementId: FEATURE_ELEMENT_IDS.totalDuration,
  containerSelector: '.title.style-scope.ytd-playlist-panel-renderer',
  defaultStyles: {
    color: 'var(--yt-spec-text-primary, #ffffff)',
    marginTop: '4px'
  }
});

/**
 * Manager for displaying playlist end time
 */
export const endTimeDisplayManager = new FeatureDisplayManager({
  elementId: FEATURE_ELEMENT_IDS.endTime,
  containerSelector: '.title.style-scope.ytd-playlist-panel-renderer',
  insertAfterId: FEATURE_ELEMENT_IDS.totalDuration, // Insert after duration if it exists
  defaultStyles: {
    color: 'var(--yt-spec-text-secondary, #aaaaaa)',
    marginTop: '2px',
    fontStyle: 'italic'
  }
});