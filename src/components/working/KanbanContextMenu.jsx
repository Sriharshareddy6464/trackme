import React, { useEffect, useRef, useState } from 'react';
import useTrackingStore from '@/store/useTrackingStore';
import useWorkingStore from '@/store/useWorkingStore';

const PRIORITIES = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
  { label: 'Critical', value: 'critical' },
];

const STATUSES = [
  { label: 'To Do', value: 'todo' },
  { label: 'Ongoing', value: 'ongoing' },
  { label: 'Completed', value: 'completed' },
  { label: 'Discarded', value: 'discarded' },
];

/**
 * KanbanContextMenu — floating context menu for a KanbanCard.
 *
 * @param {string}   taskId   - ID of the task being acted on
 * @param {boolean}  isOpen   - Whether the menu is visible
 * @param {function} onClose  - Called when the menu should close
 * @param {{x: number, y: number}} position - Screen coordinates for the menu
 */
function KanbanContextMenu({ taskId, isOpen, onClose, position }) {
  const menuRef = useRef(null);
  const [openSubmenu, setOpenSubmenu] = useState(null); // 'priority' | 'status' | null
  const [dueDateValue, setDueDateValue] = useState('');

  const updateTask = useTrackingStore((s) => s.updateTask);
  const deleteTask = useTrackingStore((s) => s.deleteTask);
  const moveTask = useWorkingStore((s) => s.moveTask);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;

    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose?.();
      }
    }

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen, onClose]);

  // Reset submenu when menu closes
  useEffect(() => {
    if (!isOpen) {
      setOpenSubmenu(null);
      setDueDateValue('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const menuStyle = {
    position: 'fixed',
    top: position?.y ?? 0,
    left: position?.x ?? 0,
    zIndex: 500,
    background: 'var(--color-bg-elevated)',
    border: '1px solid var(--color-border)',
    borderRadius: '6px',
    padding: '4px 0',
    minWidth: '160px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
  };

  const itemStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 14px',
    fontSize: '13px',
    color: 'var(--color-text-primary)',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    width: '100%',
    textAlign: 'left',
  };

  const itemHoverStyle = {
    background: 'rgba(255,255,255,0.05)',
  };

  const subItemStyle = {
    ...itemStyle,
    paddingLeft: '20px',
    fontSize: '12px',
    color: 'var(--color-text-secondary)',
  };

  const dividerStyle = {
    height: '1px',
    background: 'var(--color-border)',
    margin: '4px 0',
  };

  const deleteStyle = {
    ...itemStyle,
    color: 'var(--color-accent-coral)',
  };

  const dateInputStyle = {
    padding: '6px 14px',
    display: 'block',
  };

  function handlePriority(priority) {
    updateTask(taskId, { priority });
    onClose?.();
  }

  function handleStatus(status) {
    moveTask(taskId, status);
    onClose?.();
  }

  function handleDueDate(e) {
    const val = e.target.value; // 'YYYY-MM-DD'
    if (val) {
      updateTask(taskId, { dueDate: new Date(val).toISOString() });
      onClose?.();
    }
  }

  function handleDelete() {
    if (window.confirm('Delete this task? This cannot be undone.')) {
      deleteTask(taskId);
      onClose?.();
    }
  }

  return (
    <div ref={menuRef} style={menuStyle} role="menu" aria-label="Task options">
      {/* Change Priority */}
      <MenuItem
        style={itemStyle}
        hoverStyle={itemHoverStyle}
        onClick={() => setOpenSubmenu(openSubmenu === 'priority' ? null : 'priority')}
      >
        <span>Change Priority</span>
        <span style={{ fontSize: '10px', opacity: 0.6 }}>▶</span>
      </MenuItem>
      {openSubmenu === 'priority' && (
        <>
          {PRIORITIES.map(({ label, value }) => (
            <MenuItem
              key={value}
              style={subItemStyle}
              hoverStyle={itemHoverStyle}
              onClick={() => handlePriority(value)}
            >
              {label}
            </MenuItem>
          ))}
        </>
      )}

      <div style={dividerStyle} />

      {/* Change Status */}
      <MenuItem
        style={itemStyle}
        hoverStyle={itemHoverStyle}
        onClick={() => setOpenSubmenu(openSubmenu === 'status' ? null : 'status')}
      >
        <span>Change Status</span>
        <span style={{ fontSize: '10px', opacity: 0.6 }}>▶</span>
      </MenuItem>
      {openSubmenu === 'status' && (
        <>
          {STATUSES.map(({ label, value }) => (
            <MenuItem
              key={value}
              style={subItemStyle}
              hoverStyle={itemHoverStyle}
              onClick={() => handleStatus(value)}
            >
              {label}
            </MenuItem>
          ))}
        </>
      )}

      <div style={dividerStyle} />

      {/* Set Due Date */}
      <MenuItem
        style={itemStyle}
        hoverStyle={itemHoverStyle}
        onClick={() => setOpenSubmenu(openSubmenu === 'dueDate' ? null : 'dueDate')}
      >
        <span>Set Due Date</span>
        <span style={{ fontSize: '10px', opacity: 0.6 }}>▶</span>
      </MenuItem>
      {openSubmenu === 'dueDate' && (
        <div style={dateInputStyle}>
          <input
            type="date"
            value={dueDateValue}
            onChange={(e) => setDueDateValue(e.target.value)}
            onBlur={handleDueDate}
            style={{
              background: 'var(--color-bg-card)',
              border: '1px solid var(--color-border)',
              borderRadius: '4px',
              color: 'var(--color-text-primary)',
              padding: '4px 8px',
              fontSize: '12px',
              width: '100%',
            }}
            autoFocus
          />
        </div>
      )}

      <div style={dividerStyle} />

      {/* Delete */}
      <MenuItem
        style={deleteStyle}
        hoverStyle={{ background: 'rgba(216,90,48,0.08)' }}
        onClick={handleDelete}
      >
        Delete
      </MenuItem>
    </div>
  );
}

/** Small helper for hover-state menu items without CSS modules. */
function MenuItem({ style, hoverStyle, onClick, children }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <button
      style={{ ...style, ...(hovered ? hoverStyle : {}) }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      role="menuitem"
    >
      {children}
    </button>
  );
}

export default KanbanContextMenu;
