import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Badge, ProgressBar } from '@/components/ui';
import { formatDateRange } from '@/utils/dateHelpers';

/** Maps phase status to Badge variant. */
const STATUS_VARIANTS = {
  not_started: 'queued',
  in_progress: 'active',
  done: 'done',
  blocked: 'blocked',
};

/** Human-readable status labels. */
const STATUS_LABELS = {
  not_started: 'Not Started',
  in_progress: 'In Progress',
  done: 'Done',
  blocked: 'Blocked',
};

/**
 * PhaseCard — sortable card representing a phase within a goal.
 *
 * @param {object}   phase      - Phase entity from the store
 * @param {string}   goalTitle  - Parent goal's title (shown as muted sub-text)
 * @param {boolean}  isSelected - Whether this card is currently selected
 * @param {function} onClick    - Called when the card is clicked
 * @param {number}   progress   - 0–100 progress value
 * @param {boolean}  isDragging - Whether this card is being dragged
 */
function PhaseCard({ phase, goalTitle, isSelected = false, onClick, progress = 0, isDragging = false }) {
  const [hovered, setHovered] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: phase.id,
  });

  const sortableStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const cardStyle = {
    background: 'var(--color-bg-card)',
    borderRadius: '8px',
    padding: '14px',
    marginBottom: '8px',
    cursor: 'pointer',
    border: '1px solid var(--color-border)',
    transition: 'transform 0.15s, box-shadow 0.15s',
    opacity: isDragging ? 0.5 : 1,
    ...(isSelected
      ? {
          outline: '2px solid var(--color-accent-primary)',
          outlineOffset: '2px',
        }
      : {}),
    ...(hovered && !isDragging
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
    margin: 0,
    marginBottom: '2px',
  };

  const goalTitleStyle = {
    fontSize: '11px',
    color: 'var(--color-text-muted)',
    marginBottom: '6px',
  };

  const footerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '8px',
  };

  const dateStyle = {
    fontSize: '11px',
    color: 'var(--color-text-muted)',
  };

  const variant = STATUS_VARIANTS[phase.status] ?? 'queued';
  const label = STATUS_LABELS[phase.status] ?? phase.status;
  const dateRange = formatDateRange(phase.startDate, phase.endDate);

  return (
    <div
      ref={setNodeRef}
      style={{ ...sortableStyle }}
      {...attributes}
      {...listeners}
    >
      <div
        style={cardStyle}
        onClick={() => onClick?.(phase.id)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onClick?.(phase.id)}
        aria-pressed={isSelected}
      >
        <p style={titleStyle}>{phase.title}</p>
        {goalTitle && <p style={goalTitleStyle}>{goalTitle}</p>}

        <Badge variant={variant} label={label} style={{ marginBottom: '6px' }} />

        <ProgressBar value={progress} />

        <div style={footerStyle}>
          {dateRange && <span style={dateStyle}>{dateRange}</span>}
        </div>
      </div>
    </div>
  );
}

export default PhaseCard;
