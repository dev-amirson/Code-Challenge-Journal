import { formatDate } from '../dateUtils';

describe('dateUtils', () => {
  describe('formatDate', () => {
    it('should format date string correctly', () => {
      const dateString = '2024-01-15T10:30:00Z';
      const result = formatDate(dateString);

      // The expected format is "Month Day, Year" (e.g., "Jan 15, 2024")
      expect(result).toMatch(/^[A-Za-z]{3} \d{1,2}, \d{4}$/);
    });

    it('should format date string with different locale correctly', () => {
      const dateString = '2023-12-25T00:00:00Z';
      const result = formatDate(dateString);

      expect(result).toMatch(/^[A-Za-z]{3} \d{1,2}, \d{4}$/);
    });

    it('should handle edge cases like leap year', () => {
      const dateString = '2024-02-29T12:00:00Z';
      const result = formatDate(dateString);

      expect(result).toMatch(/^[A-Za-z]{3} \d{1,2}, \d{4}$/);
    });

    it('should handle different time zones', () => {
      const dateString = '2024-06-15T23:59:59+05:30';
      const result = formatDate(dateString);

      expect(result).toMatch(/^[A-Za-z]{3} \d{1,2}, \d{4}$/);
    });

    it('should handle invalid date strings gracefully', () => {
      const invalidDateString = 'invalid-date';
      const result = formatDate(invalidDateString);

      // Should return "Invalid Date" or handle gracefully
      expect(result).toBe('Invalid Date');
    });

    it('should format year-end date correctly', () => {
      const dateString = '2023-12-31T23:59:59Z';
      const result = formatDate(dateString);

      expect(result).toMatch(/^[A-Za-z]{3} \d{1,2}, \d{4}$/);
    });

    it('should format year-start date correctly', () => {
      const dateString = '2024-01-01T00:00:00Z';
      const result = formatDate(dateString);

      expect(result).toMatch(/^[A-Za-z]{3} \d{1,2}, \d{4}$/);
    });
  });
}); 