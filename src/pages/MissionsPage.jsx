import { motion } from 'framer-motion';
import { useState } from 'react';
import { MISSIONS, getCurrentLevel, checkBadges, BADGES, ECO_LEVELS } from '../utils/gamification';
import { getCompletedMissions, saveMissionComplete, getGameStats } from '../utils/storage';

export default function MissionsPage({ profile, updateProfile }) {
  const [completedMissions, setCompletedMissions] = useState(getCompletedMissions());
  const [tab, setTab] = useState('available');
  const [showConfetti, setShowConfetti] = useState(null);

  const completedIds = completedMissions.map(m => m.id);
  const availableMissions = MISSIONS.filter(m => !completedIds.includes(m.id));
  const doneMissions = MISSIONS.filter(m => completedIds.includes(m.id));
  const gameStats = getGameStats();

  const level = getCurrentLevel(profile.totalPoints);
  const earnedBadgeIds = checkBadges({
    ...profile,
    completedMissions: completedMissions.length,
    gameHighScore: gameStats.highScore,
  });

  const completeMission = (mission) => {
    const updated = saveMissionComplete(mission.id, mission.points);
    setCompletedMissions(updated);
    updateProfile({
      totalPoints: profile.totalPoints + mission.points,
      completedMissions: profile.completedMissions + 1,
    });
    setShowConfetti(mission.id);
    setTimeout(() => setShowConfetti(null), 2000);
  };

  const difficultyColor = {
    easy: 'bg-green-500/20 text-green-400',
    medium: 'bg-amber-500/20 text-amber-400',
    hard: 'bg-red-500/20 text-red-400',
  };

  return (
    <div className="space-y-6 pt-12 lg:pt-0">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-display font-bold gradient-text">Sustainability Missions</h1>
        <p className="text-dark-400 mt-1">Complete real-world challenges to earn Green Points and badges</p>
      </motion.div>

      {/* Level & Points bar */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-2xl p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-2xl">
              {level.icon}
            </div>
            <div>
              <p className="text-lg font-display font-bold">Level {level.level}: {level.title}</p>
              <p className="text-sm text-dark-400">{profile.totalPoints} Green Points • {completedMissions.length} missions completed</p>
            </div>
          </div>
          <div className="flex gap-4 text-center">
            <div className="glass-light rounded-xl px-4 py-2">
              <p className="text-lg font-bold text-primary-400">{availableMissions.length}</p>
              <p className="text-[10px] text-dark-400">Available</p>
            </div>
            <div className="glass-light rounded-xl px-4 py-2">
              <p className="text-lg font-bold text-accent-400">{doneMissions.length}</p>
              <p className="text-[10px] text-dark-400">Completed</p>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-xs text-dark-400 mb-1">
            <span>Progress to Level {level.nextLevel?.level || 'MAX'}</span>
            <span>{Math.round(level.progress)}%</span>
          </div>
          <div className="w-full bg-dark-800 rounded-full h-2.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${level.progress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-2.5 rounded-full bg-gradient-to-r from-primary-500 via-accent-500 to-purple-500"
            />
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setTab('available')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${tab === 'available' ? 'bg-primary-500/20 text-primary-400' : 'glass text-dark-400 hover:text-dark-200'
            }`}
        >
          🎯 Available ({availableMissions.length})
        </button>
        <button
          onClick={() => setTab('completed')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${tab === 'completed' ? 'bg-primary-500/20 text-primary-400' : 'glass text-dark-400 hover:text-dark-200'
            }`}
        >
          ✅ Completed ({doneMissions.length})
        </button>
        <button
          onClick={() => setTab('badges')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${tab === 'badges' ? 'bg-primary-500/20 text-primary-400' : 'glass text-dark-400 hover:text-dark-200'
            }`}
        >
          🏅 Badges
        </button>
      </div>

      {/* Mission list */}
      {tab !== 'badges' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(tab === 'available' ? availableMissions : doneMissions).map((mission, i) => (
            <motion.div
              key={mission.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`glass rounded-2xl p-5 relative overflow-hidden hover:border-primary-500/20 transition-all duration-300 ${showConfetti === mission.id ? 'glow-green' : ''
                }`}
            >
              {showConfetti === mission.id && (
                <motion.div
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 0 }}
                  transition={{ duration: 2 }}
                  className="absolute inset-0 flex items-center justify-center text-4xl z-10"
                >
                  🎉
                </motion.div>
              )}
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{mission.icon}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase ${difficultyColor[mission.difficulty]}`}>
                  {mission.difficulty}
                </span>
              </div>
              <h3 className="font-display font-semibold text-sm">{mission.title}</h3>
              <p className="text-xs text-dark-400 mt-1 leading-relaxed">{mission.description}</p>
              <div className="flex items-center justify-between mt-4">
                <span className="text-xs text-primary-400 font-semibold">+{mission.points} pts</span>
                {tab === 'available' ? (
                  <button
                    onClick={() => completeMission(mission)}
                    className="bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg px-3 py-1.5 text-xs font-semibold hover:opacity-90 transition-opacity"
                  >
                    Complete ✓
                  </button>
                ) : (
                  <span className="text-xs text-green-400">✅ Done</span>
                )}
              </div>
            </motion.div>
          ))}
          {(tab === 'available' ? availableMissions : doneMissions).length === 0 && (
            <div className="col-span-full glass rounded-2xl p-12 text-center">
              <p className="text-4xl mb-3">{tab === 'available' ? '🎉' : '🎯'}</p>
              <p className="text-dark-400">{tab === 'available' ? 'All missions completed! Great job!' : 'No missions completed yet. Start your eco journey!'}</p>
            </div>
          )}
        </div>
      )}

      {/* Badges gallery */}
      {tab === 'badges' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {BADGES.map((badge, i) => {
            const earned = earnedBadgeIds.includes(badge.id);
            return (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className={`glass rounded-2xl p-5 text-center transition-all duration-300 ${earned ? 'border-primary-500/30 glow-green' : 'opacity-40 grayscale'
                  }`}
              >
                <span className="text-4xl">{badge.icon}</span>
                <p className="font-display font-semibold text-sm mt-3">{badge.title}</p>
                <p className="text-[10px] text-dark-400 mt-1">{badge.description}</p>
                <p className="text-[10px] mt-2 font-medium ${earned ? 'text-primary-400' : 'text-dark-500'}">
                  {earned ? '✅ Earned!' : badge.requirement}
                </p>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Eco Levels */}
      {tab === 'badges' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <h2 className="text-lg font-display font-semibold mb-3">Eco Levels</h2>
          <div className="glass rounded-2xl p-5">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {ECO_LEVELS.map((lvl) => (
                <div
                  key={lvl.level}
                  className={`text-center p-3 rounded-xl transition-all ${lvl.level <= level.level ? 'bg-primary-500/10 border border-primary-500/20' : 'bg-dark-800/50 opacity-40'
                    }`}
                >
                  <span className="text-2xl">{lvl.icon}</span>
                  <p className="text-xs font-semibold mt-1">{lvl.title}</p>
                  <p className="text-[10px] text-dark-500">{lvl.minXP} XP</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
