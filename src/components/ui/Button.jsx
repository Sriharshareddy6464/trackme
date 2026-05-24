import React from 'react';
import './Button.css';

/**
 * Button component with three variants: primary, ghost, danger.
 *
 * @param {'primary'|'ghost'|'danger'} variant - Visual style variant
 * @param {function} onClick - Click handler
 * @param {boolean} disabled - Disables the button
 * @param {React.ReactNode} children - Button content
 * @param {string} className - Additional CSS classes
 */
function Button({
  variant = 'primary',
  onClick,
  disabled = false,
  children,
  className = '',
  ...rest
}) {
  return (
    <button
      className={`btn btn--${variant} ${className}`.trim()}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}

export default Button;
