import { useEffect } from 'react';
import { useTimeStore } from '../store/useTimeStore';
import type { TimerMode } from '../types';

// HSL values for the themes
const THEMES: Record<TimerMode, { primary: string; secondary: string }> = {
  pomodoro: { primary: '#ba4949', secondary: '#c15c5c' },
  short: { primary: '#38858a', secondary: '#4c9196' },
  long: { primary: '#397097', secondary: '#4d7fa2' },
};

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

export const useTheme = () => {
  const { mode, timeLeft, isRunning } = useTimeStore();

  // 1. Handle Colors
  useEffect(() => {
    const theme = THEMES[mode];
    const root = document.documentElement;
    
    // Set CSS variables for Tailwind to consume
    root.style.setProperty('--theme-primary', theme.primary);
    root.style.setProperty('--theme-secondary', theme.secondary);
    // Darker variant for backgrounds
    root.style.setProperty('--theme-bg', theme.primary); 
  }, [mode]);

  // 2. Handle Title
  useEffect(() => {
    const timeString = formatTime(timeLeft);
    const status = isRunning ? 'Focusing' : 'Paused';
    document.title = `${timeString} - ${status}`;
  }, [timeLeft, isRunning]);
};

