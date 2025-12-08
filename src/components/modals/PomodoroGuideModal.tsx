import { Modal } from '../common/Modal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const PomodoroGuideModal = ({ isOpen, onClose }: Props) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="The Pomodoro Technique">
      <div className="space-y-6 text-sm leading-relaxed text-white/80">
        <div>
          <p className="font-semibold text-white mb-2">What is PomoZen?</p>
          <p>
            PomoZen is a customizable, privacy-first focus timer designed to help you enter flow state.
            It is inspired by the <a href="https://www.pomodorotechnique.com/" target="_blank" rel="noopener noreferrer" className="text-[var(--theme-primary)] hover:underline font-medium">Pomodoro Technique®</a>,
            a time management method developed by Francesco Cirillo.
          </p>
        </div>

        <div>
          <p className="font-semibold text-white mb-2">What is the Pomodoro Technique?</p>
          <p>
            The Pomodoro Technique is a time management method developed by Francesco Cirillo in the late 1980s. It uses a timer to break work into intervals, traditionally 25 minutes in length, separated by short breaks.
          </p>
        </div>

        <div>
          <p className="font-semibold text-white mb-2">How to use PomoZen</p>
          <ul className="space-y-1">
            <li>• <strong className="text-white">Add a Task:</strong> Use the task input to define what you want to work on.</li>
            <li>• <strong className="text-white">Start the Timer:</strong> Click Start to begin your 25-minute focus session.</li>
            <li>• <strong className="text-white">Work until the Alarm:</strong> Focus exclusively on the task. No distractions.</li>
            <li>• <strong className="text-white">Take a Break:</strong> When the alarm rings, take a 5-minute break.</li>
            <li>• <strong className="text-white">Repeat:</strong> After 4 cycles, take a longer 15-minute break.</li>
          </ul>
        </div>

        <div>
          <p className="font-semibold text-white mb-2">Why choose PomoZen?</p>
          <p>
            Unlike other timers, PomoZen works entirely offline. Your data is stored in your browser's Local Storage, ensuring 100% privacy. With built-in features like Zen Mode (Ambient Soundscapes) and History Tracking, it's designed to help you enter a flow state faster.
          </p>
        </div>
      </div>
    </Modal>
  );
};
