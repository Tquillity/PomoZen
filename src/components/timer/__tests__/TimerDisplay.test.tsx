import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TimerDisplay } from '../TimerDisplay';
import { useTimeStore } from '../../../store/useTimeStore';

// Mock the store to control state
vi.mock('../../../store/useTimeStore', () => ({
  useTimeStore: vi.fn(),
}));

describe('TimerDisplay', () => {
  it('renders formatted time correctly', () => {
    // Mock selector pattern: useTimeStore(selector) => selector(state)
    const mockState = { timeLeft: 1500, isRunning: false };
    (useTimeStore as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      (selector: (state: typeof mockState) => unknown) => selector(mockState)
    );

    render(<TimerDisplay />);

    const timeElement = screen.getByText('25:00');
    expect(timeElement).toBeInTheDocument();
    expect(timeElement).toHaveClass('tabular-nums');
  });

  it('renders zero correctly', () => {
    const mockState = { timeLeft: 0, isRunning: false };
    (useTimeStore as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      (selector: (state: typeof mockState) => unknown) => selector(mockState)
    );

    render(<TimerDisplay />);
    expect(screen.getByText('00:00')).toBeInTheDocument();
  });
});
