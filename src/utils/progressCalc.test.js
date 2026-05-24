import { describe, it, expect } from 'vitest';
import { calcGoalProgress, calcPhaseProgress, calcTaskTodoProgress } from './progressCalc';

describe('progressCalc', () => {
  describe('calcGoalProgress', () => {
    it('returns 0 for null', () => {
      expect(calcGoalProgress(null)).toBe(0);
    });

    it('returns 0 for empty array', () => {
      expect(calcGoalProgress([])).toBe(0);
    });

    it('returns 0 when no phases are done', () => {
      const phases = [
        { status: 'not_started' },
        { status: 'in_progress' },
        { status: 'blocked' },
      ];
      expect(calcGoalProgress(phases)).toBe(0);
    });

    it('returns 100 when all phases are done', () => {
      const phases = [{ status: 'done' }, { status: 'done' }];
      expect(calcGoalProgress(phases)).toBe(100);
    });

    it('returns 50 when half the phases are done', () => {
      const phases = [{ status: 'done' }, { status: 'in_progress' }];
      expect(calcGoalProgress(phases)).toBe(50);
    });

    it('returns a value between 0 and 100 inclusive', () => {
      const phases = [{ status: 'done' }, { status: 'not_started' }, { status: 'done' }];
      const result = calcGoalProgress(phases);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(100);
    });
  });

  describe('calcPhaseProgress', () => {
    it('returns 0 for null', () => {
      expect(calcPhaseProgress(null)).toBe(0);
    });

    it('returns 0 for empty array', () => {
      expect(calcPhaseProgress([])).toBe(0);
    });

    it('returns 0 when no tasks are completed', () => {
      const tasks = [{ status: 'todo' }, { status: 'ongoing' }];
      expect(calcPhaseProgress(tasks)).toBe(0);
    });

    it('returns 100 when all tasks are completed', () => {
      const tasks = [{ status: 'completed' }, { status: 'completed' }];
      expect(calcPhaseProgress(tasks)).toBe(100);
    });

    it('returns 50 when half the tasks are completed', () => {
      const tasks = [{ status: 'completed' }, { status: 'todo' }];
      expect(calcPhaseProgress(tasks)).toBe(50);
    });

    it('does not count discarded tasks as completed', () => {
      const tasks = [{ status: 'discarded' }, { status: 'todo' }];
      expect(calcPhaseProgress(tasks)).toBe(0);
    });
  });

  describe('calcTaskTodoProgress', () => {
    it('returns 0 for null', () => {
      expect(calcTaskTodoProgress(null)).toBe(0);
    });

    it('returns 0 for empty array', () => {
      expect(calcTaskTodoProgress([])).toBe(0);
    });

    it('returns 0 when no todos are completed', () => {
      const todos = [{ completed: false }, { completed: false }];
      expect(calcTaskTodoProgress(todos)).toBe(0);
    });

    it('returns 100 when all todos are completed', () => {
      const todos = [{ completed: true }, { completed: true }];
      expect(calcTaskTodoProgress(todos)).toBe(100);
    });

    it('returns 50 when half the todos are completed', () => {
      const todos = [{ completed: true }, { completed: false }];
      expect(calcTaskTodoProgress(todos)).toBe(50);
    });

    it('only counts completed === true (not truthy values)', () => {
      const todos = [{ completed: 1 }, { completed: 'yes' }, { completed: true }];
      // Only the last one has completed === true
      const result = calcTaskTodoProgress(todos);
      expect(result).toBeCloseTo(33.33, 1);
    });
  });
});
