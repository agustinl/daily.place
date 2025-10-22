import { formatTime } from '@/helpers/formatTime';

describe('formatTime', () => {
    describe('Normal cases', () => {
        it('should format 0 seconds correctly', () => {
            expect(formatTime(0)).toBe('0:00');
        });

        it('should format seconds less than 10 with zero padding', () => {
            expect(formatTime(5)).toBe('0:05');
            expect(formatTime(9)).toBe('0:09');
        });

        it('should format seconds 10 or greater without extra padding', () => {
            expect(formatTime(10)).toBe('0:10');
            expect(formatTime(30)).toBe('0:30');
            expect(formatTime(59)).toBe('0:59');
        });

        it('should format minutes correctly', () => {
            expect(formatTime(60)).toBe('1:00');
            expect(formatTime(120)).toBe('2:00');
            expect(formatTime(300)).toBe('5:00');
        });

        it('should format minutes and seconds correctly', () => {
            expect(formatTime(65)).toBe('1:05');
            expect(formatTime(125)).toBe('2:05');
            expect(formatTime(90)).toBe('1:30');
            expect(formatTime(155)).toBe('2:35');
        });

        it('should handle typical pomodoro times', () => {
            expect(formatTime(25 * 60)).toBe('25:00'); // 25 minutes
            expect(formatTime(5 * 60)).toBe('5:00');   // 5 minutes
            expect(formatTime(15 * 60)).toBe('15:00'); // 15 minutes
        });
    });

    describe('Edge cases', () => {
        it('should handle large numbers', () => {
            expect(formatTime(3600)).toBe('60:00');    // 1 hour
            expect(formatTime(7200)).toBe('120:00');   // 2 hours
            expect(formatTime(36000)).toBe('600:00');  // 10 hours
        });

        it('should handle negative numbers by showing negative sign', () => {
            expect(formatTime(-1)).toBe('-1:0-1');
            expect(formatTime(-60)).toBe('-1:00');
        });

        it('should handle undefined by using default value of 0', () => {
            expect(formatTime(undefined)).toBe('0:00');
        });
    });

    describe('Zero padding', () => {
        it('should always pad seconds less than 10 with zero', () => {
            for (let i = 0; i < 10; i++) {
                const result = formatTime(i);
                expect(result).toMatch(/0:0\d/);
            }
        });

        it('should not pad seconds 10 or greater', () => {
            for (let i = 10; i < 60; i++) {
                const result = formatTime(i);
                expect(result).toMatch(/0:\d{2}/);
                expect(result).not.toMatch(/0:0\d{2}/);
            }
        });
    });
});

