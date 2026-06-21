// In-memory storage for user data. Data is NOT stored persistently.

let userProfile = null;
let carbonHistory = [];
let missionsCompleted = [];
let gameStats = { highScore: 0, gamesPlayed: 0, totalTokens: 0 };
let chatHistory = [];

// User profile
export function getUserProfile() {
  if (userProfile) return userProfile;
  return {
    name: 'Eco Explorer',
    onboarded: false,
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
  if (!profile) {
    userProfile = null;
  } else {
    userProfile = { ...profile };
  }
}

// Carbon history
export function getCarbonHistory() {
  return [...carbonHistory];
}

export function saveCarbonEntry(entry) {
  carbonHistory.push({ ...entry, id: Date.now(), date: new Date().toISOString() });
  return [...carbonHistory];
}

// Completed missions
export function getCompletedMissions() {
  return [...missionsCompleted];
}

export function saveMissionComplete(missionId, points) {
  if (!missionsCompleted.find(m => m.id === missionId)) {
    missionsCompleted.push({ id: missionId, date: new Date().toISOString(), points });
  }
  return [...missionsCompleted];
}

// Game stats
export function getGameStats() {
  return { ...gameStats };
}

export function saveGameStats(stats) {
  gameStats = { ...stats };
}

// Chat history
export function getChatHistory() {
  return [...chatHistory];
}

export function saveChatHistory(messages) {
  chatHistory = [...messages];
}
