export type TimerMode = 'pomodoro' | 'short' | 'long';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  estPomodoros: number;
  actPomodoros: number; // Actual pomodoros spent
}

