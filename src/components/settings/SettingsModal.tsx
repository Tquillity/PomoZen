import { useSettingsStore } from '../../store/useSettingsStore';
import type { ZenTrack } from '../../store/useSettingsStore';
import { useTimeStore } from '../../store/useTimeStore';
import { cn } from '../../utils/cn';
import type { TimerMode } from '../../types';
import { Modal } from '../common/Modal';

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

  const handleDurationChange = (mode: TimerMode, value: number) => {
    const minutes = Math.min(60, Math.max(1, value));
    updateDuration(mode, minutes);
    resetTimer();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Settings">
        <div className="space-y-6">
          {/* Timer Durations */}
          <div className="space-y-3">
            <h3 className="font-semibold text-white/80 uppercase text-xs tracking-wider">Timer (Minutes)</h3>
            <div className="grid grid-cols-3 gap-4">
              {(['pomodoro', 'short', 'long'] as TimerMode[]).map((mode) => (
                <div key={mode} className="flex flex-col">
                  <label className="text-sm text-white/70 capitalize mb-1">{mode}</label>
                  <input
                    type="number"
                    value={durations[mode]}
                    onChange={(e) => handleDurationChange(mode, parseInt(e.target.value) || 0)}
                    className="border border-white/30 bg-white/10 text-white rounded p-2 focus:ring-2 focus:ring-white/50 focus:outline-none transition-shadow"
                    min="1"
                    max="60"
                  />
                </div>
              ))}
            </div>
          </div>

        <hr className="border-white/10" />

        {/* Toggles */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="font-medium text-white">Auto-start Breaks</label>
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
            <label className="font-medium text-white">Sound Effects</label>
            <button
              onClick={toggleSound}
              className={cn(
                "w-12 h-6 rounded-full transition-colors relative cursor-pointer",
                soundEnabled ? "bg-green-500" : "bg-white/30"
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

        <hr className="border-white/10" />

        {/* Zen Mode */}
        <div className="space-y-4">
          <h3 className="font-semibold text-white/80 uppercase text-xs tracking-wider">Zen Mode</h3>

          <div className="flex justify-between items-center">
            <label className="font-medium text-white">Background Audio</label>
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
            <div className="space-y-3 bg-white/10 p-4 rounded-lg border border-white/10">
              <div className="flex flex-col gap-2">
                <label className="text-sm text-white/70">Soundscape</label>
                <select
                  value={zenTrack}
                  onChange={(e) => setZenTrack(e.target.value as ZenTrack)}
                  className="border border-white/30 bg-white/10 text-white rounded p-2 focus:ring-2 focus:ring-white/50 focus:outline-none"
                >
                  <option value="rain">Heavy Rain</option>
                  <option value="forest">Forest Morning</option>
                  <option value="white_noise">White Noise</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm text-white/70">Volume</label>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.05"
                  value={zenVolume}
                  onChange={(e) => setZenVolume(parseFloat(e.target.value))}
                  className="w-full accent-[var(--theme-primary)]"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
