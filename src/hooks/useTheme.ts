import { useEffect } from 'react';
import { useTimeStore } from '../store/useTimeStore';
import type { TimerMode } from '../types';

// HSL values for the themes
const THEMES: Record<TimerMode, { primary: string; secondary: string }> = {
  pomodoro: { primary: '#c15c5c', secondary: '#d96d6d' }, // softer warm red – motivating urgency without bright-red anxiety
  short: { primary: '#52a89a', secondary: '#6ab8ad' },     // refreshing mint-teal/green – fastest stress recovery
  long: { primary: '#2c5578', secondary: '#416a9b' },     // deep serene indigo-blue – maximum restoration & clarity
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

