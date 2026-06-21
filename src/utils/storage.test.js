import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import {
  getUserProfile,
  saveUserProfile,
  getCarbonHistory,
  saveCarbonEntry,
  getCompletedMissions,
  saveMissionComplete,
  getGameStats,
  saveGameStats,
  getChatHistory,
  saveChatHistory
} from './storage';

describe('Storage Utils', () => {
  beforeEach(() => {
    // Reset the internal state for each test by calling save functions with initial values
    // Since it's in-memory, we can just overwrite them.
    saveUserProfile(null);
    // There isn't a direct clear function for arrays, but we can test behavior.
    // However, since it's global let variables, tests might pollute each other.
    // For arrays, if we can't reset, we just test additions.
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-01T00:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('User Profile', () => {
    it('returns default profile when none exists', () => {
      saveUserProfile(null); // Reset it to trigger default
      const profile = getUserProfile();
      expect(profile.name).toBe('Eco Explorer');
      expect(profile.totalPoints).toBe(0);
      expect(profile.onboarded).toBe(false);
      expect(profile.joinDate).toBe('2024-01-01T00:00:00.000Z');
    });

    it('saves and returns a custom profile', () => {
      const customProfile = { name: 'Test User', totalPoints: 100 };
      saveUserProfile(customProfile);
      const profile = getUserProfile();
      expect(profile.name).toBe('Test User');
      expect(profile.totalPoints).toBe(100);
    });
  });

  describe('Carbon History', () => {
    it('saves and retrieves carbon entries with auto-generated id and date', () => {
      const initialCount = getCarbonHistory().length;
      const newEntry = { type: 'transport', value: 50 };
      
      const history = saveCarbonEntry(newEntry);
      
      expect(history.length).toBe(initialCount + 1);
      const saved = history[history.length - 1];
      expect(saved.type).toBe('transport');
      expect(saved.value).toBe(50);
      expect(saved.id).toBeDefined();
      expect(saved.date).toBe('2024-01-01T00:00:00.000Z');
    });
  });

  describe('Completed Missions', () => {
    it('saves new missions', () => {
      const initialCount = getCompletedMissions().length;
      const missions = saveMissionComplete('mission_1', 10);
      
      expect(missions.length).toBe(initialCount + 1);
      const saved = missions[missions.length - 1];
      expect(saved.id).toBe('mission_1');
      expect(saved.points).toBe(10);
    });

    it('does not save duplicate missions', () => {
      // First save
      saveMissionComplete('mission_unique', 20);
      const countAfterFirst = getCompletedMissions().length;
      
      // Second save with same id
      const missions = saveMissionComplete('mission_unique', 20);
      
      expect(missions.length).toBe(countAfterFirst);
    });
  });

  describe('Game Stats', () => {
    it('saves and retrieves game stats', () => {
      const stats = { highScore: 500, gamesPlayed: 2, totalTokens: 10 };
      saveGameStats(stats);
      
      const retrieved = getGameStats();
      expect(retrieved).toEqual(stats);
      // Ensure it's a copy
      expect(retrieved).not.toBe(stats);
    });
  });

  describe('Chat History', () => {
    it('saves and retrieves chat history', () => {
      const messages = [{ role: 'user', content: 'Hello' }];
      saveChatHistory(messages);
      
      const retrieved = getChatHistory();
      expect(retrieved).toEqual(messages);
      expect(retrieved).not.toBe(messages);
    });
  });
});
