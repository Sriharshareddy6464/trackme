import React, { useState } from 'react';
import { Badge, ProgressBar } from '@/components/ui';
import { formatDate } from '@/utils/dateHelpers';

/** Maps priority values to badge colors. */
const PRIORITY_COLORS = {
  low: '#1d9e75',       // teal
  medium: '#ef9f27',    // amber
  high: '#d85a30',      // coral
  critical: '#d85a30',  // coral (same as spec)
};

/**
 * GoalCard — displays a single goal with progress, priority, and deadline.
 *
 * @param {object}   goal       - Goal entity from the store
 * @param {boolean}  isSelected - Whether this card is currently selected
 * @param {function} onClick    - Called when the card is clicked
 * @param {number}   progress   - 0–100 progress value
 */
function GoalCard({ goal, isSelected = false, onClick, progress = 0 }) {
  const [hovered, setHovered] = useState(false);

  const cardStyle = {
    background: 'var(--color-bg-card)',
    borderRadius: '8px',
    padding: '14px',
    marginBottom: '8px',
    cursor: 'pointer',
    borderLeft: `3px solid ${goal.color ?? 'var(--color-accent-primary)'}`,
    transition: 'transform 0.15s, box-shadow 0.15s',
    ...(isSelected
      ? {
          outline: '2px solid var(--color-accent-primary)',
          outlineOffset: '2px',
        }
      : {}),
    ...(hovered
      ? {
          transform: 'translateY(-1px)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        }
      : {}),
  };

  const titleStyle = {
    fontSize: '14px',
    fontWeight: 700,
    color: 'var(--color-text-primary)',
    marginBottom: '4px',
    margin: 0,
  };

  const descStyle = {
    fontSize: '12px',
    color: 'var(--color-text-secondary)',
    marginBottom: '8px',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    marginTop: '4px',
  };

  const footerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '8px',
  };

  const deadlineStyle = {
    fontSize: '12px',
    color: 'var(--color-text-muted)',
  };

  const priorityColor = PRIORITY_COLORS[goal.priority] ?? '#8888a0';

  return (
    <div
      style={cardStyle}
      onClick={() => onClick?.(goal.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.(goal.id)}
      aria-pressed={isSelected}
    >
      <p style={titleStyle}>{goal.title}</p>
      {goal.description && <p style={descStyle}>{goal.description}</p>}

      <ProgressBar value={progress} style={{ marginBottom: '8px' }} />

      <div style={footerStyle}>
        <Badge
          label={goal.priority ?? 'low'}
          color={priorityColor}
        />
        {goal.deadline && (
          <span style={deadlineStyle}>{formatDate(goal.deadline)}</span>
        )}
      </div>
    </div>
  );
}

export default GoalCard;
