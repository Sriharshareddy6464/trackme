import React from 'react';
import { Badge, ProgressBar } from '@/components/ui';

/** Maps phase status to Badge variant (same as PhaseCard). */
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
 * MilestoneBar — a single row inside an expanded GoalRow showing a phase's progress.
 *
 * @param {object} phase    - Phase entity from the store
 * @param {number} progress - 0–100 progress value for this phase
 */
function MilestoneBar({ phase, progress = 0 }) {
  const variant = STATUS_VARIANTS[phase.status] ?? 'queued';
  const label = STATUS_LABELS[phase.status] ?? phase.status;

  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 16px',
    borderTop: '1px solid var(--color-border)',
  };

  const titleStyle = {
    fontSize: '13px',
    color: 'var(--color-text-secondary)',
    minWidth: '120px',
    flexShrink: 0,
  };

  const percentStyle = {
    fontSize: '12px',
    color: 'var(--color-text-muted)',
    flexShrink: 0,
    minWidth: '36px',
    textAlign: 'right',
  };

  return (
    <div style={containerStyle}>
      <span style={titleStyle}>{phase.title}</span>
      <Badge variant={variant} label={label} />
      <ProgressBar value={progress} style={{ flex: 1 }} />
      <span style={percentStyle}>{Math.round(progress)}%</span>
    </div>
  );
}

export default MilestoneBar;
