import { describe, it, expect } from 'vitest';
import { formatTime } from '../utils/timeUtils';

describe('timeUtils', () => {
  it('formats standard time correctly', () => {
    expect(formatTime(1500)).toBe('25:00');
  });

  it('formats single digits correctly', () => {
    expect(formatTime(65)).toBe('01:05');
  });

  it('formats zero correctly', () => {
    expect(formatTime(0)).toBe('00:00');
  });

  it('handles large numbers', () => {
    expect(formatTime(3600)).toBe('60:00');
  });
});

