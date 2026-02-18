// time_utils.js

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

/**
 * Converts an array of time strings (in the format "H:MM:SS", "MM:SS",
 * or "SS") into the total time in seconds.
 * @param {Array<String>} times - An array of time strings in the format 
 * "H:MM:SS", "MM:SS", or "SS". 
 * @returns {integer} The total time in seconds represented by the input array
 *  of time strings.
 */
function totalTimeInSeconds(times) {
    const weights = [1, 60, 3600, 86400];
    let totalSeconds = 0;

    for (let i = 0; i < times.length; i++) {
        let timesArray = times[i].split(":");
        k = timesArray.length;

        for (let j = 0; j < k; j++) {
            totalSeconds += parseInt(timesArray[k - j - 1]) * weights[j];
            // console.log("adding" + parseInt(timesArray[k - j - 1]) * weights[j] + "seconds" );
        }
    }

    return totalSeconds;
}

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

module.exports = {secondsToStringTime, makePluralIfNeeded, totalTimeInSeconds};

