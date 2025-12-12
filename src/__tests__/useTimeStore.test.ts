import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useTimeStore } from '../store/useTimeStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { useTaskStore } from '../store/useTaskStore';
import { events } from '../services/event.service';
import { getWorker } from '../services/worker.service';
import { format } from 'date-fns';

// Mock dependencies
vi.mock('../services/worker.service', () => ({
  getWorker: vi.fn()
}));

vi.mock('../services/event.service', () => ({
  events: {
    emit: vi.fn()
  }
}));

vi.mock('../store/useSettingsStore', () => ({
  useSettingsStore: {
    getState: vi.fn()
  }
}));

vi.mock('../store/useTaskStore', () => ({
  useTaskStore: {
    getState: vi.fn()
  }
}));

describe('useTimeStore', () => {
  const mockWorker = {
    start: vi.fn(),
    pause: vi.fn(),
    reset: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useTimeStore.setState({
      timeLeft: 1500, // 25 minutes
      isRunning: false,
      mode: 'pomodoro',
      pomodorosCompleted: 0,
      history: {}
    });
    
    // Mock settings store
    (useSettingsStore.getState as ReturnType<typeof vi.fn>).mockReturnValue({
      durations: { pomodoro: 25, short: 5, long: 15 },
      autoStart: false
    });
    
    // Mock task store
    (useTaskStore.getState as ReturnType<typeof vi.fn>).mockReturnValue({
      activeTaskId: null,
      updateActPomo: vi.fn()
    });
    
    // Mock worker
    (getWorker as ReturnType<typeof vi.fn>).mockReturnValue(mockWorker);
  });

  describe('initial state', () => {
    it('should initialize with default values', () => {
      const state = useTimeStore.getState();
      expect(state.mode).toBe('pomodoro');
      expect(state.isRunning).toBe(false);
      expect(state.pomodorosCompleted).toBe(0);
      expect(state.history).toEqual({});
    });
  });

  describe('startTimer', () => {
    it('should start the timer when not running', async () => {
      const { startTimer } = useTimeStore.getState();
      await startTimer();
      
      expect(useTimeStore.getState().isRunning).toBe(true);
      expect(getWorker().start).toHaveBeenCalled();
    });

    it('should not start if already running', async () => {
      useTimeStore.setState({ isRunning: true });
      const { startTimer } = useTimeStore.getState();
      await startTimer();
      
      expect(getWorker().start).not.toHaveBeenCalled();
    });
  });

  describe('pauseTimer', () => {
    it('should pause the timer', () => {
      useTimeStore.setState({ isRunning: true });
      const { pauseTimer } = useTimeStore.getState();
      pauseTimer();
      
      expect(useTimeStore.getState().isRunning).toBe(false);
      expect(getWorker().pause).toHaveBeenCalled();
    });
  });

  describe('resetTimer', () => {
    it('should reset timer to initial duration', () => {
      useTimeStore.setState({ timeLeft: 100, isRunning: true });
      const { resetTimer } = useTimeStore.getState();
      resetTimer();
      
      const state = useTimeStore.getState();
      expect(state.timeLeft).toBe(1500); // 25 minutes
      expect(state.isRunning).toBe(false);
      expect(getWorker().reset).toHaveBeenCalled();
    });
  });

  describe('setMode', () => {
    it('should change mode and reset timer', () => {
      const { setMode } = useTimeStore.getState();
      setMode('short');
      
      const state = useTimeStore.getState();
      expect(state.mode).toBe('short');
      expect(state.timeLeft).toBe(300); // 5 minutes
      expect(state.isRunning).toBe(false);
      expect(getWorker().reset).toHaveBeenCalled();
    });
  });

  describe('tick', () => {
    it('should decrement timeLeft when > 1', () => {
      useTimeStore.setState({ timeLeft: 10 });
      const { tick } = useTimeStore.getState();
      tick();
      
      expect(useTimeStore.getState().timeLeft).toBe(9);
    });

    it('should complete timer when timeLeft reaches 1', () => {
      useTimeStore.setState({ timeLeft: 1, mode: 'pomodoro' });
      const { tick } = useTimeStore.getState();
      
      tick();
      
      // On completion we briefly hit 0, then immediately transition to next mode/duration.
      expect(useTimeStore.getState().mode).toBe('short');
      expect(useTimeStore.getState().timeLeft).toBe(300);
      expect(events.emit).toHaveBeenCalledWith('timer:complete', 'pomodoro');
    });

    it('should update history on completion', () => {
      const today = format(new Date(), 'yyyy-MM-dd');
      useTimeStore.setState({ timeLeft: 1, mode: 'pomodoro', history: {} });
      const { tick } = useTimeStore.getState();
      
      tick();
      
      const history = useTimeStore.getState().history;
      expect(history[today]?.pomodoro).toBe(1);
    });

    it('should switch to short break after pomodoro', () => {
      useTimeStore.setState({ 
        timeLeft: 1, 
        mode: 'pomodoro', 
        pomodorosCompleted: 0 
      });
      const { tick } = useTimeStore.getState();
      
      tick();
      
      const state = useTimeStore.getState();
      expect(state.mode).toBe('short');
      expect(state.pomodorosCompleted).toBe(1);
    });

    it('should switch to long break after 4 pomodoros', () => {
      useTimeStore.setState({ 
        timeLeft: 1, 
        mode: 'pomodoro', 
        pomodorosCompleted: 3 
      });
      const { tick } = useTimeStore.getState();
      
      tick();
      
      const state = useTimeStore.getState();
      expect(state.mode).toBe('long');
      expect(state.pomodorosCompleted).toBe(4);
    });

    it('should switch back to pomodoro after break', () => {
      useTimeStore.setState({ timeLeft: 1, mode: 'short' });
      const { tick } = useTimeStore.getState();
      
      tick();
      
      expect(useTimeStore.getState().mode).toBe('pomodoro');
    });

    it('should auto-start if enabled', async () => {
      (useSettingsStore.getState as ReturnType<typeof vi.fn>).mockReturnValue({
        durations: { pomodoro: 25, short: 5, long: 15 },
        autoStart: true
      });
      
      useTimeStore.setState({ timeLeft: 1, mode: 'pomodoro' });
      const { tick } = useTimeStore.getState();
      
      tick();
      
      // Auto-start should trigger (check that start was called on worker)
      await new Promise(resolve => setTimeout(resolve, 10));
      expect(mockWorker.start).toHaveBeenCalled();
    });
  });
});
