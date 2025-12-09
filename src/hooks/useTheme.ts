import { useEffect } from 'react';
import { useTimeStore } from '../store/useTimeStore';
import { useSettingsStore } from '../store/useSettingsStore';

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

export const useTheme = () => {
  const { mode, timeLeft, isRunning } = useTimeStore();
  const themeColors = useSettingsStore((state) => state.themeColors);

  // 1. Handle Colors
  useEffect(() => {
    const primaryColor = themeColors[mode];
    const root = document.documentElement;
    
    // Set CSS variables for Tailwind to consume
    root.style.setProperty('--theme-primary', primaryColor);
    // Calculated Secondary: Lighten/saturate the user's chosen color
    root.style.setProperty('--theme-secondary', `color-mix(in srgb, ${primaryColor}, white 20%)`);
    // Darker variant for backgrounds
    root.style.setProperty('--theme-bg', primaryColor); 
  }, [mode, themeColors]);

  // 2. Handle Title
  useEffect(() => {
    const timeString = formatTime(timeLeft);
    const status = isRunning ? 'Focusing' : 'Paused';
    document.title = `${timeString} - ${status}`;
  }, [timeLeft, isRunning]);
};
