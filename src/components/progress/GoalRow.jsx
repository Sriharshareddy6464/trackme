import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Badge, ProgressBar } from '@/components/ui';
import MilestoneBar from './MilestoneBar';
import useProgressStore from '@/store/useProgressStore';

/** Maps goal status to Badge variant. */
const STATUS_VARIANTS = {
  active: 'active',
  completed: 'done',
  paused: 'queued',
  archived: 'discarded',
};

/** Human-readable goal status labels. */
const STATUS_LABELS = {
  active: 'Active',
  completed: 'Completed',
  paused: 'Paused',
  archived: 'Archived',
};

/**
 * GoalRow — accordion component showing a goal's progress and its phases.
 *
 * @param {object}   goal       - Goal entity from the store
 * @param {Array}    phases     - Array of Phase objects belonging to this goal
 * @param {number}   progress   - 0–100 overall goal progress
 * @param {boolean}  isExpanded - Whether the accordion is open
 * @param {function} onToggle   - Called with goalId when header is clicked
 */
function GoalRow({ goal, phases = [], progress = 0, isExpanded = false, onToggle }) {
  const [hovered, setHovered] = useState(false);
  const { getPhaseProgress } = useProgressStore();

  const variant = STATUS_VARIANTS[goal.status] ?? 'queued';
  const label = STATUS_LABELS[goal.status] ?? goal.status;

  const cardStyle = {
    background: 'var(--color-bg-card)',
    borderRadius: '8px',
    marginBottom: '8px',
    cursor: 'pointer',
    border: `1px solid ${hovered ? 'var(--color-border-hover)' : 'var(--color-border)'}`,
    overflow: 'hidden',
    transition: 'border-color 0.15s ease',
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
  };

  const dotStyle = {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: goal.color ?? 'var(--color-accent-primary)',
    flexShrink: 0,
  };

  const titleStyle = {
    fontSize: '14px',
    fontWeight: 700,
    color: 'var(--color-text-primary)',
    flexShrink: 0,
    minWidth: '120px',
  };

  const percentStyle = {
    fontSize: '12px',
    color: 'var(--color-text-muted)',
    flexShrink: 0,
    minWidth: '36px',
    textAlign: 'right',
  };

  const chevronStyle = {
    fontSize: '12px',
    color: 'var(--color-text-muted)',
    flexShrink: 0,
    transition: 'transform 0.2s ease',
    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
    userSelect: 'none',
  };

  return (
    <div
      style={cardStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Header row — always visible */}
      <div
        style={headerStyle}
        onClick={() => onToggle?.(goal.id)}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        onKeyDown={(e) => e.key === 'Enter' && onToggle?.(goal.id)}
      >
        <span style={dotStyle} aria-hidden="true" />
        <span style={titleStyle}>{goal.title}</span>
        <ProgressBar value={progress} style={{ flex: 1 }} />
        <span style={percentStyle}>{Math.round(progress)}%</span>
        <Badge variant={variant} label={label} />
        <span style={chevronStyle} aria-hidden="true">▼</span>
      </div>

      {/* Expanded phase list */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key="phases"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            {phases.length === 0 ? (
              <div
                style={{
                  padding: '12px 16px',
                  borderTop: '1px solid var(--color-border)',
                  fontSize: '13px',
                  color: 'var(--color-text-muted)',
                }}
              >
                No phases yet.
              </div>
            ) : (
              phases.map((phase) => (
                <MilestoneBar
                  key={phase.id}
                  phase={phase}
                  progress={getPhaseProgress(phase.id)}
                />
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default GoalRow;
