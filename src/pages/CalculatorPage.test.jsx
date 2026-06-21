import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CalculatorPage from './CalculatorPage';
import * as storage from '../utils/storage';

describe('CalculatorPage', () => {
  const mockProfile = {
    calculations: 0,
    lowestFootprint: 100,
    totalPoints: 0,
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders initial step correctly', () => {
    render(
      <MemoryRouter>
        <CalculatorPage profile={mockProfile} updateProfile={vi.fn()} />
      </MemoryRouter>
    );

    // Initial step is Transportation
    expect(screen.getAllByText('Transportation').length).toBeGreaterThan(0);
    
    // Check if input fields are present for transport types
    expect(screen.getByLabelText(/Car \(Petrol\)/i)).toBeInTheDocument();
  });

  it('navigates through steps and calculates results', () => {
    const mockSave = vi.spyOn(storage, 'saveCarbonEntry').mockImplementation(() => {});
    const mockUpdate = vi.fn();

    render(
      <MemoryRouter>
        <CalculatorPage profile={mockProfile} updateProfile={mockUpdate} />
      </MemoryRouter>
    );

    // Step 1: Transport
    const petrolInput = screen.getByLabelText(/Car \(Petrol\)/i);
    fireEvent.change(petrolInput, { target: { value: '10' } });
    
    // Click Next until the end
    const stepsCount = 6;
    for (let i = 0; i < stepsCount - 1; i++) {
      fireEvent.click(screen.getByText(/Next/));
    }
    
    // On last step
    expect(screen.getByText(/Calculate/)).toBeInTheDocument();
    
    // Click Calculate
    act(() => {
      fireEvent.click(screen.getByText(/Calculate/));
    });

    expect(mockSave).toHaveBeenCalled();
    expect(mockUpdate).toHaveBeenCalled();
    
    // Results page should be visible
    expect(screen.getByText('Your Carbon Footprint')).toBeInTheDocument();
    
    // 10 km petrol car = 10 * 0.21 = 2.1 kg CO2
    expect(screen.getByText('2.1')).toBeInTheDocument();
  });
});
