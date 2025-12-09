import { useEffect, useRef } from 'react';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useTimeStore } from '../../store/useTimeStore';
import type { ZenTrack } from '../../store/useSettingsStore';

// Using Google's official ambient sounds (Reliable, Hotlink-friendly)
// FOR OFFLINE SUPPORT: Download these files to /public/sounds/ and change paths to '/sounds/rain.mp3' etc.
const TRACKS: Record<ZenTrack, string> = {
  rain: 'https://www.gstatic.com/voice_delight/sounds/long/rain.mp3',
  forest: 'https://www.gstatic.com/voice_delight/sounds/long/forest.mp3',
  white_noise: 'https://www.gstatic.com/voice_delight/sounds/long/pink_noise.mp3' // Google uses pink noise (better for focus)
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
      audio.play().catch(e => console.error("Zen play failed:", e));
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