import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Onboarding from './Onboarding';

describe('Onboarding Component', () => {
  it('renders step 1 initially', () => {
    render(<Onboarding updateProfile={vi.fn()} />);
    expect(screen.getByText('Welcome to yntro')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument();
  });

  it('progresses to step 2 when name is entered', async () => {
    render(<Onboarding updateProfile={vi.fn()} />);
    
    const input = screen.getByPlaceholderText('Enter your name');
    const button = screen.getByText('Continue');
    
    // Initially button is disabled
    expect(button).toBeDisabled();
    
    fireEvent.change(input, { target: { value: 'TestUser' } });
    expect(button).not.toBeDisabled();
    
    fireEvent.click(button);
    
    // Now on step 2
    expect(await screen.findByText('Nice to meet you, TestUser!')).toBeInTheDocument();
    expect(await screen.findByText('Reduce my carbon footprint')).toBeInTheDocument();
  });

  it('calls updateProfile when step 2 is completed', async () => {
    const mockUpdateProfile = vi.fn();
    render(<Onboarding updateProfile={mockUpdateProfile} />);
    
    // Step 1
    const input = screen.getByPlaceholderText('Enter your name');
    fireEvent.change(input, { target: { value: 'TestUser' } });
    fireEvent.click(screen.getByText('Continue'));
    
    // Step 2 (need to wait for Framer Motion animation)
    const goalButton = await screen.findByText('Reduce my carbon footprint');
    fireEvent.click(goalButton);
    
    const goButton = screen.getByText("Let's Go!");
    expect(goButton).not.toBeDisabled();
    
    fireEvent.click(goButton);
    
    expect(mockUpdateProfile).toHaveBeenCalledWith({
      name: 'TestUser',
      onboarded: true
    });
  });
});
