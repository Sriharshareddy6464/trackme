import React, { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui';
import { isOverdue, isWithin48Hours, formatDate } from '@/utils/dateHelpers';
import useTrackingStore from '@/store/useTrackingStore';

/** Maps priority values to badge colors. */
const PRIORITY_COLORS = {
  low: '#1d9e75',
  medium: '#ef9f27',
  high: '#d85a30',
  critical: '#d85a30',
};

/**
 * TaskCard — displays a task with due-date warnings, tags, priority, and todo progress.
 *
 * @param {object}   task    - Task entity from the store
 * @param {function} onClick - Called when the card body is clicked
 */
function TaskCard({ task, onClick }) {
  const [hovered, setHovered] = useState(false);
  const deleteTask = useTrackingStore((s) => s.deleteTask);
  const todos = useTrackingStore((s) => s.todos);

  const overdue = isOverdue(task.dueDate);
  const soon = !overdue && isWithin48Hours(task.dueDate);

  const borderColor = overdue
    ? 'var(--color-accent-coral)'
    : soon
    ? 'var(--color-accent-amber)'
    : 'var(--color-border)';

  const cardStyle = {
    background: 'var(--color-bg-card)',
    borderRadius: '8px',
    padding: '14px',
    marginBottom: '8px',
    cursor: 'pointer',
    border: `1px solid ${borderColor}`,
    transition: 'transform 0.15s, box-shadow 0.15s',
    position: 'relative',
    ...(hovered
      ? {
          transform: 'translateY(-1px)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        }
      : {}),
  };

  const titleStyle = {
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--color-text-primary)',
    margin: 0,
    marginBottom: '6px',
    paddingRight: hovered ? '48px' : '0',
  };

  const tagsStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '4px',
    marginBottom: '6px',
  };

  const footerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '6px',
  };

  const dueDateStyle = {
    fontSize: '11px',
    color: overdue ? 'var(--color-accent-coral)' : 'var(--color-text-muted)',
  };

  const todoProgressStyle = {
    fontSize: '11px',
    color: 'var(--color-text-muted)',
  };

  const actionButtonsStyle = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    display: hovered ? 'flex' : 'none',
    gap: '4px',
  };

  const iconBtnStyle = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--color-text-secondary)',
    padding: '4px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'color 0.15s',
  };

  // Compute todo progress
  const todoIds = task.todoIds ?? [];
  const totalTodos = todoIds.length;
  const completedTodos = todoIds.filter((id) => todos[id]?.completed).length;

  const priorityColor = PRIORITY_COLORS[task.priority] ?? '#8888a0';

  return (
    <div
      style={cardStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Hover action buttons */}
      <div style={actionButtonsStyle}>
        <button
          style={iconBtnStyle}
          onClick={(e) => {
            e.stopPropagation();
            onClick?.(task);
          }}
          aria-label="Edit task"
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent-primary)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
        >
          <Pencil size={14} />
        </button>
        <button
          style={iconBtnStyle}
          onClick={(e) => {
            e.stopPropagation();
            deleteTask(task.id);
          }}
          aria-label="Delete task"
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent-coral)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Card body — clicking opens the card modal */}
      <div onClick={() => onClick?.(task)}>
        <p style={titleStyle}>{task.title}</p>

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div style={tagsStyle}>
            {task.tags.map((tag) => (
              <Badge key={tag} label={tag} color="#8888a0" style={{ fontSize: '10px', padding: '2px 6px' }} />
            ))}
          </div>
        )}

        {/* Overdue badge */}
        {overdue && (
          <Badge label="Overdue" color="var(--color-accent-coral)" style={{ marginBottom: '6px' }} />
        )}

        <div style={footerStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Badge label={task.priority ?? 'low'} color={priorityColor} />
            {task.dueDate && (
              <span style={dueDateStyle}>{formatDate(task.dueDate)}</span>
            )}
          </div>
          {totalTodos > 0 && (
            <span style={todoProgressStyle}>
              {completedTodos}/{totalTodos}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskCard;
