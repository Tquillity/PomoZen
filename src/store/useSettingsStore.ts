import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TimerMode } from '../types';

export type ZenTrack = 'rain' | 'white_noise' | 'forest';

interface SettingsState {
  durations: Record<TimerMode, number>;
  themeColors: Record<TimerMode, string>;
  autoStart: boolean;
  soundEnabled: boolean;
  isFocusMode: boolean;
  
  // Zen Mode
  zenModeEnabled: boolean;
  zenTrack: ZenTrack;
  zenVolume: number; // 0 to 1
  zenStrategy: 'always' | 'break_only';

  // Presets
  savedPreset: {
    durations: Record<TimerMode, number>;
    themeColors: Record<TimerMode, string>;
    zenTrack: ZenTrack;
    zenVolume: number;
    zenStrategy: 'always' | 'break_only';
  } | null;
  
  updateDuration: (mode: TimerMode, minutes: number) => void;
  setThemeColor: (mode: TimerMode, color: string) => void;
  resetThemeColors: () => void;
  toggleAutoStart: () => void;
  toggleSound: () => void;
  toggleFocusMode: () => void;
  
  toggleZenMode: () => void;
  setZenTrack: (track: ZenTrack) => void;
  setZenVolume: (volume: number) => void;
  setZenStrategy: (strategy: 'always' | 'break_only') => void;

  savePreset: () => void;
  loadPreset: () => void;
  loadFactoryDefaults: () => void;
}

const DEFAULT_THEME_COLORS = {
  pomodoro: '#c15c5c',
  short: '#52a89a',
  long: '#2c5578',
};

const DEFAULT_DURATIONS = { pomodoro: 25, short: 5, long: 15 };

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      durations: DEFAULT_DURATIONS,
      themeColors: DEFAULT_THEME_COLORS,
      autoStart: false,
      soundEnabled: true,
      isFocusMode: false,
      
      zenModeEnabled: false,
      zenTrack: 'rain',
      zenVolume: 0.5,
      zenStrategy: 'always',
      savedPreset: null,

      updateDuration: (mode, minutes) => set((state) => ({
        durations: { ...state.durations, [mode]: minutes }
      })),
      setThemeColor: (mode, color) => set((state) => ({
        themeColors: { ...state.themeColors, [mode]: color }
      })),
      resetThemeColors: () => set({ themeColors: DEFAULT_THEME_COLORS }),
      
      toggleAutoStart: () => set((state) => ({ autoStart: !state.autoStart })),
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
      toggleFocusMode: () => set((state) => ({ isFocusMode: !state.isFocusMode })),
      
      toggleZenMode: () => set((state) => ({ zenModeEnabled: !state.zenModeEnabled })),
      setZenTrack: (track) => set({ zenTrack: track }),
      setZenVolume: (volume) => set({ zenVolume: volume }),
      setZenStrategy: (strategy) => set({ zenStrategy: strategy }),

      savePreset: () => {
        const { durations, themeColors, zenTrack, zenVolume, zenStrategy } = get();
        set({ savedPreset: { durations, themeColors, zenTrack, zenVolume, zenStrategy } });
      },
      loadPreset: () => {
        const { savedPreset } = get();
        if (savedPreset) {
            set({
                durations: savedPreset.durations,
                themeColors: savedPreset.themeColors,
                zenTrack: savedPreset.zenTrack,
                zenVolume: savedPreset.zenVolume,
                zenStrategy: savedPreset.zenStrategy
            });
        }
      },
      loadFactoryDefaults: () => {
          set({
              durations: DEFAULT_DURATIONS,
              themeColors: DEFAULT_THEME_COLORS,
              zenTrack: 'rain',
              zenVolume: 0.5,
              zenStrategy: 'always',
              autoStart: false,
              soundEnabled: true,
              zenModeEnabled: false
          });
      }
    }),
    { 
      name: 'pomo-settings-storage',
      version: 3,
      partialize: (state) => ({ 
        durations: state.durations, 
        themeColors: state.themeColors,
        autoStart: state.autoStart, 
        soundEnabled: state.soundEnabled,
        zenModeEnabled: state.zenModeEnabled,
        zenTrack: state.zenTrack,
        zenVolume: state.zenVolume,
        zenStrategy: state.zenStrategy,
        savedPreset: state.savedPreset
      }),
      migrate: (persistedState: any, version) => {
          if (version < 3) {
              return {
                  ...persistedState,
                  zenStrategy: 'always',
                  savedPreset: null
              };
          }
          return persistedState;
      }
    }
  )
);
