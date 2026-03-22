import { useSettingsStore } from '../../store/useSettingsStore';
import { useTimeStore } from '../../store/useTimeStore';
import {
  getCurrentStreak,
  getDailyGoalProgress,
} from '../../utils/historyInsights';

const pluralize = (count: number, singular: string) =>
  `${count} ${singular}${count === 1 ? '' : 's'}`;

export const DailyGoalCard = () => {
  const history = useTimeStore((state) => state.history);
  const dailyGoalPomodoros = useSettingsStore(
    (state) => state.dailyGoalPomodoros
  );

  const progress = getDailyGoalProgress(history, dailyGoalPomodoros);
  const focusStreak = getCurrentStreak(history, 1);
  const goalStreak = getCurrentStreak(history, dailyGoalPomodoros);

  const helperText = progress.met
    ? 'Goal reached for today. Keep the momentum going.'
    : !focusStreak.includesToday && focusStreak.count > 0
      ? `Start one session today to keep your ${pluralize(focusStreak.count, 'day')} focus streak alive.`
      : `${pluralize(progress.remaining, 'pomodoro')} left to hit today's goal.`;

  return (
    <section className="goal-card w-full max-w-md rounded-2xl border border-white/10 bg-black/30 p-4 sm:p-5 shadow-2xl backdrop-blur-md">
      <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">
            Daily Goal
          </p>
          <h2 className="text-lg font-bold text-white">
            {progress.completed}/{progress.goal} pomodoros
          </h2>
        </div>

        <div className="self-start rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80 sm:self-auto">
          {progress.met ? 'Goal hit' : `${progress.percent}% there`}
        </div>
      </div>

      <div
        className="mt-4 h-3 overflow-hidden rounded-full border border-white/10 bg-black/20"
        aria-label={`Daily goal progress: ${progress.completed} of ${progress.goal} pomodoros completed`}
      >
        <div
          className="h-full rounded-full bg-white transition-[width] duration-500"
          style={{ width: `${progress.percent}%` }}
        />
      </div>

      <p className="mt-3 text-xs sm:text-sm text-white/75">{helperText}</p>

      <div className="mt-4 grid grid-cols-3 gap-1.5 sm:gap-2">
        <div className="min-w-0 rounded-xl border border-white/5 bg-white/5 p-2.5 sm:p-3 text-center">
          <div className="truncate text-base sm:text-lg font-bold text-white">{progress.remaining}</div>
          <div className="text-[10px] uppercase tracking-wider leading-tight text-white/45">
            Left Today
          </div>
        </div>
        <div className="min-w-0 rounded-xl border border-white/5 bg-white/5 p-2.5 sm:p-3 text-center">
          <div className="truncate text-base sm:text-lg font-bold text-white">{focusStreak.count}</div>
          <div className="text-[10px] uppercase tracking-wider leading-tight text-white/45">
            Focus Streak
          </div>
        </div>
        <div className="min-w-0 rounded-xl border border-white/5 bg-white/5 p-2.5 sm:p-3 text-center">
          <div className="truncate text-base sm:text-lg font-bold text-white">{goalStreak.count}</div>
          <div className="text-[10px] uppercase tracking-wider leading-tight text-white/45">
            Goal Streak
          </div>
        </div>
      </div>
    </section>
  );
};
