import { parseTimeToSeconds } from '../src/utils/time_utils.js';

describe('parseTimeToSeconds Tests', () => {
    test('SS format', () => {
        expect(parseTimeToSeconds('30')).toBe(30);
        expect(parseTimeToSeconds('0')).toBe(0);
        expect(parseTimeToSeconds('59')).toBe(59);
    });

    test('MM:SS format', () => {
        expect(parseTimeToSeconds('1:30')).toBe(90);
        expect(parseTimeToSeconds('10:45')).toBe(645);
        expect(parseTimeToSeconds('0:30')).toBe(30);
        expect(parseTimeToSeconds('59:59')).toBe(3599);
    });

    test('H:MM:SS format', () => {
        expect(parseTimeToSeconds('1:30:45')).toBe(5445);
        expect(parseTimeToSeconds('2:0:30')).toBe(7230);
        expect(parseTimeToSeconds('0:1:30')).toBe(90);
        expect(parseTimeToSeconds('23:59:59')).toBe(86399);
    });

    test('Invalid inputs', () => {
        expect(parseTimeToSeconds('')).toBe(0);
        expect(parseTimeToSeconds(null)).toBe(0);
        expect(parseTimeToSeconds(undefined)).toBe(0);
        expect(parseTimeToSeconds('invalid')).toBe(0);
        expect(parseTimeToSeconds('1:2:3:4')).toBe(0);
    });

    test('Edge cases', () => {
        expect(parseTimeToSeconds('00:00:00')).toBe(0);
        expect(parseTimeToSeconds('00:00')).toBe(0);
        expect(parseTimeToSeconds('00')).toBe(0);
    });
});