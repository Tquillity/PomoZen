import { useEffect, useRef } from 'react';
import { useSettingsStore } from '../../store/useSettingsStore';
import type { ZenTrack } from '../../store/useSettingsStore';

const TRACKS: Record<ZenTrack, string> = {
  rain: 'https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg',
  forest: 'https://actions.google.com/sounds/v1/ambiences/forest_morning.ogg',
  white_noise: 'https://actions.google.com/sounds/v1/ambiences/industrial_hum.ogg'
};

export const ZenPlayer = () => {
  const { zenModeEnabled, zenTrack, zenVolume } = useSettingsStore();
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

    if (zenModeEnabled) {
      audio.play().catch(e => console.error("Zen play failed:", e));
    } else {
      audio.pause();
    }
  }, [zenModeEnabled, zenTrack]);

  // Handle Volume changes independently
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = zenVolume;
    }
  }, [zenVolume]);

  return null; // Invisible component
};
