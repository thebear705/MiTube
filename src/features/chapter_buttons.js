/**
 * Chapter Buttons Feature Module
 * 
 * Adds Previous/Next Chapter navigation buttons next to the chapter indicator
 * in the YouTube video player controls.
 * Buttons automatically show/hide when chapters are available.
 */

let chapterObserver = null;

/**
 * Create chapter navigation button
 * @param {string} direction - 'prev' or 'next'
 * @returns {HTMLElement} Button element
 */
function createChapterButton(direction) {
  const button = document.createElement('button');
  button.className = 'ytp-play-button ytp-button';
  
  if (direction === 'prev') {
    button.id = 'miTube-prev-chapter-button';
    button.title = 'Previous Chapter';
    button.setAttribute('aria-label', 'Previous Chapter');
    button.innerHTML = `
      <svg width="36px" height="36px" viewBox="0 0 36 36" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <g id="icons_Q2" transform="translate(1.5, 1.9466) scale(-1, 1) translate(-33, 0)" fill="white">
              <circle id="Oval" cx="4.5" cy="25.8034001" r="4.5"></circle>
              <path d="M16.5,21.3034001 C14.0147186,21.3034001 12,23.3181187 12,25.8034001 C12,28.2886815 14.0147186,30.3034001 16.5,30.3034001 C18.9852814,30.3034001 21,28.2886815 21,25.8034001 C21,23.3181187 18.9852814,21.3034001 16.5,21.3034001 L16.5,21.3034001 Z M16.5,27.3034001 C15.6715729,27.3034001 15,26.6318272 15,25.8034001 C15,24.974973 15.6715729,24.3034001 16.5,24.3034001 C17.3284271,24.3034001 18,24.974973 18,25.8034001 C18,26.6318272 17.3284271,27.3034001 16.5,27.3034001 Z" id="Shape" fill-rule="nonzero"></path>
              <circle id="Oval" cx="28.5" cy="25.8034001" r="4.5"></circle>
              <path d="M26.55,12.7534001 C26.2575245,12.4229774 25.8284713,12.2466944 25.3881765,12.2760474 C24.9478817,12.3054004 24.5460258,12.5370773 24.3,12.9034001 C23.8501375,13.5248453 23.9134838,14.3800199 24.45,14.9284001 L27.45,17.8534001 C27.7198902,18.1475531 28.1007924,18.3150076 28.5,18.3150076 C28.8992076,18.3150076 29.2801098,18.1475531 29.55,17.8534001 L32.55,14.9284001 C33.0582026,14.3745237 33.1492248,13.555324 32.775,12.9034001 C32.5133776,12.5346795 32.0994035,12.3036295 31.6482341,12.2745218 C31.1970646,12.2454141 30.7568332,12.4213541 30.45,12.7534001 L30,13.2034001 C29.8343144,5.74755608 23.655844,-0.162285051 16.2,0.00340037168 C8.74415599,0.169085794 2.83431473,6.34755607 3,13.8034001 L3,15.3034001 C3.00000002,16.1318272 3.67157289,16.8034001 4.5,16.8034001 C5.32842711,16.8034001 5.99999998,16.1318272 6,15.3034001 L6,13.8034001 C5.8136039,8.00441021 10.3635101,3.15229619 16.1625,2.96590009 C21.9614899,2.77950398 26.8136039,7.32941021 27,13.1284001 L26.55,12.7534001 Z" id="Path"></path>
          </g>
      </svg>
    `;
  } else {
    button.id = 'miTube-next-chapter-button';
    button.title = 'Next Chapter';
    button.setAttribute('aria-label', 'Next Chapter');
    button.innerHTML = `
      <svg width="36px" height="36px" viewBox="0 0 36 36" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <g id="icons_Q2" transform="translate(1.5, 1.9466)" fill="white">
              <circle id="Oval" cx="4.5" cy="25.8034001" r="4.5"></circle>
              <path d="M16.5,21.3034001 C14.0147186,21.3034001 12,23.3181187 12,25.8034001 C12,28.2886815 14.0147186,30.3034001 16.5,30.3034001 C18.9852814,30.3034001 21,28.2886815 21,25.8034001 C21,23.3181187 18.9852814,21.3034001 16.5,21.3034001 L16.5,21.3034001 Z M16.5,27.3034001 C15.6715729,27.3034001 15,26.6318272 15,25.8034001 C15,24.974973 15.6715729,24.3034001 16.5,24.3034001 C17.3284271,24.3034001 18,24.974973 18,25.8034001 C18,26.6318272 17.3284271,27.3034001 16.5,27.3034001 Z" id="Shape" fill-rule="nonzero"></path>
              <circle id="Oval" cx="28.5" cy="25.8034001" r="4.5"></circle>
              <path d="M26.55,12.7534001 C26.2575245,12.4229774 25.8284713,12.2466944 25.3881765,12.2760474 C24.9478817,12.3054004 24.5460258,12.5370773 24.3,12.9034001 C23.8501375,13.5248453 23.9134838,14.3800199 24.45,14.9284001 L27.45,17.8534001 C27.7198902,18.1475531 28.1007924,18.3150076 28.5,18.3150076 C28.8992076,18.3150076 29.2801098,18.1475531 29.55,17.8534001 L32.55,14.9284001 C33.0582026,14.3745237 33.1492248,13.555324 32.775,12.9034001 C32.5133776,12.5346795 32.0994035,12.3036295 31.6482341,12.2745218 C31.1970646,12.2454141 30.7568332,12.4213541 30.45,12.7534001 L30,13.2034001 C29.8343144,5.74755608 23.655844,-0.162285051 16.2,0.00340037168 C8.74415599,0.169085794 2.83431473,6.34755607 3,13.8034001 L3,15.3034001 C3.00000002,16.1318272 3.67157289,16.8034001 4.5,16.8034001 C5.32842711,16.8034001 5.99999998,16.1318272 6,15.3034001 L6,13.8034001 C5.8136039,8.00441021 10.3635101,3.15229619 16.1625,2.96590009 C21.9614899,2.77950398 26.8136039,7.32941021 27,13.1284001 L26.55,12.7534001 Z" id="Path"></path>
          </g>
      </svg>
    `;
  }
  
  button.addEventListener('click', () => {
    const activeChapter = document.querySelector('ytd-macro-markers-list-item-renderer[active]');
    
    if (!activeChapter) {
      console.log('[MiTube] No active chapter found');
      return;
    }
    
    if (direction === 'prev') {
      // Get current video player time
      const video = document.querySelector('video.html5-main-video');
      const currentTime = video ? video.currentTime : 0;
      
      // Parse chapter timestamp from the active chapter link
      const activeLink = activeChapter.querySelector('a#endpoint');
      let chapterStartTime = 0;
      
      if (activeLink) {
        const urlParams = new URLSearchParams(activeLink.href);
        chapterStartTime = parseInt(urlParams.get('t')) || 0;
      }
      
      const timeIntoChapter = currentTime - chapterStartTime;
      
      // If more than 5 seconds into chapter: go to start of current chapter
      // If less than 5 seconds: go to previous chapter
      if (timeIntoChapter > 5) {
        activeLink.click();
        console.log('[MiTube] Jumped to start of current chapter');
        return;
      } else {
        // Go to previous chapter
        const prevChapter = activeChapter.previousElementSibling;
        if (prevChapter) {
          const prevLink = prevChapter.querySelector('a#endpoint');
          if (prevLink) {
            prevLink.click();
            console.log('[MiTube] Jumped to previous chapter');
            return;
          }
        } else {
          // No previous chapter, go to start of current chapter
          activeLink.click();
          console.log('[MiTube] Jumped to start of first chapter');
          return;
        }
      }
    } else {
      // Next button: always go to next chapter
      const nextChapter = activeChapter.nextElementSibling;
      if (nextChapter) {
        const nextLink = nextChapter.querySelector('a#endpoint');
        if (nextLink) {
          nextLink.click();
          console.log('[MiTube] Jumped to next chapter');
        }
      }
    }
  });
  
  return button;
}

/**
 * Inject chapter buttons next to the first visible chapter container
 */
function injectChapterButtons() {
  // Always check if buttons already exist before injecting
  const existingPrev = document.getElementById('miTube-prev-chapter-button');
  const existingNext = document.getElementById('miTube-next-chapter-button');
  
  if (existingPrev && existingNext) return;
  
  const chapterContainers = document.querySelectorAll('.ytp-chapter-container');
  
  // Find first visible chapter container
  let targetChapterContainer = null;
  for (const container of chapterContainers) {
    if (container.offsetParent !== null && window.getComputedStyle(container).display !== 'none') {
      targetChapterContainer = container;
      break;
    }
  }
  
  if (!targetChapterContainer) return;
  
  // Cleanup any partial buttons first
  if (existingPrev) existingPrev.remove();
  if (existingNext) existingNext.remove();
  
  // Create buttons
  const prevButton = createChapterButton('prev');
  const nextButton = createChapterButton('next');
  
  // Insert buttons
  targetChapterContainer.parentNode.insertBefore(prevButton, targetChapterContainer);
  targetChapterContainer.parentNode.insertBefore(nextButton, targetChapterContainer.nextSibling);
  
  console.log('[MiTube] Chapter buttons injected successfully');
}

/**
 * Remove chapter buttons from player controls
 */
function removeChapterButtons() {
  const prevButton = document.getElementById('miTube-prev-chapter-button');
  const nextButton = document.getElementById('miTube-next-chapter-button');
  
  if (prevButton) prevButton.remove();
  if (nextButton) nextButton.remove();
}

/**
 * Check chapter container visibility and update button state
 * Called on every DOM mutation - works even if YouTube recreates controls
 */
function updateButtonVisibility() {
  // Official authoritative chapter presence check
  // YouTube renders this element only when video has actual chapters
  const chaptersContainer = document.querySelector('ytd-macro-markers-list-renderer');
  const hasChapters = !!chaptersContainer;
  
  if (hasChapters) {
    injectChapterButtons();
  } else {
    removeChapterButtons();
  }
}

/**
 * Enable chapter buttons feature
 * Follows same pattern as all other MiTube features
 */
export function enableChapterButtons() {
  // Check immediately
  updateButtonVisibility();
  
  // Set up observer exactly like other features
  if (!chapterObserver) {
    chapterObserver = new MutationObserver((mutations) => {
      // Always check visibility on any DOM change
      updateButtonVisibility();
    });
    
    // Observe entire document body permanently (same pattern used by all other features)
    chapterObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });
    
    console.log('[MiTube] Chapter buttons feature enabled');
  }
}

/**
 * Disable chapter buttons feature
 */
export function disableChapterButtons() {
  if (chapterObserver) {
    chapterObserver.disconnect();
    chapterObserver = null;
  }
  
  removeChapterButtons();
  console.log('[MiTube] Chapter buttons feature disabled');
}

/**
 * Toggle chapter buttons feature
 * @param {boolean} enable - True to enable, false to disable
 */
export function toggleChapterButtons(enable) {
  if (enable) {
    enableChapterButtons();
  } else {
    disableChapterButtons();
  }
}