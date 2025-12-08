export interface TimerWorkerAPI {
  start(callback: (tick: number) => void): void;
  pause(): void;
  reset(): void;
}

