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

  // Close menu when clicking outside
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
    <div className="w-full max-w-md mx-auto mt-8 bg-white/10 p-6 rounded-xl backdrop-blur-sm">
      <div className="flex justify-between items-center mb-4 relative">
        <h2 className="text-xl font-bold text-white">Tasks</h2>
        
        {/* 3-dots Menu */}
        <div ref={menuRef} className="relative">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Task Options"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
            </svg>
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-50 overflow-hidden text-gray-800">
              <button 
                onClick={() => { clearCompletedTasks(); setIsMenuOpen(false); }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm transition-colors"
              >
                Clear Completed Tasks
              </button>
              <button 
                onClick={() => { clearTasks(); setIsMenuOpen(false); }}
                className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 text-sm transition-colors border-t border-gray-100"
              >
                Clear All Tasks
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Active Task Display */}
      <div className="mb-6 text-center">
        <span className="text-gray-400 uppercase text-xs tracking-widest">Current Focus</span>
        <div className="text-white text-lg font-medium truncate px-4">
            {tasks.find(t => t.id === activeTaskId)?.title || "No active task"}
        </div>
      </div>

      <form onSubmit={handleAdd} className="flex gap-2 mb-4">
        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What are you working on?"
          className="flex-1 bg-black/20 text-white placeholder-white/50 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-white/30"
        />
        <button type="submit" className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded font-bold cursor-pointer">
          Add
        </button>
      </form>

      {/* Task List with Scroller */}
      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
        {tasks.length === 0 && (
            <div className="text-center text-white/40 py-8 text-sm italic">
                No tasks yet. Add one above!
            </div>
        )}
        {tasks.map(task => (
          <div 
            key={task.id}
            onClick={() => setActiveTask(task.id)}
            className={clsx(
              "group p-3 rounded cursor-pointer border-l-4 transition-all flex justify-between items-center",
              activeTaskId === task.id ? "bg-white/20 border-red-400" : "bg-black/20 border-transparent hover:bg-black/30"
            )}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
               <button 
                 onClick={(e) => { e.stopPropagation(); toggleTask(task.id); }}
                 className={clsx(
                   "w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors",
                   task.completed ? "bg-red-500 border-red-500" : "border-white/40 hover:border-white"
                 )}
               >
                 {task.completed && <span className="text-white text-xs">✓</span>}
               </button>
               <span className={clsx(
                   "truncate transition-colors", 
                   task.completed ? "line-through text-white/50" : "text-white"
               )}>
                 {task.title}
               </span>
            </div>
            
            <div className="flex items-center gap-3">
                <div className="text-white/60 text-xs font-mono whitespace-nowrap">
                  {task.actPomodoros}/{task.estPomodoros}
                </div>
                
                {/* Delete Task Button */}
                <button
                    onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
                    className="text-white/30 hover:text-red-400 p-1 rounded transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                    aria-label="Delete Task"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
