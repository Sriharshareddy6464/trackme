import React from 'react';

/**
 * Custom styled checkbox with purple accent.
 *
 * @param {boolean} checked      - Whether the checkbox is checked
 * @param {function} onChange    - Change handler
 * @param {string} label         - Label text displayed next to the checkbox
 * @param {string} id            - HTML id for the input (links label)
 * @param {boolean} disabled     - Disables the checkbox
 */
function Checkbox({ checked = false, onChange, label, id, disabled = false, ...rest }) {
  const wrapperStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
  };

  const hiddenInputStyle = {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: 0,
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0,0,0,0)',
    whiteSpace: 'nowrap',
    border: 0,
  };

  const boxStyle = {
    width: '16px',
    height: '16px',
    borderRadius: '3px',
    border: checked ? '1.5px solid #7F77DD' : '1.5px solid var(--color-border-hover)',
    background: checked ? '#7F77DD' : 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'background 0.15s ease, border-color 0.15s ease',
    boxSizing: 'border-box',
  };

  const checkmarkStyle = {
    color: '#ffffff',
    fontSize: '11px',
    lineHeight: 1,
    userSelect: 'none',
  };

  const labelStyle = {
    fontSize: '13px',
    color: 'var(--color-text-secondary)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    userSelect: 'none',
  };

  return (
    <label htmlFor={id} style={wrapperStyle}>
      {/* Visually hidden native input for accessibility */}
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        style={hiddenInputStyle}
        {...rest}
      />
      {/* Custom visual checkbox */}
      <span style={boxStyle} aria-hidden="true">
        {checked && <span style={checkmarkStyle}>✓</span>}
      </span>
      {label && <span style={labelStyle}>{label}</span>}
    </label>
  );
}

export default Checkbox;
