import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import CalculatorPage from './pages/CalculatorPage';
import CoachPage from './pages/CoachPage';
import GamePage from './pages/GamePage';
import MissionsPage from './pages/MissionsPage';
import { getUserProfile, saveUserProfile } from './utils/storage';

function App() {
  const [profile, setProfile] = useState(getUserProfile());

  useEffect(() => {
    saveUserProfile(profile);
  }, [profile]);

  const updateProfile = (updates) => {
    setProfile(prev => {
      const updated = { ...prev, ...updates };
      saveUserProfile(updated);
      return updated;
    });
  };

  return (
    <Router>
      {/* Background animated orbs */}
      <div className="bg-orb w-96 h-96 bg-primary-500 top-[-10%] left-[-5%]" />
      <div className="bg-orb w-80 h-80 bg-accent-500 bottom-[-5%] right-[-5%]" />
      <div className="bg-orb w-64 h-64 bg-purple-500 top-[40%] right-[20%]" />

      <Routes>
        <Route path="/" element={<Layout profile={profile} />}>
          <Route index element={<GamePage profile={profile} updateProfile={updateProfile} />} />
          <Route path="explore" element={<DashboardPage profile={profile} updateProfile={updateProfile} />} />
          <Route path="calculator" element={<CalculatorPage profile={profile} updateProfile={updateProfile} />} />
          <Route path="coach" element={<CoachPage />} />
          <Route path="missions" element={<MissionsPage profile={profile} updateProfile={updateProfile} />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
