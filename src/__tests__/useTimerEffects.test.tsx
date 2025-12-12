import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useTimerEffects } from '../hooks/useTimerEffects';
import { useSettingsStore } from '../store/useSettingsStore';
import { playAlarm, sendNotification } from '../services/sound.service';

vi.mock('../services/sound.service');
import { useTimeStore } from '../store/useTimeStore';

describe('useTimerEffects', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useSettingsStore.setState({ soundEnabled: false, notificationsEnabled: false });
    useTimeStore.setState({ timeLeft: 10, mode: 'pomodoro' });
  });

  it('should play alarm when timer completes and sound is enabled', () => {
    useTimeStore.setState({ timeLeft: 0, mode: 'pomodoro' });
    useSettingsStore.setState({ soundEnabled: true, notificationsEnabled: false });

    renderHook(() => useTimerEffects());

    expect(playAlarm).toHaveBeenCalled();
  });

  it('should not play alarm when sound is disabled', () => {
    useTimeStore.setState({ timeLeft: 0, mode: 'pomodoro' });
    useSettingsStore.setState({ soundEnabled: false, notificationsEnabled: false });

    renderHook(() => useTimerEffects());

    expect(playAlarm).not.toHaveBeenCalled();
  });

  it('should send notification when timer completes and notifications enabled', () => {
    useTimeStore.setState({ timeLeft: 0, mode: 'pomodoro' });
    useSettingsStore.setState({ soundEnabled: false, notificationsEnabled: true });

    renderHook(() => useTimerEffects());

    expect(sendNotification).toHaveBeenCalledWith(
      'Break Time!',
      'Great job! Take a short break.'
    );
  });

  it('should send different notification for break completion', () => {
    useTimeStore.setState({ timeLeft: 0, mode: 'short' });
    useSettingsStore.setState({ soundEnabled: false, notificationsEnabled: true });

    renderHook(() => useTimerEffects());

    expect(sendNotification).toHaveBeenCalledWith(
      'Back to Work!',
      'Break is over. Let\'s focus.'
    );
  });

  it('should reset completion handler when timer restarts', () => {
    const { rerender } = renderHook(() => useTimerEffects());
    
    // Set to complete
    useTimeStore.setState({ timeLeft: 0, mode: 'pomodoro' });
    useSettingsStore.setState({ soundEnabled: true, notificationsEnabled: false });
    
    rerender();
    vi.clearAllMocks();
    
    // Timer restarts
    useTimeStore.setState({ timeLeft: 10, mode: 'pomodoro' });
    
    rerender();
    
    // Complete again
    useTimeStore.setState({ timeLeft: 0, mode: 'pomodoro' });
    
    rerender();
    
    expect(playAlarm).toHaveBeenCalled();
  });
});
