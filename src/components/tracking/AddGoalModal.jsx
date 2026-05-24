import React, { useState } from 'react';
import { Modal, Input, Textarea, Button } from '@/components/ui';
import useTrackingStore from '@/store/useTrackingStore';

const PRESET_COLORS = ['#7F77DD', '#1D9E75', '#EF9F27', '#D85A30', '#4A90D9', '#9B59B6'];

const labelStyle = {
  display: 'block',
  fontSize: '12px',
  color: 'var(--color-text-secondary)',
  marginBottom: '4px',
};

const fieldStyle = {
  marginBottom: '14px',
};

const errorStyle = {
  fontSize: '11px',
  color: 'var(--color-accent-coral)',
  marginTop: '4px',
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

/**
 * AddGoalModal — form modal for creating a new goal.
 *
 * @param {boolean}  isOpen  - Controls modal visibility
 * @param {function} onClose - Called when the modal should close
 */
function AddGoalModal({ isOpen, onClose }) {
  const addGoal = useTrackingStore((s) => s.addGoal);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState('medium');
  const [titleError, setTitleError] = useState('');

  function handleClose() {
    setTitle('');
    setDescription('');
    setColor(PRESET_COLORS[0]);
    setDeadline('');
    setPriority('medium');
    setTitleError('');
    onClose();
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) {
      setTitleError('Title is required.');
      return;
    }
    addGoal({
      title: title.trim(),
      description: description.trim(),
      color,
      deadline,
      priority,
      status: 'active',
      phaseIds: [],
    });
    handleClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Goal">
      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div style={fieldStyle}>
          <label style={labelStyle}>Title *</label>
          <Input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (e.target.value.trim()) setTitleError('');
            }}
            placeholder="Goal title"
            autoFocus
          />
          {titleError && <p style={errorStyle}>{titleError}</p>}
        </div>

        {/* Description */}
        <div style={fieldStyle}>
          <label style={labelStyle}>Description</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional description"
          />
        </div>

        {/* Color picker */}
        <div style={fieldStyle}>
          <label style={labelStyle}>Color</label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                aria-label={`Select color ${c}`}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: c,
                  border: color === c ? '2px solid var(--color-text-primary)' : '2px solid transparent',
                  cursor: 'pointer',
                  outline: color === c ? '2px solid var(--color-accent-primary)' : 'none',
                  outlineOffset: '2px',
                  transition: 'outline 0.15s',
                }}
              />
            ))}
          </div>
        </div>

        {/* Deadline */}
        <div style={fieldStyle}>
          <label style={labelStyle}>Deadline</label>
          <Input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </div>

        {/* Priority */}
        <div style={fieldStyle}>
          <label style={labelStyle}>Priority</label>
          <select
            style={selectStyle}
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '4px' }}>
          <Button variant="ghost" type="button" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Add Goal
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default AddGoalModal;
