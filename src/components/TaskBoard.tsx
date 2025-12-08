import { useState } from 'react';
import { useTaskStore } from '../store/useTaskStore';
import clsx from 'clsx';

export const TaskBoard = () => {
  const { tasks, activeTaskId, addTask, toggleTask, setActiveTask } = useTaskStore();
  const [input, setInput] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    addTask(input, 1);
    setInput('');
  };

  return (
    <div className="w-full max-w-md mx-auto mt-8 bg-white/10 p-6 rounded-xl backdrop-blur-sm">
      <h2 className="text-xl font-bold text-white mb-4">Tasks</h2>
      
      {/* Active Task Display */}
      <div className="mb-6 text-center">
        <span className="text-gray-400 uppercase text-xs tracking-widest">Current Focus</span>
        <div className="text-white text-lg font-medium">
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

      <div className="space-y-2">
        {tasks.map(task => (
          <div 
            key={task.id}
            onClick={() => setActiveTask(task.id)}
            className={clsx(
              "p-4 rounded cursor-pointer border-l-4 transition-all flex justify-between items-center",
              activeTaskId === task.id ? "bg-white/20 border-red-400" : "bg-black/20 border-transparent hover:bg-black/30"
            )}
          >
            <div className="flex items-center gap-3">
               <button 
                 onClick={(e) => { e.stopPropagation(); toggleTask(task.id); }}
                 className={clsx(
                   "w-6 h-6 rounded-full border-2 flex items-center justify-center",
                   task.completed ? "bg-red-500 border-red-500" : "border-white/40"
                 )}
               >
                 {task.completed && "✓"}
               </button>
               <span className={clsx(task.completed && "line-through text-white/50", "text-white")}>
                 {task.title}
               </span>
            </div>
            <div className="text-white/60 text-sm font-mono">
              {task.actPomodoros}/{task.estPomodoros}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

