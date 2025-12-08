import { useEffect, useState, Suspense, lazy } from 'react';
import { TaskBoard } from './components/TaskBoard';
import { Footer } from './components/layout/Footer';
import { LandingContent } from './components/layout/LandingContent';
import { useTheme } from './hooks/useTheme';
import { useTimerEffects } from './hooks/useTimerEffects';
import { useDocumentTitle } from './hooks/useDocumentTitle';
import { TimerDisplay } from './components/timer/TimerDisplay';
import { TimerControls } from './components/timer/TimerControls';
import { ModeSwitcher } from './components/timer/ModeSwitcher';
import { useTaskStore } from './store/useTaskStore';
import { events } from './services/event.service';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useFocusMode } from './hooks/useFocusMode';
import { ZenPlayer } from './components/sound/ZenPlayer';
import { SEOHelmet } from './components/seo/SEOHelmet';

// Lazy load modals for code splitting
const SettingsModal = lazy(() => import('./components/settings/SettingsModal').then(module => ({ default: module.SettingsModal })));
const StatsModal = lazy(() => import('./components/stats/StatsModal').then(module => ({ default: module.StatsModal })));

function App() {
  // Initialize Hooks
  useTheme();
  useTimerEffects();
  useDocumentTitle();
  useKeyboardShortcuts();
  useFocusMode();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);

  // Wire Event Bus for Tasks
  useEffect(() => {
    return events.on('timer:complete', (mode) => {
       if (mode === 'pomodoro') {
         const activeId = useTaskStore.getState().activeTaskId;
         if (activeId) useTaskStore.getState().updateActPomo(activeId);
       }
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center py-12 transition-colors duration-500 relative">

      <SEOHelmet />
      <ZenPlayer />

      {/* Top Right Buttons */}
      <div className="absolute top-6 right-6 z-20 flex gap-2">
        {/* Stats Button */}
        <button 
          onClick={() => setIsStatsOpen(true)}
          className="bg-white/20 p-2 rounded-full hover:bg-white/30 text-white transition-colors cursor-pointer"
          aria-label="Open Statistics"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
          </svg>
        </button>

        {/* Settings Button */}
        <button 
          onClick={() => setIsSettingsOpen(true)}
          className="bg-white/20 p-2 rounded-full hover:bg-white/30 text-white transition-colors cursor-pointer"
          aria-label="Open Settings"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 1 1 0-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 0 1-1.44-4.282m3.102.069a18.03 18.03 0 0 1-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 0 1 8.835 2.535M10.34 6.66a23.847 23.847 0 0 0 8.835-2.535m0 0A23.74 23.74 0 0 0 18.795 3m.38 1.125a23.91 23.91 0 0 1 1.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 0 0 1.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.42 24.42 0 0 1 0 3.46" />
          </svg>
        </button>
      </div>

      <ModeSwitcher />
      <TimerDisplay />
      <TimerControls />
      <TaskBoard />
      <Footer />
      <LandingContent />

      {/* Lazy loaded modals with code splitting */}
      <Suspense fallback={null}>
        <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        <StatsModal isOpen={isStatsOpen} onClose={() => setIsStatsOpen(false)} />
      </Suspense>

    </div>
  );
}

export default App;
