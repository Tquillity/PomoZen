import type { TimerMode } from '../types';

export interface PomoEvents {
  'timer:complete': TimerMode;
  'timer:tick': number;
}

// Helper type for the callback based on the Event Key
type Listener<K extends keyof PomoEvents> = (data: PomoEvents[K]) => void;

class EventService {
  // Use a mapped type for the listeners storage
  private listeners: { [K in keyof PomoEvents]?: Listener<K>[] } = {};

  on<K extends keyof PomoEvents>(event: K, fn: Listener<K>) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    // TypeScript now knows this push is safe
    this.listeners[event]!.push(fn);
    return () => this.off(event, fn);
  }

  off<K extends keyof PomoEvents>(event: K, fn: Listener<K>) {
    const listeners = this.listeners[event];
    if (!listeners) return;
    // Filter and reassign - safe at runtime, type assertion needed for mapped type
    const filtered = listeners.filter(l => l !== fn);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.listeners[event] = filtered as any;
  }

  emit<K extends keyof PomoEvents>(event: K, data: PomoEvents[K]) {
    if (!this.listeners[event]) return;
    this.listeners[event]!.forEach(fn => fn(data));
  }
}

export const events = new EventService();