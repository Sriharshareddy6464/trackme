import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Badge } from '@/components/ui';
import { formatDate, isOverdue, isWithin48Hours } from '@/utils/dateHelpers';
import useTrackingStore from '@/store/useTrackingStore';

/** Maps priority values to badge colors — same as GoalCard. */
const PRIORITY_COLORS = {
  low: '#1d9e75',
  medium: '#ef9f27',
  high: '#d85a30',
  critical: '#d85a30',
};

/**
 * KanbanCard — a draggable task card for the Working (Kanban) board.
 *
 * @param {object}   task          - Task entity from the store
 * @param {boolean}  isDragging    - Whether this card is currently being dragged
 * @param {function} onContextMenu - Called with taskId when the "..." button is clicked
 */
function KanbanCard({ task, isDragging = false, onContextMenu }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });

  const { goals, phases, todos } = useTrackingStore();

  // Breadcrumb: look up goal and phase titles
  const phase = phases[task.phaseId];
  const goal = goals[task.goalId];
  const goalTitle = goal?.title ?? '';
  const phaseTitle = phase?.title ?? '';

  // Checklist progress
  const todoIds = task.todoIds ?? [];
  const totalTodos = todoIds.length;
  const completedTodos = todoIds.filter((id) => todos[id]?.completed).length;

  // Due date border
  const overdue = isOverdue(task.dueDate);
  const within48 = !overdue && isWithin48Hours(task.dueDate);

  let borderColor = 'var(--color-border)';
  if (overdue) borderColor = 'var(--color-accent-coral)';
  else if (within48) borderColor = 'var(--color-accent-amber)';

  const style = {
    transform: CSS.Translate.toString(transform),
    background: 'var(--color-bg-card)',
    borderRadius: '8px',
    padding: '14px',
    marginBottom: '8px',
    cursor: isDragging ? 'grabbing' : 'grab',
    opacity: isDragging ? 0.6 : 1,
    border: `1px solid ${borderColor}`,
    position: 'relative',
    userSelect: 'none',
  };

  const titleStyle = {
    fontSize: '14px',
    fontWeight: 700,
    color: 'var(--color-text-primary)',
    margin: '0 0 4px 0',
    paddingRight: '24px', // room for the "..." button
  };

  const breadcrumbStyle = {
    fontSize: '11px',
    color: 'var(--color-text-secondary)',
    marginBottom: '8px',
  };

  const metaRowStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    flexWrap: 'wrap',
    marginTop: '8px',
  };

  const dueDateStyle = {
    fontSize: '12px',
    color: 'var(--color-text-secondary)',
  };

  const checklistStyle = {
    fontSize: '12px',
    color: 'var(--color-text-secondary)',
    marginTop: '6px',
  };

  const moreButtonStyle = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'none',
    border: 'none',
    color: 'var(--color-text-secondary)',
    cursor: 'pointer',
    fontSize: '16px',
    lineHeight: 1,
    padding: '2px 4px',
    borderRadius: '4px',
  };

  const priorityColor = PRIORITY_COLORS[task.priority] ?? '#8888a0';

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {/* "..." context menu button — stop propagation so it doesn't trigger drag */}
      <button
        style={moreButtonStyle}
        onClick={(e) => {
          e.stopPropagation();
          onContextMenu?.(task.id, e);
        }}
        onPointerDown={(e) => e.stopPropagation()}
        aria-label="Task options"
        title="Task options"
      >
        ···
      </button>

      <p style={titleStyle}>{task.title}</p>

      {(goalTitle || phaseTitle) && (
        <p style={breadcrumbStyle}>
          {goalTitle}
          {goalTitle && phaseTitle ? ' → ' : ''}
          {phaseTitle}
        </p>
      )}

      <div style={metaRowStyle}>
        <Badge label={task.priority ?? 'low'} color={priorityColor} />
        {task.dueDate && (
          <span style={dueDateStyle}>{formatDate(task.dueDate)}</span>
        )}
        {(task.tags ?? []).map((tag) => (
          <Badge
            key={tag}
            label={tag}
            color="#8888a0"
            style={{ fontSize: '10px', padding: '2px 6px' }}
          />
        ))}
      </div>

      {totalTodos > 0 && (
        <p style={checklistStyle}>
          ✓ {completedTodos}/{totalTodos}
        </p>
      )}
    </div>
  );
}

export default KanbanCard;
