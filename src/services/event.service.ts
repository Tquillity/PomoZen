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
  private listeners: Record<string, Function[]> = {};

  on<K extends keyof PomoEvents>(event: K, fn: Listener<PomoEvents[K]>) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(fn);
    return () => this.off(event, fn);
  }

  off<K extends keyof PomoEvents>(event: K, fn: Listener<PomoEvents[K]>) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(l => l !== fn);
  }

  emit<K extends keyof PomoEvents>(event: K, data: PomoEvents[K]) {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach(fn => fn(data));
  }
}

export const events = new EventService();
