import { useState, useRef, useEffect } from 'react';
import { useTaskStore } from '../store/useTaskStore';
import clsx from 'clsx';

export const TaskBoard = () => {
  const {
    tasks,
    activeTaskId,
    addTask,
    toggleTask,
    setActiveTask,
    deleteTask,
    clearTasks,
    clearCompletedTasks
  } = useTaskStore();
  const [input, setInput] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    addTask(input, 1);
    setInput('');
  };

  return (
    // Updated container styles for a "Solid Component" look
    <div className="w-full max-w-md bg-black/30 border border-white/10 shadow-2xl p-6 rounded-2xl backdrop-blur-md flex flex-col h-full max-h-[400px] relative overflow-hidden transition-all">

      {/* Header */}
      <div className="flex justify-between items-center mb-4 shrink-0 z-10">
        <h2 className="text-xl font-bold text-white tracking-tight">Tasks</h2>

        <div ref={menuRef} className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Task Options"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
            </svg>
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-50 overflow-hidden text-gray-800 ring-1 ring-black/5">
              <button
                onClick={() => { clearCompletedTasks(); setIsMenuOpen(false); }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm transition-colors"
              >
                Clear Completed
              </button>
              <button
                onClick={() => { clearTasks(); setIsMenuOpen(false); }}
                className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 text-sm transition-colors border-t border-gray-100"
              >
                Clear All
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Current Focus Section */}
      <div className="mb-4 bg-white/5 rounded-lg p-3 text-center border border-white/5 shrink-0">
        <span className="text-white/50 uppercase text-[10px] tracking-widest font-bold block mb-1">Current Focus</span>
        <div className="text-white text-base font-medium truncate">
            {tasks.find(t => t.id === activeTaskId)?.title || "No active task"}
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleAdd} className="flex gap-2 mb-4 shrink-0">
        <label htmlFor="new-task-input" className="sr-only">New Task Name</label>
        <input
          id="new-task-input"
          name="new-task"
          autoComplete="off"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="New task..."
          className="flex-1 bg-black/20 text-white placeholder-white/30 px-3 py-2 rounded-lg text-sm border border-transparent focus:border-white/30 focus:outline-none focus:bg-black/40 transition-all"
        />
        <button type="submit" aria-label="Add Task" className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-medium cursor-pointer text-sm transition-colors border border-white/5">
          +
        </button>
      </form>

      {/* Scrollable Task List */}
      <div className="space-y-2 overflow-y-auto custom-scrollbar flex-1 min-h-0 pr-1 -mr-2">
        {tasks.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-white/30 text-sm italic min-h-[100px]">
                <p>Stay focused.</p>
                <p>Add a task above.</p>
            </div>
        )}
        {tasks.map(task => (
          <button
            key={task.id}
            onClick={() => setActiveTask(task.id)}
            type="button"
            className={clsx(
              "group w-full text-left p-3 rounded-lg cursor-pointer border transition-all flex justify-between items-center outline-none focus-visible:ring-2 focus-visible:ring-white/50",
              activeTaskId === task.id
                ? "bg-(--theme-primary)/40 border-white/30 shadow-lg translate-x-1"
                : "bg-white/5 border-transparent hover:bg-white/10 hover:border-white/10"
            )}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
               <button
                 onClick={(e) => { e.stopPropagation(); toggleTask(task.id); }}
                 className={clsx(
                   "w-5 h-5 rounded-full border shrink-0 flex items-center justify-center transition-all",
                   task.completed ? "bg-green-500 border-green-500" : "border-white/30 hover:border-white"
                 )}
               >
                 {task.completed && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>}
               </button>
               <span className={clsx(
                   "truncate text-sm transition-colors",
                   task.completed ? "line-through text-white/40" : "text-white/90"
               )}>
                 {task.title}
               </span>
            </div>

            <div className="flex items-center gap-3 pl-2">
                <div className="text-white/60 text-[10px] font-mono bg-black/20 px-1.5 py-0.5 rounded">
                  {task.actPomodoros}/{task.estPomodoros}
                </div>

                <button
                    onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
                    className="text-white/20 hover:text-red-400 p-1 rounded transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 focus:text-red-400"
                    aria-label={`Delete task: ${task.title}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};