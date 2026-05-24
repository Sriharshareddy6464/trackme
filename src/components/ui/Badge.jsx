import React from 'react';

/**
 * Variant presets for common status types.
 * Each preset defines a `color` (text/background tint) and optional `dotColor`.
 */
const VARIANTS = {
  active: { color: '#1d9e75' },       // teal
  done: { color: '#7f77dd' },         // purple
  blocked: { color: '#d85a30' },      // coral
  queued: { color: '#ef9f27' },       // amber
  discarded: { color: '#8888a0' },    // muted
};

/**
 * Badge component — a status pill with a small colored dot on the left.
 *
 * @param {string} label       - Text displayed inside the badge
 * @param {string} color       - Hex color used for text and semi-transparent background
 * @param {string} [dotColor]  - Hex color for the dot; defaults to `color`
 * @param {'active'|'done'|'blocked'|'queued'|'discarded'} [variant] - Preset shorthand
 * @param {string} [className] - Additional CSS classes
 */
function Badge({ label, color, dotColor, variant, className = '', style = {}, ...rest }) {
  // Resolve color from variant preset if no explicit color is provided
  const resolvedColor = color ?? (variant ? VARIANTS[variant]?.color : undefined) ?? '#8888a0';
  const resolvedDotColor = dotColor ?? resolvedColor;

  // Semi-transparent background: append '22' to a 6-char hex for ~13% opacity
  const bg = resolvedColor.startsWith('#') && resolvedColor.length === 7
    ? resolvedColor + '22'
    : resolvedColor;

  const badgeStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    borderRadius: '100px',
    padding: '3px 8px',
    fontSize: '11px',
    fontWeight: 500,
    lineHeight: 1.4,
    color: resolvedColor,
    backgroundColor: bg,
    whiteSpace: 'nowrap',
    ...style,
  };

  const dotStyle = {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: resolvedDotColor,
    flexShrink: 0,
  };

  return (
    <span className={className} style={badgeStyle} {...rest}>
      <span style={dotStyle} aria-hidden="true" />
      {label}
    </span>
  );
}

export default Badge;
