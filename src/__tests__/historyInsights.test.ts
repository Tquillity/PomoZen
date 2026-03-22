import { describe, expect, it } from 'vitest';
import {
  getCurrentStreak,
  getDailyGoalProgress,
  getGoalHitRate,
} from '../utils/historyInsights';

describe('historyInsights', () => {
  const history = {
    '2026-03-20': { pomodoro: 4, short: 3, long: 0 },
    '2026-03-21': { pomodoro: 6, short: 3, long: 1 },
    '2026-03-22': { pomodoro: 2, short: 1, long: 0 },
  };

  it('calculates daily goal progress for today', () => {
    const progress = getDailyGoalProgress(
      history,
      5,
      new Date('2026-03-22T12:00:00Z').getTime()
    );

    expect(progress.completed).toBe(2);
    expect(progress.remaining).toBe(3);
    expect(progress.percent).toBe(40);
    expect(progress.met).toBe(false);
  });

  it('counts a focus streak and carries it forward when today has not started yet', () => {
    const streak = getCurrentStreak(
      history,
      3,
      new Date('2026-03-22T12:00:00Z').getTime()
    );

    expect(streak.count).toBe(2);
    expect(streak.includesToday).toBe(false);
  });

  it('calculates goal hit rate across recorded days', () => {
    expect(getGoalHitRate(history, 4)).toBe(67);
  });
});
