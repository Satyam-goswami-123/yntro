import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { getCarbonHistory } from '../utils/storage';
import { calculateTotalFootprint, getCategoryBreakdown, CATEGORY_COLORS, CATEGORY_LABELS, BENCHMARKS } from '../utils/carbonEngine';
import { getRecommendations } from '../utils/ruleEngine';
import { getCurrentLevel, checkBadges, BADGES } from '../utils/gamification';
import { getCompletedMissions, getGameStats } from '../utils/storage';
import { Globe, Target, Gamepad2, Calculator, TrendingUp, CheckCircle } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' }
  }),
};

export default function DashboardPage({ profile, updateProfile }) {
  const [history, setHistory] = useState([]);
  const [latestBreakdown, setLatestBreakdown] = useState(null);
  const [latestTotal, setLatestTotal] = useState(0);
  const [recommendations, setRecommendations] = useState([]);
  const [level, setLevel] = useState(getCurrentLevel(profile.totalPoints));
  const [completedMissions, setCompletedMissions] = useState([]);
  const [gameStats, setGameStats] = useState({ highScore: 0, gamesPlayed: 0 });

  useEffect(() => {
    const h = getCarbonHistory();
    setHistory(h);
    setCompletedMissions(getCompletedMissions());
    setGameStats(getGameStats());
    setLevel(getCurrentLevel(profile.totalPoints));

    if (h.length > 0) {
      const latest = h[h.length - 1];
      const bd = getCategoryBreakdown(latest);
      const total = calculateTotalFootprint(latest);
      setLatestBreakdown(bd);
      setLatestTotal(total);
      setRecommendations(getRecommendations(bd, total, 3));
    }
  }, [profile]);

  const pieData = latestBreakdown
    ? Object.entries(latestBreakdown)
        .filter(([, v]) => v > 0)
        .map(([key, value]) => ({ name: CATEGORY_LABELS[key], value, color: CATEGORY_COLORS[key] }))
    : [];

  const trendData = history.slice(-14).map((entry, i) => ({
    day: `Day ${i + 1}`,
    co2: calculateTotalFootprint(entry),
  }));

  const earnedBadgeIds = checkBadges({
    ...profile,
    completedMissions: completedMissions.length,
    gameHighScore: gameStats.highScore,
  });

  return (
    <div className="space-y-6 pt-12 lg:pt-0">
      {/* Header */}
      <motion.div initial="hidden" animate="visible" custom={0} variants={fadeUp}>
        <h1 className="text-3xl sm:text-4xl font-display font-bold">
          Welcome back, <span className="gradient-text">{profile.name}</span>
        </h1>
        <p className="text-dark-400 mt-1">Here's your environmental impact overview</p>
      </motion.div>

      {/* Top stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Daily Footprint',
            value: latestTotal > 0 ? `${latestTotal} kg` : '—',
            sub: 'CO₂ equivalent',
            color: latestTotal > BENCHMARKS.india_average ? 'text-amber-400' : 'text-primary-400',
            icon: <Globe size={24} />,
          },
          {
            label: 'Green Points',
            value: profile.totalPoints,
            sub: `Level ${level.level}: ${level.title}`,
            color: 'text-primary-400',
            icon: <span className="text-2xl">{level.icon}</span>,
          },
          {
            label: 'Missions Done',
            value: completedMissions.length,
            sub: 'sustainability actions',
            color: 'text-accent-400',
            icon: <Target size={24} />,
          },
          {
            label: 'EcoDrive Best',
            value: gameStats.highScore,
            sub: `${gameStats.gamesPlayed} games played`,
            color: 'text-purple-400',
            icon: <Gamepad2 size={24} />,
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial="hidden"
            animate="visible"
            custom={i + 1}
            variants={fadeUp}
            className="glass rounded-2xl p-5 hover:border-primary-500/30 transition-all duration-300"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-dark-400 uppercase tracking-wider">{stat.label}</p>
                <p className={`text-2xl font-display font-bold mt-1 ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-dark-500 mt-1">{stat.sub}</p>
              </div>
              <div className="text-primary-400">{stat.icon}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Level progress */}
      <motion.div initial="hidden" animate="visible" custom={5} variants={fadeUp} className="glass rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{level.icon}</span>
            <div>
              <p className="font-semibold text-sm">Level {level.level}: {level.title}</p>
              <p className="text-xs text-dark-400">
                {level.nextLevel ? `${level.nextLevel.minXP - profile.totalPoints} XP to Level ${level.nextLevel.level}` : 'Max Level!'}
              </p>
            </div>
          </div>
          <span className="text-sm text-primary-400 font-semibold">{Math.round(level.progress)}%</span>
        </div>
        <div className="w-full bg-dark-800 rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${level.progress}%` }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="h-3 rounded-full bg-gradient-to-r from-primary-500 via-accent-500 to-purple-500"
          />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Emission breakdown */}
        <motion.div initial="hidden" animate="visible" custom={6} variants={fadeUp} className="glass rounded-2xl p-6">
          <h2 className="text-lg font-display font-semibold mb-4">Emission Breakdown</h2>
          {pieData.length > 0 ? (
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <ResponsiveContainer width={200} height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }}
                    itemStyle={{ color: '#f1f5f9' }}
                    formatter={(v) => `${v} kg CO₂`}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 flex-1">
                {pieData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm text-dark-300">{item.name}</span>
                    </div>
                    <span className="text-sm font-semibold">{item.value} kg</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 flex flex-col items-center">
              <Calculator size={48} className="text-dark-400 mb-4" />
              <p className="text-dark-400 text-sm">No data yet. <Link to="/calculator" className="text-primary-400 hover:underline">Calculate your footprint</Link> to see breakdown.</p>
            </div>
          )}
        </motion.div>

        {/* Trend chart */}
        <motion.div initial="hidden" animate="visible" custom={7} variants={fadeUp} className="glass rounded-2xl p-6">
          <h2 className="text-lg font-display font-semibold mb-4">Footprint Trend</h2>
          {trendData.length > 1 ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorCo2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }}
                  itemStyle={{ color: '#f1f5f9' }}
                  formatter={(v) => `${v} kg CO₂`}
                />
                <Area type="monotone" dataKey="co2" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorCo2)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 flex flex-col items-center">
              <TrendingUp size={48} className="text-dark-400 mb-4" />
              <p className="text-dark-400 text-sm">Log at least 2 days to see trends.</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* AI Recommendations */}
      <motion.div initial="hidden" animate="visible" custom={8} variants={fadeUp}>
        <h2 className="text-lg font-display font-semibold mb-3">AI Recommendations</h2>
        {recommendations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {recommendations.map((rec) => (
              <div key={rec.id} className="glass rounded-2xl p-5 hover:border-primary-500/20 transition-all duration-300 group flex flex-col items-start">
                <span className="text-2xl">{rec.icon}</span>
                <h3 className="font-semibold text-sm mt-2 group-hover:text-primary-400 transition-colors">{rec.title}</h3>
                <p className="text-xs text-dark-400 mt-1">{rec.description}</p>
                <p className="text-xs text-primary-500 mt-2 font-medium">{rec.impact}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass rounded-2xl p-6 text-center">
            <p className="text-dark-400 text-sm">Calculate your footprint to get personalized AI recommendations!</p>
          </div>
        )}
      </motion.div>

      {/* Badges */}
      <motion.div initial="hidden" animate="visible" custom={9} variants={fadeUp}>
        <h2 className="text-lg font-display font-semibold mb-3">Badges</h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {BADGES.slice(0, 5).map((badge) => {
            const earned = earnedBadgeIds.includes(badge.id);
            return (
              <div
                key={badge.id}
                className={`glass rounded-2xl p-4 text-center transition-all duration-300 ${
                  earned ? 'border-primary-500/30 glow-green' : 'opacity-40'
                }`}
              >
                <span className="text-3xl">{badge.icon}</span>
                <p className="text-xs font-semibold mt-2">{badge.title}</p>
                <p className="text-[10px] text-dark-500 mt-1 flex items-center justify-center gap-1">
                  {earned ? <><CheckCircle size={10} className="text-primary-500" /> Earned</> : badge.requirement}
                </p>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div initial="hidden" animate="visible" custom={10} variants={fadeUp}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link to="/calculator" className="glass rounded-2xl p-6 flex flex-col items-center hover:border-primary-500/30 hover:shadow-lg hover:shadow-primary-500/10 transition-all duration-300 group">
            <Calculator size={32} className="text-primary-400 mb-2" />
            <p className="font-display font-semibold mt-2 group-hover:text-primary-400 transition-colors">Calculate Footprint</p>
            <p className="text-xs text-dark-400 mt-1">Track your daily emissions</p>
          </Link>
          <Link to="/" className="glass rounded-2xl p-6 flex flex-col items-center hover:border-accent-500/30 hover:shadow-lg hover:shadow-accent-500/10 transition-all duration-300 group">
            <Gamepad2 size={32} className="text-accent-400 mb-2" />
            <p className="font-display font-semibold mt-2 group-hover:text-accent-400 transition-colors">Play EcoDrive</p>
            <p className="text-xs text-dark-400 mt-1">Learn while having fun</p>
          </Link>
          <Link to="/missions" className="glass rounded-2xl p-6 flex flex-col items-center hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 group">
            <Target size={32} className="text-purple-400 mb-2" />
            <p className="font-display font-semibold mt-2 group-hover:text-purple-400 transition-colors">Start a Mission</p>
            <p className="text-xs text-dark-400 mt-1">Complete eco challenges</p>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
