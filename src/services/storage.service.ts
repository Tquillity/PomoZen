import { useTimeStore } from '../store/useTimeStore';
import { useTaskStore } from '../store/useTaskStore';
import { useSettingsStore } from '../store/useSettingsStore';

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
    const data = JSON.parse(text);
    
    if (!data.timeStore || !data.taskStore) throw new Error("Invalid Backup File");

    useTimeStore.setState({ 
        mode: data.timeStore.mode, 
        pomodorosCompleted: data.timeStore.pomodorosCompleted 
    });
    useTaskStore.setState({ tasks: data.taskStore.tasks });
    
    if (data.settingsStore) {
        useSettingsStore.setState({
            durations: data.settingsStore.durations,
            themeColors: data.settingsStore.themeColors,
            zenTrack: data.settingsStore.zenTrack
        });
    }
    
    return true;
  } catch {
    alert("Failed to import file. It may be corrupt.");
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
        type: 'pomozen_settings'
    };
    downloadJSON(exportable, `pomozen-settings.json`);
};

export const importSettingsOnly = async (file: File): Promise<boolean> => {
    try {
        const text = await file.text();
        const data = JSON.parse(text);
        if (data.type !== 'pomozen_settings') throw new Error("Invalid Settings File");

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
        alert("Invalid Settings File");
        return false;
    }
};
