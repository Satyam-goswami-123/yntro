// LocalStorage-based persistence for all user data

const STORAGE_KEYS = {
  USER_PROFILE: 'yntro_profile',
  CARBON_HISTORY: 'yntro_carbon_history',
  MISSIONS_COMPLETED: 'yntro_missions_completed',
  GAME_STATS: 'yntro_game_stats',
  CHAT_HISTORY: 'yntro_chat_history',
};

// User profile
export function getUserProfile() {
  const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
  if (data) return JSON.parse(data);
  return {
    name: 'Eco Explorer',
    totalPoints: 0,
    streak: 0,
    lastLogDate: null,
    calculations: 0,
    completedMissions: 0,
    lowestFootprint: Infinity,
    earnedBadges: [],
    gameHighScore: 0,
    joinDate: new Date().toISOString(),
  };
}

export function saveUserProfile(profile) {
  localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
}

// Carbon history
export function getCarbonHistory() {
  const data = localStorage.getItem(STORAGE_KEYS.CARBON_HISTORY);
  return data ? JSON.parse(data) : [];
}

export function saveCarbonEntry(entry) {
  const history = getCarbonHistory();
  history.push({ ...entry, id: Date.now(), date: new Date().toISOString() });
  localStorage.setItem(STORAGE_KEYS.CARBON_HISTORY, JSON.stringify(history));
  return history;
}

// Completed missions
export function getCompletedMissions() {
  const data = localStorage.getItem(STORAGE_KEYS.MISSIONS_COMPLETED);
  return data ? JSON.parse(data) : [];
}

export function saveMissionComplete(missionId, points) {
  const completed = getCompletedMissions();
  if (!completed.find(m => m.id === missionId)) {
    completed.push({ id: missionId, date: new Date().toISOString(), points });
    localStorage.setItem(STORAGE_KEYS.MISSIONS_COMPLETED, JSON.stringify(completed));
  }
  return completed;
}

// Game stats
export function getGameStats() {
  const data = localStorage.getItem(STORAGE_KEYS.GAME_STATS);
  return data ? JSON.parse(data) : { highScore: 0, gamesPlayed: 0, totalTokens: 0 };
}

export function saveGameStats(stats) {
  localStorage.setItem(STORAGE_KEYS.GAME_STATS, JSON.stringify(stats));
}

// Chat history
export function getChatHistory() {
  const data = localStorage.getItem(STORAGE_KEYS.CHAT_HISTORY);
  return data ? JSON.parse(data) : [];
}

export function saveChatHistory(messages) {
  localStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(messages));
}
