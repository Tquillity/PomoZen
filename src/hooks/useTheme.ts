import { useEffect } from 'react';
import { useTimeStore } from '../store/useTimeStore';
import { useSettingsStore } from '../store/useSettingsStore';

export const useTheme = () => {
  const { mode } = useTimeStore();
  const themeColors = useSettingsStore((state) => state.themeColors);

  useEffect(() => {
    const primaryColor = themeColors[mode];
    const root = document.documentElement;
    
    root.style.setProperty('--theme-primary', primaryColor);
    root.style.setProperty('--theme-secondary', `color-mix(in srgb, ${primaryColor}, white 20%)`);
    root.style.setProperty('--theme-bg', primaryColor); 
  }, [mode, themeColors]);
};
