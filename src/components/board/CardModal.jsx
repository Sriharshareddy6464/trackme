import React, { useState } from 'react';
import { Modal, Input, Textarea, Button, Badge } from '@/components/ui';
import { TodoList } from '@/components/tracking';
import useTrackingStore from '@/store/useTrackingStore';
import { formatDate } from '@/utils/dateHelpers';

const labelStyle = {
  display: 'block',
  fontSize: '12px',
  color: 'var(--color-text-secondary)',
  marginBottom: '4px',
};

const fieldStyle = { marginBottom: '14px' };

const valueStyle = {
  fontSize: '13px',
  color: 'var(--color-text-primary)',
};

const selectStyle = {
  background: 'var(--color-bg-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: '6px',
  padding: '8px 12px',
  fontSize: '13px',
  color: 'var(--color-text-primary)',
  width: '100%',
  boxSizing: 'border-box',
  outline: 'none',
  fontFamily: 'inherit',
};

const PRIORITY_COLORS = {
  low: '#1d9e75',
  medium: '#ef9f27',
  high: '#d85a30',
  critical: '#d85a30',
};

/**
 * CardModal — shows task details in read mode; toggles to edit mode.
 *
 * @param {object}   task    - Task entity from the store
 * @param {boolean}  isOpen  - Controls modal visibility
 * @param {function} onClose - Called when the modal should close
 */
function CardModal({ task, isOpen, onClose }) {
  const updateTask = useTrackingStore((s) => s.updateTask);
  const [editing, setEditing] = useState(false);

  // Edit state mirrors task fields
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPriority, setEditPriority] = useState('medium');
  const [editDueDate, setEditDueDate] = useState('');
  const [editEstimatedHours, setEditEstimatedHours] = useState('');
  const [editActualHours, setEditActualHours] = useState('');
  const [editTags, setEditTags] = useState('');
  const [editStatus, setEditStatus] = useState('todo');

  function startEditing() {
    setEditTitle(task.title ?? '');
    setEditDescription(task.description ?? '');
    setEditPriority(task.priority ?? 'medium');
    setEditDueDate(task.dueDate ?? '');
    setEditEstimatedHours(task.estimatedHours != null ? String(task.estimatedHours) : '');
    setEditActualHours(task.actualHours != null ? String(task.actualHours) : '');
    setEditTags((task.tags ?? []).join(', '));
    setEditStatus(task.status ?? 'todo');
    setEditing(true);
  }

  function handleSave() {
    const tags = editTags.split(',').map((t) => t.trim()).filter(Boolean);
    updateTask(task.id, {
      title: editTitle.trim() || task.title,
      description: editDescription.trim(),
      priority: editPriority,
      dueDate: editDueDate,
      estimatedHours: editEstimatedHours ? parseFloat(editEstimatedHours) : 0,
      actualHours: editActualHours ? parseFloat(editActualHours) : 0,
      tags,
      status: editStatus,
    });
    setEditing(false);
  }

  function handleClose() {
    setEditing(false);
    onClose();
  }

  if (!task) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={editing ? 'Edit Task' : task.title}>
      {editing ? (
        /* ── Edit mode ── */
        <div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Title</label>
            <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Description</label>
            <Textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Priority</label>
            <select style={selectStyle} value={editPriority} onChange={(e) => setEditPriority(e.target.value)}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Status</label>
            <select style={selectStyle} value={editStatus} onChange={(e) => setEditStatus(e.target.value)}>
              <option value="todo">To Do</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="discarded">Discarded</option>
            </select>
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Due Date</label>
            <Input type="date" value={editDueDate} onChange={(e) => setEditDueDate(e.target.value)} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Estimated Hours</label>
            <Input type="number" min="0" step="0.5" value={editEstimatedHours} onChange={(e) => setEditEstimatedHours(e.target.value)} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Actual Hours</label>
            <Input type="number" min="0" step="0.5" value={editActualHours} onChange={(e) => setEditActualHours(e.target.value)} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Tags (comma-separated)</label>
            <Input value={editTags} onChange={(e) => setEditTags(e.target.value)} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <Button variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSave}>Save</Button>
          </div>
        </div>
      ) : (
        /* ── Read mode ── */
        <div>
          {task.description && (
            <div style={fieldStyle}>
              <label style={labelStyle}>Description</label>
              <p style={valueStyle}>{task.description}</p>
            </div>
          )}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '14px', flexWrap: 'wrap' }}>
            <div>
              <label style={labelStyle}>Priority</label>
              <Badge label={task.priority ?? 'low'} color={PRIORITY_COLORS[task.priority] ?? '#8888a0'} />
            </div>
            <div>
              <label style={labelStyle}>Status</label>
              <span style={valueStyle}>{task.status}</span>
            </div>
            {task.dueDate && (
              <div>
                <label style={labelStyle}>Due Date</label>
                <span style={valueStyle}>{formatDate(task.dueDate)}</span>
              </div>
            )}
            {task.estimatedHours != null && task.estimatedHours > 0 && (
              <div>
                <label style={labelStyle}>Est. Hours</label>
                <span style={valueStyle}>{task.estimatedHours}h</span>
              </div>
            )}
            {task.actualHours != null && task.actualHours > 0 && (
              <div>
                <label style={labelStyle}>Actual Hours</label>
                <span style={valueStyle}>{task.actualHours}h</span>
              </div>
            )}
          </div>
          {task.tags && task.tags.length > 0 && (
            <div style={fieldStyle}>
              <label style={labelStyle}>Tags</label>
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                {task.tags.map((tag) => (
                  <Badge key={tag} label={tag} color="#8888a0" />
                ))}
              </div>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
            <Button variant="ghost" onClick={startEditing}>Edit</Button>
          </div>
          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
            <TodoList taskId={task.id} />
          </div>
        </div>
      )}
    </Modal>
  );
}

export default CardModal;
