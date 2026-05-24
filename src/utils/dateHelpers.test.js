import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { isOverdue, isWithin48Hours, formatDate, formatDateRange } from './dateHelpers';

describe('dateHelpers', () => {
  describe('isOverdue', () => {
    it('returns false for null', () => {
      expect(isOverdue(null)).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isOverdue(undefined)).toBe(false);
    });

    it('returns true for a past date', () => {
      expect(isOverdue('2000-01-01T00:00:00.000Z')).toBe(true);
    });

    it('returns false for a future date', () => {
      expect(isOverdue('2099-12-31T23:59:59.000Z')).toBe(false);
    });

    it('returns false for an invalid string', () => {
      expect(isOverdue('not-a-date')).toBe(false);
    });
  });

  describe('isWithin48Hours', () => {
    it('returns false for null', () => {
      expect(isWithin48Hours(null)).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isWithin48Hours(undefined)).toBe(false);
    });

    it('returns true for a date 24 hours from now', () => {
      const soon = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      expect(isWithin48Hours(soon)).toBe(true);
    });

    it('returns false for a date 72 hours from now', () => {
      const later = new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString();
      expect(isWithin48Hours(later)).toBe(false);
    });

    it('returns false for a past date', () => {
      expect(isWithin48Hours('2000-01-01T00:00:00.000Z')).toBe(false);
    });
  });

  describe('formatDate', () => {
    it('returns empty string for null', () => {
      expect(formatDate(null)).toBe('');
    });

    it('returns empty string for undefined', () => {
      expect(formatDate(undefined)).toBe('');
    });

    it('formats a known date correctly', () => {
      expect(formatDate('2025-01-15T00:00:00.000Z')).toBe('Jan 15, 2025');
    });

    it('returns empty string for an invalid date string', () => {
      expect(formatDate('not-a-date')).toBe('');
    });
  });

  describe('formatDateRange', () => {
    it('returns empty string when start is null', () => {
      expect(formatDateRange(null, '2025-03-31T00:00:00.000Z')).toBe('');
    });

    it('returns empty string when end is null', () => {
      expect(formatDateRange('2025-01-01T00:00:00.000Z', null)).toBe('');
    });

    it('returns empty string when both are null', () => {
      expect(formatDateRange(null, null)).toBe('');
    });

    it('formats a known range correctly', () => {
      const result = formatDateRange(
        '2025-01-01T00:00:00.000Z',
        '2025-03-31T00:00:00.000Z'
      );
      expect(result).toBe('Jan 1 \u2013 Mar 31, 2025');
    });

    it('returns empty string for invalid date strings', () => {
      expect(formatDateRange('bad', 'also-bad')).toBe('');
    });
  });
});
