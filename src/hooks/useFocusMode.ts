import { useEffect } from 'react';
import { useSettingsStore } from '../store/useSettingsStore';

export const useFocusMode = () => {
  const isFocusMode = useSettingsStore(state => state.isFocusMode);

  useEffect(() => {
    const handleFocusChange = async () => {
      try {
        if (isFocusMode) {
          if (!document.fullscreenElement) {
            await document.documentElement.requestFullscreen();
          }
        } else {
          if (document.fullscreenElement) {
            await document.exitFullscreen();
          }
        }
      } catch {
        // Silently handle fullscreen API errors
      }
    };

    handleFocusChange();
  }, [isFocusMode]);
};

