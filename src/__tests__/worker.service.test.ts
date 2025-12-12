import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as Comlink from 'comlink';

// Mock Comlink
vi.mock('comlink', () => ({
  wrap: vi.fn(() => ({
    start: vi.fn(),
    pause: vi.fn(),
    reset: vi.fn()
  }))
}));

// Mock Worker
const createMockWorker = () => ({
  onerror: null,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  terminate: vi.fn(),
  postMessage: vi.fn()
});

const setWorkerMock = () => {
  const calls: unknown[][] = [];
  let nextInstance: unknown | null = null;

  class WorkerCtor {
    // Accept any args to match browser Worker constructor signature
    constructor(...args: unknown[]) {
      calls.push(args);
      return (nextInstance ?? createMockWorker()) as object;
    }
  }

  Object.defineProperty(globalThis, 'Worker', {
    value: WorkerCtor,
    writable: true,
    configurable: true,
  });

  return {
    calls,
    setNextInstance: (inst: unknown | null) => {
      nextInstance = inst;
    },
  };
};

describe('worker.service', () => {
  let workerCalls: unknown[][];
  let setNextWorkerInstance: (inst: unknown | null) => void;
  let getWorker: () => unknown;
  let terminateWorker: () => void;

  beforeEach(async () => {
    vi.clearAllMocks();
    vi.resetModules();

    // Ensure Worker is constructible before importing module under test
    const mock = setWorkerMock();
    workerCalls = mock.calls;
    setNextWorkerInstance = mock.setNextInstance;

    // Import module fresh each test (ensures singleton state reset)
    const mod = await import('../services/worker.service');
    getWorker = mod.getWorker;
    terminateWorker = mod.terminateWorker;
  });

  describe('getWorker', () => {
    it('should create a worker instance', () => {
      const worker = getWorker();
      
      expect(worker).toBeDefined();
      expect(workerCalls.length).toBe(1);
      expect(Comlink.wrap).toHaveBeenCalled();
    });

    it('should return the same instance on subsequent calls', () => {
      const worker1 = getWorker();
      const worker2 = getWorker();
      
      expect(worker1).toBe(worker2);
      expect(workerCalls.length).toBe(1);
    });

    it('should set up error handlers', () => {
      const mockWorker = createMockWorker();
      setNextWorkerInstance(mockWorker as unknown as Worker);
      
      getWorker();
      
      expect(mockWorker.addEventListener).toHaveBeenCalledWith('error', expect.any(Function));
    });
  });

  describe('terminateWorker', () => {
    it('should terminate the underlying worker', () => {
      const mockWorker = createMockWorker();
      setNextWorkerInstance(mockWorker as unknown as Worker);
      
      getWorker();
      terminateWorker();
      
      expect(mockWorker.terminate).toHaveBeenCalled();
    });

    it('should reset worker instance', () => {
      const mockWorker = createMockWorker();
      setNextWorkerInstance(mockWorker as unknown as Worker);
      
      getWorker();
      terminateWorker();
      
      // Next call should create a new worker
      getWorker();
      
      expect(workerCalls.length).toBe(2);
    });
  });
});
