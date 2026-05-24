import React, { useState } from 'react';
import { Modal, Input, Textarea, Button } from '@/components/ui';
import useTrackingStore from '@/store/useTrackingStore';

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
 * AddPhaseModal — form modal for creating a new phase under a goal.
 *
 * @param {boolean}  isOpen          - Controls modal visibility
 * @param {function} onClose         - Called when the modal should close
 * @param {string}   selectedGoalId  - The goal this phase belongs to
 */
function AddPhaseModal({ isOpen, onClose, selectedGoalId }) {
  const addPhase = useTrackingStore((s) => s.addPhase);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('not_started');
  const [titleError, setTitleError] = useState('');

  function handleClose() {
    setTitle('');
    setDescription('');
    setStartDate('');
    setEndDate('');
    setStatus('not_started');
    setTitleError('');
    onClose();
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) {
      setTitleError('Title is required.');
      return;
    }
    addPhase({
      goalId: selectedGoalId,
      title: title.trim(),
      description: description.trim(),
      order: 0,
      status,
      taskIds: [],
      startDate,
      endDate,
    });
    handleClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Phase">
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
            placeholder="Phase title"
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

        {/* Start Date */}
        <div style={fieldStyle}>
          <label style={labelStyle}>Start Date</label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        {/* End Date */}
        <div style={fieldStyle}>
          <label style={labelStyle}>End Date</label>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        {/* Status */}
        <div style={fieldStyle}>
          <label style={labelStyle}>Status</label>
          <select
            style={selectStyle}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="not_started">Not Started</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '4px' }}>
          <Button variant="ghost" type="button" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Add Phase
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default AddPhaseModal;
