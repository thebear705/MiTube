// time_utils.js

import { PERFORMANCE } from './constants.js';

/**
 * Parse a single time string to seconds
 * Supports formats: "H:MM:SS", "MM:SS", "SS"
 * @param {string} timeString - Time string to parse
 * @returns {number} Duration in seconds
 */
export function parseTimeToSeconds(timeString) {
  if (!timeString || typeof timeString !== 'string') {
    return 0;
  }
  
  const parts = timeString.split(':').map(part => parseInt(part, 10));
  
  if (parts.length === 1) {
    // SS format
    return parts[0] || 0;
  } else if (parts.length === 2) {
    // MM:SS format
    return (parts[0] * 60) + (parts[1] || 0);
  } else if (parts.length === 3) {
    // H:MM:SS format
    return (parts[0] * 3600) + (parts[1] * 60) + (parts[2] || 0);
  }
  
  return 0;
}

/**
 * Converts an array of time strings (in the format "H:MM:SS", "MM:SS",
 * or "SS") into the total time in seconds.
 * @param {Array<String>} times - An array of time strings in the format 
 * "H:MM:SS", "MM:SS", or "SS". 
 * @returns {integer} The total time in seconds represented by the input array
 *  of time strings.
 */
export function totalTimeInSeconds(times) {
    if (!Array.isArray(times)) {
        return 0;
    }

    let totalSeconds = 0;

    for (let i = 0; i < times.length; i++) {
        totalSeconds += parseTimeToSeconds(times[i]);
    }

    return totalSeconds;
}


/**
 * Converts an integer representing seconds into a string in the format:
 * - "56 seconds" if seconds < 60 seconds
 * - "12 min and 9 sec" if seconds < 60 minutes
 * - "1:24:23" if seconds < 24 hours
 * - "2 days, 2:34:13" if seconds >= 24 hours
 * 
 * @param {integer} seconds - The number of seconds to convert.
 * @returns {string} The formatted time string.
 */
function secondsToStringTime(seconds) {
    // Input validation
    if (!Number.isInteger(seconds) || seconds < 0) {
        throw new Error("Input must be a non-negative integer.");
    }

    const days = Math.floor(seconds / (24 * 60 * 60));
    seconds %= (24 * 60 * 60); // Get the remaining seconds after calculating days
    const hours = Math.floor(seconds / (60 * 60));
    seconds %= (60 * 60);   // Get the remaining seconds after calculating hours
    const minutes = Math.floor(seconds / 60);
    seconds %= 60;  // Get the remaining seconds after calculating minutes

    let timeString;
    // Contains Days
    if (days > 0) {
        timeString = `${makePluralIfNeeded(days, 'day')}`;
        // if there are only hours left, add them to the string
        if (hours > 0 && minutes == 0 && seconds == 0) { 
            timeString += `, ${makePluralIfNeeded(hours, 'hour')}`;
        }
        // if there are only minutes left, add them to the string
        else if (hours == 0 && minutes >= 0 && seconds == 0) { 
            timeString += `, ${makePluralIfNeeded(minutes, 'minute')}`;
        }
        // if there are only seconds left, add them to the string
        else if (hours == 0 && minutes == 0 && seconds > 0) { 
            timeString += `, ${makePluralIfNeeded(seconds, 'second')}`;
        }

        else {
            timeString += `, ${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    } 
    // Contains Hours but no Days
    else if (hours > 0) {
        // hours only
        if (minutes == 0 && seconds == 0) {
            timeString = `${makePluralIfNeeded(hours, 'hour')}`;
        } 
        // Hours and Minutes
        else if (minutes > 0 && seconds == 0) {
            timeString = `${makePluralIfNeeded(hours, 'hour')}, ${makePluralIfNeeded(minutes, 'minute')}`;
        } 
        // Hours and Seconds
        else if (minutes == 0 && seconds > 0) {
            timeString = `${makePluralIfNeeded(hours, 'hour')}, ${makePluralIfNeeded(seconds, 'second')}`;
        }
        // Hours and (Minutes or Seconds)
        else {
            timeString = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    } 
    // Contains Minutes but no Hours or Days
    else if (minutes > 0) {
        if (seconds == 0) {
            timeString = `${makePluralIfNeeded(minutes, 'minute')}`;
        } else {
            timeString = `${minutes} minutes, ${seconds} seconds`;
        }
    } 
    // Contains only Seconds
    else {
        timeString = `${makePluralIfNeeded(seconds, 'second')}`;
    }

    return timeString;
}

/**
 * makePluralIfNeeded - Adds a plural suffix to a number if it's not 1.
 *
 * @param {number} number - The number to format (must be a non-negative integer).
 * @param {string} label - The singular form of the word (e.g., "hour", "day").
 * @returns {string} A string with the number and label, adding an 's' if needed 
 * for pluralization.
 * @throws {TypeError} If `number` is not a number or if `label` is not a string 
 * or number is negative.
 *  */
function makePluralIfNeeded(number, label) {
    
    // Input validation
    if (!Number.isInteger(number) || number < 0) {
        throw new TypeError("The number must be a non-negative integer.");
    }

    if (number == null) {
        throw new TypeError("The number cannot be null or undefined.");
    }

    if (typeof label !== 'string') {
        throw new TypeError("The label must be a string.");
    }

    if (label == null) {
        throw new TypeError("The label cannot be null or undefined.");
    }

    // Validation Passed, Perform Pluralization
    if (number > 1 || number === 0) { // Handles both plural and zero cases
        return `${number} ${label}s`;
    } else {
        return `${number} ${label}`;
    }
}

// Export functions for ES modules
export { secondsToStringTime, makePluralIfNeeded };

/**
 * Format end time with date if needed
 * @param {Date} endDate - The calculated end date
 * @returns {string} Formatted end time string
 */
export function formatEndTime(endDate) {
  const now = new Date();
  const isSameDay = endDate.toDateString() === now.toDateString();
  
  const hours = endDate.getHours().toString().padStart(2, '0');
  const minutes = endDate.getMinutes().toString().padStart(2, '0');
  const timeStr = `${hours}:${minutes}`;
  
  if (isSameDay) {
    return `End Time: ${timeStr}`;
  } else {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayName = dayNames[endDate.getDay()];
    const day = endDate.getDate();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = monthNames[endDate.getMonth()];
    return `End Time: ${dayName}, ${day} ${month}, ${timeStr}`;
  }
}

/**
 * Debounce function to limit function calls
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, delay = PERFORMANCE.DEBOUNCE_DELAY) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

