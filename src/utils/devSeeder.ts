import { useTimeStore } from '../store/useTimeStore';
import { subDays, format } from 'date-fns';

export const seedDevData = () => {
  const history: Record<string, { pomodoro: number; short: number; long: number }> = {};

  // Generate last 14 days of data
  for (let i = 0; i < 14; i++) {
    const date = subDays(new Date(), i);
    const key = format(date, 'yyyy-MM-dd');

    // Randomize: 60% chance of working that day
    if (Math.random() > 0.4) {
      const pomos = Math.floor(Math.random() * 8) + 1; // 1 to 8 pomodoros
      history[key] = {
        pomodoro: pomos,
        short: Math.floor(pomos * 0.8), // Some short breaks
        long: Math.floor(pomos * 0.2)   // Fewer long breaks
      };
    } else {
        // Empty day
        history[key] = { pomodoro: 0, short: 0, long: 0 };
    }
  }

  useTimeStore.setState({ history });
  alert("🌱 Seeded 14 days of random data!");
  window.location.reload();
};