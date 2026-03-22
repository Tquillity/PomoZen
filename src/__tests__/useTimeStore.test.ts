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
      history: {},
      sessionEndAt: null,
    });
    
    // Mock settings store
    (useSettingsStore.getState as ReturnType<typeof vi.fn>).mockReturnValue({
      durations: { pomodoro: 25, short: 5, long: 15 },
      autoStartBreaks: false,
      autoStartPomodoros: false,
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
      expect(useTimeStore.getState().sessionEndAt).not.toBeNull();
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
      useTimeStore.setState({ isRunning: true, sessionEndAt: 12345 });
      const { pauseTimer } = useTimeStore.getState();
      pauseTimer();
      
      expect(useTimeStore.getState().isRunning).toBe(false);
      expect(useTimeStore.getState().sessionEndAt).toBeNull();
      expect(getWorker().pause).toHaveBeenCalled();
    });
  });

  describe('resetTimer', () => {
    it('should reset timer to initial duration', () => {
      useTimeStore.setState({ timeLeft: 100, isRunning: true, sessionEndAt: 999 });
      const { resetTimer } = useTimeStore.getState();
      resetTimer();
      
      const state = useTimeStore.getState();
      expect(state.timeLeft).toBe(1500); // 25 minutes
      expect(state.isRunning).toBe(false);
      expect(state.sessionEndAt).toBeNull();
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
      expect(state.sessionEndAt).toBeNull();
      expect(getWorker().reset).toHaveBeenCalled();
    });
  });

  describe('switchModeWithSkip', () => {
    it('should count a skipped pomodoro toward the cycle', () => {
      useTimeStore.setState({ mode: 'pomodoro', pomodorosCompleted: 2, timeLeft: 900 });

      const { switchModeWithSkip } = useTimeStore.getState();
      switchModeWithSkip('long');

      const state = useTimeStore.getState();
      expect(state.mode).toBe('long');
      expect(state.pomodorosCompleted).toBe(3);
      expect(state.timeLeft).toBe(900);
      expect(getWorker().reset).toHaveBeenCalled();
    });

    it('should not count skipped breaks as completed pomodoros', () => {
      useTimeStore.setState({ mode: 'short', pomodorosCompleted: 2, timeLeft: 120 });

      const { switchModeWithSkip } = useTimeStore.getState();
      switchModeWithSkip('pomodoro');

      const state = useTimeStore.getState();
      expect(state.mode).toBe('pomodoro');
      expect(state.pomodorosCompleted).toBe(2);
      expect(state.timeLeft).toBe(1500);
      expect(state.sessionEndAt).toBeNull();
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

    it('should auto-start breaks if enabled', async () => {
      (useSettingsStore.getState as ReturnType<typeof vi.fn>).mockReturnValue({
        durations: { pomodoro: 25, short: 5, long: 15 },
        autoStartBreaks: true,
        autoStartPomodoros: false,
      });
      
      useTimeStore.setState({ timeLeft: 1, mode: 'pomodoro' });
      const { tick } = useTimeStore.getState();
      
      tick();
      
      // Auto-start should trigger (check that start was called on worker)
      await new Promise(resolve => setTimeout(resolve, 10));
      expect(mockWorker.start).toHaveBeenCalled();
    });

    it('should auto-start pomodoros if enabled', async () => {
      (useSettingsStore.getState as ReturnType<typeof vi.fn>).mockReturnValue({
        durations: { pomodoro: 25, short: 5, long: 15 },
        autoStartBreaks: false,
        autoStartPomodoros: true,
      });

      useTimeStore.setState({ timeLeft: 1, mode: 'short' });
      const { tick } = useTimeStore.getState();

      tick();

      await new Promise(resolve => setTimeout(resolve, 10));
      expect(mockWorker.start).toHaveBeenCalled();
    });
  });

  describe('syncWithWallClock', () => {
    it('should sync an active running session to current time', async () => {
      useTimeStore.setState({
        isRunning: true,
        timeLeft: 1500,
        sessionEndAt: 10_000,
      });

      const { syncWithWallClock } = useTimeStore.getState();
      await syncWithWallClock(7_500);

      expect(useTimeStore.getState().timeLeft).toBe(3);
      expect(mockWorker.start).toHaveBeenCalled();
    });

    it('should recover into an auto-started break when work elapsed in the background', async () => {
      (useSettingsStore.getState as ReturnType<typeof vi.fn>).mockReturnValue({
        durations: { pomodoro: 1, short: 1, long: 1 },
        autoStartBreaks: true,
        autoStartPomodoros: false,
      });

      useTimeStore.setState({
        isRunning: true,
        mode: 'pomodoro',
        timeLeft: 10,
        pomodorosCompleted: 0,
        history: {},
        sessionEndAt: 1_000,
      });

      const { syncWithWallClock } = useTimeStore.getState();
      await syncWithWallClock(2_000);

      const state = useTimeStore.getState();
      expect(state.mode).toBe('short');
      expect(state.isRunning).toBe(true);
      expect(state.pomodorosCompleted).toBe(1);
      expect(state.timeLeft).toBe(59);
      expect(state.sessionEndAt).toBe(61_000);
    });

    it('should stop on the next session when auto-start is disabled', async () => {
      (useSettingsStore.getState as ReturnType<typeof vi.fn>).mockReturnValue({
        durations: { pomodoro: 1, short: 1, long: 1 },
        autoStartBreaks: false,
        autoStartPomodoros: false,
      });

      useTimeStore.setState({
        isRunning: true,
        mode: 'pomodoro',
        timeLeft: 10,
        pomodorosCompleted: 0,
        history: {},
        sessionEndAt: 1_000,
      });

      const { syncWithWallClock } = useTimeStore.getState();
      await syncWithWallClock(2_000);

      const state = useTimeStore.getState();
      expect(state.mode).toBe('short');
      expect(state.isRunning).toBe(false);
      expect(state.timeLeft).toBe(60);
      expect(state.sessionEndAt).toBeNull();
    });
  });
});
