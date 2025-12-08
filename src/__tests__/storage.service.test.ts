import { describe, it, expect, vi, beforeEach } from 'vitest';
import { importData } from '../services/storage.service';
import { useTimeStore } from '../store/useTimeStore';
import { useTaskStore } from '../store/useTaskStore';

// Mock the stores to avoid actual localStorage writes during test
vi.mock('../store/useTimeStore');
vi.mock('../store/useTaskStore');

// Polyfill File.prototype.text which is missing in jsdom
if (!File.prototype.text) {
  File.prototype.text = async function () {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsText(this);
    });
  };
}

describe('storage.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('rejects invalid JSON', async () => {
    const badFile = new File(['{ "broken": '], 'backup.json', { type: 'application/json' });
    const result = await importData(badFile);
    expect(result).toBe(false);
  });

  it('rejects valid JSON with missing schema', async () => {
    const badData = JSON.stringify({ random: 'data' });
    const badFile = new File([badData], 'backup.json', { type: 'application/json' });
    const result = await importData(badFile);
    expect(result).toBe(false);
  });

  it('accepts valid backup file', async () => {
    const validData = JSON.stringify({
      timeStore: { mode: 'short', pomodorosCompleted: 2 },
      taskStore: { tasks: [] }
    });
    const goodFile = new File([validData], 'backup.json', { type: 'application/json' });
    
    // Mock the setState functions
    useTimeStore.setState = vi.fn();
    useTaskStore.setState = vi.fn();

    const result = await importData(goodFile);
    
    expect(result).toBe(true);
    expect(useTimeStore.setState).toHaveBeenCalledWith({ mode: 'short', pomodorosCompleted: 2 });
  });
});

