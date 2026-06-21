import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import { useEffect } from 'react';

// A simple component to test the AuthContext
const TestComponent = () => {
  const { currentUser, login, logout, signup } = useAuth();
  
  return (
    <div>
      <div data-testid="user">{currentUser ? currentUser.email : 'No User'}</div>
      <button onClick={() => login('test@example.com', 'password123')}>Login</button>
      <button onClick={() => signup('new@example.com', 'password123')}>Signup</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('provides null currentUser initially if localStorage is empty', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    expect(screen.getByTestId('user')).toHaveTextContent('No User');
  });

  it('loads user from localStorage on mount', () => {
    localStorage.setItem('yntro_user', JSON.stringify({ email: 'saved@example.com' }));
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    expect(screen.getByTestId('user')).toHaveTextContent('saved@example.com');
  });

  it('handles login successfully', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    act(() => {
      screen.getByText('Login').click();
    });
    
    // Fast-forward the setTimeout in the mock login
    await act(async () => {
      vi.runAllTimers();
    });

    expect(screen.getByTestId('user')).toHaveTextContent('test@example.com');
    expect(JSON.parse(localStorage.getItem('yntro_user')).email).toBe('test@example.com');
  });

  it('handles logout successfully', async () => {
    localStorage.setItem('yntro_user', JSON.stringify({ email: 'saved@example.com' }));
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    act(() => {
      screen.getByText('Logout').click();
    });

    expect(screen.getByTestId('user')).toHaveTextContent('No User');
    expect(localStorage.getItem('yntro_user')).toBeNull();
  });

  it('handles signup successfully', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    act(() => {
      screen.getByText('Signup').click();
    });
    
    await act(async () => {
      vi.runAllTimers();
    });

    expect(screen.getByTestId('user')).toHaveTextContent('new@example.com');
  });
});
