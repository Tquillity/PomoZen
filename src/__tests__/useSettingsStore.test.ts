import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useSettingsStore } from '../store/useSettingsStore';

// Mock Notification API
const mockNotification = {
  requestPermission: vi.fn(() => Promise.resolve('granted')),
  permission: 'default'
};

Object.defineProperty(window, 'Notification', {
  writable: true,
  configurable: true,
  value: mockNotification
});

describe('useSettingsStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useSettingsStore.setState({
      durations: { pomodoro: 25, short: 5, long: 15 },
      themeColors: { pomodoro: '#c15c5c', short: '#52a89a', long: '#2c5578' },
      autoStart: false,
      soundEnabled: true,
      isFocusMode: false,
      zenModeEnabled: false,
      zenTrack: 'rain',
      zenVolume: 0.5,
      zenStrategy: 'always',
      presets: [],
      isAudioUnlocked: false,
      notificationsEnabled: false
    });
  });

  describe('updateDuration', () => {
    it('should update duration for a mode', () => {
      const { updateDuration } = useSettingsStore.getState();
      updateDuration('pomodoro', 30);
      
      expect(useSettingsStore.getState().durations.pomodoro).toBe(30);
    });

    it('should update duration even if value is out of range (UI clamps values)', () => {
      const { updateDuration } = useSettingsStore.getState();
      
      updateDuration('pomodoro', 100);
      expect(useSettingsStore.getState().durations.pomodoro).toBe(100);
    });
  });

  describe('setThemeColor', () => {
    it('should update theme color for a mode', () => {
      const { setThemeColor } = useSettingsStore.getState();
      setThemeColor('pomodoro', '#ff0000');
      
      expect(useSettingsStore.getState().themeColors.pomodoro).toBe('#ff0000');
    });
  });

  describe('resetThemeColors', () => {
    it('should reset to default theme colors', () => {
      useSettingsStore.setState({
        themeColors: { pomodoro: '#ff0000', short: '#00ff00', long: '#0000ff' }
      });
      
      const { resetThemeColors } = useSettingsStore.getState();
      resetThemeColors();
      
      expect(useSettingsStore.getState().themeColors).toEqual({
        pomodoro: '#c15c5c',
        short: '#52a89a',
        long: '#2c5578'
      });
    });
  });

  describe('toggles', () => {
    it('should toggle autoStart', () => {
      const { toggleAutoStart } = useSettingsStore.getState();
      toggleAutoStart();
      
      expect(useSettingsStore.getState().autoStart).toBe(true);
    });

    it('should toggle soundEnabled', () => {
      const { toggleSound } = useSettingsStore.getState();
      toggleSound();
      
      expect(useSettingsStore.getState().soundEnabled).toBe(false);
    });

    it('should toggle focusMode', () => {
      const { toggleFocusMode } = useSettingsStore.getState();
      toggleFocusMode();
      
      expect(useSettingsStore.getState().isFocusMode).toBe(true);
    });

    it('should toggle zenMode', () => {
      const { toggleZenMode } = useSettingsStore.getState();
      toggleZenMode();
      
      expect(useSettingsStore.getState().zenModeEnabled).toBe(true);
    });
  });

  describe('zen settings', () => {
    it('should set zen track', () => {
      const { setZenTrack } = useSettingsStore.getState();
      setZenTrack('forest');
      
      expect(useSettingsStore.getState().zenTrack).toBe('forest');
    });

    it('should set zen volume', () => {
      const { setZenVolume } = useSettingsStore.getState();
      setZenVolume(0.8);
      
      expect(useSettingsStore.getState().zenVolume).toBe(0.8);
    });

    it('should set zen strategy', () => {
      const { setZenStrategy } = useSettingsStore.getState();
      setZenStrategy('break_only');
      
      expect(useSettingsStore.getState().zenStrategy).toBe('break_only');
    });
  });

  describe('presets', () => {
    it('should add a preset', () => {
      const { addPreset } = useSettingsStore.getState();
      addPreset('My Preset');
      
      const presets = useSettingsStore.getState().presets;
      expect(presets).toHaveLength(1);
      expect(presets[0].name).toBe('My Preset');
      expect(presets[0].id).toBeDefined();
    });

    it('should delete a preset', () => {
      const { addPreset, deletePreset } = useSettingsStore.getState();
      addPreset('Preset 1');
      const presetId = useSettingsStore.getState().presets[0].id;
      
      deletePreset(presetId);
      
      expect(useSettingsStore.getState().presets).toHaveLength(0);
    });

    it('should load a preset', () => {
      const { addPreset, loadPreset } = useSettingsStore.getState();
      addPreset('My Preset');
      const presetId = useSettingsStore.getState().presets[0].id;
      
      // Change settings
      useSettingsStore.setState({ durations: { pomodoro: 30, short: 10, long: 20 } });
      
      loadPreset(presetId);
      
      const state = useSettingsStore.getState();
      expect(state.durations.pomodoro).toBe(25); // Should be restored from preset
    });
  });

  describe('loadFactoryDefaults', () => {
    it('should reset to factory defaults', () => {
      useSettingsStore.setState({
        durations: { pomodoro: 30, short: 10, long: 20 },
        themeColors: { pomodoro: '#ff0000', short: '#00ff00', long: '#0000ff' },
        zenTrack: 'forest',
        zenVolume: 0.8,
        zenStrategy: 'break_only',
        autoStart: true,
        soundEnabled: false,
        zenModeEnabled: true
      });
      
      const { loadFactoryDefaults } = useSettingsStore.getState();
      loadFactoryDefaults();
      
      const state = useSettingsStore.getState();
      expect(state.durations).toEqual({ pomodoro: 25, short: 5, long: 15 });
      expect(state.themeColors).toEqual({
        pomodoro: '#c15c5c',
        short: '#52a89a',
        long: '#2c5578'
      });
      expect(state.zenTrack).toBe('rain');
      expect(state.zenVolume).toBe(0.5);
      expect(state.zenStrategy).toBe('always');
      expect(state.autoStart).toBe(false);
      expect(state.soundEnabled).toBe(true);
      expect(state.zenModeEnabled).toBe(false);
    });
  });

  describe('toggleNotifications', () => {
    it('should request permission if not set', async () => {
      mockNotification.permission = 'default';
      const { toggleNotifications } = useSettingsStore.getState();
      
      await toggleNotifications();
      
      expect(mockNotification.requestPermission).toHaveBeenCalled();
    });

    it('should disable if permission is denied', () => {
      mockNotification.permission = 'denied';
      const { toggleNotifications } = useSettingsStore.getState();
      
      toggleNotifications();
      
      expect(useSettingsStore.getState().notificationsEnabled).toBe(false);
    });

    it('should handle missing Notification API', () => {
      const originalNotification = window.Notification;
      // @ts-expect-error - testing missing API
      delete window.Notification;
      
      const { toggleNotifications } = useSettingsStore.getState();
      toggleNotifications();
      
      expect(useSettingsStore.getState().notificationsEnabled).toBe(false);
      
      window.Notification = originalNotification;
    });
  });

  describe('unlockAudio', () => {
    it('should unlock audio', () => {
      const { unlockAudio } = useSettingsStore.getState();
      unlockAudio();
      
      expect(useSettingsStore.getState().isAudioUnlocked).toBe(true);
    });
  });
});
