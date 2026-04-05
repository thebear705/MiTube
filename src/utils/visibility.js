// Visibility Manager for MiTube Chrome Extension
// Provides a generic way to show/hide elements based on selectors and filters

/**
 * VisibilityManager - A generic class for managing visibility of DOM elements
 * 
 * This class provides a unified way to show/hide elements across different
 * locations on YouTube, reducing code duplication in feature modules.
 */
export class VisibilityManager {
  /**
   * @param {Array<{name: string, selector: string, filterFn?: Function}>} locations
   *   - name: Identifier for this location (for debugging)
   *   - selector: CSS selector to find elements
   *   - filterFn: Optional function to filter elements (element => boolean)
   */
  constructor(locations) {
    this.locations = locations;
  }

  /**
   * Hide all managed elements
   */
  hide() {
    this.locations.forEach(loc => {
      const elements = document.querySelectorAll(loc.selector);
      elements.forEach(el => {
        // If a filter function is provided, check if element matches
        if (!loc.filterFn || loc.filterFn(el)) {
          el.style.display = 'none';
        }
      });
    });
  }

  /**
   * Show all managed elements (reset display style)
   */
  show() {
    this.locations.forEach(loc => {
      const elements = document.querySelectorAll(loc.selector);
      elements.forEach(el => {
        // If a filter function is provided, check if element matches
        if (!loc.filterFn || loc.filterFn(el)) {
          el.style.display = '';
        }
      });
    });
  }

  /**
   * Toggle visibility of all managed elements
   * @param {boolean} hide - True to hide, false to show
   */
  toggle(hide) {
    if (hide) {
      this.hide();
    } else {
      this.show();
    }
  }
}

/**
 * Create a simple visibility manager for a single selector
 * @param {string} selector - CSS selector for elements
 * @returns {VisibilityManager} Manager instance
 */
export function createSimpleVisibilityManager(selector) {
  return new VisibilityManager([
    { name: 'default', selector }
  ]);
}