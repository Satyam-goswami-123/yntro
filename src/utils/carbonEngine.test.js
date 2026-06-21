import { describe, it, expect } from 'vitest';
import { calculateEmission, calculateTotalFootprint, getCategoryBreakdown, EMISSION_FACTORS, BENCHMARKS, CATEGORY_COLORS, CATEGORY_LABELS } from './carbonEngine';

describe('Carbon Engine Utils', () => {
  describe('Constants', () => {
    it('exports required constants', () => {
      expect(EMISSION_FACTORS).toBeDefined();
      expect(BENCHMARKS).toBeDefined();
      expect(CATEGORY_COLORS).toBeDefined();
      expect(CATEGORY_LABELS).toBeDefined();
    });
  });

  describe('calculateEmission', () => {
    it('calculates correct emission for known category and type', () => {
      // car_petrol factor is 0.21. 100 * 0.21 = 21
      expect(calculateEmission('transport', 'car_petrol', 100)).toBe(21);
    });

    it('returns 0 for unknown category or type', () => {
      expect(calculateEmission('transport', 'unknown_type', 100)).toBe(0);
      expect(calculateEmission('unknown_cat', 'unknown_type', 100)).toBe(0);
    });

    it('rounds to 2 decimal places', () => {
      // bus factor is 0.089. 15 * 0.089 = 1.335 -> 1.34
      expect(calculateEmission('transport', 'bus', 15)).toBe(1.34);
    });
  });

  describe('calculateTotalFootprint', () => {
    it('calculates total correctly across multiple categories', () => {
      const entry = {
        date: '2024-01-01',
        id: '123',
        transport: {
          car_petrol: 10, // 10 * 0.21 = 2.1
          bus: 10         // 10 * 0.089 = 0.89
        },
        electricity: {
          grid_average: 5 // 5 * 0.82 = 4.1
        }
      };
      // 2.1 + 0.89 + 4.1 = 7.09
      expect(calculateTotalFootprint(entry)).toBe(7.09);
    });

    it('ignores non-object category data', () => {
      const entry = {
        transport: "invalid string",
        electricity: { grid_average: 10 } // 10 * 0.82 = 8.2
      };
      expect(calculateTotalFootprint(entry)).toBe(8.2);
    });

    it('returns 0 for empty entry', () => {
      expect(calculateTotalFootprint({})).toBe(0);
    });
  });

  describe('getCategoryBreakdown', () => {
    it('returns breakdown for all categories', () => {
      const entry = {
        transport: { car_petrol: 10 }, // 2.1
        electricity: { grid_average: 10 }, // 8.2
      };
      const breakdown = getCategoryBreakdown(entry);
      
      expect(breakdown.transport).toBe(2.1);
      expect(breakdown.electricity).toBe(8.2);
      expect(breakdown.food).toBe(0); // Exists but 0
      expect(breakdown.waste).toBe(0);
    });
  });
});
