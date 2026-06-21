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
});
