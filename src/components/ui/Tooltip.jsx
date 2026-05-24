import React from 'react';

/**
 * Tooltip component — shows a small dark pill on hover of children.
 * Uses CSS-only show/hide via :hover on the wrapper (no JS state).
 *
 * @param {string} label          - Tooltip text
 * @param {React.ReactNode} children - The trigger element
 * @param {'top'|'bottom'|'left'|'right'} position - Tooltip placement (default: 'top')
 */
function Tooltip({ label, children, position = 'top' }) {
  const positionStyles = {
    top: {
      bottom: '100%',
      left: '50%',
      transform: 'translateX(-50%)',
      marginBottom: '6px',
    },
    bottom: {
      top: '100%',
      left: '50%',
      transform: 'translateX(-50%)',
      marginTop: '6px',
    },
    left: {
      right: '100%',
      top: '50%',
      transform: 'translateY(-50%)',
      marginRight: '6px',
    },
    right: {
      left: '100%',
      top: '50%',
      transform: 'translateY(-50%)',
      marginLeft: '6px',
    },
  };

  const wrapperStyle = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const tooltipStyle = {
    position: 'absolute',
    background: 'var(--color-bg-elevated)',
    border: '1px solid var(--color-border)',
    borderRadius: '4px',
    padding: '4px 8px',
    fontSize: '11px',
    color: 'var(--color-text-primary)',
    whiteSpace: 'nowrap',
    pointerEvents: 'none',
    zIndex: 9999,
    opacity: 0,
    transition: 'opacity 0.12s ease',
    ...positionStyles[position] ?? positionStyles.top,
  };

  // We use a CSS class approach with a <style> tag injected once
  // to handle the :hover show/hide without JS state.
  return (
    <span
      className="kiro-tooltip-wrapper"
      style={wrapperStyle}
    >
      {children}
      <span
        className="kiro-tooltip"
        role="tooltip"
        style={tooltipStyle}
      >
        {label}
      </span>
      <style>{`
        .kiro-tooltip-wrapper:hover .kiro-tooltip {
          opacity: 1;
        }
      `}</style>
    </span>
  );
}

export default Tooltip;
