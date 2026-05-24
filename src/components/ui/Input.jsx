import React from 'react';

const baseStyles = {
  background: 'var(--color-bg-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: '6px',
  padding: '8px 12px',
  fontSize: '13px',
  color: 'var(--color-text-primary)',
  width: '100%',
  boxSizing: 'border-box',
  outline: 'none',
  transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
  fontFamily: 'inherit',
};

const focusStyles = {
  borderColor: 'var(--color-accent-primary)',
  boxShadow: '0 0 0 2px rgba(127,119,221,0.2)',
};

/**
 * Dark-themed text input.
 * Accepts all standard HTML input props via spread.
 *
 * @param {string} className - Additional CSS classes
 */
function Input({ className = '', style = {}, ...rest }) {
  const [focused, setFocused] = React.useState(false);

  const computedStyle = {
    ...baseStyles,
    ...(focused ? focusStyles : {}),
    ...style,
  };

  return (
    <input
      className={className}
      style={computedStyle}
      onFocus={(e) => {
        setFocused(true);
        rest.onFocus?.(e);
      }}
      onBlur={(e) => {
        setFocused(false);
        rest.onBlur?.(e);
      }}
      {...rest}
    />
  );
}

/**
 * Dark-themed textarea.
 * Accepts all standard HTML textarea props via spread.
 *
 * @param {string} className - Additional CSS classes
 */
export function Textarea({ className = '', style = {}, ...rest }) {
  const [focused, setFocused] = React.useState(false);

  const computedStyle = {
    ...baseStyles,
    resize: 'vertical',
    minHeight: '80px',
    ...(focused ? focusStyles : {}),
    ...style,
  };

  return (
    <textarea
      className={className}
      style={computedStyle}
      onFocus={(e) => {
        setFocused(true);
        rest.onFocus?.(e);
      }}
      onBlur={(e) => {
        setFocused(false);
        rest.onBlur?.(e);
      }}
      {...rest}
    />
  );
}

export default Input;
