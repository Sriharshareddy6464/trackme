import React from 'react';
import { motion } from 'framer-motion';

/**
 * ProgressBar component — animated fill bar using framer-motion.
 *
 * @param {number} value       - Fill percentage, 0–100
 * @param {string} [color]     - Fill color; defaults to var(--color-accent-primary)
 * @param {string} [className] - Additional CSS classes for the outer wrapper
 */
function ProgressBar({ value = 0, color, className = '' }) {
  const clampedValue = Math.min(100, Math.max(0, value));

  const trackStyle = {
    width: '100%',
    height: '3px',
    backgroundColor: 'var(--color-bg-elevated)',
    borderRadius: '100px',
    overflow: 'hidden',
  };

  const fillStyle = {
    height: '100%',
    backgroundColor: color ?? 'var(--color-accent-primary)',
    borderRadius: '100px',
  };

  return (
    <div className={className} style={trackStyle}>
      <motion.div
        style={fillStyle}
        initial={{ width: '0%' }}
        animate={{ width: `${clampedValue}%` }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      />
    </div>
  );
}

export default ProgressBar;
