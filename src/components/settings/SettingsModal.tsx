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
    themeColors,
    autoStart, 
    soundEnabled, 
    zenModeEnabled,
    zenTrack,
    zenVolume,
    zenStrategy,
    savedPreset,
    updateDuration,
    setThemeColor,
    resetThemeColors,
    toggleAutoStart, 
    toggleSound,
    toggleZenMode,
    setZenTrack,
    setZenVolume,
    setZenStrategy,
    savePreset,
    loadPreset,
    loadFactoryDefaults
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
            <h3 className="font-semibold text-white uppercase text-xs tracking-wider">Timer (Minutes)</h3>
            <div className="grid grid-cols-3 gap-4">
              {(['pomodoro', 'short', 'long'] as TimerMode[]).map((mode) => (
                <div key={mode} className="flex flex-col">
                  <label className="text-sm text-white capitalize mb-1">{mode}</label>
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

        {/* Theme Colors */}
        <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-white uppercase text-xs tracking-wider">Theme Colors</h3>
              <button 
                onClick={resetThemeColors}
                className="text-xs text-white/50 underline hover:text-white transition-colors"
              >
                Reset Defaults
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {(['pomodoro', 'short', 'long'] as TimerMode[]).map((mode) => (
                <div key={mode} className="flex flex-col">
                  <label className="text-sm text-white capitalize mb-1">{mode}</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={themeColors[mode]}
                      onChange={(e) => setThemeColor(mode, e.target.value)}
                      className="w-full h-8 rounded cursor-pointer bg-transparent border-0 p-0"
                    />
                  </div>
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
          <h3 className="font-semibold text-white uppercase text-xs tracking-wider">Zen Mode</h3>

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
                <label className="text-sm text-white">Soundscape</label>
                <select
                  value={zenTrack}
                  onChange={(e) => setZenTrack(e.target.value as ZenTrack)}
                  className="border border-white/30 bg-white/10 text-black rounded p-2 focus:ring-2 focus:ring-white/50 focus:outline-none"
                >
                  <option value="rain">Heavy Rain</option>
                  <option value="forest">Forest Morning</option>
                  <option value="white_noise">White Noise</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm text-white">Playback Mode</label>
                <div className="flex gap-2">
                  <button 
                     onClick={() => setZenStrategy('always')}
                     className={cn("flex-1 py-1.5 px-3 rounded text-xs font-medium border transition-colors", 
                        zenStrategy === 'always' ? "bg-white text-[var(--theme-primary)] border-white" : "bg-transparent text-white/70 border-white/20 hover:border-white/40"
                     )}
                  >
                    Always On
                  </button>
                  <button 
                     onClick={() => setZenStrategy('break_only')}
                     className={cn("flex-1 py-1.5 px-3 rounded text-xs font-medium border transition-colors", 
                        zenStrategy === 'break_only' ? "bg-white text-[var(--theme-primary)] border-white" : "bg-transparent text-white/70 border-white/20 hover:border-white/40"
                     )}
                  >
                    Break Only
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm text-white">Volume</label>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.05"
                  value={zenVolume}
                  onChange={(e) => setZenVolume(parseFloat(e.target.value))}
                  className="w-full accent-(--theme-primary)"
                />
              </div>
            </div>
          )}
        </div>

        <hr className="border-white/10" />
        
        {/* Presets */}
        <div className="space-y-3">
             <h3 className="font-semibold text-white uppercase text-xs tracking-wider">Presets</h3>
             <div className="flex flex-col gap-2">
                <button 
                  onClick={savePreset}
                  className="w-full py-2 px-4 rounded bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                  </svg>
                  Save Current Settings as Preset
                </button>
                
                <div className="flex gap-2">
                    <button 
                      onClick={loadPreset}
                      disabled={!savedPreset}
                      className="flex-1 py-2 px-4 rounded bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Load My Preset
                    </button>
                    <button 
                      onClick={loadFactoryDefaults}
                      className="flex-1 py-2 px-4 rounded bg-white/5 hover:bg-white/10 text-white/80 text-sm font-medium transition-colors"
                    >
                      Factory Reset
                    </button>
                </div>
             </div>
        </div>

      </div>
    </Modal>
  );
};
