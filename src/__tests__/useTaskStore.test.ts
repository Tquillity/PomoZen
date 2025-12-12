import { describe, it, expect, beforeEach } from 'vitest';
import { useTaskStore } from '../store/useTaskStore';

describe('useTaskStore', () => {
  beforeEach(() => {
    useTaskStore.setState({
      tasks: [],
      activeTaskId: null
    });
  });

  describe('addTask', () => {
    it('should add a new task', () => {
      const { addTask } = useTaskStore.getState();
      addTask('Test Task', 3);
      
      const tasks = useTaskStore.getState().tasks;
      expect(tasks).toHaveLength(1);
      expect(tasks[0].title).toBe('Test Task');
      expect(tasks[0].estPomodoros).toBe(3);
      expect(tasks[0].actPomodoros).toBe(0);
      expect(tasks[0].completed).toBe(false);
      expect(tasks[0].id).toBeDefined();
    });

    it('should trim task title', () => {
      const { addTask } = useTaskStore.getState();
      addTask('  Trimmed Task  ', 2);
      
      expect(useTaskStore.getState().tasks[0].title).toBe('Trimmed Task');
    });

    it('should limit title to 100 characters', () => {
      const { addTask } = useTaskStore.getState();
      const longTitle = 'a'.repeat(150);
      addTask(longTitle, 1);
      
      expect(useTaskStore.getState().tasks[0].title).toHaveLength(100);
    });
  });

  describe('deleteTask', () => {
    it('should delete a task', () => {
      const { addTask, deleteTask } = useTaskStore.getState();
      addTask('Task 1', 1);
      addTask('Task 2', 2);
      const taskId = useTaskStore.getState().tasks[0].id;
      
      deleteTask(taskId);
      
      expect(useTaskStore.getState().tasks).toHaveLength(1);
      expect(useTaskStore.getState().tasks[0].title).toBe('Task 2');
    });

    it('should clear activeTaskId if deleted task was active', () => {
      const { addTask, deleteTask, setActiveTask } = useTaskStore.getState();
      addTask('Active Task', 1);
      const taskId = useTaskStore.getState().tasks[0].id;
      setActiveTask(taskId);
      
      deleteTask(taskId);
      
      expect(useTaskStore.getState().activeTaskId).toBeNull();
    });
  });

  describe('toggleTask', () => {
    it('should toggle task completion', () => {
      const { addTask, toggleTask } = useTaskStore.getState();
      addTask('Task', 1);
      const taskId = useTaskStore.getState().tasks[0].id;
      
      toggleTask(taskId);
      
      expect(useTaskStore.getState().tasks[0].completed).toBe(true);
      
      toggleTask(taskId);
      
      expect(useTaskStore.getState().tasks[0].completed).toBe(false);
    });
  });

  describe('setActiveTask', () => {
    it('should set active task', () => {
      const { addTask, setActiveTask } = useTaskStore.getState();
      addTask('Task', 1);
      const taskId = useTaskStore.getState().tasks[0].id;
      
      setActiveTask(taskId);
      
      expect(useTaskStore.getState().activeTaskId).toBe(taskId);
    });

    it('should clear active task', () => {
      const { addTask, setActiveTask } = useTaskStore.getState();
      addTask('Task', 1);
      const taskId = useTaskStore.getState().tasks[0].id;
      setActiveTask(taskId);
      
      setActiveTask(null);
      
      expect(useTaskStore.getState().activeTaskId).toBeNull();
    });
  });

  describe('updateActPomo', () => {
    it('should increment actual pomodoros', () => {
      const { addTask, updateActPomo } = useTaskStore.getState();
      addTask('Task', 3);
      const taskId = useTaskStore.getState().tasks[0].id;
      
      updateActPomo(taskId);
      
      expect(useTaskStore.getState().tasks[0].actPomodoros).toBe(1);
      
      updateActPomo(taskId);
      
      expect(useTaskStore.getState().tasks[0].actPomodoros).toBe(2);
    });

    it('should not affect other tasks', () => {
      const { addTask, updateActPomo } = useTaskStore.getState();
      addTask('Task 1', 1);
      addTask('Task 2', 1);
      const task1Id = useTaskStore.getState().tasks[0].id;
      
      updateActPomo(task1Id);
      
      expect(useTaskStore.getState().tasks[0].actPomodoros).toBe(1);
      expect(useTaskStore.getState().tasks[1].actPomodoros).toBe(0);
    });
  });

  describe('clearTasks', () => {
    it('should clear all tasks and active task', () => {
      const { addTask, setActiveTask, clearTasks } = useTaskStore.getState();
      addTask('Task 1', 1);
      addTask('Task 2', 2);
      const taskId = useTaskStore.getState().tasks[0].id;
      setActiveTask(taskId);
      
      clearTasks();
      
      expect(useTaskStore.getState().tasks).toHaveLength(0);
      expect(useTaskStore.getState().activeTaskId).toBeNull();
    });
  });

  describe('clearCompletedTasks', () => {
    it('should remove only completed tasks', () => {
      const { addTask, toggleTask, clearCompletedTasks } = useTaskStore.getState();
      addTask('Task 1', 1);
      addTask('Task 2', 2);
      addTask('Task 3', 3);
      
      const task1Id = useTaskStore.getState().tasks[0].id;
      const task2Id = useTaskStore.getState().tasks[1].id;
      
      toggleTask(task1Id);
      toggleTask(task2Id);
      
      clearCompletedTasks();
      
      const tasks = useTaskStore.getState().tasks;
      expect(tasks).toHaveLength(1);
      expect(tasks[0].title).toBe('Task 3');
    });

    it('should clear activeTaskId if active task was completed', () => {
      const { addTask, toggleTask, setActiveTask, clearCompletedTasks } = useTaskStore.getState();
      addTask('Task 1', 1);
      const taskId = useTaskStore.getState().tasks[0].id;
      setActiveTask(taskId);
      toggleTask(taskId);
      
      clearCompletedTasks();
      
      expect(useTaskStore.getState().activeTaskId).toBeNull();
    });

    it('should keep activeTaskId if active task was not completed', () => {
      const { addTask, toggleTask, setActiveTask, clearCompletedTasks } = useTaskStore.getState();
      addTask('Task 1', 1);
      addTask('Task 2', 1);
      const task1Id = useTaskStore.getState().tasks[0].id;
      const task2Id = useTaskStore.getState().tasks[1].id;
      setActiveTask(task1Id);
      toggleTask(task2Id); // Complete different task
      
      clearCompletedTasks();
      
      expect(useTaskStore.getState().activeTaskId).toBe(task1Id);
    });
  });
});
