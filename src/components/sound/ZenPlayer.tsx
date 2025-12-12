import { useEffect, useRef } from 'react';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useTimeStore } from '../../store/useTimeStore';
import type { ZenTrack } from '../../store/useSettingsStore';

// Local assets (Offline-ready & CORB-free)
const TRACKS: Record<ZenTrack, string> = {
  rain: '/sounds/rain.mp3',
  forest: '/sounds/forest.mp3',
  white_noise: '/sounds/white_noise.mp3'
};

export const ZenPlayer = () => {
  const { zenModeEnabled, zenTrack, zenVolume, zenStrategy, isAudioUnlocked } = useSettingsStore();
  const mode = useTimeStore(state => state.mode);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Create audio element on mount
  useEffect(() => {
    // Initialize
    const audio = new Audio();
    audio.loop = true;
    audioRef.current = audio;

    return () => {
      // Robust cleanup
      audio.pause();
      audio.src = '';
      audio.load(); // Hints to browser to release memory buffer
      audioRef.current = null;
    };
  }, []);

  // Handle Track & Playback changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const targetSrc = TRACKS[zenTrack];

    // Check if src actually needs changing to prevent audio gaps
    // We use endsWith to safely compare relative vs absolute URLs
    if (!audio.src || !audio.src.endsWith(targetSrc)) {
        audio.src = targetSrc;
        // Preload immediately when track changes
        audio.load();
    }

    const shouldPlay = isAudioUnlocked && zenModeEnabled && (
        zenStrategy === 'always' ||
        (zenStrategy === 'break_only' && mode !== 'pomodoro')
    );

    if (shouldPlay) {
      // Prevent "The play() request was interrupted" errors
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
            // Only log if it's not the user-interaction error (handled by Unlocker)
            if (error.name !== 'NotAllowedError') {
                console.warn("Zen playback issue:", error);
            }
        });
      }
    } else {
      audio.pause();
    }
  }, [zenModeEnabled, zenTrack, zenStrategy, mode, isAudioUnlocked]);

  // Handle Volume changes independently
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = zenVolume;
    }
  }, [zenVolume]);

  return null; // Invisible component
};