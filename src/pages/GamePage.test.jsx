import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import GamePage from './GamePage';
import * as storage from '../utils/storage';

// Mock Canvas and related Three.js components to avoid WebGL errors in jsdom
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }) => <div data-testid="3d-canvas">{children}</div>,
  useFrame: () => {},
}));

vi.mock('@react-three/drei', () => ({
  PerspectiveCamera: () => null,
  Environment: () => null,
}));

describe('GamePage', () => {
  const mockProfile = { totalPoints: 100 };
  
  beforeEach(() => {
    vi.restoreAllMocks();
    // HTMLCanvasElement.prototype.getContext needs to be mocked for the 2D canvas
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
      scale: vi.fn(),
      fillRect: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      fillText: vi.fn(),
      save: vi.fn(),
      restore: vi.fn(),
      drawImage: vi.fn(),
    });
  });

  it('renders initial game view in autoMode', () => {
    vi.spyOn(storage, 'getGameStats').mockReturnValue({ highScore: 50, gamesPlayed: 2 });
    
    render(
      <MemoryRouter>
        <GamePage profile={mockProfile} updateProfile={vi.fn()} />
      </MemoryRouter>
    );

    expect(screen.getByText('yntro.')).toBeInTheDocument();
    expect(screen.getByText('Drive Towards a Greener Future.')).toBeInTheDocument();
    expect(screen.getByText('Take Control')).toBeInTheDocument();
  });

  it('allows user to take control', () => {
    vi.spyOn(storage, 'getGameStats').mockReturnValue({ highScore: 50 });
    
    render(
      <MemoryRouter>
        <GamePage profile={mockProfile} updateProfile={vi.fn()} />
      </MemoryRouter>
    );

    const takeControlBtn = screen.getByText('Take Control');
    fireEvent.click(takeControlBtn);

    // After taking control, score HUD should appear
    expect(screen.getByText('Score')).toBeInTheDocument();
    expect(screen.getByText('Tokens')).toBeInTheDocument();
  });
});
