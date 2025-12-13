import { useEffect, useState, Suspense, lazy } from 'react';

import { TaskBoard } from './components/TaskBoard';
import { Footer } from './components/layout/Footer';
import { SEOContent } from './components/layout/SEOContent';
import { TimerDisplay } from './components/timer/TimerDisplay';
import { TimerControls } from './components/timer/TimerControls';
import { ModeSwitcher } from './components/timer/ModeSwitcher';
import { ZenPlayer } from './components/sound/ZenPlayer';
import { SEOHelmet } from './components/seo/SEOHelmet';
import { VisualBell } from './components/common/VisualBell';
import { ErrorBoundary } from './components/common/ErrorBoundary';

import { useTheme } from './hooks/useTheme';
import { useTimerEffects } from './hooks/useTimerEffects';
import { useDocumentTitle } from './hooks/useDocumentTitle';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useFocusMode } from './hooks/useFocusMode';

import { useSettingsStore } from './store/useSettingsStore';

import { setStorageQuotaErrorHandler } from './utils/storageWrapper';

import { PomodoroGuideModal } from './components/modals/PomodoroGuideModal';

const SettingsModal = lazy(() => import('./components/settings/SettingsModal').then(module => ({ default: module.SettingsModal })));
const StatsModal = lazy(() => import('./components/stats/StatsModal').then(module => ({ default: module.StatsModal })));
const ColorPsychologyModal = lazy(() => import('./components/modals/ColorPsychologyModal').then(module => ({ default: module.ColorPsychologyModal })));

function App() {
  useTheme();
  useTimerEffects();
  useDocumentTitle();
  useKeyboardShortcuts();
  useFocusMode();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isColorPsychOpen, setIsColorPsychOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);
  
  const { zenModeEnabled, isAudioUnlocked, unlockAudio } = useSettingsStore();

  useEffect(() => {
    let timeoutId: number | null = null;
    setStorageQuotaErrorHandler(() => {
      setStorageError('Storage quota exceeded. Some data may not be saved.');
      if (timeoutId !== null) window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => setStorageError(null), 5000);
    });

    const handleStorageFallback = (e: Event) => {
      const customEvent = e as CustomEvent<{ message: string }>;
      setStorageError(customEvent.detail.message);
      if (timeoutId !== null) window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => setStorageError(null), 5000);
    };
    const handleStorageError = (e: Event) => {
      const customEvent = e as CustomEvent<{ message: string }>;
      setStorageError(customEvent.detail.message);
      if (timeoutId !== null) window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => setStorageError(null), 5000);
    };
    window.addEventListener('storage-fallback', handleStorageFallback);
    window.addEventListener('storage-error', handleStorageError);

    return () => {
      if (timeoutId !== null) window.clearTimeout(timeoutId);
      window.removeEventListener('storage-fallback', handleStorageFallback);
      window.removeEventListener('storage-error', handleStorageError);
    };
  }, []);

  useEffect(() => {
    if (zenModeEnabled && !isAudioUnlocked) {
      const handleAnyClick = () => {
        unlockAudio();
      };
      
      document.addEventListener('click', handleAnyClick, { once: true });
      document.addEventListener('touchstart', handleAnyClick, { once: true });
      
      return () => {
        document.removeEventListener('click', handleAnyClick);
        document.removeEventListener('touchstart', handleAnyClick);
      };
    }
  }, [zenModeEnabled, isAudioUnlocked, unlockAudio]);

  return (
    <div className="h-screen w-full flex flex-col items-center transition-colors duration-500 relative overflow-hidden bg-(--theme-bg)">

      <SEOHelmet />
      <VisualBell />
      <ZenPlayer />

      {/* HEADER SECTION */}
      {/* Fixed: Use flex-row and items-center to keep icons centered and aligned */}
      <div className="w-full flex justify-end px-4 pt-6 sm:absolute sm:top-6 sm:right-6 z-30">
        <div className="flex flex-row items-center gap-2">
          
          {/* Text Buttons: Hidden on Mobile, Visible on Desktop */}
          <div className="hidden sm:flex flex-row gap-2">
            <button onClick={() => setIsColorPsychOpen(true)} className="bg-white/20 hover:bg-white/30 text-white text-xs sm:text-sm font-medium px-3 sm:px-4 py-2 rounded-full transition-colors cursor-pointer whitespace-nowrap">Color Psychology</button>
            <button onClick={() => setIsGuideOpen(true)} className="bg-white/20 hover:bg-white/30 text-white text-xs sm:text-sm font-medium px-3 sm:px-4 py-2 rounded-full transition-colors cursor-pointer whitespace-nowrap">Pomodoro Technique</button>
          </div>

          <div className="flex gap-2">
            {/* Mobile Only: Help Icon */}
            <button 
              onClick={() => setIsGuideOpen(true)} 
              className="sm:hidden bg-white/20 p-2 rounded-full hover:bg-white/30 text-white transition-colors cursor-pointer flex items-center justify-center" 
              aria-label="Guide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
              </svg>
            </button>

            <button onClick={() => setIsStatsOpen(true)} className="bg-white/20 p-2 rounded-full hover:bg-white/30 text-white transition-colors cursor-pointer flex items-center justify-center" aria-label="Stats">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg>
            </button>
            <button onClick={() => setIsSettingsOpen(true)} className="bg-white/20 p-2 rounded-full hover:bg-white/30 text-white transition-colors cursor-pointer flex items-center justify-center" aria-label="Settings">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 0 1 0 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281Z" /></svg>
            </button>
          </div>
        </div>
      </div>

      <main className="flex-1 w-full flex flex-col items-center justify-start pt-2 sm:pt-6 pb-4 min-h-0 px-4 gap-[13px] overflow-y-auto custom-scrollbar z-10">
        <ModeSwitcher />
        
        <div className="shrink-0">
          <TimerDisplay />
        </div>

        <div className="shrink-0">
          <TimerControls />
        </div>

        <div className="w-full flex justify-center shrink-0 mb-4">
          <TaskBoard />
        </div>

        <div className="shrink-0 w-full">
          <SEOContent />
        </div>
      </main>

      <Footer />

      {zenModeEnabled && !isAudioUnlocked && (
        <div
          className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-full text-xs font-medium z-50 animate-bounce pointer-events-none"
          aria-label="Click anywhere to enable Zen Audio"
        >
          Click anywhere to enable Zen Audio
        </div>
      )}

      {storageError && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-full text-xs font-medium z-50 animate-bounce">
          {storageError}
        </div>
      )}

      <Suspense fallback={null}>
        <ErrorBoundary>
          <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        </ErrorBoundary>
        <ErrorBoundary>
          <StatsModal isOpen={isStatsOpen} onClose={() => setIsStatsOpen(false)} />
        </ErrorBoundary>
        <ErrorBoundary>
          <ColorPsychologyModal isOpen={isColorPsychOpen} onClose={() => setIsColorPsychOpen(false)} />
        </ErrorBoundary>
        <ErrorBoundary>
          <PomodoroGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
        </ErrorBoundary>
      </Suspense>
    </div>
  );
}

export default App;
