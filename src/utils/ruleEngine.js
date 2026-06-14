// Rule-based recommendation engine
// Analyzes user footprint data and generates personalized suggestions

const RULES = [
  {
    id: 'high_car_usage',
    condition: (breakdown, total) => breakdown.transport > total * 0.4,
    priority: 1,
    icon: '🚌',
    title: 'Switch to Public Transport',
    description: 'Your transport emissions are over 40% of your total. Try using bus or train twice a week.',
    impact: 'Could reduce your footprint by 15-25%',
    category: 'transport',
  },
  {
    id: 'high_electricity',
    condition: (breakdown, total) => breakdown.electricity > 5,
    priority: 2,
    icon: '💡',
    title: 'Reduce Electricity Consumption',
    description: 'Turn off lights and appliances when not in use. Use LED bulbs and reduce AC usage during peak hours.',
    impact: 'Save up to 2 kg CO₂ per day',
    category: 'electricity',
  },
  {
    id: 'high_meat',
    condition: (breakdown, total) => breakdown.food > total * 0.35,
    priority: 3,
    icon: '🥗',
    title: 'Try More Plant-Based Meals',
    description: 'Replacing one non-veg meal per day with a vegetarian option significantly reduces emissions.',
    impact: 'Could reduce food emissions by 40%',
    category: 'food',
  },
  {
    id: 'low_recycling',
    condition: (breakdown) => breakdown.waste > 2,
    priority: 4,
    icon: '♻️',
    title: 'Increase Recycling',
    description: 'Sort your waste and recycle paper, plastic, and glass. Compost food scraps.',
    impact: 'Reduce waste emissions by up to 90%',
    category: 'waste',
  },
  {
    id: 'high_shopping',
    condition: (breakdown) => breakdown.shopping > 5,
    priority: 5,
    icon: '🛍️',
    title: 'Buy Second-Hand',
    description: 'Consider buying second-hand clothing and electronics. Each reused item saves significant emissions.',
    impact: 'Save 15-50 kg CO₂ per item',
    category: 'shopping',
  },
  {
    id: 'water_usage',
    condition: (breakdown) => breakdown.water > 1,
    priority: 6,
    icon: '💧',
    title: 'Conserve Water',
    description: 'Take shorter showers, fix leaky faucets, and use water-efficient appliances.',
    impact: 'Save up to 0.5 kg CO₂ per day',
    category: 'water',
  },
  {
    id: 'general_tip_bike',
    condition: () => true,
    priority: 10,
    icon: '🚲',
    title: 'Bike for Short Trips',
    description: 'For trips under 5 km, cycling is faster in traffic and produces zero emissions.',
    impact: 'Zero emissions for short distances',
    category: 'transport',
  },
  {
    id: 'general_tip_reusable',
    condition: () => true,
    priority: 11,
    icon: '🧴',
    title: 'Use Reusable Containers',
    description: 'Replace disposable bottles, bags, and containers with reusable alternatives.',
    impact: 'Reduce plastic waste significantly',
    category: 'waste',
  },
  {
    id: 'general_tip_local',
    condition: () => true,
    priority: 12,
    icon: '🌽',
    title: 'Buy Local Produce',
    description: 'Local food has lower transport emissions. Visit farmers markets when possible.',
    impact: 'Reduce food transport emissions',
    category: 'food',
  },
  {
    id: 'general_tip_solar',
    condition: () => true,
    priority: 13,
    icon: '☀️',
    title: 'Consider Solar Energy',
    description: 'If possible, switch to solar panels or green energy providers for your electricity.',
    impact: 'Can reduce electricity emissions by 90%',
    category: 'electricity',
  },
];

export function getRecommendations(breakdown, total, limit = 5) {
  const applicable = RULES
    .filter(rule => rule.condition(breakdown, total))
    .sort((a, b) => a.priority - b.priority)
    .slice(0, limit);

  return applicable;
}

export function getRandomTip() {
  const tips = RULES.filter(r => r.priority >= 10);
  return tips[Math.floor(Math.random() * tips.length)];
}

// AI Coach responses (rule-based, no API needed)
const COACH_RESPONSES = {
  greeting: [
    "Hi there! 🌱 I'm your AI Sustainability Coach. I'm here to help you understand and reduce your carbon footprint. What would you like to know?",
    "Welcome! 🌍 Let's make the planet greener together. Ask me anything about sustainability, or tell me about your daily habits and I'll suggest improvements!",
  ],
  carbon_explain: [
    "**Carbon footprint** is the total amount of greenhouse gases (mainly CO₂) produced by your activities. 🏭\n\nIt's measured in **kg CO₂ equivalent (CO₂e)** and includes:\n- 🚗 How you travel\n- ⚡ Your electricity use\n- 🍽️ What you eat\n- 🛍️ What you buy\n- 🗑️ Your waste\n\nThe average person produces about **13.2 kg CO₂/day** globally. The goal is to get below **6 kg/day** by 2030!",
  ],
  reduce_tips: [
    "Here are my **top 5 ways to reduce** your footprint today:\n\n1. 🚶 **Walk or bike** for short trips (saves 0.2 kg/km)\n2. 🥗 **Eat one plant-based meal** daily (saves 2-3 kg/day)\n3. 💡 **Turn off unused appliances** (saves 1-2 kg/day)\n4. ♻️ **Recycle and compost** (saves 0.5 kg/day)\n5. 🛍️ **Buy less, choose wisely** (saves 5-50 kg per item)\n\nStart with one change and build from there! 💪",
  ],
  transport: [
    "**Transport** is often the biggest emission source! Here's a comparison:\n\n| Mode | CO₂/km |\n|------|--------|\n| ✈️ Domestic Flight | 0.255 kg |\n| 🚗 Petrol Car | 0.21 kg |\n| 🏍️ Motorcycle | 0.11 kg |\n| 🚌 Bus | 0.089 kg |\n| 🚆 Train | 0.041 kg |\n| 🚲 Bicycle | 0 kg |\n| 🚶 Walking | 0 kg |\n\n**Pro tip:** Carpooling cuts your per-person emissions by 50-75%!",
  ],
  food: [
    "**Food choices** have a huge impact! 🍽️\n\n- 🥩 Beef produces **27 kg CO₂/kg** — that's massive!\n- 🍗 Chicken is much lower at **6.9 kg CO₂/kg**\n- 🥦 Vegetables are just **2 kg CO₂/kg**\n- 🌱 A vegan meal produces only **0.7 kg CO₂**\n\n**You don't have to go fully vegan!** Even replacing 2-3 meals a week with plant-based options makes a big difference. Try 'Meatless Mondays' to start!",
  ],
  electricity: [
    "⚡ **Electricity tips** to lower your footprint:\n\n1. Switch to **LED bulbs** — use 75% less energy\n2. **Unplug chargers** when not in use — phantom power adds up\n3. Use **natural light** during daytime\n4. Set AC to **24-26°C** instead of lower\n5. Wash clothes in **cold water** — heating water uses lots of energy\n6. Consider **solar panels** if possible — reduces emissions by 90%\n\nSmall changes in habits can save 2-5 kg CO₂ every day!",
  ],
  motivation: [
    "🌟 **You're making a difference!** Every small action counts:\n\n- If 1 million people skipped one car trip per week, we'd save **10,000 tons of CO₂** per year\n- Recycling one aluminum can saves enough energy to run a TV for 3 hours\n- Planting one tree absorbs about 22 kg of CO₂ per year\n\nYou're not alone in this journey. Keep going! 🌱💚",
    "💪 **Remember:** Climate change isn't solved by one person being perfect — it's solved by millions of people being imperfectly consistent.\n\nEvery sustainable choice you make inspires others around you. You're building habits that will last a lifetime! 🌍✨",
  ],
  weekly_plan: [
    "📋 **Your Weekly Eco Plan:**\n\n**Monday:** 🥗 Meatless Monday — try a fully plant-based day\n**Tuesday:** 🚶 Walk or bike for at least one trip\n**Wednesday:** ♻️ Sort your recyclables and start composting\n**Thursday:** 💡 Energy audit — unplug unused devices\n**Friday:** 🛍️ Zero shopping day — buy nothing new\n**Saturday:** 🌱 Plant something or visit a local market\n**Sunday:** 📊 Review your week and plan next week's goals\n\nTrack your progress in the dashboard! 🎯",
  ],
  waste: [
    "🗑️ **Waste reduction** is easier than you think!\n\n**The 5 R's:**\n1. **Refuse** — Say no to things you don't need\n2. **Reduce** — Buy less, choose quality over quantity\n3. **Reuse** — Use reusable bags, bottles, containers\n4. **Recycle** — Sort waste properly\n5. **Rot** — Compost food scraps\n\n**Did you know?** Landfill waste produces 0.58 kg CO₂/kg, but recycling reduces that to just 0.02 kg CO₂/kg. That's a **96% reduction!**",
  ],
  default: [
    "Great question! 🤔 Here are some things I can help with:\n\n- 📊 **Explain** your carbon footprint\n- 💡 **Tips** to reduce emissions\n- 🚗 **Transport** comparisons\n- 🍽️ **Food** impact analysis\n- ⚡ **Electricity** saving advice\n- 🗑️ **Waste** reduction strategies\n- 📋 **Weekly plan** for improvement\n- 💪 **Motivation** and encouragement\n\nJust type a topic or ask a question!",
  ],
};

export function getCoachResponse(message) {
  const lower = message.toLowerCase();

  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey') || lower.includes('start')) {
    return pickRandom(COACH_RESPONSES.greeting);
  }
  if (lower.includes('what is carbon') || lower.includes('explain') || lower.includes('carbon footprint') || lower.includes('what is co2')) {
    return pickRandom(COACH_RESPONSES.carbon_explain);
  }
  if (lower.includes('reduce') || lower.includes('lower') || lower.includes('tips') || lower.includes('how to') || lower.includes('improve')) {
    return pickRandom(COACH_RESPONSES.reduce_tips);
  }
  if (lower.includes('transport') || lower.includes('car') || lower.includes('drive') || lower.includes('travel') || lower.includes('flight') || lower.includes('bus') || lower.includes('train')) {
    return pickRandom(COACH_RESPONSES.transport);
  }
  if (lower.includes('food') || lower.includes('eat') || lower.includes('diet') || lower.includes('meat') || lower.includes('vegan') || lower.includes('vegetarian')) {
    return pickRandom(COACH_RESPONSES.food);
  }
  if (lower.includes('electric') || lower.includes('energy') || lower.includes('power') || lower.includes('light') || lower.includes('solar')) {
    return pickRandom(COACH_RESPONSES.electricity);
  }
  if (lower.includes('waste') || lower.includes('recycle') || lower.includes('trash') || lower.includes('garbage') || lower.includes('compost')) {
    return pickRandom(COACH_RESPONSES.waste);
  }
  if (lower.includes('motivat') || lower.includes('encourage') || lower.includes('inspire') || lower.includes('why')) {
    return pickRandom(COACH_RESPONSES.motivation);
  }
  if (lower.includes('plan') || lower.includes('week') || lower.includes('schedule') || lower.includes('routine')) {
    return pickRandom(COACH_RESPONSES.weekly_plan);
  }

  return pickRandom(COACH_RESPONSES.default);
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
