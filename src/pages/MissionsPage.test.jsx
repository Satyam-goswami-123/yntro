import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import MissionsPage from './MissionsPage';
import * as storage from '../utils/storage';
import { MISSIONS } from '../utils/gamification';

describe('MissionsPage', () => {
  const mockProfile = {
    name: 'TestUser',
    totalPoints: 100,
    completedMissions: 0,
    gameHighScore: 0,
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders available missions by default', () => {
    vi.spyOn(storage, 'getCompletedMissions').mockReturnValue([]);
    vi.spyOn(storage, 'getGameStats').mockReturnValue({ highScore: 0 });

    render(<MissionsPage profile={mockProfile} updateProfile={vi.fn()} />);

    expect(screen.getByText('Sustainability Missions')).toBeInTheDocument();
    expect(screen.getByText(`🎯 Available (${MISSIONS.length})`)).toBeInTheDocument();
    
    // Check if the first mission title is rendered
    expect(screen.getByText(MISSIONS[0].title)).toBeInTheDocument();
  });

  it('allows completing a mission', async () => {
    vi.spyOn(storage, 'getCompletedMissions').mockReturnValue([]);
    vi.spyOn(storage, 'getGameStats').mockReturnValue({ highScore: 0 });
    const mockSave = vi.spyOn(storage, 'saveMissionComplete').mockReturnValue([{ id: MISSIONS[0].id }]);
    const mockUpdate = vi.fn();

    render(<MissionsPage profile={mockProfile} updateProfile={mockUpdate} />);

    // Find the first 'Complete ✓' button
    const completeButtons = screen.getAllByText('Complete ✓');
    
    act(() => {
      fireEvent.click(completeButtons[0]);
    });

    expect(mockSave).toHaveBeenCalledWith(MISSIONS[0].id, MISSIONS[0].points);
    expect(mockUpdate).toHaveBeenCalledWith({
      totalPoints: mockProfile.totalPoints + MISSIONS[0].points,
      completedMissions: 1
    });
  });

  it('switches to completed tab', () => {
    vi.spyOn(storage, 'getCompletedMissions').mockReturnValue([{ id: MISSIONS[0].id }]);
    vi.spyOn(storage, 'getGameStats').mockReturnValue({ highScore: 0 });

    render(<MissionsPage profile={mockProfile} updateProfile={vi.fn()} />);

    // Click completed tab
    const completedTab = screen.getByText('✅ Completed (1)');
    fireEvent.click(completedTab);

    // Verify it shows "Done" instead of "Complete"
    expect(screen.getByText('✅ Done')).toBeInTheDocument();
  });

  it('switches to badges tab', () => {
    vi.spyOn(storage, 'getCompletedMissions').mockReturnValue([]);
    vi.spyOn(storage, 'getGameStats').mockReturnValue({ highScore: 0 });

    render(<MissionsPage profile={mockProfile} updateProfile={vi.fn()} />);

    const badgesTab = screen.getByText('🏅 Badges');
    fireEvent.click(badgesTab);

    // Eco levels section should be visible
    expect(screen.getByText('Eco Levels')).toBeInTheDocument();
  });
});
