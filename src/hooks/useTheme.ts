import { useEffect } from 'react';
import { useTimeStore } from '../store/useTimeStore';
import { useSettingsStore } from '../store/useSettingsStore';

export const useTheme = () => {
  const { mode } = useTimeStore();
  const themeColors = useSettingsStore((state) => state.themeColors);

  // Handle Colors
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
};
