import { useEffect } from 'react';
import { TaskBoard } from './components/TaskBoard';
import { Footer } from './components/layout/Footer';
import { useTheme } from './hooks/useTheme';
import { useTimerEffects } from './hooks/useTimerEffects';
import { useDocumentTitle } from './hooks/useDocumentTitle';
import { TimerDisplay } from './components/timer/TimerDisplay';
import { TimerControls } from './components/timer/TimerControls';
import { ModeSwitcher } from './components/timer/ModeSwitcher';
import { useTaskStore } from './store/useTaskStore';
import { events } from './services/event.service';

function App() {
  // Initialize Hooks
  useTheme();
  useTimerEffects();
  useDocumentTitle();

  // Request notification permission on first interaction (simulated by checking if we should ask)
  // Ideally this should be on a button click, but we'll leave the logic in TimerControls/handleStart for now
  // or just let the user triggering start handle it.
  
  // Wire Event Bus for Tasks
  useEffect(() => {
    return events.on('timer:complete', (mode) => {
       if (mode === 'pomodoro') {
         const activeId = useTaskStore.getState().activeTaskId;
         if (activeId) useTaskStore.getState().updateActPomo(activeId);
       }
    });
  }, []);

  // Temporary: We need requestNotificationPermission available for the first start
  // But TimerControls is decoupled. We can pass it or just export it.
  // Actually, let's add a global click listener for the very first interaction if needed, 
  // or just rely on the user clicking "Start" inside TimerControls which calls playClick -> which we can hook into?
  // For now, let's keep it simple.

  return (
    <div className="min-h-screen flex flex-col items-center py-12 transition-colors duration-500">
      
      <ModeSwitcher />
      <TimerDisplay />
      <TimerControls />
      <TaskBoard />
      <Footer />

    </div>
  );
}

export default App;
