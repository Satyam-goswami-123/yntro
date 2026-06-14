import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EMISSION_FACTORS, calculateEmission, getCategoryBreakdown, calculateTotalFootprint, BENCHMARKS, CATEGORY_COLORS, CATEGORY_LABELS } from '../utils/carbonEngine';
import { saveCarbonEntry } from '../utils/storage';
import { Car, Zap, Droplets, Utensils, ShoppingBag, Trash2 } from 'lucide-react';

const STEPS = ['transport', 'electricity', 'water', 'food', 'shopping', 'waste'];
const STEP_ICONS = { transport: Car, electricity: Zap, water: Droplets, food: Utensils, shopping: ShoppingBag, waste: Trash2 };
const STEP_TITLES = { transport: 'Transportation', electricity: 'Electricity', water: 'Water Usage', food: 'Food & Diet', shopping: 'Shopping', waste: 'Waste' };

export default function CalculatorPage({ profile, updateProfile }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    transport: {},
    electricity: {},
    water: {},
    food: {},
    shopping: {},
    waste: {},
  });
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  const currentCategory = STEPS[step];
  const factors = EMISSION_FACTORS[currentCategory];

  const handleInput = (type, value) => {
    setData(prev => ({
      ...prev,
      [currentCategory]: {
        ...prev[currentCategory],
        [type]: Math.max(0, Number(value) || 0),
      },
    }));
  };

  const next = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
    else handleSubmit();
  };

  const prev = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleSubmit = () => {
    saveCarbonEntry(data);
    const total = calculateTotalFootprint(data);
    updateProfile({
      calculations: profile.calculations + 1,
      lowestFootprint: Math.min(profile.lowestFootprint, total),
      totalPoints: profile.totalPoints + 25,
      lastLogDate: new Date().toISOString(),
    });
    setShowResults(true);
  };

  if (showResults) {
    const total = calculateTotalFootprint(data);
    const breakdown = getCategoryBreakdown(data);
    const level = total <= BENCHMARKS.excellent ? 'Excellent' : total <= BENCHMARKS.target_2030 ? 'Good' : total <= BENCHMARKS.india_average ? 'Average' : 'High';
    const levelColor = total <= BENCHMARKS.excellent ? 'text-primary-400' : total <= BENCHMARKS.target_2030 ? 'text-green-400' : total <= BENCHMARKS.india_average ? 'text-amber-400' : 'text-red-400';

    return (
      <div className="space-y-6 pt-12 lg:pt-0 max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <h1 className="text-3xl font-display font-bold gradient-text">Your Carbon Footprint</h1>
          <p className="text-dark-400 mt-1">Here's your daily emission breakdown</p>
        </motion.div>

        {/* Big score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-3xl p-8 text-center"
        >
          <motion.p
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 100 }}
            className={`text-6xl font-display font-bold ${levelColor}`}
          >
            {total}
          </motion.p>
          <p className="text-dark-400 text-lg mt-1">kg CO₂ per day</p>
          <p className={`text-sm font-semibold mt-3 ${levelColor}`}>{level} Impact</p>
          <div className="mt-4 flex justify-center gap-4 text-xs text-dark-500">
            <span>🌍 World avg: {BENCHMARKS.world_average} kg</span>
            <span>🇮🇳 India avg: {BENCHMARKS.india_average} kg</span>
            <span>🎯 2030 target: {BENCHMARKS.target_2030} kg</span>
          </div>
          <p className="text-xs text-primary-400 mt-3">+25 Green Points earned! 🌱</p>
        </motion.div>

        {/* Category breakdown */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass rounded-2xl p-6">
          <h2 className="font-display font-semibold mb-4">Breakdown by Category</h2>
          <div className="space-y-3">
            {Object.entries(breakdown)
              .filter(([, v]) => v > 0)
              .sort((a, b) => b[1] - a[1])
              .map(([cat, val]) => (
                <div key={cat}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="flex items-center gap-2 text-dark-300">
                      {(() => { const Icon = STEP_ICONS[cat]; return <Icon size={16} />; })()}
                      <span>{CATEGORY_LABELS[cat]}</span>
                    </span>
                    <span className="font-semibold">{val} kg</span>
                  </div>
                  <div className="w-full bg-dark-800 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (val / total) * 100)}%` }}
                      transition={{ delay: 0.6, duration: 0.8 }}
                      className="h-2 rounded-full"
                      style={{ backgroundColor: CATEGORY_COLORS[cat] }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </motion.div>

        <div className="flex gap-4">
          <button onClick={() => { setShowResults(false); setStep(0); setData({ transport: {}, electricity: {}, water: {}, food: {}, shopping: {}, waste: {} }); }} className="flex-1 glass rounded-xl py-3 text-sm hover:bg-dark-700 transition-colors">
            Calculate Again
          </button>
          <button onClick={() => navigate('/')} className="flex-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl py-3 text-sm font-semibold hover:opacity-90 transition-opacity">
            View Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-12 lg:pt-0 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-display font-bold gradient-text">Carbon Calculator</h1>
        <p className="text-dark-400 mt-1">Estimate your daily carbon footprint</p>
      </motion.div>

      {/* Progress bar */}
      <div className="glass rounded-2xl p-4">
        <div className="flex justify-between mb-2">
          {STEPS.map((s, i) => (
            <button
              key={s}
              onClick={() => setStep(i)}
              className={`flex flex-col items-center gap-2 transition-all duration-300 ${
                i === step ? 'scale-110 text-primary-400' : i < step ? 'opacity-60 text-dark-300' : 'opacity-30 text-dark-500'
              }`}
              aria-label={`Step ${i+1}: ${STEP_TITLES[s]}`}
            >
              {(() => { const Icon = STEP_ICONS[s]; return <Icon size={24} />; })()}
              <span className="text-[10px] hidden sm:block font-medium">{STEP_TITLES[s]}</span>
            </button>
          ))}
        </div>
        <div className="w-full bg-dark-800 rounded-full h-1.5">
          <motion.div
            animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            className="h-1.5 rounded-full bg-gradient-to-r from-primary-500 to-accent-500"
          />
        </div>
      </div>

      {/* Form */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3 }}
          className="glass rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 glass-light rounded-xl text-primary-400">
              {(() => { const Icon = STEP_ICONS[currentCategory]; return <Icon size={28} />; })()}
            </div>
            <div>
              <h2 className="text-xl font-display font-bold">{STEP_TITLES[currentCategory]}</h2>
              <p className="text-xs text-dark-400">Enter your daily usage amounts</p>
            </div>
          </div>

          <div className="space-y-4">
            {Object.entries(factors).map(([type, info]) => (
              <div key={type} className="group">
                <label htmlFor={`input-${type}`} className="flex justify-between text-sm mb-1.5">
                  <span className="text-dark-300">{info.label}</span>
                  <span className="text-dark-500 text-xs">{info.factor} kg CO₂/{info.unit}</span>
                </label>
                <div className="relative">
                  <input
                    id={`input-${type}`}
                    type="number"
                    min="0"
                    step="0.1"
                    value={data[currentCategory][type] || ''}
                    onChange={(e) => handleInput(type, e.target.value)}
                    placeholder={`0 ${info.unit}`}
                    className="w-full bg-dark-800/50 border border-dark-700 rounded-xl px-4 py-3 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all outline-none"
                    aria-label={`${info.label} in ${info.unit}`}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-dark-500">{info.unit}</span>
                </div>
                {data[currentCategory][type] > 0 && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-primary-400 mt-1">
                    = {calculateEmission(currentCategory, type, data[currentCategory][type])} kg CO₂
                  </motion.p>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation buttons */}
      <div className="flex gap-4">
        <button
          onClick={prev}
          disabled={step === 0}
          className="flex-1 glass rounded-xl py-3 text-sm font-medium disabled:opacity-30 hover:bg-dark-700 transition-all"
        >
          ← Previous
        </button>
        <button
          onClick={next}
          className="flex-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl py-3 text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          {step === STEPS.length - 1 ? 'Calculate →' : 'Next →'}
        </button>
      </div>
    </div>
  );
}
