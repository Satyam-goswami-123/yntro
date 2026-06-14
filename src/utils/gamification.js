// Gamification engine — points, badges, levels, missions

export const MISSIONS = [
  {
    id: 'walk_day',
    title: 'Walk Instead of Drive',
    description: 'Walk or bike instead of driving for at least one trip today.',
    category: 'transport',
    difficulty: 'easy',
    points: 50,
    icon: '🚶',
  },
  {
    id: 'reusable_bottle',
    title: 'Use a Reusable Bottle',
    description: 'Use a reusable water bottle throughout the day.',
    category: 'waste',
    difficulty: 'easy',
    points: 30,
    icon: '🧴',
  },
  {
    id: 'lights_off',
    title: 'Turn Off Unused Appliances',
    description: 'Make sure all unused lights and appliances are turned off when not in use.',
    category: 'electricity',
    difficulty: 'easy',
    points: 40,
    icon: '💡',
  },
  {
    id: 'recycle_waste',
    title: 'Recycle Household Waste',
    description: 'Sort and recycle at least 3 types of waste today (paper, plastic, glass).',
    category: 'waste',
    difficulty: 'medium',
    points: 60,
    icon: '♻️',
  },
  {
    id: 'reduce_plastic',
    title: 'Reduce Plastic Usage',
    description: 'Avoid single-use plastics for an entire day. Use cloth bags and reusable containers.',
    category: 'waste',
    difficulty: 'medium',
    points: 70,
    icon: '🚫',
  },
  {
    id: 'plant_meal',
    title: 'Plant-Based Meal Day',
    description: 'Eat only plant-based meals for an entire day.',
    category: 'food',
    difficulty: 'medium',
    points: 80,
    icon: '🥗',
  },
  {
    id: 'public_transport',
    title: 'Public Transport Hero',
    description: 'Use only public transport or bicycle for all travel today.',
    category: 'transport',
    difficulty: 'medium',
    points: 75,
    icon: '🚌',
  },
  {
    id: 'cold_wash',
    title: 'Cold Water Laundry',
    description: 'Wash all your clothes in cold water today.',
    category: 'electricity',
    difficulty: 'easy',
    points: 35,
    icon: '🧺',
  },
  {
    id: 'no_shopping',
    title: 'Zero Shopping Day',
    description: 'Buy nothing new for an entire day. Only purchase essentials.',
    category: 'shopping',
    difficulty: 'easy',
    points: 45,
    icon: '🛍️',
  },
  {
    id: 'composting',
    title: 'Start Composting',
    description: 'Compost your food scraps and organic waste.',
    category: 'waste',
    difficulty: 'hard',
    points: 100,
    icon: '🌱',
  },
  {
    id: 'energy_audit',
    title: 'Home Energy Audit',
    description: 'Check all your home appliances and unplug devices on standby mode.',
    category: 'electricity',
    difficulty: 'medium',
    points: 65,
    icon: '🔌',
  },
  {
    id: 'local_food',
    title: 'Buy Local Produce',
    description: 'Buy groceries from local farmers or markets instead of imported goods.',
    category: 'food',
    difficulty: 'medium',
    points: 55,
    icon: '🌽',
  },
  {
    id: 'carpool',
    title: 'Carpool Champion',
    description: 'Share a ride with someone going in the same direction.',
    category: 'transport',
    difficulty: 'easy',
    points: 50,
    icon: '🚗',
  },
  {
    id: 'water_save',
    title: 'Water Conservation',
    description: 'Reduce water usage: shorter showers, turn off taps while brushing.',
    category: 'water',
    difficulty: 'easy',
    points: 40,
    icon: '💧',
  },
  {
    id: 'tree_plant',
    title: 'Plant a Tree',
    description: 'Plant a tree or maintain an indoor plant.',
    category: 'general',
    difficulty: 'hard',
    points: 150,
    icon: '🌳',
  },
];

export const BADGES = [
  { id: 'first_calc', title: 'First Step', description: 'Complete your first carbon calculation', icon: '🌱', requirement: 'Calculate footprint once' },
  { id: 'week_streak', title: 'Week Warrior', description: 'Log your footprint for 7 days', icon: '🔥', requirement: '7-day streak' },
  { id: 'mission_5', title: 'Eco Explorer', description: 'Complete 5 missions', icon: '🏅', requirement: '5 missions completed' },
  { id: 'mission_15', title: 'Green Champion', description: 'Complete 15 missions', icon: '🏆', requirement: '15 missions completed' },
  { id: 'low_footprint', title: 'Low Carbon Hero', description: 'Achieve a daily footprint under 5 kg CO₂', icon: '💚', requirement: 'Daily footprint < 5 kg' },
  { id: 'game_100', title: 'EcoDrive Master', description: 'Score 100+ in EcoDrive game', icon: '🎮', requirement: 'Game score > 100' },
  { id: 'game_500', title: 'EcoDrive Legend', description: 'Score 500+ in EcoDrive game', icon: '👑', requirement: 'Game score > 500' },
  { id: 'points_500', title: 'Green Collector', description: 'Earn 500 Green Points', icon: '✨', requirement: '500 total points' },
  { id: 'points_2000', title: 'Sustainability Star', description: 'Earn 2000 Green Points', icon: '⭐', requirement: '2000 total points' },
  { id: 'all_categories', title: 'All-Rounder', description: 'Complete missions in all categories', icon: '🌍', requirement: 'All category missions done' },
];

// Eco levels with XP thresholds
export const ECO_LEVELS = [
  { level: 1, title: 'Seedling', minXP: 0, icon: '🌱' },
  { level: 2, title: 'Sprout', minXP: 100, icon: '🌿' },
  { level: 3, title: 'Sapling', minXP: 300, icon: '🌳' },
  { level: 4, title: 'Green Guardian', minXP: 600, icon: '🛡️' },
  { level: 5, title: 'Eco Warrior', minXP: 1000, icon: '⚔️' },
  { level: 6, title: 'Nature Protector', minXP: 1500, icon: '🌍' },
  { level: 7, title: 'Climate Champion', minXP: 2200, icon: '🏆' },
  { level: 8, title: 'Earth Hero', minXP: 3000, icon: '🦸' },
  { level: 9, title: 'Planet Saver', minXP: 4000, icon: '🌟' },
  { level: 10, title: 'Legendary Ecologist', minXP: 5500, icon: '👑' },
];

export function getCurrentLevel(xp) {
  let current = ECO_LEVELS[0];
  for (const level of ECO_LEVELS) {
    if (xp >= level.minXP) {
      current = level;
    } else {
      break;
    }
  }
  const nextLevel = ECO_LEVELS.find(l => l.minXP > xp);
  const progress = nextLevel
    ? ((xp - current.minXP) / (nextLevel.minXP - current.minXP)) * 100
    : 100;
  return { ...current, xp, progress: Math.min(100, progress), nextLevel };
}

export function checkBadges(userData) {
  const earned = [];

  if (userData.calculations > 0) earned.push('first_calc');
  if (userData.streak >= 7) earned.push('week_streak');
  if (userData.completedMissions >= 5) earned.push('mission_5');
  if (userData.completedMissions >= 15) earned.push('mission_15');
  if (userData.lowestFootprint < 5) earned.push('low_footprint');
  if (userData.gameHighScore >= 100) earned.push('game_100');
  if (userData.gameHighScore >= 500) earned.push('game_500');
  if (userData.totalPoints >= 500) earned.push('points_500');
  if (userData.totalPoints >= 2000) earned.push('points_2000');

  return earned;
}
