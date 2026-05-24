import React, { useState } from 'react';
import { Modal, Input, Textarea, Button } from '@/components/ui';
import useTrackingStore from '@/store/useTrackingStore';

const labelStyle = {
  display: 'block',
  fontSize: '12px',
  color: 'var(--color-text-secondary)',
  marginBottom: '4px',
};

const fieldStyle = { marginBottom: '14px' };

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
 * AddTaskModal — form modal for creating a new task under a phase.
 *
 * @param {boolean}  isOpen           - Controls modal visibility
 * @param {function} onClose          - Called when the modal should close
 * @param {string}   selectedPhaseId  - The phase this task belongs to
 * @param {string}   selectedGoalId   - The goal this task belongs to
 */
function AddTaskModal({ isOpen, onClose, selectedPhaseId, selectedGoalId }) {
  const addTask = useTrackingStore((s) => s.addTask);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [estimatedHours, setEstimatedHours] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [titleError, setTitleError] = useState('');

  function handleClose() {
    setTitle(''); setDescription(''); setPriority('medium');
    setDueDate(''); setEstimatedHours(''); setTagsInput('');
    setTitleError('');
    onClose();
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) { setTitleError('Title is required.'); return; }
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    addTask({
      phaseId: selectedPhaseId,
      goalId: selectedGoalId,
      title: title.trim(),
      description: description.trim(),
      priority,
      status: 'todo',
      dueDate,
      estimatedHours: estimatedHours ? parseFloat(estimatedHours) : 0,
      actualHours: 0,
      tags,
      todoIds: [],
    });
    handleClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Task">
      <form onSubmit={handleSubmit}>
        <div style={fieldStyle}>
          <label style={labelStyle}>Title *</label>
          <Input value={title} onChange={(e) => { setTitle(e.target.value); if (e.target.value.trim()) setTitleError(''); }} placeholder="Task title" autoFocus />
          {titleError && <p style={errorStyle}>{titleError}</p>}
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Description</label>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional description" />
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Priority</label>
          <select style={selectStyle} value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Due Date</label>
          <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Estimated Hours</label>
          <Input type="number" min="0" step="0.5" value={estimatedHours} onChange={(e) => setEstimatedHours(e.target.value)} placeholder="e.g. 4" />
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Tags (comma-separated)</label>
          <Input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="e.g. frontend, api" />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '4px' }}>
          <Button variant="ghost" type="button" onClick={handleClose}>Cancel</Button>
          <Button variant="primary" type="submit">Add Task</Button>
        </div>
      </form>
    </Modal>
  );
}

export default AddTaskModal;
