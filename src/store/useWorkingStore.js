import { create } from 'zustand';
import useTrackingStore from './useTrackingStore.js';

/**
 * useWorkingStore — thin derived store for the Working (Kanban) page.
 *
 * Reads tasks from useTrackingStore and exposes:
 *   getTasksByStatus(status) → Task[]
 *   moveTask(taskId, newStatus) → void
 *
 * No persistence needed — it's a derived view over useTrackingStore.
 */
const useWorkingStore = create(() => ({
  /**
   * Returns all Task objects whose status matches the given value.
   * @param {string} status - One of 'todo' | 'ongoing' | 'completed' | 'discarded'
   * @returns {Task[]}
   */
  getTasksByStatus: (status) => {
    const { tasks } = useTrackingStore.getState();
    return Object.values(tasks).filter((task) => task.status === status);
  },

  /**
   * Updates a task's status in useTrackingStore.
   * @param {string} taskId
   * @param {string} newStatus
   */
  moveTask: (taskId, newStatus) => {
    useTrackingStore.getState().updateTask(taskId, { status: newStatus });
  },
}));

export default useWorkingStore;
