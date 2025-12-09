import { useEffect } from 'react';
import { useSettingsStore } from '../../store/useSettingsStore';

export const AudioUnlocker = () => {
  const unlockAudio = useSettingsStore(state => state.unlockAudio);
  const isAudioUnlocked = useSettingsStore(state => state.isAudioUnlocked);

  useEffect(() => {
    // If already unlocked, don't set up listeners
    if (isAudioUnlocked) return;

    const handleInteraction = () => {
      unlockAudio();
      // Remove listeners once unlocked
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };

    window.addEventListener('click', handleInteraction);
    window.addEventListener('keydown', handleInteraction);

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
  }, [unlockAudio, isAudioUnlocked]);

  return null;
};
