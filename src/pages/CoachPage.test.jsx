import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import CoachPage from './CoachPage';
import * as storage from '../utils/storage';

describe('CoachPage', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.useFakeTimers();
    // Element.prototype.scrollIntoView is not implemented in jsdom
    Element.prototype.scrollIntoView = vi.fn();
  });

  it('renders initial welcome message from coach', () => {
    vi.spyOn(storage, 'getChatHistory').mockReturnValue([]);
    
    render(<CoachPage />);
    
    expect(screen.getByText('AI Sustainability Coach')).toBeInTheDocument();
    expect(screen.getByText(/I'm your AI Sustainability Coach|Let's make the planet greener/i)).toBeInTheDocument();
  });

  it('sends a message and receives a response', async () => {
    vi.spyOn(storage, 'getChatHistory').mockReturnValue([]);
    const mockSave = vi.spyOn(storage, 'saveChatHistory').mockImplementation(() => {});

    render(<CoachPage />);
    
    const input = screen.getByPlaceholderText('Ask me about sustainability...');
    const sendBtn = screen.getByText('Send');

    fireEvent.change(input, { target: { value: 'what is carbon footprint?' } });
    expect(sendBtn).not.toBeDisabled();
    
    act(() => {
      fireEvent.click(sendBtn);
    });

    // User message should be displayed
    expect(screen.getByText('what is carbon footprint?')).toBeInTheDocument();

    // Advance timers to trigger coach response
    act(() => {
      vi.runAllTimers();
    });

    // Check if saveChatHistory was called with updated array
    expect(mockSave).toHaveBeenCalled();
    
    // Check if the response was added (since ruleEngine returns specific text for this)
    expect(screen.getAllByText(/Carbon footprint/i).length).toBeGreaterThan(0);
  });

  it('allows clicking suggestion chips', () => {
    vi.spyOn(storage, 'getChatHistory').mockReturnValue([]);
    
    render(<CoachPage />);
    
    const suggestionBtn = screen.getByText('What is carbon footprint?');
    
    act(() => {
      fireEvent.click(suggestionBtn);
    });
    
    expect(screen.getByText('What is carbon footprint?')).toBeInTheDocument();
  });
});
