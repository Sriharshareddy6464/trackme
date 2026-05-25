import { useEffect, useRef } from 'react';
import useTrackingStore from '@/store/useTrackingStore';
import { useConfetti } from './useConfetti';

/**
 * Subscribes to tracking store changes and fires confetti when a goal
 * transitions to fully complete (all phases have status === 'done').
 * Each goal only triggers confetti once per session.
 */
export function useGoalCompletionConfetti() {
  const { fire } = useConfetti();
  // Track which goal IDs have already triggered confetti this session
  const firedGoals = useRef(new Set());

  useEffect(() => {
    const checkCompletion = (state) => {
      const { goals, phases } = state;

      Object.values(goals).forEach((goal) => {
        // Skip if already fired for this goal
        if (firedGoals.current.has(goal.id)) return;

        const goalPhases = (goal.phaseIds ?? [])
          .map((pid) => phases[pid])
          .filter(Boolean);

        // Need at least one phase, and all must be 'done'
        if (goalPhases.length > 0 && goalPhases.every((p) => p.status === 'done')) {
          firedGoals.current.add(goal.id);
          fire();
        }
      });
    };

    // Check current state immediately
    checkCompletion(useTrackingStore.getState());

    // Subscribe to future changes
    const unsubscribe = useTrackingStore.subscribe(checkCompletion);
    return unsubscribe;
  }, [fire]);
}
