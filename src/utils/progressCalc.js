/**
 * Calculates goal progress as the percentage of phases with status === 'done'.
 * @param {Array} phases - Array of Phase objects
 * @returns {number} 0–100
 */
export function calcGoalProgress(phases) {
  if (!phases || phases.length === 0) return 0;
  const done = phases.filter((p) => p.status === 'done').length;
  return Math.min(100, Math.max(0, (done / phases.length) * 100));
}

/**
 * Calculates phase progress as the percentage of tasks with status === 'completed'.
 * @param {Array} tasks - Array of Task objects
 * @returns {number} 0–100
 */
export function calcPhaseProgress(tasks) {
  if (!tasks || tasks.length === 0) return 0;
  const completed = tasks.filter((t) => t.status === 'completed').length;
  return Math.min(100, Math.max(0, (completed / tasks.length) * 100));
}

/**
 * Calculates task todo progress as the percentage of todos with completed === true.
 * @param {Array} todos - Array of TodoItem objects
 * @returns {number} 0–100
 */
export function calcTaskTodoProgress(todos) {
  if (!todos || todos.length === 0) return 0;
  const done = todos.filter((t) => t.completed === true).length;
  return Math.min(100, Math.max(0, (done / todos.length) * 100));
}
