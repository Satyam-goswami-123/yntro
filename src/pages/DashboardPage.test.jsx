import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DashboardPage from './DashboardPage';
import * as storage from '../utils/storage';

// Mock Recharts to avoid ResizeObserver issues in jsdom
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
  PieChart: ({ children }) => <div data-testid="pie-chart">{children}</div>,
  Pie: () => <div />,
  Cell: () => <div />,
  AreaChart: ({ children }) => <div data-testid="area-chart">{children}</div>,
  Area: () => <div />,
  XAxis: () => <div />,
  YAxis: () => <div />,
  Tooltip: () => <div />,
}));

describe('DashboardPage', () => {
  const mockProfile = {
    name: 'TestUser',
    totalPoints: 150,
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders correctly with no history', () => {
    vi.spyOn(storage, 'getCarbonHistory').mockReturnValue([]);
    vi.spyOn(storage, 'getCompletedMissions').mockReturnValue([]);
    vi.spyOn(storage, 'getGameStats').mockReturnValue({ highScore: 0, gamesPlayed: 0 });

    render(
      <MemoryRouter>
        <DashboardPage profile={mockProfile} updateProfile={vi.fn()} />
      </MemoryRouter>
    );

    expect(screen.getByText(/Welcome back,/)).toBeInTheDocument();
    expect(screen.getByText('TestUser')).toBeInTheDocument();
    
    // Check default states for charts
    expect(screen.getByText(/No data yet/i)).toBeInTheDocument();
    expect(screen.getByText(/Log at least 2 days to see trends/i)).toBeInTheDocument();
    expect(screen.getByText(/Calculate your footprint to get personalized AI recommendations/i)).toBeInTheDocument();
  });

  it('renders data when history is present', () => {
    vi.spyOn(storage, 'getCarbonHistory').mockReturnValue([
      { date: '2024-01-01', transport: { car_petrol: 50 }, electricity: { grid_average: 10 } },
      { date: '2024-01-02', transport: { bus: 20 }, food: { vegan_meal: 2 } }
    ]);
    vi.spyOn(storage, 'getCompletedMissions').mockReturnValue([{ id: 'm1' }]);
    vi.spyOn(storage, 'getGameStats').mockReturnValue({ highScore: 200, gamesPlayed: 5 });

    render(
      <MemoryRouter>
        <DashboardPage profile={mockProfile} updateProfile={vi.fn()} />
      </MemoryRouter>
    );

    // Instead of exact strings, just check if charts rendered
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    expect(screen.getByTestId('area-chart')).toBeInTheDocument();
    
    // Check if recommendations rendered
    expect(screen.getByText('AI Recommendations')).toBeInTheDocument();
    
    // Check if stats are visible
    expect(screen.getByText('200')).toBeInTheDocument(); // game score
  });
});
