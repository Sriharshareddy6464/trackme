import React, { useState, useRef } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Checkbox } from '@/components/ui';
import useTrackingStore from '@/store/useTrackingStore';

/* ── Sortable Todo Item ─────────────────────────────────────────────────── */

function SortableTodoItem({ todo, onToggle, onDelete, onEdit }) {
  const [hovered, setHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const inputRef = useRef(null);

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: todo.id });

  const sortableStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const rowStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '4px 0',
    position: 'relative',
  };

  const textStyle = {
    flex: 1,
    fontSize: '13px',
    color: todo.completed ? 'var(--color-text-muted)' : 'var(--color-text-primary)',
    textDecoration: todo.completed ? 'line-through' : 'none',
    cursor: 'text',
    userSelect: 'none',
  };

  const deleteBtnStyle = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--color-text-muted)',
    fontSize: '16px',
    lineHeight: 1,
    padding: '0 4px',
    display: hovered ? 'block' : 'none',
    transition: 'color 0.15s',
  };

  function commitEdit() {
    const trimmed = editText.trim();
    if (trimmed && trimmed !== todo.text) {
      onEdit(todo.id, trimmed);
    } else {
      setEditText(todo.text);
    }
    setIsEditing(false);
  }

  return (
    <div ref={setNodeRef} style={sortableStyle} {...attributes}>
      <div
        style={rowStyle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Drag handle area */}
        <span
          {...listeners}
          style={{ cursor: 'grab', color: 'var(--color-text-muted)', fontSize: '12px', userSelect: 'none' }}
          aria-label="Drag to reorder"
        >
          ⠿
        </span>

        <Checkbox
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          id={`todo-${todo.id}`}
        />

        {isEditing ? (
          <input
            ref={inputRef}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitEdit();
              if (e.key === 'Escape') { setEditText(todo.text); setIsEditing(false); }
            }}
            autoFocus
            style={{
              flex: 1,
              background: 'var(--color-bg-surface)',
              border: '1px solid var(--color-accent-primary)',
              borderRadius: '4px',
              padding: '2px 6px',
              fontSize: '13px',
              color: 'var(--color-text-primary)',
              outline: 'none',
              fontFamily: 'inherit',
            }}
          />
        ) : (
          <span
            style={textStyle}
            onDoubleClick={() => { setIsEditing(true); setEditText(todo.text); }}
          >
            {todo.text}
          </span>
        )}

        <button
          style={deleteBtnStyle}
          onClick={() => onDelete(todo.id)}
          aria-label="Delete todo"
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent-coral)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}
        >
          ×
        </button>
      </div>
    </div>
  );
}

/* ── TodoList ───────────────────────────────────────────────────────────── */

/**
 * TodoList — drag-to-reorder checklist for a task.
 *
 * @param {string} taskId - The task whose todos are displayed
 */
function TodoList({ taskId }) {
  const task = useTrackingStore((s) => s.tasks[taskId]);
  const todos = useTrackingStore((s) => s.todos);
  const addTodo = useTrackingStore((s) => s.addTodo);
  const updateTodo = useTrackingStore((s) => s.updateTodo);
  const deleteTodo = useTrackingStore((s) => s.deleteTodo);
  const reorderTodos = useTrackingStore((s) => s.reorderTodos);

  const [newText, setNewText] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  if (!task) return null;

  const todoIds = task.todoIds ?? [];
  const todoItems = todoIds.map((id) => todos[id]).filter(Boolean);

  function handleToggle(id) {
    const todo = todos[id];
    if (!todo) return;
    updateTodo(id, {
      completed: !todo.completed,
      completedAt: !todo.completed ? new Date().toISOString() : null,
    });
  }

  function handleDelete(id) {
    deleteTodo(id);
  }

  function handleEdit(id, text) {
    updateTodo(id, { text });
  }

  function handleAdd() {
    const trimmed = newText.trim();
    if (!trimmed) return;
    addTodo({
      taskId,
      text: trimmed,
      completed: false,
      completedAt: null,
      order: todoItems.length,
    });
    setNewText('');
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = todoIds.indexOf(active.id);
    const newIndex = todoIds.indexOf(over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const reordered = arrayMove(todoIds, oldIndex, newIndex);
    reorderTodos(taskId, reordered);
  }

  const headerStyle = {
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--color-text-secondary)',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };

  const addRowStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginTop: '8px',
  };

  const addInputStyle = {
    flex: 1,
    background: 'var(--color-bg-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: '6px',
    padding: '6px 10px',
    fontSize: '13px',
    color: 'var(--color-text-primary)',
    outline: 'none',
    fontFamily: 'inherit',
  };

  const addBtnStyle = {
    background: 'none',
    border: '1px solid var(--color-border)',
    borderRadius: '6px',
    padding: '6px 10px',
    cursor: 'pointer',
    color: 'var(--color-text-secondary)',
    fontSize: '16px',
    lineHeight: 1,
    transition: 'color 0.15s, border-color 0.15s',
  };

  return (
    <div>
      <p style={headerStyle}>Checklist ({todoItems.filter((t) => t.completed).length}/{todoItems.length})</p>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={todoIds} strategy={verticalListSortingStrategy}>
          {todoItems.map((todo) => (
            <SortableTodoItem
              key={todo.id}
              todo={todo}
              onToggle={handleToggle}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}
        </SortableContext>
      </DndContext>

      {/* Add new todo */}
      <div style={addRowStyle}>
        <input
          style={addInputStyle}
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Add a checklist item…"
        />
        <button
          style={addBtnStyle}
          onClick={handleAdd}
          aria-label="Add todo"
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-accent-primary)'; e.currentTarget.style.borderColor = 'var(--color-accent-primary)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-secondary)'; e.currentTarget.style.borderColor = 'var(--color-border)'; }}
        >
          +
        </button>
      </div>
    </div>
  );
}

export default TodoList;
