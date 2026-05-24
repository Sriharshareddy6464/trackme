import React from 'react';

/**
 * EmptyState component — centered placeholder for empty lists/views.
 *
 * @param {string} message         - Descriptive text shown below the icon
 * @param {React.ReactNode} [icon] - Optional icon node rendered at 24px
 */
function EmptyState({ message, icon }) {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '32px 16px',
  };

  const iconWrapperStyle = {
    fontSize: '24px',
    lineHeight: 1,
    color: 'var(--color-text-muted)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const messageStyle = {
    fontSize: '12px',
    color: 'var(--color-text-muted)',
    textAlign: 'center',
    maxWidth: '160px',
    lineHeight: 1.5,
  };

  return (
    <div style={containerStyle}>
      {icon && <span style={iconWrapperStyle}>{icon}</span>}
      {message && <p style={messageStyle}>{message}</p>}
    </div>
  );
}

export default EmptyState;
