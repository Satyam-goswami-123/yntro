import { describe, it, expect } from 'vitest';
import { getCurrentLevel, checkBadges, MISSIONS, BADGES, ECO_LEVELS } from './gamification';

describe('Gamification Utils', () => {
  describe('Constants', () => {
    it('exports MISSIONS array', () => {
      expect(Array.isArray(MISSIONS)).toBe(true);
      expect(MISSIONS.length).toBeGreaterThan(0);
    });

    it('exports BADGES array', () => {
      expect(Array.isArray(BADGES)).toBe(true);
      expect(BADGES.length).toBeGreaterThan(0);
    });

    it('exports ECO_LEVELS array', () => {
      expect(Array.isArray(ECO_LEVELS)).toBe(true);
      expect(ECO_LEVELS.length).toBeGreaterThan(0);
    });
  });

  describe('getCurrentLevel', () => {
    it('returns first level for 0 XP', () => {
      const levelInfo = getCurrentLevel(0);
      expect(levelInfo.level).toBe(1);
      expect(levelInfo.title).toBe('Seedling');
      expect(levelInfo.progress).toBe(0);
    });

    it('returns appropriate level for specific XP', () => {
      // 100 XP is exactly level 2 (Sprout)
      const levelInfo = getCurrentLevel(100);
      expect(levelInfo.level).toBe(2);
      expect(levelInfo.title).toBe('Sprout');
      expect(levelInfo.progress).toBe(0);
    });

    it('calculates progress correctly between levels', () => {
      // Level 2 is 100XP, Level 3 is 300XP. Difference is 200XP.
      // 200XP total gives 50% progress towards level 3.
      const levelInfo = getCurrentLevel(200);
      expect(levelInfo.level).toBe(2);
      expect(levelInfo.progress).toBe(50);
      expect(levelInfo.nextLevel.level).toBe(3);
    });

    it('handles max level gracefully', () => {
      // Legendary Ecologist starts at 5500
      const levelInfo = getCurrentLevel(6000);
      expect(levelInfo.level).toBe(10);
      expect(levelInfo.title).toBe('Legendary Ecologist');
      expect(levelInfo.progress).toBe(100);
      expect(levelInfo.nextLevel).toBeUndefined();
    });
  });

  describe('checkBadges', () => {
    it('returns empty array when no criteria met', () => {
      const userData = {
        calculations: 0,
        streak: 0,
        completedMissions: 0,
        lowestFootprint: 10,
        gameHighScore: 0,
        totalPoints: 0
      };
      const earned = checkBadges(userData);
      expect(earned).toEqual([]);
    });

    it('returns first_calc when calculations > 0', () => {
      const userData = { calculations: 1, streak: 0, completedMissions: 0, lowestFootprint: 10, gameHighScore: 0, totalPoints: 0 };
      const earned = checkBadges(userData);
      expect(earned).toContain('first_calc');
    });

    it('returns multiple badges if criteria met', () => {
      const userData = {
        calculations: 5,
        streak: 7,
        completedMissions: 16, // earns mission_5 and mission_15
        lowestFootprint: 4, // earns low_footprint
        gameHighScore: 600, // earns game_100 and game_500
        totalPoints: 2500 // earns points_500 and points_2000
      };
      const earned = checkBadges(userData);
      expect(earned).toEqual([
        'first_calc',
        'week_streak',
        'mission_5',
        'mission_15',
        'low_footprint',
        'game_100',
        'game_500',
        'points_500',
        'points_2000'
      ]);
    });
  });
});
