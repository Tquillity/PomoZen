// Event Payload Types
// We define strict interfaces for our events to avoid 'any'
import type { TimerMode } from '../types';

export interface PomoEvents {
  'timer:complete': TimerMode;
  'timer:tick': number; // Example for future use
}

// Type-safe listener definition
type Listener<T> = (data: T) => void;

class EventService {
  private listeners: Record<string, Listener<unknown>[]> = {};

  on<K extends keyof PomoEvents>(event: K, fn: Listener<PomoEvents[K]>) {
    if (!this.listeners[event]) this.listeners[event] = [];
    // FIX: Cast fn to Listener<unknown> to satisfy strict type checks
    this.listeners[event].push(fn as Listener<unknown>);
    return () => this.off(event, fn);
  }

  off<K extends keyof PomoEvents>(event: K, fn: Listener<PomoEvents[K]>) {
    if (!this.listeners[event]) return;
    // FIX: Cast fn to Listener<unknown> for comparison
    this.listeners[event] = this.listeners[event].filter(l => l !== (fn as Listener<unknown>));
  }

  emit<K extends keyof PomoEvents>(event: K, data: PomoEvents[K]) {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach(fn => fn(data));
  }
}

export const events = new EventService();
