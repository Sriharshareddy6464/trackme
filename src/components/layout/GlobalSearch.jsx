import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useTrackingStore from '@/store/useTrackingStore';

/**
 * Full-screen search overlay triggered by Cmd+K / Ctrl+K.
 *
 * @param {Object}   props
 * @param {boolean}  props.isOpen  - Whether the overlay is visible
 * @param {Function} props.onClose - Callback to close the overlay
 */
export default function GlobalSearch({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const { goals, phases, tasks } = useTrackingStore();

  // Auto-focus input when opened; clear query when closed
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      // Small delay to ensure the element is mounted and visible
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  // Build result groups
  const matchedGoals = q
    ? Object.values(goals).filter((g) => g.title.toLowerCase().includes(q))
    : [];

  const matchedPhases = q
    ? Object.values(phases).filter((p) => p.title.toLowerCase().includes(q))
    : [];

  const matchedTasks = q
    ? Object.values(tasks).filter((t) => t.title.toLowerCase().includes(q))
    : [];

  const hasResults =
    matchedGoals.length > 0 || matchedPhases.length > 0 || matchedTasks.length > 0;

  const handleResultClick = (type) => {
    if (type === 'task') {
      navigate('/working');
    } else {
      navigate('/tracking');
    }
    onClose();
  };

  return (
    /* Backdrop */
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '80px',
      }}
    >
      {/* Panel — stop propagation so clicks inside don't close */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--color-bg-elevated)',
          borderRadius: '10px',
          width: '560px',
          maxWidth: '90vw',
          border: '1px solid var(--color-border)',
          overflow: 'hidden',
        }}
      >
        {/* Search input */}
        <input
          ref={inputRef}
          type="text"
          placeholder="Search goals, phases, tasks…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '16px',
            fontSize: '16px',
            background: 'transparent',
            border: 'none',
            borderBottom: '1px solid var(--color-border)',
            color: 'var(--color-text-primary)',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />

        {/* Results area */}
        <div
          style={{
            maxHeight: '400px',
            overflowY: 'auto',
            padding: '8px',
          }}
        >
          {/* No query yet — show hint */}
          {!q && (
            <p
              style={{
                padding: '12px 14px',
                color: 'var(--color-text-muted)',
                fontSize: '13px',
                margin: 0,
              }}
            >
              Start typing to search…
            </p>
          )}

          {/* No results */}
          {q && !hasResults && (
            <p
              style={{
                padding: '12px 14px',
                color: 'var(--color-text-muted)',
                fontSize: '13px',
                margin: 0,
              }}
            >
              No results for &ldquo;{query}&rdquo;
            </p>
          )}

          {/* Goals group */}
          {matchedGoals.length > 0 && (
            <ResultGroup
              label="Goals"
              items={matchedGoals}
              onSelect={() => handleResultClick('goal')}
            />
          )}

          {/* Phases group */}
          {matchedPhases.length > 0 && (
            <ResultGroup
              label="Phases"
              items={matchedPhases}
              onSelect={() => handleResultClick('phase')}
            />
          )}

          {/* Tasks group */}
          {matchedTasks.length > 0 && (
            <ResultGroup
              label="Tasks"
              items={matchedTasks}
              onSelect={() => handleResultClick('task')}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Internal sub-components ─────────────────────────────────────────────── */

function ResultGroup({ label, items, onSelect }) {
  return (
    <div style={{ marginBottom: '4px' }}>
      {/* Section header */}
      <div
        style={{
          padding: '6px 14px 4px',
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--color-text-muted)',
        }}
      >
        {label}
      </div>

      {items.map((item) => (
        <ResultItem key={item.id} title={item.title} onClick={onSelect} />
      ))}
    </div>
  );
}

function ResultItem({ title, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '10px 14px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '13px',
        color: 'var(--color-text-primary)',
        background: hovered ? 'rgba(255,255,255,0.05)' : 'transparent',
        transition: 'background 0.1s',
      }}
    >
      {title}
    </div>
  );
}
