import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});

// Mock Web Worker for tests (Comlink relies on Workers)
class WorkerMock {
  url: string;
  onmessage: ((this: Worker, ev: MessageEvent) => void) | null = null;

  constructor(stringUrl: string) {
    this.url = stringUrl;
  }

  postMessage(msg: unknown) {
    // Echo back or mock logic if needed
    console.log('Worker Message:', msg);
  }

  terminate() {}
  addEventListener() {}
  removeEventListener() {}
  dispatchEvent() { return true; }
  onerror = null;
  onmessageerror = null;
}

// @ts-expect-error - Mocking global Worker
globalThis.Worker = WorkerMock;

// Mock Audio (JSDOM doesn't support it)
globalThis.Audio = vi.fn().mockImplementation(() => ({
  play: vi.fn().mockResolvedValue(undefined),
  pause: vi.fn(),
  load: vi.fn(),
  currentTime: 0,
  src: '',
  volume: 1,
  loop: false,
}));

// Mock Notification API
Object.defineProperty(globalThis, 'Notification', {
  value: {
    requestPermission: vi.fn().mockResolvedValue('granted'),
    permission: 'granted',
  },
  writable: true
});