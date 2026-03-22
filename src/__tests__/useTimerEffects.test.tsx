import { describe, it, expect, beforeEach, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useTimerEffects } from '../hooks/useTimerEffects';
import { useSettingsStore } from '../store/useSettingsStore';
import { playAlarm, sendNotification } from '../services/sound.service';
vi.mock('../services/sound.service');

import { useTimeStore } from '../store/useTimeStore';
import { events } from '../services/event.service';

describe('useTimerEffects', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useSettingsStore.setState({ soundEnabled: false, notificationsEnabled: false });
    useTimeStore.setState({ timeLeft: 1500, mode: 'pomodoro', pomodorosCompleted: 0 });
  });

  it('should play alarm when timer completes and sound is enabled', () => {
    useSettingsStore.setState({ soundEnabled: true, notificationsEnabled: false });

    renderHook(() => useTimerEffects());

    act(() => {
      events.emit('timer:complete', 'pomodoro');
    });

    expect(playAlarm).toHaveBeenCalled();
  });

  it('should not play alarm when sound is disabled', () => {
    useSettingsStore.setState({ soundEnabled: false, notificationsEnabled: false });

    renderHook(() => useTimerEffects());

    act(() => {
      events.emit('timer:complete', 'pomodoro');
    });

    expect(playAlarm).not.toHaveBeenCalled();
  });

  it('should send a short break notification after a standard pomodoro', () => {
    useSettingsStore.setState({ soundEnabled: false, notificationsEnabled: true });

    renderHook(() => useTimerEffects());

    act(() => {
      events.emit('timer:complete', 'pomodoro');
    });

    expect(sendNotification).toHaveBeenCalledWith(
      'Break Time!',
      'Great job! Take a short break.'
    );
  });

  it('should send a long break notification after the fourth pomodoro', () => {
    useTimeStore.setState({ pomodorosCompleted: 3 });
    useSettingsStore.setState({ soundEnabled: false, notificationsEnabled: true });

    renderHook(() => useTimerEffects());

    act(() => {
      events.emit('timer:complete', 'pomodoro');
    });

    expect(sendNotification).toHaveBeenCalledWith(
      'Break Time!',
      'Great job! Take a long break.'
    );
  });

  it('should send different notification for break completion', () => {
    useSettingsStore.setState({ soundEnabled: false, notificationsEnabled: true });

    renderHook(() => useTimerEffects());

    act(() => {
      events.emit('timer:complete', 'short');
    });

    expect(sendNotification).toHaveBeenCalledWith(
      'Back to Work!',
      'Break is over. Let\'s focus.'
    );
  });

  it('should not trigger effects after the hook unmounts', () => {
    useSettingsStore.setState({ soundEnabled: true, notificationsEnabled: false });
    const { unmount } = renderHook(() => useTimerEffects());

    unmount();

    act(() => {
      events.emit('timer:complete', 'pomodoro');
    });

    expect(playAlarm).not.toHaveBeenCalled();
  });
});
