
interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ColorPsychologyModal = ({ isOpen, onClose }: Props) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 text-gray-800 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Color Psychology in PomoZen</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100" aria-label="Close">✕</button>
        </div>

        <div className="space-y-5 text-sm leading-relaxed">
          <p>PomoZen deliberately uses different background colors for each timer mode to support your cognitive and emotional state, based on decades of peer-reviewed color psychology research.</p>

          <ul className="space-y-4">
            <li><strong>Pomodoro (Focus) – Soft warm red (#c15c5c)</strong><br/>Provides gentle arousal and urgency to overcome procrastination and enter flow, without the anxiety that bright red can trigger. Red is the traditional "tomato" color and increases attention to detail.</li>
            <li><strong>Short Break – Refreshing mint-teal (#52a89a)</strong><br/>Quick emotional reset with nature/water associations. Green-blue hues are proven to reduce stress fastest and restore attention rapidly.</li>
            <li><strong>Long Break – Deep indigo-blue (#2c5578)</strong><br/>Maximum calm, clarity, and recovery. Blue consistently lowers heart rate/cortisol and is rated the #1 color for sustained concentration and relaxation in workplace studies.</li>
          </ul>

          <p className="font-medium">This warm → refreshing → cool progression mirrors the natural energy cycle of the Pomodoro Technique itself.</p>

          <div className="pt-4 border-t">
            <p className="font-semibold mb-2">Scientific sources:</p>
            <ul className="text-xs space-y-1">
              <li>• Elliot & Maier (2012). <a href="https://www.sciencedirect.com/science/article/abs/pii/B9780123942869000020" className="text-blue-600 underline" target="_blank">Color-in-Context Theory</a></li>
              <li>• Gnambs et al. (2015). <a href="https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2015.00368/full" className="text-blue-600 underline" target="_blank">Color and psychological functioning review</a></li>
              <li>• YesColours (2024). <a href="https://yescolours.com/blogs/news/science-behind-colours-for-focus-and-calm" className="text-blue-600 underline" target="_blank">The Science Behind Colours That Boost Focus and Calm</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
