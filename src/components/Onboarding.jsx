import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Leaf, ArrowRight } from 'lucide-react';

export default function Onboarding({ updateProfile }) {
  const [name, setName] = useState('');
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState('');

  const GOALS = [
    { id: 'reduce', icon: '📉', text: 'Reduce my carbon footprint' },
    { id: 'learn', icon: '🧠', text: 'Learn about sustainability' },
    { id: 'game', icon: '🎮', text: 'Play EcoDrive and earn points' },
  ];

  const handleNext = (e) => {
    e.preventDefault();
    if (step === 1 && name.trim()) {
      setStep(2);
    } else if (step === 2 && goal) {
      // Finish onboarding
      updateProfile({
        name: name.trim(),
        onboarded: true,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-950 p-4">
      {/* Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="bg-orb w-96 h-96 bg-primary-500 top-[-10%] left-[-5%] opacity-50" />
        <div className="bg-orb w-80 h-80 bg-accent-500 bottom-[-5%] right-[-5%] opacity-50" />
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="relative z-10 glass rounded-3xl p-8 max-w-md w-full shadow-2xl shadow-primary-500/10"
          >
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/20">
                <Leaf size={32} className="text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-display font-bold text-center text-white mb-2">Welcome to yntro</h1>
            <p className="text-center text-dark-300 mb-8 text-sm">Let's set up your eco-profile. What should we call you?</p>

            <form onSubmit={handleNext}>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full bg-dark-900/50 border border-dark-700 rounded-xl px-5 py-4 text-white placeholder-dark-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all outline-none text-center text-lg mb-6"
                autoFocus
                required
              />
              <button
                type="submit"
                disabled={!name.trim()}
                className="w-full bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl py-4 font-bold flex items-center justify-center gap-2 disabled:opacity-50 hover:opacity-90 transition-all shadow-lg shadow-primary-500/20"
              >
                Continue <ArrowRight size={20} />
              </button>
            </form>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative z-10 glass rounded-3xl p-8 max-w-md w-full shadow-2xl shadow-accent-500/10"
          >
            <h2 className="text-2xl font-display font-bold text-center text-white mb-2">Nice to meet you, {name}!</h2>
            <p className="text-center text-dark-300 mb-6 text-sm">What is your primary goal today?</p>

            <div className="space-y-3 mb-8">
              {GOALS.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setGoal(g.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-center gap-4 ${
                    goal === g.id 
                      ? 'bg-primary-500/20 border-primary-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
                      : 'bg-dark-800/50 border-dark-700 hover:border-dark-500'
                  }`}
                >
                  <span className="text-2xl">{g.icon}</span>
                  <span className="font-medium text-white">{g.text}</span>
                </button>
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={!goal}
              className="w-full bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl py-4 font-bold flex items-center justify-center gap-2 disabled:opacity-50 hover:opacity-90 transition-all shadow-lg shadow-primary-500/20"
            >
              Let's Go! <ArrowRight size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
