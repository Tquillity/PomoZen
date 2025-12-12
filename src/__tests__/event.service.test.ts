import { describe, it, expect, beforeEach, vi } from 'vitest';
import { events } from '../services/event.service';

describe('event.service', () => {
  beforeEach(() => {
    // Reset listeners by creating a new instance
    // Since events is a singleton, we need to clear it manually
    // This is a limitation, but we can test the behavior
  });

  describe('on', () => {
    it('should register a listener', () => {
      const listener = vi.fn();
      events.on('timer:complete', listener);
      
      events.emit('timer:complete', 'pomodoro');
      
      expect(listener).toHaveBeenCalledWith('pomodoro');
    });

    it('should register multiple listeners', () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();
      
      events.on('timer:complete', listener1);
      events.on('timer:complete', listener2);
      
      events.emit('timer:complete', 'short');
      
      expect(listener1).toHaveBeenCalledWith('short');
      expect(listener2).toHaveBeenCalledWith('short');
    });

    it('should return unsubscribe function', () => {
      const listener = vi.fn();
      const unsubscribe = events.on('timer:complete', listener);
      
      unsubscribe();
      events.emit('timer:complete', 'pomodoro');
      
      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('off', () => {
    it('should remove a listener', () => {
      const listener = vi.fn();
      events.on('timer:complete', listener);
      
      events.off('timer:complete', listener);
      events.emit('timer:complete', 'pomodoro');
      
      expect(listener).not.toHaveBeenCalled();
    });

    it('should not affect other listeners', () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();
      
      events.on('timer:complete', listener1);
      events.on('timer:complete', listener2);
      
      events.off('timer:complete', listener1);
      events.emit('timer:complete', 'pomodoro');
      
      expect(listener1).not.toHaveBeenCalled();
      expect(listener2).toHaveBeenCalledWith('pomodoro');
    });
  });

  describe('emit', () => {
    it('should emit event to all listeners', () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();
      
      events.on('timer:complete', listener1);
      events.on('timer:complete', listener2);
      
      events.emit('timer:complete', 'long');
      
      expect(listener1).toHaveBeenCalledWith('long');
      expect(listener2).toHaveBeenCalledWith('long');
    });

    it('should emit timer:tick events', () => {
      const listener = vi.fn();
      events.on('timer:tick', listener);
      
      events.emit('timer:tick', 100);
      
      expect(listener).toHaveBeenCalledWith(100);
    });

    it('should not crash if no listeners', () => {
      expect(() => {
        events.emit('timer:complete', 'pomodoro');
      }).not.toThrow();
    });
  });
});
