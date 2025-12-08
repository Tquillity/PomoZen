import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TimerMode } from '../types';

export type ZenTrack = 'rain' | 'white_noise' | 'forest';

interface SettingsState {
  durations: Record<TimerMode, number>;
  autoStart: boolean;
  soundEnabled: boolean;
  isFocusMode: boolean;
  
  // Zen Mode
  zenModeEnabled: boolean;
  zenTrack: ZenTrack;
  zenVolume: number; // 0 to 1
  
  updateDuration: (mode: TimerMode, minutes: number) => void;
  toggleAutoStart: () => void;
  toggleSound: () => void;
  toggleFocusMode: () => void;
  
  toggleZenMode: () => void;
  setZenTrack: (track: ZenTrack) => void;
  setZenVolume: (volume: number) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      durations: { pomodoro: 25, short: 5, long: 15 },
      autoStart: false,
      soundEnabled: true,
      isFocusMode: false,
      
      zenModeEnabled: false,
      zenTrack: 'rain',
      zenVolume: 0.5,

      updateDuration: (mode, minutes) => set((state) => ({
        durations: { ...state.durations, [mode]: minutes }
      })),
      toggleAutoStart: () => set((state) => ({ autoStart: !state.autoStart })),
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
      toggleFocusMode: () => set((state) => ({ isFocusMode: !state.isFocusMode })),
      
      toggleZenMode: () => set((state) => ({ zenModeEnabled: !state.zenModeEnabled })),
      setZenTrack: (track) => set({ zenTrack: track }),
      setZenVolume: (volume) => set({ zenVolume: volume }),
    }),
    { 
      name: 'pomo-settings-storage',
      partialize: (state) => ({ 
        durations: state.durations, 
        autoStart: state.autoStart, 
        soundEnabled: state.soundEnabled,
        zenModeEnabled: state.zenModeEnabled,
        zenTrack: state.zenTrack,
        zenVolume: state.zenVolume
      }), // Don't persist Focus Mode
    }
  )
);
