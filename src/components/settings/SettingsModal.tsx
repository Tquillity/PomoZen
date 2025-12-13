import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useSettingsStore } from '../../store/useSettingsStore';
import type { ZenTrack } from '../../store/useSettingsStore';
import { useTimeStore } from '../../store/useTimeStore';
import { cn } from '../../utils/cn';
import type { TimerMode } from '../../types';
import { Modal } from '../common/Modal';
import { exportSettingsOnly, importSettingsOnly } from '../../services/storage.service';

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
    notificationsEnabled,
    isFocusMode,
    zenModeEnabled,
    zenTrack,
    zenVolume,
    zenStrategy,
    presets,
    updateDuration,
    setThemeColor,
    resetThemeColors,
    toggleAutoStart,
    toggleSound,
    toggleNotifications,
    toggleFocusMode,
    toggleZenMode,
    setZenTrack,
    setZenVolume,
    setZenStrategy,
    addPreset,
    deletePreset,
    loadPreset,
    loadFactoryDefaults
  } = useSettingsStore();

  const resetTimer = useTimeStore(state => state.resetTimer);
  const [presetName, setPresetName] = useState('');
  const settingsFileInputRef = useRef<HTMLInputElement>(null);
  const clearCacheButtonRef = useRef<HTMLButtonElement>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number } | null>(null);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const tooltipId = 'clear-cache-tooltip';

  const handleDurationChange = (mode: TimerMode, value: number) => {
    const minutes = Math.min(60, Math.max(1, value));
    updateDuration(mode, minutes);
    resetTimer();
  };

  const handleSavePreset = () => {
    if (!presetName.trim()) return;
    addPreset(presetName);
    setPresetName('');
  };

  const handleSettingsImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          await importSettingsOnly(file);
          if (settingsFileInputRef.current) settingsFileInputRef.current.value = '';
      }
  };

  const handleClearCache = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for(const registration of registrations) {
          registration.unregister();
        }
        window.location.reload();
      });
    } else {
      window.location.reload();
    }
  };

  useEffect(() => {
    const updateTooltipPosition = () => {
      if (clearCacheButtonRef.current && isTooltipVisible) {
        const rect = clearCacheButtonRef.current.getBoundingClientRect();
        setTooltipPosition({
          top: rect.top - 10,
          left: rect.left + rect.width / 2,
        });
      }
    };

    if (isTooltipVisible) {
      updateTooltipPosition();
      window.addEventListener('scroll', updateTooltipPosition, true);
      window.addEventListener('resize', updateTooltipPosition);
    }

    return () => {
      window.removeEventListener('scroll', updateTooltipPosition, true);
      window.removeEventListener('resize', updateTooltipPosition);
    };
  }, [isTooltipVisible]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Settings">
        <div className="space-y-6">
          {/* Timer Durations */}
          <div className="space-y-3">
            <h3 className="font-semibold text-white uppercase text-xs tracking-wider">Timer (Minutes)</h3>
            <div className="grid grid-cols-3 gap-4">
              {(['pomodoro', 'short', 'long'] as TimerMode[]).map((mode) => (
                <div key={mode} className="flex flex-col">
                  <label htmlFor={`duration-${mode}`} className="text-sm text-white capitalize mb-1">{mode}</label>
                  <input
                    id={`duration-${mode}`}
                    name={`duration-${mode}`}
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
                  <label htmlFor={`color-${mode}`} className="text-sm text-white capitalize mb-1">{mode}</label>
                  <div className="flex items-center gap-2">
                    <input
                      id={`color-${mode}`}
                      name={`color-${mode}`}
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
            <label htmlFor="toggle-autostart" className="font-medium text-white">Auto-start Breaks</label>
            <button
              id="toggle-autostart"
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
            <label htmlFor="toggle-sound" className="font-medium text-white">Sound Effects</label>
            <button
              id="toggle-sound"
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

          <div className="flex justify-between items-center">
            <label htmlFor="toggle-notifications" className="font-medium text-white">Notifications</label>
            <button
              id="toggle-notifications"
              onClick={toggleNotifications}
              className={cn(
                "w-12 h-6 rounded-full transition-colors relative cursor-pointer",
                notificationsEnabled ? "bg-green-500" : "bg-gray-300"
              )}
              aria-pressed={notificationsEnabled}
              aria-label="Toggle Notifications"
            >
              <div className={cn(
                "w-4 h-4 bg-white rounded-full absolute top-1 transition-transform",
                notificationsEnabled ? "left-7" : "left-1"
              )} />
            </button>
          </div>

          <div className="flex justify-between items-center">
            <label htmlFor="toggle-focus" className="font-medium text-white">Focus Mode (Fullscreen)</label>
            <button
              id="toggle-focus"
              onClick={async () => {
                const newValue = !isFocusMode;
                toggleFocusMode();
                if (newValue) {
                  try {
                    if (!document.fullscreenElement) {
                      await document.documentElement.requestFullscreen();
                    }
                  } catch {
                    toggleFocusMode();
                  }
                }
              }}
              className={cn(
                "w-12 h-6 rounded-full transition-colors relative cursor-pointer",
                isFocusMode ? "bg-green-500" : "bg-gray-300"
              )}
              aria-pressed={isFocusMode}
              aria-label="Toggle Focus Mode (Fullscreen)"
            >
              <div className={cn(
                "w-4 h-4 bg-white rounded-full absolute top-1 transition-transform",
                isFocusMode ? "left-7" : "left-1"
              )} />
            </button>
          </div>
        </div>

        <hr className="border-white/10" />

        {/* Zen Mode */}
        <div className="space-y-4">
          <h3 className="font-semibold text-white uppercase text-xs tracking-wider">Zen Mode</h3>

          <div className="flex justify-between items-center">
            <label htmlFor="toggle-zen" className="font-medium text-white">Background Audio</label>
            <button
              id="toggle-zen"
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
                <label htmlFor="zen-track-select" className="text-sm text-white">Soundscape</label>
                <select
                  id="zen-track-select"
                  name="zen-track"
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
                <span className="text-sm text-white">Playback Mode</span>
                <div className="flex gap-2">
                  <button
                     onClick={() => setZenStrategy('always')}
                     className={cn("flex-1 py-1.5 px-3 rounded text-xs font-medium border transition-colors",
                        zenStrategy === 'always' ? "bg-white text-(--theme-primary) border-white" : "bg-transparent text-white/70 border-white/20 hover:border-white/40"
                     )}
                  >
                    Always On
                  </button>
                  <button
                     onClick={() => setZenStrategy('break_only')}
                     className={cn("flex-1 py-1.5 px-3 rounded text-xs font-medium border transition-colors",
                        zenStrategy === 'break_only' ? "bg-white text-(--theme-primary) border-white" : "bg-transparent text-white/70 border-white/20 hover:border-white/40"
                     )}
                  >
                    Break Only
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="zen-volume-slider" className="text-sm text-white">Volume</label>
                <input
                  id="zen-volume-slider"
                  name="zen-volume"
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

        {/* Presets & Data */}
        <div className="space-y-4">
             <h3 className="font-semibold text-white uppercase text-xs tracking-wider">Presets & Data</h3>

             {/* Add New Preset */}
             <div className="flex gap-2">
                <label htmlFor="preset-name-input" className="sr-only">Preset Name</label>
                <input
                    id="preset-name-input"
                    name="preset-name"
                    value={presetName}
                    onChange={(e) => setPresetName(e.target.value)}
                    placeholder="Preset Name (e.g. Deep Work)"
                    className="flex-1 bg-white/10 text-white text-sm px-3 py-2 rounded border border-white/20 focus:outline-none focus:border-white/50 placeholder-white/30"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSavePreset();
                      }
                    }}
                />
                <button
                  onClick={handleSavePreset}
                  disabled={!presetName.trim()}
                  className="bg-white/20 hover:bg-white/30 text-white p-2 rounded disabled:opacity-50 transition-colors"
                  title="Save Current Settings"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                </button>
             </div>

             {/* Preset List */}
             {presets.length > 0 && (
                 <div className="max-h-32 overflow-y-auto custom-scrollbar space-y-1 bg-black/20 p-2 rounded">
                    {presets.map(p => (
                        <div key={p.id} className="flex justify-between items-center bg-white/5 p-2 rounded hover:bg-white/10 transition-colors group">
                            <span className="text-sm text-white truncate">{p.name}</span>
                            <div className="flex gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => loadPreset(p.id)} className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded hover:bg-green-500/30">Load</button>
                                <button onClick={() => deletePreset(p.id)} className="text-white/50 hover:text-red-400 px-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                                </button>
                            </div>
                        </div>
                    ))}
                 </div>
             )}

             <hr className="border-white/10" />

             {/* Actions */}
             <div className="flex gap-2">
                <button
                    onClick={exportSettingsOnly}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white text-xs py-2 rounded transition-colors flex items-center justify-center gap-1"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" /></svg>
                    Export Config
                </button>
                <label className="flex-1 bg-white/10 hover:bg-white/20 text-white text-xs py-2 rounded transition-colors flex items-center justify-center gap-1 cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" className="rotate-180" /></svg>
                    Import Config
                    <input type="file" className="hidden" accept=".json" ref={settingsFileInputRef} onChange={handleSettingsImport} />
                </label>
                <button
                    onClick={loadFactoryDefaults}
                    className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-200 text-xs py-2 rounded transition-colors"
                >
                    Reset All
                </button>
             </div>

             <div className="mt-4 relative">
               <button 
                 ref={clearCacheButtonRef}
                 onMouseEnter={() => setIsTooltipVisible(true)}
                 onMouseLeave={() => setIsTooltipVisible(false)}
                  onFocus={() => setIsTooltipVisible(true)}
                  onBlur={() => setIsTooltipVisible(false)}
                 onClick={handleClearCache} 
                 className="w-full text-[10px] text-white/30 hover:text-white/50 uppercase tracking-widest transition-colors"
                  aria-describedby={isTooltipVisible ? tooltipId : undefined}
               >
                 Troubleshoot: Clear Cache & Reload
               </button>
               {/* Tooltip - Rendered in portal with fixed positioning to escape overflow container */}
               {isTooltipVisible && tooltipPosition && createPortal(
                 <div 
                  id={tooltipId}
                  role="tooltip"
                   className="fixed bg-black text-white text-[10px] p-2 rounded whitespace-normal max-w-[220px] z-60 pointer-events-none shadow-xl border border-white/20 transition-opacity"
                   style={{
                     top: `${tooltipPosition.top}px`,
                     left: `${tooltipPosition.left}px`,
                     transform: 'translate(-50%, -100%)',
                     marginTop: '-8px',
                   }}
                 >
                   Use this if the app seems outdated, features aren't working, or you're seeing cached content. Clears service worker cache and reloads.
                   <div className="mt-1.5 pt-1.5 border-t border-white/20 text-white/80">
                     💡 Tip: You can also press <kbd className="bg-white/20 px-1 py-0.5 rounded text-[9px] font-mono">Ctrl+Shift+R</kbd> (or <kbd className="bg-white/20 px-1 py-0.5 rounded text-[9px] font-mono">Cmd+Shift+R</kbd> on Mac) for a hard refresh.
                   </div>
                 </div>,
                 document.body
               )}
             </div>

             {import.meta.env.DEV && (
                <button 
                  onClick={async () => {
                    const { seedDevData } = await import('../../utils/devSeeder');
                    seedDevData();
                  }} 
                  className="mt-2 w-full text-[10px] text-green-300/50 hover:text-green-300 uppercase tracking-widest transition-colors"
                >
                  [DEV] Seed Dummy Data
                </button>
             )}
        </div>

      </div>
    </Modal>
  );
};