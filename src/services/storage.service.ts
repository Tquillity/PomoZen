import { z } from 'zod';
import { useTimeStore } from '../store/useTimeStore';
import { useTaskStore } from '../store/useTaskStore';
import { useSettingsStore } from '../store/useSettingsStore';
import type { TimerMode } from '../types';

const getDuration = (mode: TimerMode) => {
  // Defensive fallback for invalid backups / test environments.
  const durations =
    useSettingsStore.getState?.()?.durations ??
    ({ pomodoro: 25, short: 5, long: 15 } as Record<TimerMode, number>);
  return durations[mode] * 60;
};

const TimerModeSchema = z.enum(['pomodoro', 'short', 'long']);

const TimeStoreSchema = z.object({
  mode: TimerModeSchema,
  pomodorosCompleted: z.number().int().min(0).max(10000),
  timeLeft: z.number().int().min(0).optional(),
  isRunning: z.boolean().optional(),
  history: z.record(z.string(), z.object({
    pomodoro: z.number().int().min(0),
    short: z.number().int().min(0),
    long: z.number().int().min(0)
  })).optional()
});

const TaskSchema = z.object({
  id: z.string(),
  title: z.string().max(100),
  completed: z.boolean(),
  estPomodoros: z.number().int().min(1).max(100),
  actPomodoros: z.number().int().min(0).max(1000)
});

const TaskStoreSchema = z.object({
  tasks: z.array(TaskSchema).max(1000),
  activeTaskId: z.string().nullable().optional()
});

const SettingsStoreSchema = z.object({
  durations: z.object({
    pomodoro: z.number().int().min(1).max(60),
    short: z.number().int().min(1).max(60),
    long: z.number().int().min(1).max(60)
  }).optional(),
  themeColors: z.object({
    pomodoro: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    short: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    long: z.string().regex(/^#[0-9A-Fa-f]{6}$/)
  }).optional(),
  zenTrack: z.enum(['rain', 'white_noise', 'forest']).optional(),
  zenVolume: z.number().min(0).max(1).optional(),
  zenStrategy: z.enum(['always', 'break_only']).optional(),
  autoStart: z.boolean().optional(),
  soundEnabled: z.boolean().optional(),
  notificationsEnabled: z.boolean().optional(),
  zenModeEnabled: z.boolean().optional(),
  presets: z.array(z.object({
    id: z.string(),
    name: z.string().max(50),
    data: z.object({
      durations: z.object({
        pomodoro: z.number().int().min(1).max(60),
        short: z.number().int().min(1).max(60),
        long: z.number().int().min(1).max(60)
      }),
      themeColors: z.object({
        pomodoro: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
        short: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
        long: z.string().regex(/^#[0-9A-Fa-f]{6}$/)
      }),
      zenTrack: z.enum(['rain', 'white_noise', 'forest']),
      zenVolume: z.number().min(0).max(1),
      zenStrategy: z.enum(['always', 'break_only'])
    })
  })).max(50).optional()
});

const BackupFileSchema = z.object({
  timeStore: TimeStoreSchema,
  taskStore: TaskStoreSchema,
  settingsStore: SettingsStoreSchema.optional(),
  timestamp: z.number().optional(),
  version: z.number().optional()
});

const SettingsFileSchema = z.object({
  type: z.literal('pomozen_settings'),
  durations: z.object({
    pomodoro: z.number().int().min(1).max(60),
    short: z.number().int().min(1).max(60),
    long: z.number().int().min(1).max(60)
  }),
  themeColors: z.object({
    pomodoro: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    short: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    long: z.string().regex(/^#[0-9A-Fa-f]{6}$/)
  }),
  zenTrack: z.enum(['rain', 'white_noise', 'forest']),
  zenVolume: z.number().min(0).max(1),
  zenStrategy: z.enum(['always', 'break_only']),
  presets: z.array(z.object({
    id: z.string(),
    name: z.string().max(50),
    data: z.object({
      durations: z.object({
        pomodoro: z.number().int().min(1).max(60),
        short: z.number().int().min(1).max(60),
        long: z.number().int().min(1).max(60)
      }),
      themeColors: z.object({
        pomodoro: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
        short: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
        long: z.string().regex(/^#[0-9A-Fa-f]{6}$/)
      }),
      zenTrack: z.enum(['rain', 'white_noise', 'forest']),
      zenVolume: z.number().min(0).max(1),
      zenStrategy: z.enum(['always', 'break_only'])
    })
  })).max(50)
});

const downloadJSON = (data: unknown, filename: string) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export const exportData = () => {
  const data = {
    timeStore: useTimeStore.getState(),
    taskStore: useTaskStore.getState(),
    settingsStore: useSettingsStore.getState(),
    timestamp: Date.now(),
    version: 2
  };
  downloadJSON(data, `pomozen-backup-${new Date().toISOString().slice(0, 10)}.json`);
};

export const importData = async (file: File): Promise<boolean> => {
  try {
    const text = await file.text();
    const parsed = JSON.parse(text);
    
    const result = BackupFileSchema.safeParse(parsed);
    if (!result.success) {
      throw new Error("Invalid backup file format");
    }

    const data = result.data;

    // Restore full time store state (including history, timeLeft, isRunning)
    useTimeStore.setState({ 
      mode: data.timeStore.mode, 
      pomodorosCompleted: data.timeStore.pomodorosCompleted,
      timeLeft: data.timeStore.timeLeft ?? getDuration(data.timeStore.mode),
      isRunning: data.timeStore.isRunning ?? false,
      history: data.timeStore.history ?? {}
    });
    
    // Restore full task store state (including activeTaskId)
    useTaskStore.setState({ 
      tasks: data.taskStore.tasks,
      activeTaskId: data.taskStore.activeTaskId ?? null
    });
    
    // Restore full settings store state (all properties)
    if (data.settingsStore) {
      useSettingsStore.setState({
        durations: data.settingsStore.durations,
        themeColors: data.settingsStore.themeColors,
        zenTrack: data.settingsStore.zenTrack,
        zenVolume: data.settingsStore.zenVolume,
        zenStrategy: data.settingsStore.zenStrategy,
        presets: data.settingsStore.presets ?? [],
        autoStart: data.settingsStore.autoStart,
        soundEnabled: data.settingsStore.soundEnabled,
        notificationsEnabled: data.settingsStore.notificationsEnabled,
        zenModeEnabled: data.settingsStore.zenModeEnabled
      });
    }
    
    return true;
  } catch {
    alert("Failed to import file. It may be corrupt or invalid.");
    return false;
  }
};

export const exportSettingsOnly = () => {
    const settings = useSettingsStore.getState();
    const exportable = {
        durations: settings.durations,
        themeColors: settings.themeColors,
        zenTrack: settings.zenTrack,
        zenVolume: settings.zenVolume,
        zenStrategy: settings.zenStrategy,
        presets: settings.presets,
        type: 'pomozen_settings' as const
    };
    downloadJSON(exportable, `pomozen-settings.json`);
};

export const importSettingsOnly = async (file: File): Promise<boolean> => {
    try {
        const text = await file.text();
        const parsed = JSON.parse(text);
        
        const result = SettingsFileSchema.safeParse(parsed);
        if (!result.success) {
          throw new Error("Invalid settings file format");
        }

        const data = result.data;

        useSettingsStore.setState({
            durations: data.durations,
            themeColors: data.themeColors,
            zenTrack: data.zenTrack,
            zenVolume: data.zenVolume,
            zenStrategy: data.zenStrategy,
            presets: data.presets
        });
        return true;
    } catch {
        alert("Invalid settings file. It may be corrupt or invalid.");
        return false;
    }
};
