# 🌍 yntro — Carbon Footprint Awareness Platform

An AI-powered web platform that helps individuals understand, track, reduce, and improve their environmental impact through personalized insights, real-world sustainability actions, and an engaging EcoDrive game.

## ✨ Features

### 📊 AI Carbon Footprint Calculator
- Calculate emissions from **transportation, electricity, water, food, shopping, and waste**
- EPA/DEFRA-based emission factors for accurate calculations
- Daily carbon footprint score with benchmark comparisons
- Animated multi-step form wizard

### 🤖 AI Sustainability Coach
- Interactive chat interface with intelligent responses
- Explains carbon emissions in simple language
- Personalized reduction strategies and weekly plans
- Sustainability tips for all categories

### 🎮 EcoDrive Challenge Game
- Browser-based HTML5 Canvas mini-game
- Drive an eco-friendly vehicle through a smart city
- Collect green energy tokens, avoid pollution zones
- Auto Eco Mode with manual control option
- Motivational messages instead of "Game Over"
- In-game sustainability missions

### 🎯 Sustainability Missions
- 15 real-world environmental challenges
- Green Points, badges, and eco-levels
- Progressive difficulty (Easy/Medium/Hard)
- Achievement tracking and streak system

### 📈 Interactive Dashboard
- Carbon footprint score and trend charts
- Emission breakdown with pie charts
- AI-powered personalized recommendations
- Badge gallery and level progression
- Game statistics

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| React 18 | UI Framework |
| Vite 5 | Build Tool |
| Tailwind CSS 3 | Styling |
| Framer Motion | Animations |
| Recharts | Charts & Graphs |
| HTML5 Canvas | EcoDrive Game |
| localStorage | Data Persistence |

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🎨 Design

- **Dark mode** with glassmorphism effects
- **Gradient accents** (emerald, cyan, purple)
- **Smooth animations** with Framer Motion
- **Mobile-responsive** design
- **Accessible** with ARIA labels and keyboard navigation

## 📁 Project Structure

```
src/
├── components/
│   └── Layout.jsx          # App shell with sidebar navigation
├── pages/
│   ├── DashboardPage.jsx   # Main dashboard with charts
│   ├── CalculatorPage.jsx  # Multi-step carbon calculator
│   ├── CoachPage.jsx       # AI sustainability coach chat
│   ├── GamePage.jsx        # EcoDrive HTML5 Canvas game
│   └── MissionsPage.jsx    # Sustainability missions & badges
├── utils/
│   ├── carbonEngine.js     # Emission factor calculations
│   ├── ruleEngine.js       # AI recommendations & coach
│   ├── gamification.js     # Points, badges, levels
│   └── storage.js          # localStorage persistence
├── App.jsx                 # Router & state management
├── main.jsx                # Entry point
└── index.css               # Global styles & Tailwind
```

## ♿ Accessibility

- Semantic HTML5 elements
- ARIA labels on all interactive elements
- Keyboard navigation support
- Focus-visible indicators
- Respects `prefers-reduced-motion`
- High contrast compatible

## 📄 License

Built for Void Hacks 7.0 by Code Novices
