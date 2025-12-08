export const LandingContent = () => {
  return (
    <article className="max-w-2xl mx-auto px-6 py-16 text-gray-400 space-y-8 border-t border-white/10 mt-12">
      <header className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-white">The Pomodoro Technique: Master Your Workflow</h1>
        <p>A simple guide to using PomoZen for maximum productivity.</p>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-200">What is the Pomodoro Technique?</h2>
        <p>
          The Pomodoro Technique is a time management method developed by Francesco Cirillo in the late 1980s.
          It uses a timer to break work into intervals, traditionally 25 minutes in length, separated by short breaks.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-200">How to use PomoZen</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Add a Task:</strong> Use the task input to define what you want to work on.</li>
          <li><strong>Start the Timer:</strong> Click Start to begin your 25-minute focus session.</li>
          <li><strong>Work until the Alarm:</strong> Focus exclusively on the task. No distractions.</li>
          <li><strong>Take a Break:</strong> When the alarm rings, take a 5-minute break.</li>
          <li><strong>Repeat:</strong> After 4 cycles, take a longer 15-minute break.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-200">Why choose PomoZen?</h2>
        <p>
          Unlike other timers, PomoZen works entirely <strong>offline</strong>. Your data is stored in your browser's
          Local Storage, ensuring 100% privacy. With built-in features like <em>Zen Mode</em> (Ambient Soundscapes)
          and History Tracking, it's designed to help you enter a flow state faster.
        </p>
      </section>
    </article>
  );
};
