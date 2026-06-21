import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Layout from './Layout';

// Mock matchMedia for framer-motion if needed, though usually jsdom handles basic tests
beforeEach(() => {
  // IntersectionObserver isn't available in test environment
  const mockIntersectionObserver = vi.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null
  });
  window.IntersectionObserver = mockIntersectionObserver;
});

describe('Layout Component', () => {
  const mockProfile = {
    name: 'Eco Warrior',
    totalPoints: 150
  };

  it('renders logo and navigation links', () => {
    render(
      <MemoryRouter>
        <Layout profile={mockProfile} />
      </MemoryRouter>
    );

    // Logo
    expect(screen.getByText('yntro')).toBeInTheDocument();

    // Nav items
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Explore')).toBeInTheDocument();
    expect(screen.getByText('Calculator')).toBeInTheDocument();
    expect(screen.getByText('AI Coach')).toBeInTheDocument();
    expect(screen.getByText('Missions')).toBeInTheDocument();
  });

  it('displays user profile data correctly', () => {
    render(
      <MemoryRouter>
        <Layout profile={mockProfile} />
      </MemoryRouter>
    );

    // Mobile menu starts closed, but desktop badge is visible
    const levelTexts = screen.getAllByText('Level Eco Warrior');
    expect(levelTexts.length).toBeGreaterThan(0);
  });

  it('toggles mobile menu', () => {
    // Override window width to simulate mobile if needed, though jsdom treats classes just as strings
    render(
      <MemoryRouter>
        <Layout profile={mockProfile} />
      </MemoryRouter>
    );

    // Find mobile menu button (it should be a button containing the Menu icon)
    // Since lucide icons are SVGs, we can look for the button role or just by clicking the first button
    const buttons = screen.getAllByRole('button');
    const menuButton = buttons[0]; // Assuming it's the first button

    fireEvent.click(menuButton);
    // Menu should be open, we can check for Eco Level
    expect(screen.getByText('Eco Level')).toBeInTheDocument();

    // Click again to close
    fireEvent.click(menuButton);
  });
});
