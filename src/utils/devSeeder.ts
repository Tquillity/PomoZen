import { useTimeStore } from '../store/useTimeStore';
import { subDays, format } from 'date-fns';

export const seedDevData = () => {
  const history: Record<string, { pomodoro: number; short: number; long: number }> = {};

  // Generate 2 years (730 days) of data
  const daysToGenerate = 730;
  
  for (let i = 0; i < daysToGenerate; i++) {
    const date = subDays(new Date(), i);
    const key = format(date, 'yyyy-MM-dd');

    // Realistic patterns:
    // - Weekends (Sat/Sun) have lower activity (30% chance)
    // - Weekdays have higher activity (70% chance)
    // - Some days are completely off (10% chance even on weekdays)
    const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const workChance = isWeekend ? 0.3 : 0.7;
    
    // 10% chance of completely off day regardless of weekday
    const isOffDay = Math.random() < 0.1;
    
    if (!isOffDay && Math.random() < workChance) {
      // Generate realistic pomodoro counts
      // Weekdays: 2-12 pomodoros (more productive)
      // Weekends: 0-6 pomodoros (lighter work)
      const maxPomos = isWeekend ? 6 : 12;
      const minPomos = isWeekend ? 0 : 2;
      const pomos = Math.floor(Math.random() * (maxPomos - minPomos + 1)) + minPomos;
      
      if (pomos > 0) {
        // Short breaks: roughly 80% of pomodoros (most sessions)
        // Long breaks: roughly 20% of pomodoros (every 4-5 sessions)
        history[key] = {
          pomodoro: pomos,
          short: Math.floor(pomos * 0.8),
          long: Math.floor(pomos * 0.2)
        };
      } else {
        history[key] = { pomodoro: 0, short: 0, long: 0 };
      }
    } else {
      history[key] = { pomodoro: 0, short: 0, long: 0 };
    }
  }

  useTimeStore.setState({ history });
  alert("Seeded 2 years (730 days) of realistic dev data.");
  window.location.reload();
};