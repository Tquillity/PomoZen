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
    const audio = new Audio();
    audio.loop = true;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  // Handle Track & Playback changes
  useEffect(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;

    // Only update source if it changed to avoid restarting track
    if (!audio.src.includes(TRACKS[zenTrack])) {
        audio.src = TRACKS[zenTrack];
    }

    const shouldPlay = isAudioUnlocked && zenModeEnabled && (
        zenStrategy === 'always' ||
        (zenStrategy === 'break_only' && mode !== 'pomodoro')
    );

    if (shouldPlay) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
            if (error.name === 'NotSupportedError') {
                console.warn('PomoZen Audio Error: Missing audio file. Please run "node scripts/generate-audio.js" or check public/sounds/');
            } else if (error.name !== 'NotAllowedError') {
                // Ignore NotAllowedError as AudioUnlocker handles it, log others
                console.error("Zen play failed:", error);
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