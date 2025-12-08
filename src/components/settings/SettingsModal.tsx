import { useEffect } from 'react';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useTimeStore } from '../../store/useTimeStore';
import { cn } from '../../utils/cn';
import type { TimerMode } from '../../types';
import type { ZenTrack } from '../../store/useSettingsStore';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const { 
    durations, 
    autoStart, 
    soundEnabled, 
    zenModeEnabled,
    zenTrack,
    zenVolume,
    updateDuration, 
    toggleAutoStart, 
    toggleSound,
    toggleZenMode,
    setZenTrack,
    setZenVolume
  } = useSettingsStore();

  const resetTimer = useTimeStore(state => state.resetTimer);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleDurationChange = (mode: TimerMode, value: number) => {
    const minutes = Math.min(60, Math.max(1, value));
    updateDuration(mode, minutes);
    resetTimer();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 text-gray-800 max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-label="Settings"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 cursor-pointer"
            aria-label="Close Settings"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* Timer Durations */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-500 uppercase text-xs tracking-wider">Timer (Minutes)</h3>
            <div className="grid grid-cols-3 gap-4">
              {(['pomodoro', 'short', 'long'] as TimerMode[]).map((mode) => (
                <div key={mode} className="flex flex-col">
                  <label className="text-sm text-gray-600 capitalize mb-1">{mode}</label>
                  <input 
                    type="number" 
                    value={durations[mode]} 
                    onChange={(e) => handleDurationChange(mode, parseInt(e.target.value) || 0)}
                    className="border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    min="1" 
                    max="60"
                  />
                </div>
              ))}
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Toggles */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="font-medium text-gray-700">Auto-start Breaks</label>
              <button 
                onClick={toggleAutoStart}
                className={cn(
                  "w-12 h-6 rounded-full transition-colors relative cursor-pointer",
                  autoStart ? "bg-green-500" : "bg-gray-300"
                )}
                aria-pressed={autoStart}
                aria-label="Toggle Auto-start"
              >
                <div className={cn(
                  "w-4 h-4 bg-white rounded-full absolute top-1 transition-transform",
                  autoStart ? "left-7" : "left-1"
                )} />
              </button>
            </div>

            <div className="flex justify-between items-center">
              <label className="font-medium text-gray-700">Sound Effects</label>
              <button 
                onClick={toggleSound}
                className={cn(
                  "w-12 h-6 rounded-full transition-colors relative cursor-pointer",
                  soundEnabled ? "bg-green-500" : "bg-gray-300"
                )}
                aria-pressed={soundEnabled}
                aria-label="Toggle Sound"
              >
                <div className={cn(
                  "w-4 h-4 bg-white rounded-full absolute top-1 transition-transform",
                  soundEnabled ? "left-7" : "left-1"
                )} />
              </button>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Zen Mode */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-500 uppercase text-xs tracking-wider">Zen Mode</h3>
            
            <div className="flex justify-between items-center">
              <label className="font-medium text-gray-700">Background Audio</label>
              <button 
                onClick={toggleZenMode}
                className={cn(
                  "w-12 h-6 rounded-full transition-colors relative cursor-pointer",
                  zenModeEnabled ? "bg-green-500" : "bg-gray-300"
                )}
                aria-pressed={zenModeEnabled}
                aria-label="Toggle Zen Mode"
              >
                <div className={cn(
                  "w-4 h-4 bg-white rounded-full absolute top-1 transition-transform",
                  zenModeEnabled ? "left-7" : "left-1"
                )} />
              </button>
            </div>

            {zenModeEnabled && (
              <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-gray-600">Soundscape</label>
                  <select 
                    value={zenTrack} 
                    onChange={(e) => setZenTrack(e.target.value as ZenTrack)}
                    className="border border-gray-300 rounded p-2 bg-white"
                  >
                    <option value="rain">Heavy Rain</option>
                    <option value="forest">Forest Morning</option>
                    <option value="white_noise">White Noise</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm text-gray-600">Volume</label>
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.05"
                    value={zenVolume}
                    onChange={(e) => setZenVolume(parseFloat(e.target.value))}
                    className="w-full accent-green-500"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
