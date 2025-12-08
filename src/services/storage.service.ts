import { useTimeStore } from '../store/useTimeStore';
import { useTaskStore } from '../store/useTaskStore';

export const exportData = () => {
  const data = {
    timeStore: useTimeStore.getState(),
    taskStore: useTaskStore.getState(),
    timestamp: Date.now(),
    version: 1
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `pomozen-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const importData = async (file: File): Promise<boolean> => {
  try {
    const text = await file.text();
    const data = JSON.parse(text);
    
    // Basic validation
    if (!data.timeStore || !data.taskStore) throw new Error("Invalid Backup File");

    // Hydrate Stores
    // We strictly extract only the persisted properties to avoid overwriting methods
    const { mode, pomodorosCompleted } = data.timeStore;
    const { tasks } = data.taskStore;

    useTimeStore.setState({ mode, pomodorosCompleted });
    useTaskStore.setState({ tasks });
    
    return true;
  } catch (e) {
    console.error("Import Failed", e);
    alert("Failed to import file. It may be corrupt.");
    return false;
  }
};

