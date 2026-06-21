import { describe, it, expect } from 'vitest';
import { getRecommendations, getRandomTip, getCoachResponse } from './ruleEngine';

describe('Rule Engine Utils', () => {
  describe('getRecommendations', () => {
    it('returns high priority recommendations based on breakdown', () => {
      const breakdown = {
        transport: 50,
        electricity: 10,
        food: 20,
        waste: 1,
        shopping: 1,
        water: 0.5
      };
      const total = 82.5;
      
      const recs = getRecommendations(breakdown, total, 2);
      
      expect(recs.length).toBe(2);
      // Transport > 40% of total (50 > 33) -> Priority 1
      expect(recs[0].id).toBe('high_car_usage');
      // Electricity > 5 (10 > 5) -> Priority 2
      expect(recs[1].id).toBe('high_electricity');
    });

    it('returns general tips if no specific conditions met', () => {
      const breakdown = {
        transport: 1,
        electricity: 1,
        food: 1,
        waste: 1,
        shopping: 1,
        water: 0.5
      };
      const total = 5.5;

      const recs = getRecommendations(breakdown, total, 3);
      
      // Since no high thresholds are met, it should return general tips
      expect(recs.length).toBe(3);
      expect(recs[0].id).toContain('general_tip_');
    });

    it('respects the limit parameter', () => {
      const breakdown = { transport: 50, electricity: 10 };
      const total = 60;
      const recs = getRecommendations(breakdown, total, 1);
      expect(recs.length).toBe(1);
    });
  });

  describe('getRandomTip', () => {
    it('returns a tip with priority >= 10', () => {
      const tip = getRandomTip();
      expect(tip.priority).toBeGreaterThanOrEqual(10);
      expect(tip.id).toContain('general_tip_');
    });
  });

  describe('getCoachResponse', () => {
    it('returns greeting for hello', () => {
      const response = getCoachResponse('hello coach');
      expect(typeof response).toBe('string');
      // Just verifying it doesn't crash and returns a string
    });

    it('returns explanation for carbon footprint', () => {
      const response = getCoachResponse('what is carbon footprint?');
      expect(response).toMatch(/carbon footprint/i);
    });

    it('returns tips for reducing', () => {
      const response = getCoachResponse('how to reduce');
      expect(response).toContain('reduce');
    });

    it('returns transport info', () => {
      const response = getCoachResponse('car vs bus');
      expect(response).toContain('Transport');
    });

    it('returns food info', () => {
      const response = getCoachResponse('vegan diet');
      expect(response).toContain('Food choices');
    });

    it('returns default response for unknown topics', () => {
      const response = getCoachResponse('xyzabc');
      expect(response).toContain('Great question!');
    });
  });
});
