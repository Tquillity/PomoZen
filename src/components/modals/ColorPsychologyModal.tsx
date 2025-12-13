import { Modal } from '../common/Modal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ColorPsychologyModal = ({ isOpen, onClose }: Props) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Color Psychology in PomoZen">
      <div className="space-y-5 text-sm leading-relaxed text-white/80">
        <p>PomoZen deliberately uses different background colors for each timer mode to support your cognitive and emotional state, based on decades of peer-reviewed color psychology research.</p>

        <ul className="space-y-4">
          <li><strong className="text-white">Pomodoro (Focus) – Soft warm red (#c15c5c)</strong><br/>Provides gentle arousal and urgency to overcome procrastination and enter flow, without the anxiety that bright red can trigger. Red is the traditional "tomato" color and increases attention to detail.</li>
          <li><strong className="text-white">Short Break – Refreshing mint-teal (#52a89a)</strong><br/>Quick emotional reset with nature/water associations. Green-blue hues are proven to reduce stress fastest and restore attention rapidly.</li>
          <li><strong className="text-white">Long Break – Deep indigo-blue (#2c5578)</strong><br/>Maximum calm, clarity, and recovery. Blue consistently lowers heart rate/cortisol and is rated the #1 color for sustained concentration and relaxation in workplace studies.</li>
        </ul>

        <p className="font-medium text-white">This warm → refreshing → cool progression mirrors the natural energy cycle of the Pomodoro Technique itself.</p>

        <div className="pt-4 border-t border-white/10">
          <p className="font-semibold mb-2 text-white/80">Scientific sources:</p>
          <ul className="text-xs space-y-1 text-white/60">
            <li>• Elliot & Maier (2012). <a href="https://www.sciencedirect.com/science/article/abs/pii/B9780123942869000020" className="text-white underline hover:text-white/80" target="_blank" rel="noopener noreferrer">Color-in-Context Theory</a></li>
            <li>• Gnambs et al. (2015). <a href="https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2015.00368/full" className="text-white underline hover:text-white/80" target="_blank" rel="noopener noreferrer">Color and psychological functioning review</a></li>
            <li>• YesColours (2024). <a href="https://yescolours.com/blogs/news/science-behind-colours-for-focus-and-calm" className="text-white underline hover:text-white/80" target="_blank" rel="noopener noreferrer">The Science Behind Colours That Boost Focus and Calm</a></li>
          </ul>
        </div>
      </div>
    </Modal>
  );
};
