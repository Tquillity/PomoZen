import { useEffect, useRef } from 'react';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useTimeStore } from '../../store/useTimeStore';
import type { ZenTrack } from '../../store/useSettingsStore';

const TRACKS: Record<ZenTrack, string> = {
  rain: '/sounds/rain.mp3',
  forest: '/sounds/forest.mp3',
  white_noise: '/sounds/white_noise.mp3'
};

export const ZenPlayer = () => {
  const { zenModeEnabled, zenTrack, zenVolume, zenStrategy, isAudioUnlocked } = useSettingsStore();
  const mode = useTimeStore(state => state.mode);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio();
    audio.loop = true;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
      audio.load();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const targetSrc = TRACKS[zenTrack];

    if (!audio.src || !audio.src.endsWith(targetSrc)) {
        audio.src = targetSrc;
        audio.load();
    }

    const shouldPlay = isAudioUnlocked && zenModeEnabled && (
        zenStrategy === 'always' ||
        (zenStrategy === 'break_only' && mode !== 'pomodoro')
    );

    if (shouldPlay) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    } else {
      audio.pause();
    }
  }, [zenModeEnabled, zenTrack, zenStrategy, mode, isAudioUnlocked]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = zenVolume;
    }
  }, [zenVolume]);

  return null;
};