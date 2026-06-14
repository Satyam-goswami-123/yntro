import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Globe, LayoutDashboard, Calculator, Bot, Target, Leaf, Menu, X, Gamepad2 } from 'lucide-react';

const NAV_ITEMS = [
  { path: '/', label: 'Home', icon: Gamepad2 },
  { path: '/explore', label: 'Explore', icon: LayoutDashboard },
  { path: '/calculator', label: 'Calculator', icon: Calculator },
  { path: '/coach', label: 'AI Coach', icon: Bot },
  { path: '/missions', label: 'Missions', icon: Target },
];

export default function Layout({ profile }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col relative z-10">
      {/* Top Navbar */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || !isHome ? 'glass shadow-lg py-3' : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold shadow-lg shadow-primary-500/20">
              <Globe size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold gradient-text leading-none">yntro</h1>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-dark-900/40 backdrop-blur-md rounded-full p-1 border border-dark-700/50">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-5 py-2 rounded-full transition-all duration-300 font-medium text-sm ${
                      isActive
                        ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-md shadow-primary-500/20'
                        : 'text-dark-300 hover:text-white hover:bg-dark-800/50'
                    }`
                  }
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Profile Level Badge (Desktop) */}
          <div className="hidden lg:flex items-center gap-3 glass-light px-4 py-2 rounded-full border-primary-500/20">
            <div className="text-primary-400">
              <Leaf size={18} />
            </div>
            <div className="text-right">
              <p className="text-[10px] text-primary-400 font-bold uppercase tracking-wider leading-none mb-1">Level {profile?.name || 'Explorer'}</p>
              <div className="w-16 bg-dark-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-500"
                  style={{ width: `${Math.min(100, (profile?.totalPoints || 0) / 50)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden glass rounded-xl p-2.5 text-white hover:bg-dark-700 transition-colors flex items-center justify-center"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 lg:hidden pt-20 pb-4 px-4 bg-dark-900/95 backdrop-blur-xl flex flex-col"
          >
            <nav className="flex-1 flex flex-col gap-2 mt-4">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-200 text-lg ${
                        isActive
                          ? 'bg-gradient-to-r from-primary-500/20 to-accent-500/20 text-primary-400 border border-primary-500/30'
                          : 'text-dark-300 hover:bg-dark-800'
                      }`
                    }
                  >
                    <Icon size={24} />
                    <span className="font-medium">{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
            <div className="mt-auto glass p-4 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-primary-400">
                  <Leaf size={24} />
                </div>
                <div>
                  <p className="text-sm text-dark-400">Eco Level</p>
                  <p className="font-semibold text-primary-400">{profile?.name || 'Explorer'}</p>
                </div>
              </div>
              <p className="text-sm font-bold">{profile?.totalPoints || 0} pts</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className={`flex-1 relative ${isHome ? 'p-0' : 'pt-24 pb-8'}`}>
        <div className={`mx-auto ${isHome ? 'w-full max-w-none' : 'max-w-7xl px-4 sm:px-6 lg:px-8'}`}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
