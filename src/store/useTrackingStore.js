import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { seedData } from './seedData.js';

const useTrackingStore = create(
  persist(
    (set, get) => ({
      // ── State ──────────────────────────────────────────────────────────────
      goals: {},
      phases: {},
      tasks: {},
      todos: {},

      // ── Goal actions ───────────────────────────────────────────────────────
      addGoal: (data) => {
        const id = uuidv4();
        const now = new Date().toISOString();
        const goal = {
          ...data,
          id,
          phaseIds: data.phaseIds ?? [],
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ goals: { ...state.goals, [id]: goal } }));
        return id;
      },

      updateGoal: (id, data) => {
        set((state) => {
          const existing = state.goals[id];
          if (!existing) return state;
          return {
            goals: {
              ...state.goals,
              [id]: { ...existing, ...data, updatedAt: new Date().toISOString() },
            },
          };
        });
      },

      deleteGoal: (id) => {
        const { phases, tasks, todos } = get();

        // Collect all phase IDs belonging to this goal
        const phaseIds = Object.values(phases)
          .filter((p) => p.goalId === id)
          .map((p) => p.id);

        // Collect all task IDs belonging to those phases
        const taskIds = Object.values(tasks)
          .filter((t) => phaseIds.includes(t.phaseId))
          .map((t) => t.id);

        // Collect all todo IDs belonging to those tasks
        const todoIds = Object.values(todos)
          .filter((td) => taskIds.includes(td.taskId))
          .map((td) => td.id);

        set((state) => {
          const newGoals = { ...state.goals };
          delete newGoals[id];

          const newPhases = { ...state.phases };
          phaseIds.forEach((pid) => delete newPhases[pid]);

          const newTasks = { ...state.tasks };
          taskIds.forEach((tid) => delete newTasks[tid]);

          const newTodos = { ...state.todos };
          todoIds.forEach((tdid) => delete newTodos[tdid]);

          return { goals: newGoals, phases: newPhases, tasks: newTasks, todos: newTodos };
        });
      },

      // ── Phase actions ──────────────────────────────────────────────────────
      addPhase: (data) => {
        const id = uuidv4();
        const phase = { ...data, id, taskIds: data.taskIds ?? [] };
        set((state) => {
          const parentGoal = state.goals[data.goalId];
          const updatedGoal = parentGoal
            ? {
                ...parentGoal,
                phaseIds: [...(parentGoal.phaseIds ?? []), id],
                updatedAt: new Date().toISOString(),
              }
            : parentGoal;
          return {
            phases: { ...state.phases, [id]: phase },
            goals: parentGoal
              ? { ...state.goals, [data.goalId]: updatedGoal }
              : state.goals,
          };
        });
        return id;
      },

      updatePhase: (id, data) => {
        set((state) => {
          const existing = state.phases[id];
          if (!existing) return state;
          return {
            phases: { ...state.phases, [id]: { ...existing, ...data } },
          };
        });
      },

      deletePhase: (id) => {
        const { tasks, todos } = get();

        // Collect task IDs belonging to this phase
        const taskIds = Object.values(tasks)
          .filter((t) => t.phaseId === id)
          .map((t) => t.id);

        // Collect todo IDs belonging to those tasks
        const todoIds = Object.values(todos)
          .filter((td) => taskIds.includes(td.taskId))
          .map((td) => td.id);

        set((state) => {
          const phase = state.phases[id];
          const newPhases = { ...state.phases };
          delete newPhases[id];

          const newTasks = { ...state.tasks };
          taskIds.forEach((tid) => delete newTasks[tid]);

          const newTodos = { ...state.todos };
          todoIds.forEach((tdid) => delete newTodos[tdid]);

          // Remove phaseId from parent goal
          let newGoals = state.goals;
          if (phase?.goalId && state.goals[phase.goalId]) {
            const parentGoal = state.goals[phase.goalId];
            newGoals = {
              ...state.goals,
              [phase.goalId]: {
                ...parentGoal,
                phaseIds: (parentGoal.phaseIds ?? []).filter((pid) => pid !== id),
                updatedAt: new Date().toISOString(),
              },
            };
          }

          return { phases: newPhases, tasks: newTasks, todos: newTodos, goals: newGoals };
        });
      },

      // ── Task actions ───────────────────────────────────────────────────────
      addTask: (data) => {
        const id = uuidv4();
        const now = new Date().toISOString();
        const task = { ...data, id, todoIds: data.todoIds ?? [], createdAt: now };
        set((state) => {
          const parentPhase = state.phases[data.phaseId];
          const updatedPhase = parentPhase
            ? { ...parentPhase, taskIds: [...(parentPhase.taskIds ?? []), id] }
            : parentPhase;
          return {
            tasks: { ...state.tasks, [id]: task },
            phases: parentPhase
              ? { ...state.phases, [data.phaseId]: updatedPhase }
              : state.phases,
          };
        });
        return id;
      },

      updateTask: (id, data) => {
        set((state) => {
          const existing = state.tasks[id];
          if (!existing) return state;
          return {
            tasks: { ...state.tasks, [id]: { ...existing, ...data } },
          };
        });
      },

      deleteTask: (id) => {
        const { todos } = get();

        // Collect todo IDs belonging to this task
        const todoIds = Object.values(todos)
          .filter((td) => td.taskId === id)
          .map((td) => td.id);

        set((state) => {
          const task = state.tasks[id];
          const newTasks = { ...state.tasks };
          delete newTasks[id];

          const newTodos = { ...state.todos };
          todoIds.forEach((tdid) => delete newTodos[tdid]);

          // Remove taskId from parent phase
          let newPhases = state.phases;
          if (task?.phaseId && state.phases[task.phaseId]) {
            const parentPhase = state.phases[task.phaseId];
            newPhases = {
              ...state.phases,
              [task.phaseId]: {
                ...parentPhase,
                taskIds: (parentPhase.taskIds ?? []).filter((tid) => tid !== id),
              },
            };
          }

          return { tasks: newTasks, todos: newTodos, phases: newPhases };
        });
      },

      // ── Todo actions ───────────────────────────────────────────────────────
      addTodo: (data) => {
        const id = uuidv4();
        const todo = { ...data, id };
        set((state) => {
          const parentTask = state.tasks[data.taskId];
          const updatedTask = parentTask
            ? { ...parentTask, todoIds: [...(parentTask.todoIds ?? []), id] }
            : parentTask;
          return {
            todos: { ...state.todos, [id]: todo },
            tasks: parentTask
              ? { ...state.tasks, [data.taskId]: updatedTask }
              : state.tasks,
          };
        });
        return id;
      },

      updateTodo: (id, data) => {
        set((state) => {
          const existing = state.todos[id];
          if (!existing) return state;
          return {
            todos: { ...state.todos, [id]: { ...existing, ...data } },
          };
        });
      },

      deleteTodo: (id) => {
        set((state) => {
          const todo = state.todos[id];
          const newTodos = { ...state.todos };
          delete newTodos[id];

          // Remove todoId from parent task
          let newTasks = state.tasks;
          if (todo?.taskId && state.tasks[todo.taskId]) {
            const parentTask = state.tasks[todo.taskId];
            newTasks = {
              ...state.tasks,
              [todo.taskId]: {
                ...parentTask,
                todoIds: (parentTask.todoIds ?? []).filter((tdid) => tdid !== id),
              },
            };
          }

          return { todos: newTodos, tasks: newTasks };
        });
      },

      reorderTodos: (taskId, orderedIds) => {
        set((state) => {
          const task = state.tasks[taskId];
          if (!task) return state;
          return {
            tasks: { ...state.tasks, [taskId]: { ...task, todoIds: orderedIds } },
          };
        });
      },
    }),
    {
      name: 'trackme-tracking',
      onRehydrateStorage: () => (state) => {
        // Seed data when store is empty after rehydration
        if (state && Object.keys(state.goals).length === 0) {
          seedData((partial) => {
            Object.assign(state, partial);
          });
        }
      },
    }
  )
);

// Seed on first load if goals are empty (handles the case before rehydration completes)
const initialState = useTrackingStore.getState();
if (Object.keys(initialState.goals).length === 0) {
  seedData(useTrackingStore.setState);
}

export default useTrackingStore;
