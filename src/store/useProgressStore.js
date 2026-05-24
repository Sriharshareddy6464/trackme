import { create } from 'zustand';
import useTrackingStore from './useTrackingStore.js';
import { calcGoalProgress, calcPhaseProgress, calcTaskTodoProgress } from '../utils/progressCalc.js';
import { isOverdue } from '../utils/dateHelpers.js';

/**
 * useProgressStore — selectors that compute progress metrics from useTrackingStore.
 *
 * No persistence needed — all values are derived from useTrackingStore.
 */
const useProgressStore = create(() => ({
  /**
   * Returns the percentage of phases with status 'done' for a given goal.
   * @param {string} goalId
   * @returns {number} 0–100
   */
  getGoalProgress: (goalId) => {
    const { goals, phases } = useTrackingStore.getState();
    const goal = goals[goalId];
    if (!goal) return 0;
    const goalPhases = (goal.phaseIds ?? []).map((pid) => phases[pid]).filter(Boolean);
    return calcGoalProgress(goalPhases);
  },

  /**
   * Returns the percentage of tasks with status 'completed' for a given phase.
   * @param {string} phaseId
   * @returns {number} 0–100
   */
  getPhaseProgress: (phaseId) => {
    const { phases, tasks } = useTrackingStore.getState();
    const phase = phases[phaseId];
    if (!phase) return 0;
    const phaseTasks = (phase.taskIds ?? []).map((tid) => tasks[tid]).filter(Boolean);
    return calcPhaseProgress(phaseTasks);
  },

  /**
   * Returns the percentage of todos with completed === true for a given task.
   * @param {string} taskId
   * @returns {number} 0–100
   */
  getTaskTodoProgress: (taskId) => {
    const { tasks, todos } = useTrackingStore.getState();
    const task = tasks[taskId];
    if (!task) return 0;
    const taskTodos = (task.todoIds ?? []).map((tdid) => todos[tdid]).filter(Boolean);
    return calcTaskTodoProgress(taskTodos);
  },

  /**
   * Returns aggregate metrics across all goals and tasks.
   * @returns {{ totalGoals: number, activelyWorking: number, completedThisMonth: number, overdueTasks: number }}
   */
  getMetrics: () => {
    const { goals, tasks } = useTrackingStore.getState();
    const allGoals = Object.values(goals);
    const allTasks = Object.values(tasks);

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const totalGoals = allGoals.length;

    const activelyWorking = allGoals.filter((g) => g.status === 'active').length;

    const completedThisMonth = allGoals.filter((g) => {
      if (g.status !== 'completed') return false;
      try {
        const updated = new Date(g.updatedAt);
        return updated >= monthStart && updated <= monthEnd;
      } catch {
        return false;
      }
    }).length;

    const overdueTasks = allTasks.filter((t) => {
      if (t.status === 'completed' || t.status === 'discarded') return false;
      return isOverdue(t.dueDate);
    }).length;

    return { totalGoals, activelyWorking, completedThisMonth, overdueTasks };
  },
}));

export default useProgressStore;
