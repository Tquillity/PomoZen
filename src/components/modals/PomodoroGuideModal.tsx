import { useState } from 'react';
import { Modal } from '../common/Modal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const PomodoroGuideModal = ({ isOpen, onClose }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="The Pomodoro Technique – How & Why It Works">
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full text-left flex items-center justify-between text-white hover:text-gray-300 transition-colors"
        >
          <span className="font-medium">
            Master Your Workflow
          </span>
          <svg
            className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isExpanded && (
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-gray-200">
            <p className="text-gray-300">
              A simple guide to using PomoZen for maximum productivity.
            </p>

            <div>
              <p className="font-semibold text-white mb-2">What is the Pomodoro Technique?</p>
              <p className="text-white/80">
                The Pomodoro Technique is a time management method developed by Francesco Cirillo in the late 1980s. It uses a timer to break work into intervals, traditionally 25 minutes in length, separated by short breaks.
              </p>
            </div>

            <div>
              <p className="font-semibold text-white mb-2">How to use PomoZen</p>
              <ul className="space-y-1 text-white/80">
                <li>• <strong className="text-white">Add a Task:</strong> Use the task input to define what you want to work on.</li>
                <li>• <strong className="text-white">Start the Timer:</strong> Click Start to begin your 25-minute focus session.</li>
                <li>• <strong className="text-white">Work until the Alarm:</strong> Focus exclusively on the task. No distractions.</li>
                <li>• <strong className="text-white">Take a Break:</strong> When the alarm rings, take a 5-minute break.</li>
                <li>• <strong className="text-white">Repeat:</strong> After 4 cycles, take a longer 15-minute break.</li>
              </ul>
            </div>

            <div>
              <p className="font-semibold text-white mb-2">Why choose PomoZen?</p>
              <p className="text-white/80">
                Unlike other timers, PomoZen works entirely offline. Your data is stored in your browser's Local Storage, ensuring 100% privacy. With built-in features like Zen Mode (Ambient Soundscapes) and History Tracking, it's designed to help you enter a flow state faster.
              </p>
            </div>
          </div>
        )}

        {!isExpanded && (
          <p className="mt-2 text-gray-400 text-sm">
            Click to expand for a complete guide...
          </p>
        )}
      </div>
    </Modal>
  );
};
