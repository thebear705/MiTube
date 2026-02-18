const { secondsToStringTime, makePluralIfNeeded } = require(
    '../src/utils/time_utils');

// Pluralization tests
describe('makePluralIfNeeded Tests', () => {
    test("Pluralization Tests", () => {
        expect(makePluralIfNeeded(1, "day")).toBe("1 day");
        expect(makePluralIfNeeded(2, "day")).toBe("2 days");
        expect(makePluralIfNeeded(1, "hour")).toBe("1 hour");
        expect(makePluralIfNeeded(3, "hour")).toBe("3 hours");
    });

    test("Pluralization Invalid Input Tests", () => {
        expect(() => makePluralIfNeeded(-1, "day"))
            .toThrow("The number must be a non-negative integer.");

        expect(() => makePluralIfNeeded(1.5, "hour"))
            .toThrow("The number must be a non-negative integer.");

        expect(() => makePluralIfNeeded("2", "minute"))
            .toThrow("The number must be a non-negative integer.");

        expect(() => makePluralIfNeeded(5, 1))
            .toThrow("The label must be a string.");

    });
});

// Days tests
describe('Days', () => {
    test('Days and Hours', () => {
        expect(secondsToStringTime(90000)).toBe("1 day, 1 hour");
        expect(secondsToStringTime(97200)).toBe("1 day, 3 hours");
    });

    test('Days and Seconds', () => {
        expect(secondsToStringTime(172802)).toBe("2 days, 2 seconds");
    });

    test('Days and Minutes', () => {
        expect(secondsToStringTime(175020)).toBe("2 days, 37 minutes");
    });
    test('Days and Time H:MM:SS', () => {
        expect(secondsToStringTime(92224)).toBe("1 day, 1:37:04");
        expect(secondsToStringTime(90004)).toBe("1 day, 1:00:04");
        expect(secondsToStringTime(86464)).toBe("1 day, 0:01:04");
    });
});

// Hours tests
describe('Minutes', () => {
    test('Hours and Minutes', () => {
        expect(secondsToStringTime(7320)).toBe("2 hours, 2 minutes");
    });

    test('Hours and Seconds', () => {
        expect(secondsToStringTime(7201)).toBe("2 hours, 1 second");
    });

    test('Hours Only', () => {
        expect(secondsToStringTime(7200)).toBe("2 hours");
    });

    test('H:MM:SS', () => {
        expect(secondsToStringTime(82864)).toBe("23:01:04");
    });
});

// Minutes tests
describe('Minutes', () => {
    test('Minutes and Seconds', () => {
        expect(secondsToStringTime(1024)).toBe("17 minutes, 4 seconds");
        expect(secondsToStringTime(364)).toBe("6 minutes, 4 seconds");
    });

    test('Minutes Only', () => {
        expect(secondsToStringTime(60)).toBe("1 minute");
        expect(secondsToStringTime(120)).toBe("2 minutes");
    });
});


// Seconds tests
describe('Seconds and Pluralization', () => {
    test('Seconds Only', () => {
        expect(secondsToStringTime(58)).toBe("58 seconds");
        expect(secondsToStringTime(1)).toBe("1 second");
    });
});

// Input Error tests
describe('secondsToStringTime Error Handling', () => {
    const errorStrng = "Input must be a non-negative integer.";

    test('throws error for negative numbers', () => {
        expect(() => secondsToStringTime(-1)).toThrow(errorStrng);
    });

    test('throws error for decimals', () => {
        expect(() => secondsToStringTime(5.5)).toThrow(errorStrng);
    });

    test('throws error for non-number strings', () => {
        expect(() => secondsToStringTime("60")).toThrow(errorStrng);
    });

    test('works correctly for 0', () => {
        // This should NOT throw an error
        expect(() => secondsToStringTime(0)).not.toThrow();
        expect(secondsToStringTime(0)).toBe("0 seconds");
    });

});
