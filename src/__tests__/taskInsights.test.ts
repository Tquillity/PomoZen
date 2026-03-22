import { describe, expect, it } from 'vitest';
import {
  getTaskPlanningSummary,
  getTaskStatusLabel,
  getTaskVariance,
} from '../utils/taskInsights';

describe('taskInsights', () => {
  const tasks = [
    {
      id: '1',
      title: 'Outline article',
      completed: false,
      estPomodoros: 2,
      actPomodoros: 1,
    },
    {
      id: '2',
      title: 'Ship feature',
      completed: true,
      estPomodoros: 3,
      actPomodoros: 4,
    },
  ];

  it('builds a planning summary from current tasks', () => {
    const summary = getTaskPlanningSummary(tasks);

    expect(summary.totalEstimated).toBe(5);
    expect(summary.totalActual).toBe(5);
    expect(summary.planningAccuracy).toBe(100);
    expect(summary.variance).toBe(0);
  });

  it('reports task variance and status labels', () => {
    expect(getTaskVariance(tasks[0])).toBe(-1);
    expect(getTaskStatusLabel(tasks[0])).toBe('1 left');
    expect(getTaskStatusLabel(tasks[1])).toBe('+1 over');
  });
});
