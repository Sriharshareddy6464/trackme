import React from 'react';
import { Button, EmptyState } from '@/components/ui';

/**
 * Column — a vertical board column with header, scrollable body, and optional drop-target styling.
 *
 * @param {string}           title        - Column heading text
 * @param {number}           count        - Item count shown next to the title
 * @param {function}         onAdd        - Called when the + button is clicked
 * @param {boolean}          isDropTarget - Highlights the body as a DnD drop zone
 * @param {string}           emptyMessage - Placeholder text when there are no children
 * @param {React.ReactNode}  children     - Card items rendered inside the body
 */
function Column({ title, count = 0, onAdd, isDropTarget = false, emptyMessage, children }) {
  const columnStyle = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    background: 'var(--color-bg-surface)',
    borderRight: '1px solid var(--color-border)',
  };

  const headerStyle = {
    padding: '16px 16px 8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0,
  };

  const headerLeftStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  };

  const bodyStyle = {
    flex: 1,
    overflowY: 'auto',
    padding: '8px',
    ...(isDropTarget
      ? {
          background: 'rgba(127,119,221,0.06)',
          border: '1px dashed rgba(127,119,221,0.3)',
        }
      : {}),
  };

  const hasChildren = React.Children.count(children) > 0;

  return (
    <div style={columnStyle}>
      <div style={headerStyle}>
        <div style={headerLeftStyle}>
          <span className="col-header">{title}</span>
          <span
            style={{
              fontSize: '12px',
              color: 'var(--color-text-muted)',
            }}
          >
            ({count})
          </span>
        </div>
        {onAdd && (
          <Button variant="ghost" onClick={onAdd} aria-label={`Add to ${title}`}>
            +
          </Button>
        )}
      </div>

      <div style={bodyStyle}>
        {hasChildren ? children : <EmptyState message={emptyMessage} />}
      </div>
    </div>
  );
}

export default Column;
