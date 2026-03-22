import { describe, expect, it } from 'vitest';
import {
  getCurrentCycleLabel,
  getCurrentScheduleStep,
  getNextCycleLabel,
  getScheduledBreakMode,
} from '../utils/timerSchedule';

describe('timerSchedule', () => {
  it('maps cycle steps across a full pomodoro set', () => {
    expect(getCurrentScheduleStep('pomodoro', 0)).toBe(0);
    expect(getCurrentScheduleStep('short', 1)).toBe(1);
    expect(getCurrentScheduleStep('pomodoro', 1)).toBe(2);
    expect(getCurrentScheduleStep('short', 2)).toBe(3);
    expect(getCurrentScheduleStep('pomodoro', 2)).toBe(4);
    expect(getCurrentScheduleStep('short', 3)).toBe(5);
    expect(getCurrentScheduleStep('pomodoro', 3)).toBe(6);
    expect(getCurrentScheduleStep('long', 4)).toBe(7);
  });

  it('keeps manual break overrides aligned to the same schedule slot', () => {
    expect(getCurrentScheduleStep('long', 1)).toBe(1);
    expect(getCurrentScheduleStep('short', 4)).toBe(7);
  });

  it('schedules a long break every fourth pomodoro', () => {
    expect(getScheduledBreakMode(0)).toBe('short');
    expect(getScheduledBreakMode(1)).toBe('short');
    expect(getScheduledBreakMode(2)).toBe('short');
    expect(getScheduledBreakMode(3)).toBe('long');
  });

  it('describes the current and next cycle states', () => {
    expect(getCurrentCycleLabel('pomodoro', 0)).toBe('Pomodoro 1 of 4');
    expect(getCurrentCycleLabel('long', 4)).toBe('Long break');
    expect(getNextCycleLabel('pomodoro', 3)).toBe('Long break');
    expect(getNextCycleLabel('long', 4)).toBe('Pomodoro 1 of 4');
  });
});
