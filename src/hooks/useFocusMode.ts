import { useEffect } from 'react';
import { useSettingsStore } from '../store/useSettingsStore';

export const useFocusMode = () => {
  const isFocusMode = useSettingsStore(state => state.isFocusMode);

  useEffect(() => {
    // Fullscreen API requires a user gesture. This effect only handles exit.
    // Entry should be triggered by explicit user action (e.g., button click).
    const handleFocusChange = async () => {
      try {
        if (!isFocusMode && document.fullscreenElement) {
          await document.exitFullscreen();
        }
        // Note: Entering fullscreen requires a user gesture, so we don't attempt it here.
        // The toggle should be connected to a button click handler.
      } catch (error) {
        // Log error for debugging but don't crash the app
        console.warn('Fullscreen API error:', error);
      }
    };

    handleFocusChange();
  }, [isFocusMode]);
};

