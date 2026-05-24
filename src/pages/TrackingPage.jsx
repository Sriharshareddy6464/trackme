import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { EmptyState } from '@/components/ui';
import { Column } from '@/components/board';
import {
  GoalCard,
  PhaseCard,
  TaskCard,
  TodoList,
  AddGoalModal,
  AddPhaseModal,
  AddTaskModal,
} from '@/components/tracking';
import { CardModal } from '@/components/board';
import useTrackingStore from '@/store/useTrackingStore';
import { calcGoalProgress, calcPhaseProgress } from '@/utils/progressCalc';

/**
 * TrackingPage — four-column board: Goals → Phases → Tasks → To-Do.
 */
function TrackingPage() {
  const goals = useTrackingStore((s) => s.goals);
  const phases = useTrackingStore((s) => s.phases);
  const tasks = useTrackingStore((s) => s.tasks);
  const updateGoal = useTrackingStore((s) => s.updateGoal);
  const reorderPhases = useTrackingStore((s) => s.updateGoal);

  const [selectedGoalId, setSelectedGoalId] = useState(null);
  const [selectedPhaseId, setSelectedPhaseId] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [modalOpen, setModalOpen] = useState(null); // 'goal' | 'phase' | 'task' | null
  const [cardModalTask, setCardModalTask] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  /* ── Derived lists ─────────────────────────────────────────────────────── */

  const goalList = Object.values(goals);

  const selectedGoal = selectedGoalId ? goals[selectedGoalId] : null;
  const phaseList = selectedGoal
    ? (selectedGoal.phaseIds ?? []).map((id) => phases[id]).filter(Boolean)
    : [];

  const selectedPhase = selectedPhaseId ? phases[selectedPhaseId] : null;
  const taskList = selectedPhase
    ? (selectedPhase.taskIds ?? []).map((id) => tasks[id]).filter(Boolean)
    : [];

  /* ── Phase DnD ─────────────────────────────────────────────────────────── */

  function handlePhaseDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id || !selectedGoal) return;
    const phaseIds = selectedGoal.phaseIds ?? [];
    const oldIndex = phaseIds.indexOf(active.id);
    const newIndex = phaseIds.indexOf(over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const reordered = arrayMove(phaseIds, oldIndex, newIndex);
    updateGoal(selectedGoalId, { phaseIds: reordered });
  }

  /* ── Progress helpers ──────────────────────────────────────────────────── */

  function goalProgress(goal) {
    const gPhases = (goal.phaseIds ?? []).map((id) => phases[id]).filter(Boolean);
    return calcGoalProgress(gPhases);
  }

  function phaseProgress(phase) {
    const pTasks = (phase.taskIds ?? []).map((id) => tasks[id]).filter(Boolean);
    return calcPhaseProgress(pTasks);
  }

  /* ── Layout ────────────────────────────────────────────────────────────── */

  const pageStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1px',
    height: '100vh',
    background: 'var(--color-border)',
    overflow: 'hidden',
  };

  return (
    <div style={pageStyle}>
      {/* ── Column 1: Goals ── */}
      <Column
        title="Goals"
        count={goalList.length}
        onAdd={() => setModalOpen('goal')}
        emptyMessage="No goals yet. Add one to get started."
      >
        {goalList.map((goal) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            isSelected={goal.id === selectedGoalId}
            onClick={(id) => {
              setSelectedGoalId(id);
              setSelectedPhaseId(null);
              setSelectedTaskId(null);
            }}
            progress={goalProgress(goal)}
          />
        ))}
      </Column>

      {/* ── Column 2: Phases (sortable) ── */}
      <Column
        title="Phases"
        count={phaseList.length}
        onAdd={selectedGoalId ? () => setModalOpen('phase') : undefined}
        emptyMessage={selectedGoalId ? 'No phases yet.' : 'Select a goal to see its phases.'}
      >
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handlePhaseDragEnd}>
          <SortableContext
            items={(selectedGoal?.phaseIds ?? [])}
            strategy={verticalListSortingStrategy}
          >
            {phaseList.map((phase) => (
              <PhaseCard
                key={phase.id}
                phase={phase}
                goalTitle={selectedGoal?.title ?? ''}
                isSelected={phase.id === selectedPhaseId}
                onClick={(id) => {
                  setSelectedPhaseId(id);
                  setSelectedTaskId(null);
                }}
                progress={phaseProgress(phase)}
              />
            ))}
          </SortableContext>
        </DndContext>
      </Column>

      {/* ── Column 3: Tasks ── */}
      <Column
        title="Tasks"
        count={taskList.length}
        onAdd={selectedPhaseId ? () => setModalOpen('task') : undefined}
        emptyMessage={selectedPhaseId ? 'No tasks yet.' : 'Select a phase to see its tasks.'}
      >
        {taskList.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onClick={(t) => {
              setSelectedTaskId(t.id);
              setCardModalTask(t);
            }}
          />
        ))}
      </Column>

      {/* ── Column 4: To-Do ── */}
      <Column
        title="To-Do"
        count={0}
        emptyMessage="Select a task to see its checklist."
      >
        {selectedTaskId ? (
          <TodoList taskId={selectedTaskId} />
        ) : (
          <EmptyState message="Select a task to see its checklist." />
        )}
      </Column>

      {/* ── Modals ── */}
      <AddGoalModal
        isOpen={modalOpen === 'goal'}
        onClose={() => setModalOpen(null)}
      />
      <AddPhaseModal
        isOpen={modalOpen === 'phase'}
        onClose={() => setModalOpen(null)}
        selectedGoalId={selectedGoalId}
      />
      <AddTaskModal
        isOpen={modalOpen === 'task'}
        onClose={() => setModalOpen(null)}
        selectedPhaseId={selectedPhaseId}
        selectedGoalId={selectedGoalId}
      />
      {cardModalTask && (
        <CardModal
          task={cardModalTask}
          isOpen={!!cardModalTask}
          onClose={() => setCardModalTask(null)}
        />
      )}
    </div>
  );
}

export default TrackingPage;
